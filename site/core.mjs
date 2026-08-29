// Shared spine machinery: data loading, the time axis with its seam,
// storage lookup (observed left, engine right), reservoir markers, and the
// century strip chart. Used by spine.html (free scrub) and story.html
// (scroll choreography).
import { simulate } from './lib/engine.mjs';
import { baselineDemands } from './lib/presets.mjs';

export const M0 = 1906 * 12, M_END = 2057 * 12 - 1;
export const SEAM = 2026 * 12 + 7; // 2026-08, last observed month
export const mkey = (m) => `${Math.floor(m / 12)}-${String(m % 12 + 1).padStart(2, '0')}`;
export const mlabel = (m) => mkey(m).replace('-', '·');
export const CAP = { mead: 26.12e6, powell: 23.3e6 };
export const R_FULL = 34;
export const radius = (af, cap) => Math.max(2, R_FULL * Math.sqrt(Math.max(af, 0) / cap));

export async function loadAll() {
  const [storage, basin, rivers, lakes, richter, flowsJson] = await Promise.all([
    './data/storage.json', './data/geometry/basin.json', './data/geometry/rivers.json',
    './data/geometry/lakes.json', './data/richter2024.json', './data/lees-ferry-natural-flow.json',
  ].map((u) => fetch(u).then((r) => r.json())));

  const split = storage.latest.mead / (storage.latest.mead + storage.latest.powell);
  const meanFlow = flowsJson.averagesMAF['2000-2024'] * 1e6;
  const run = simulate(
    Array.from({ length: 31 }, (_, i) => ({ year: 2027 + i, naturalFlowAF: meanFlow })),
    baselineDemands(richter),
    { residualInflowAF: 1.77e6, startStorageAF: storage.latest.combined });
  const simYear = Object.fromEntries(run.years.map((y) => [y.year, y.storageAF]));
  simYear[2026] = storage.latest.combined;

  const combinedAt = (m) => {
    if (m <= SEAM) return { af: storage.combined[mkey(m)] ?? 0, era: 'observed' };
    const y = Math.floor(m / 12), frac = (m % 12) / 12;
    const a = simYear[y - 1] ?? storage.latest.combined, b = simYear[y] ?? a;
    return { af: a + (b - a) * frac, era: 'modeled' };
  };
  const reservoirsAt = (m) => {
    if (m <= SEAM) {
      const k = mkey(m);
      return { mead: storage.mead[k] ?? 0, powell: storage.powell[k] ?? 0, era: 'observed' };
    }
    const { af, era } = combinedAt(m);
    return { mead: af * split, powell: af * (1 - split), era };
  };
  return { storage, basin, rivers, lakes, richter, flowsJson, combinedAt, reservoirsAt };
}

export const darkMedia = matchMedia('(prefers-color-scheme: dark)');

export function makeMap(container, { bounds, interactive = true } = {}) {
  const canvas = darkMedia.matches ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base';
  return new maplibregl.Map({
    container, interactive, attributionControl: { compact: true },
    style: { version: 8, sources: { esri: {
      type: 'raster', tileSize: 256, maxzoom: 12,
      tiles: [`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${canvas}/MapServer/tile/{z}/{y}/{x}`],
      attribution: 'Esri, HERE, Garmin © OpenStreetMap · geometry: USGS WBD, Natural Earth · storage: Reclamation',
    } }, layers: [{ id: 'base', type: 'raster', source: 'esri' }] },
    bounds: bounds ?? [[-117.5, 30.8], [-105.2, 43.6]], fitBoundsOptions: { padding: 24 },
  });
}

export function addOverlays(map, { basin, rivers, lakes }) {
  const line = darkMedia.matches ? '#3987e5' : '#2a78d6';
  map.addSource('basin', { type: 'geojson', data: basin });
  map.addSource('rivers', { type: 'geojson', data: rivers });
  map.addSource('lakes', { type: 'geojson', data: lakes });
  map.addLayer({ id: 'basin-fill', type: 'fill', source: 'basin',
    paint: { 'fill-color': line, 'fill-opacity': 0.05 } });
  map.addLayer({ id: 'basin-line', type: 'line', source: 'basin',
    paint: { 'line-color': line, 'line-opacity': 0.35, 'line-width': 1 } });
  map.addLayer({ id: 'rivers', type: 'line', source: 'rivers',
    paint: { 'line-color': line, 'line-opacity': 0.85,
      'line-width': ['case', ['==', ['get', 'name'], 'Colorado'], 2.2, 1.1] } });
  map.addLayer({ id: 'lakes', type: 'fill', source: 'lakes',
    paint: { 'fill-color': line, 'fill-opacity': 0.5 } });
}

