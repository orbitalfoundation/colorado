// M3: movements over the fixed map; the timeline follows the reader.
// Movement IV is now two parts — the promises (flow-vs-paper figure draws
// itself with your scroll) and the drawdown — with an event ticker that
// fires as the scrub passes each Law-of-the-River moment.
import { loadAll, makeMap, addOverlays, makeReservoirMarkers, buildStrip,
  M0, M_END, SEAM, mlabel, darkMedia } from './core.mjs';

const data = await loadAll();

const STAKES = [
  { name: 'Las Vegas', ll: [-115.14, 36.17] },
  { name: 'Phoenix (CAP)', ll: [-112.07, 33.45] },
  { name: 'Imperial Valley', ll: [-115.56, 32.79] },
  { name: 'Yuma', ll: [-114.63, 32.69] },
  { name: 'Front Range export', ll: [-104.99, 39.74] },
  { name: 'Mexicali & the delta', ll: [-115.0, 32.2] },
];

// Verified Law-of-the-River moments (see docs/verification.md).
const EVENTS = [
  { m: 1922 * 12 + 10, t: '1922 · the Compact divides 15 MAF/yr, signed against a wet run of years' },
  { m: 1935 * 12 + 8, t: '1935 · Hoover Dam completed; Mead begins to fill' },
  { m: 1944 * 12 + 1, t: '1944 · treaty adds 1.5 MAF/yr for Mexico; 16.5 promised' },
  { m: 1963 * 12 + 5, t: '1963 · Glen Canyon Dam closes; Powell fills · Arizona v. California decided' },
  { m: 1968 * 12 + 8, t: "1968 · Central Arizona Project authorized, junior to California's 4.4" },
  { m: 2000 * 12, t: '2000 · the millennium drought begins' },
  { m: 2007 * 12 + 11, t: '2007 · Interim Guidelines: the first shortage-sharing rules' },
  { m: 2019 * 12 + 4, t: '2019 · Drought Contingency Plan deepens the cuts' },
  { m: 2026 * 12 + 6, t: '2026 · record lows; states deadlock; Interior imposes the 2027–2036 framework' },
];

const H_SPLIT = 1966 * 12;
const MOVES = {
  'm-river':    { bounds: [[-117.5, 30.8], [-105.2, 43.6]], time: SEAM },
  'm-born':     { bounds: [[-112.5, 37.8], [-105.6, 43.7]], time: SEAM },
  'm-drinks':   { bounds: [[-118.8, 31.0], [-108.5, 37.6]], time: SEAM, stakes: true },
  'm-promises': { bounds: [[-114.8, 34.6], [-108.8, 39.0]], scrub: [M0, H_SPLIT], evt: 'evt-promises' },
  'm-history':  { bounds: [[-116.6, 33.9], [-109.4, 38.6]], scrub: [H_SPLIT, SEAM], evt: 'evt-history' },
  'm-future':   { bounds: [[-117.5, 30.8], [-105.2, 43.6]], scrub: [SEAM, M_END] },
};

const $ = (id) => document.getElementById(id);
let map, setDiscs, strip, stakeMarkers = [], mapReady = false;

