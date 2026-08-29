// The spine (M1): basin map + one timeline with a seam at today.
// Left of the seam: Reclamation's observed monthly storage (1906..2026).
// Right: the engine simulating forward under 2000-2019 average demands and
// the 2000-2024 mean flow. Same map, same units; only one side forks.
import { simulate } from './lib/engine.mjs';
import { baselineDemands } from './lib/presets.mjs';

const [storage, basin, rivers, lakes, richter, flowsJson] = await Promise.all([
  './data/storage.json', './data/geometry/basin.json', './data/geometry/rivers.json',
  './data/geometry/lakes.json', './data/richter2024.json', './data/lees-ferry-natural-flow.json',
].map((u) => fetch(u).then((r) => r.json())));

// ---- time axis: month index from 1906-01 to 2056-12 ----------------------
const M0 = 1906 * 12, M1 = 2057 * 12 - 1;
const SEAM = 2026 * 12 + 7; // 2026-08, last observed month
const mkey = (m) => `${Math.floor(m / 12)}-${String(m % 12 + 1).padStart(2, '0')}`;
const mlabel = (m) => mkey(m).replace('-', '·');

// ---- the future: engine run from the observed present --------------------
const CAP = { mead: 26.12e6, powell: 23.3e6 }; // derived caps, see verification.md
const nowMead = storage.latest.mead, nowPowell = storage.latest.powell;
const split = nowMead / (nowMead + nowPowell); // modeled per-reservoir split
const meanFlow = flowsJson.averagesMAF['2000-2024'] * 1e6;
const run = simulate(
  Array.from({ length: 31 }, (_, i) => ({ year: 2027 + i, naturalFlowAF: meanFlow })),
  baselineDemands(richter),
  { residualInflowAF: 1.77e6, startStorageAF: storage.latest.combined });
const simYear = Object.fromEntries(run.years.map((y) => [y.year, y.storageAF]));
simYear[2026] = storage.latest.combined;

function combinedAt(m) {
  if (m <= SEAM) return { af: storage.combined[mkey(m)] ?? 0, era: 'observed' };
  const y = Math.floor(m / 12), frac = (m % 12) / 12;
  const a = simYear[y - 1] ?? storage.latest.combined, b = simYear[y] ?? a;
  return { af: a + (b - a) * frac, era: 'modeled' };
}
function reservoirsAt(m) {
  if (m <= SEAM) {
    const k = mkey(m);
    return { mead: storage.mead[k] ?? 0, powell: storage.powell[k] ?? 0, era: 'observed' };
  }
  const { af } = combinedAt(m);
  return { mead: af * split, powell: af * (1 - split), era: 'modeled' };
}

// ---- map -----------------------------------------------------------------
const dark = matchMedia('(prefers-color-scheme: dark)');
const centroids = Object.fromEntries(lakes.features.map((f) => [f.properties.name, f.properties.centroid]));
const RES = [
  { id: 'mead', name: 'Lake Mead', c: centroids['Lake Mead'] },
  { id: 'powell', name: 'Lake Powell', c: centroids['Lake Powell'] },
];
const R_FULL = 34; // px radius at full pool
const radius = (af, cap) => Math.max(2, R_FULL * Math.sqrt(Math.max(af, 0) / cap));

let map, mapReady = false;
function buildMap() {
  mapReady = false;
  map?.remove();
  const canvas = dark.matches ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base';
  map = new maplibregl.Map({
    container: 'map', attributionControl: { compact: true },
    style: { version: 8, sources: { esri: {
      type: 'raster', tileSize: 256, maxzoom: 12,
      tiles: [`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${canvas}/MapServer/tile/{z}/{y}/{x}`],
      attribution: 'Esri, HERE, Garmin © OpenStreetMap · geometry: USGS WBD, Natural Earth · storage: Reclamation',
    } }, layers: [{ id: 'base', type: 'raster', source: 'esri' }] },
    bounds: [[-117.5, 30.8], [-105.2, 43.6]], fitBoundsOptions: { padding: 24 },
  });
  map.on('load', () => {
    const line = dark.matches ? '#3987e5' : '#2a78d6';
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
    mapReady = true; drawMarkers();
  });
}