// Reservoir discs: a dashed capacity ring holding a water disc.
export function makeReservoirMarkers(map, lakes) {
  const centroids = Object.fromEntries(lakes.features.map((f) => [f.properties.name, f.properties.centroid]));
  const defs = [
    { id: 'mead', name: 'Mead', c: centroids['Lake Mead'] },
    { id: 'powell', name: 'Powell', c: centroids['Lake Powell'] },
  ];
  const markers = {};
  for (const { id, name, c } of defs) {
    if (!c) continue;
    const el = document.createElement('div');
    el.innerHTML = `<div class="ring"></div><div class="disc"></div><div class="lab"></div>`;
    Object.assign(el.style, { position: 'relative', width: `${R_FULL * 2}px`, height: `${R_FULL * 2}px`, pointerEvents: 'none' });
    el.querySelector('.ring').style.cssText = 'position:absolute;inset:0;border:1px dashed var(--muted);border-radius:50%;opacity:.7';
    el.querySelector('.disc').style.cssText = 'position:absolute;border-radius:50%;background:var(--water);opacity:.75;box-shadow:0 0 0 1px var(--ring)';
    el.querySelector('.lab').style.cssText = 'position:absolute;top:100%;left:50%;transform:translateX(-50%);font:600 11px var(--sans);color:var(--ink);white-space:nowrap;text-shadow:0 0 4px var(--page)';
    markers[id] = { marker: new maplibregl.Marker({ element: el }).setLngLat(c).addTo(map), el, name };
  }
  return (r) => {
    for (const id of Object.keys(markers)) {
      const { el, name } = markers[id];
      const rad = radius(r[id], CAP[id]);
      Object.assign(el.querySelector('.disc').style, {
        width: `${rad * 2}px`, height: `${rad * 2}px`,
        left: `${R_FULL - rad}px`, top: `${R_FULL - rad}px` });
      el.querySelector('.lab').textContent = `${name} ${(r[id] / 1e6).toFixed(1)}`;
    }
  };
}

// Century strip chart into an <svg>; returns setCursor(monthIndex).
export function buildStrip(svg, { storage, combinedAt }, { title = true } = {}) {
  const CW = 800, CH = title ? 92 : 64, ML = 30, MR = 8, MT = 6, MB = 14;
  const X = (m) => ML + (m - M0) / (M_END - M0) * (CW - ML - MR);
  const Y = (af) => MT + (1 - af / 52e6) * (CH - MT - MB);
  svg.setAttribute('viewBox', `0 0 ${CW} ${CH}`);
  const obs = [], sim = [];
  for (let m = M0; m <= SEAM; m += 3) obs.push(`${X(m)},${Y(storage.combined[mkey(m)] ?? 0)}`);
  for (let m = SEAM; m <= M_END; m += 3) sim.push(`${X(m)},${Y(combinedAt(m).af)}`);
  const g = [];
  for (const maf of [0, 25, 50]) g.push(
    `<line x1="${ML}" y1="${Y(maf * 1e6)}" x2="${CW - MR}" y2="${Y(maf * 1e6)}" stroke="var(--grid)" stroke-width="1"/>`,
    `<text x="${ML - 4}" y="${Y(maf * 1e6) + 3}" text-anchor="end">${maf}</text>`);
  for (const yr of [1922, 1937, 1963, 2000, 2026, 2056]) g.push(
    `<text x="${X(yr * 12)}" y="${CH - 3}" text-anchor="middle">${yr}</text>`);
  g.push(`<polyline points="${obs.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`);
  g.push(`<polyline points="${sim.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.4" stroke-dasharray="4 3" opacity=".8"/>`);
  g.push(`<line x1="${X(SEAM)}" y1="${MT}" x2="${X(SEAM)}" y2="${CH - MB}" stroke="var(--muted)" stroke-width="1"/>`);
  g.push(`<text x="${X(SEAM)}" y="${MT + 8}" text-anchor="middle">today</text>`);
  const cursor = `<line id="strip-cursor" x1="0" x2="0" y1="${MT}" y2="${CH - MB}" stroke="var(--ink)" stroke-width="1" opacity=".8"/>`;
  svg.innerHTML = (title ? `<text x="${ML}" y="${MT + 8}">Mead + Powell combined storage, MAF — observed to the seam, modeled beyond</text>` : '') + g.join('') + cursor;
  const cur = svg.querySelector('#strip-cursor');
  return { setCursor: (m) => { cur.setAttribute('x1', X(m)); cur.setAttribute('x2', X(m)); }, X };
}