// ---- flow-vs-paper figure (movement IV·a) --------------------------------
const FW = 340, FH = 150, FL = 24, FR = 6, FT = 12, FB = 16;
const YEARS = Object.keys(data.flowsJson.waterYears).map(Number);
const fx = (y) => FL + (y - 1906) / (2024 - 1906) * (FW - FL - FR);
const fy = (maf) => FT + (1 - maf / 26) * (FH - FT - FB);
let flowBars = [];
function buildFlowFig() {
  const svg = $('flowfig');
  svg.setAttribute('viewBox', `0 0 ${FW} ${FH}`);
  const g = [];
  for (const maf of [0, 10, 20]) g.push(
    `<line x1="${FL}" y1="${fy(maf)}" x2="${FW - FR}" y2="${fy(maf)}" stroke="var(--grid)" stroke-width=".7"/>`,
    `<text x="${FL - 3}" y="${fy(maf) + 3}" text-anchor="end">${maf}</text>`);
  g.push(`<rect x="${fx(1906)}" y="${FT}" width="${fx(1921) - fx(1906)}" height="${FH - FT - FB}" fill="var(--accent)" opacity=".07"/>`);
  for (const yr of [1906, 1940, 1980, 2024]) g.push(
    `<text x="${fx(yr)}" y="${FH - 4}" text-anchor="middle">${yr}</text>`);
  const bars = YEARS.map((y) => {
    const maf = data.flowsJson.waterYears[String(y)] / 1e6;
    const w = (FW - FL - FR) / (2024 - 1906) * 0.82;
    return `<rect data-y="${y}" x="${fx(y) - w / 2}" y="${fy(maf)}" width="${w}" height="${Math.max(0, fy(0) - fy(maf))}" fill="var(--accent)" opacity="0" rx="1"/>`;
  });
  g.push(`<line x1="${fx(1922)}" y1="${fy(15)}" x2="${FW - FR}" y2="${fy(15)}" stroke="var(--ink)" stroke-width=".9" stroke-dasharray="3 3" opacity="0" id="pl-compact"/>`);
  g.push(`<text x="${FW - FR}" y="${fy(15) - 3}" text-anchor="end" opacity="0" id="pt-compact">promised: 15</text>`);
  g.push(`<line x1="${fx(1944)}" y1="${fy(16.5)}" x2="${FW - FR}" y2="${fy(16.5)}" stroke="var(--ink)" stroke-width=".9" stroke-dasharray="3 3" opacity="0" id="pl-mexico"/>`);
  g.push(`<text x="${FW - FR}" y="${fy(16.5) - 3}" text-anchor="end" opacity="0" id="pt-mexico">+Mexico: 16.5</text>`);
  g.push(`<text x="${fx(1913)}" y="${FT + 18}" text-anchor="middle" opacity=".9">the wet years</text>`);
  svg.innerHTML = `<text x="${FL}" y="${FT - 3}">natural flow at Lees Ferry, MAF/yr — vs the paper</text>` + g.join('') + bars.join('');
  flowBars = [...svg.querySelectorAll('rect[data-y]')];
}
function updateFlowFig(m) {
  const year = Math.floor(m / 12);
  for (const b of flowBars) b.setAttribute('opacity', Number(b.dataset.y) <= year ? '0.8' : '0');
  for (const [id, from] of [['compact', 1922], ['mexico', 1944]]) {
    const on = year >= from ? '0.9' : '0';
    $(`pl-${id}`).setAttribute('opacity', on);
    $(`pt-${id}`).setAttribute('opacity', on);
  }
}

// ---- map / dock ----------------------------------------------------------
function buildAll() {
  mapReady = false;
  map?.remove();
  map = makeMap('map', { interactive: false });
  map.on('load', () => {
    addOverlays(map, data);
    setDiscs = makeReservoirMarkers(map, data.lakes);
    stakeMarkers = STAKES.map(({ name, ll }) => {
      const el = document.createElement('div');
      el.textContent = name;
      el.style.cssText = `font:600 11px var(--sans);color:var(--ink);background:color-mix(in srgb,var(--surface) 85%,transparent);padding:2px 6px;border-radius:4px;box-shadow:0 0 0 1px var(--ring);white-space:nowrap;visibility:hidden`;
      return new maplibregl.Marker({ element: el }).setLngLat(ll).addTo(map);
    });
    mapReady = true;
    onScroll(true);
  });
  strip = buildStrip($('strip'), data, { title: false });
  buildFlowFig();
}

const state = { active: null, m: SEAM };
function setTime(m) {
  state.m = Math.round(m);
  const r = data.reservoirsAt(state.m), c = data.combinedAt(state.m);
  $('rdate').textContent = mlabel(state.m);
  $('rera').textContent = c.era;
  $('rmead').textContent = (r.mead / 1e6).toFixed(1);
  $('rpowell').textContent = (r.powell / 1e6).toFixed(1);
  $('rcomb').textContent = (c.af / 1e6).toFixed(1);
  strip.setCursor(state.m);
  updateFlowFig(state.m);
  const past = EVENTS.filter((e) => e.m <= state.m).at(-1);
  for (const id of ['evt-promises', 'evt-history'])
    $(id).innerHTML = past && state.m <= SEAM ? past.t : '&nbsp;';
  if (mapReady) setDiscs(r);
}

function onScroll(force = false) {
  const mid = innerHeight * 0.45;
  let active = null, progress = 0;
  for (const id of Object.keys(MOVES)) {
    const el = $(id), rect = el.getBoundingClientRect();
    if (rect.top <= mid && rect.bottom > mid) {
      active = id;
      progress = Math.min(1, Math.max(0, (mid - rect.top) / (rect.height * 0.82)));
      break;
    }
  }
  active ??= state.active ?? 'm-river';
  const mv = MOVES[active];
  if (active !== state.active || force) {
    state.active = active;
    if (mapReady) map.fitBounds(mv.bounds, { padding: 30, duration: 1600 });
    for (const mk of stakeMarkers) mk.getElement().style.visibility = mv.stakes ? 'visible' : 'hidden';
  }
  setTime(mv.scrub ? mv.scrub[0] + (mv.scrub[1] - mv.scrub[0]) * progress : mv.time);
}

let raf = null;
addEventListener('scroll', () => { raf ??= requestAnimationFrame(() => { raf = null; onScroll(); }); }, { passive: true });
addEventListener('resize', () => onScroll(true));
darkMedia.addEventListener('change', buildAll);

buildAll();
setTime(SEAM);
if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ block: 'start' }), 800);