// Reservoir discs as DOM markers: a capacity ring holding a water disc.
const markers = {};
function drawMarkers() {
  if (!mapReady) return;
  const r = reservoirsAt(state.m);
  for (const { id, name, c } of RES) {
    if (!c) continue;
    let el = markers[id]?.getElement();
    if (!el) {
      el = document.createElement('div');
      el.innerHTML = `<div class="ring"></div><div class="disc"></div><div class="lab"></div>`;
      Object.assign(el.style, { position: 'relative', width: `${R_FULL * 2}px`, height: `${R_FULL * 2}px`, pointerEvents: 'none' });
      for (const [cls, css] of [['ring', `position:absolute;inset:0;border:1px dashed var(--muted);border-radius:50%;opacity:.7`],
        ['disc', `position:absolute;border-radius:50%;background:var(--water);opacity:.75;box-shadow:0 0 0 1px var(--ring)`],
        ['lab', `position:absolute;top:100%;left:50%;transform:translateX(-50%);font:600 11px var(--sans);color:var(--ink);white-space:nowrap;text-shadow:0 0 4px var(--page)`]])
        el.querySelector(`.${cls}`).style.cssText = css;
      markers[id] = new maplibregl.Marker({ element: el }).setLngLat(c).addTo(map);
    }
    const rad = radius(r[id], CAP[id]);
    const disc = el.querySelector('.disc');
    Object.assign(disc.style, { width: `${rad * 2}px`, height: `${rad * 2}px`,
      left: `${R_FULL - rad}px`, top: `${R_FULL - rad}px` });
    el.querySelector('.lab').textContent = `${name.replace('Lake ', '')} ${(r[id] / 1e6).toFixed(1)}`;
  }
}

// ---- chart: the century strip with the seam ------------------------------
const chart = document.getElementById('chart');
const CW = 800, CH = 92, ML = 30, MR = 8, MT = 6, MB = 14;
const X = (m) => ML + (m - M0) / (M1 - M0) * (CW - ML - MR);
const YMAX = 52e6;
const Y = (af) => MT + (1 - af / YMAX) * (CH - MT - MB);
function buildChart() {
  chart.setAttribute('viewBox', `0 0 ${CW} ${CH}`);
  const obs = [], sim = [];
  for (let m = M0; m <= SEAM; m += 3) obs.push(`${X(m)},${Y(storage.combined[mkey(m)] ?? 0)}`);
  for (let m = SEAM; m <= M1; m += 3) sim.push(`${X(m)},${Y(combinedAt(m).af)}`);
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
  g.push(`<text x="${X(SEAM) + 6}" y="${Y(20e6)}">modeled ⟶</text>`);
  g.push(`<line id="cursor" x1="0" x2="0" y1="${MT}" y2="${CH - MB}" stroke="var(--ink)" stroke-width="1" opacity=".8"/>`);
  chart.innerHTML = `<text x="${ML}" y="${MT + 8}">Mead + Powell combined storage, MAF — observed to the seam, modeled beyond</text>` + g.join('');
}

// ---- state + wiring ------------------------------------------------------
const state = { m: SEAM, playing: false };
const $ = (id) => document.getElementById(id);
const scrub = $('scrub');
scrub.min = M0; scrub.max = M1; scrub.value = state.m;

function render() {
  const r = reservoirsAt(state.m), c = combinedAt(state.m);
  $('rdate').textContent = mlabel(state.m);
  $('rera').textContent = c.era;
  $('rmead').textContent = (r.mead / 1e6).toFixed(1);
  $('rpowell').textContent = (r.powell / 1e6).toFixed(1);
  $('rcomb').textContent = (c.af / 1e6).toFixed(1);
  $('rnote').textContent = state.m > SEAM
    ? 'future: mean 2000–2024 flow, demand held at 2000–2019 average'
    : (state.m < 1937 * 12 + 5 ? 'before Hoover Dam: no reservoirs yet' : 'Reclamation record');
  document.getElementById('cursor')?.setAttribute('x1', X(state.m));
  document.getElementById('cursor')?.setAttribute('x2', X(state.m));
  drawMarkers();
}
scrub.addEventListener('input', () => { state.m = Number(scrub.value); render(); });
chart.parentElement.addEventListener('pointerdown', seekFromPointer);
chart.parentElement.addEventListener('pointermove', (e) => { if (e.buttons) seekFromPointer(e); });
function seekFromPointer(e) {
  const rect = chart.getBoundingClientRect();
  const frac = Math.min(1, Math.max(0, ((e.clientX - rect.left) / rect.width * CW - ML) / (CW - ML - MR)));
  state.m = Math.round(M0 + frac * (M1 - M0)); scrub.value = state.m; render();
}
$('play').addEventListener('click', () => {
  state.playing = !state.playing;
  $('play').textContent = state.playing ? '⏸' : '▶';
  if (state.playing) tick();
});
function tick() {
  if (!state.playing) return;
  state.m = state.m >= M1 ? M0 : state.m + 2;
  scrub.value = state.m; render();
  requestAnimationFrame(() => setTimeout(tick, 24));
}

dark.addEventListener('change', () => { buildMap(); buildChart(); render(); });
buildMap(); buildChart(); render();
