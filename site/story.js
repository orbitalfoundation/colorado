// M3: movements over the fixed map; the timeline follows the reader.
// Movement IV is now two parts — the promises (flow-vs-paper figure draws
// itself with your scroll) and the drawdown — with an event ticker that
// fires as the scrub passes each Law-of-the-River moment.
import { loadAll, makeMap, addOverlays, makeReservoirMarkers, buildStrip,
  M0, M_END, SEAM, mlabel, darkMedia } from './core.mjs';
import { REGIMES, ENTITLEMENTS_AF, PARTIES } from './lib/allocate.mjs';

const data = await loadAll();
const canals = await fetch('./data/geometry/canals.json').then((r) => r.json());

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
  'm-open':     { bounds: [[-115.8, 31.0], [-113.4, 33.6]], time: SEAM },
  'm-river':    { bounds: [[-117.5, 30.8], [-105.2, 43.6]], time: SEAM },
  'm-born':     { bounds: [[-112.5, 37.8], [-105.6, 43.7]], time: SEAM },
  'm-drinks':   { bounds: [[-118.8, 31.0], [-108.5, 37.6]], time: SEAM, stakes: true, canals: true },
  'm-promises': { bounds: [[-114.8, 34.6], [-108.8, 39.0]], scrub: [M0, H_SPLIT], evt: 'evt-promises' },
  'm-history':  { bounds: [[-116.6, 33.9], [-109.4, 38.6]], scrub: [H_SPLIT, SEAM], evt: 'evt-history' },
  'm-future':   { bounds: [[-122.8, 29.8], [-106.0, 40.2]], scrub: [SEAM, M_END], parties: true },
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

// ---- Sankey: where the water goes, with a denominator toggle -------------
const MCM2MAF = 1 / 1233.48;
function sankeyRows() {
  const s = data.richter.sectoral.sectors;
  const ag = s['Irrigated agriculture'];
  const feed = ag.crops['Alfalfa'].total + ag.crops['Other Hay'].total;
  return [
    { id: 'feed', label: 'cattle feed', v: feed, human: true, hue: 'var(--accent)' },
    { id: 'crops', label: 'other crops', v: ag.total - feed, human: true, hue: 'color-mix(in srgb, var(--accent) 45%, var(--surface))' },
    { id: 'mci', label: 'cities & industry', v: s['Municipal, Commercial & Industrial'].total, human: true, hue: 'color-mix(in srgb, var(--accent) 65%, var(--surface))' },
    { id: 'evap', label: 'reservoir evaporation', v: s['Reservoir Evaporation'].total, human: false, hue: 'var(--grid)' },
    { id: 'riparian', label: 'wild vegetation', v: s['Riparian & Wetland ET'].total, human: false, hue: 'var(--grid)' },
  ];
}
let denom = new URLSearchParams(location.search).get('denom') === 'direct' ? 'direct' : 'total';
function drawSankey() {
  const rows = sankeyRows();
  const total = rows.reduce((a, r) => a + r.v, 0);
  const direct = rows.filter((r) => r.human).reduce((a, r) => a + r.v, 0);
  const base = denom === 'total' ? total : direct;
  const W = 360, H = 210, GAP = 3, TOP = 8, BOT = 6, LX = 6, LW = 10, RX = 196, RW = 10;
  const usable = H - TOP - BOT - GAP * (rows.length - 1);
  const scale = usable / total;
  const g = [];
  let ySrc = TOP + (denom === 'direct' ? 0 : 0), yR = TOP;
  // source bar sized to the chosen denominator
  const srcH = base * scale;
  g.push(`<rect x="${LX}" y="${TOP}" width="${LW}" height="${srcH}" rx="2" fill="var(--accent)" opacity=".9"/>`);
  g.push(`<text x="${LX}" y="${TOP + srcH + 12}">${(base * MCM2MAF).toFixed(1)} MAF/yr</text>`);
  let yL = TOP;
  for (const r of rows) {
    const dim = denom === 'direct' && !r.human;
    const h = r.v * scale;
    const y0 = yL, y1 = yR;
    if (!dim) {
      g.push(`<path d="M ${LX + LW} ${y0} C ${W * 0.42} ${y0}, ${W * 0.42} ${y1}, ${RX} ${y1}
        L ${RX} ${y1 + h} C ${W * 0.42} ${y1 + h}, ${W * 0.42} ${y0 + h}, ${LX + LW} ${y0 + h} Z"
        fill="${r.hue}" opacity="${r.human ? '.75' : '.45'}"/>`);
      yL += h;
    }
    g.push(`<rect x="${RX}" y="${y1}" width="${RW}" height="${h}" rx="2" fill="${r.hue}" opacity="${dim ? '.25' : '.9'}"/>`);
    const pct = dim ? '·' : `${(r.v / base * 100).toFixed(0)}%`;
    g.push(`<text x="${RX + RW + 6}" y="${y1 + h / 2 + 3}" ${dim ? 'opacity=".45"' : ''}>${dim ? '' : pct + ' '}${r.label} · ${(r.v * MCM2MAF).toFixed(1)}</text>`);
    yR += h + GAP;
  }
  $('sankey').setAttribute('viewBox', `0 0 ${W} ${H}`);
  $('sankey').innerHTML = g.join('');
  $('sankeynote').textContent = denom === 'total'
    ? 'Everything the basin consumes, 2000–2019 average (Richter et al. 2024). MAF/yr.'
    : 'Direct human use only: reservoir evaporation and the river\u2019s own vegetation set aside.';
  for (const b of $('denoms').children) b.setAttribute('aria-pressed', String(b.dataset.d === denom));
}
$('denoms').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-d]');
  if (b) { denom = b.dataset.d; drawSankey(); }
});

// ---- the fork: levers, allocation, party delivery on the map -------------
// Mainstem (UB+LB, excl. Gila/Mexico) shares from the Richter sectoral
// accounting: cattle feed is 69.5% of mainstem irrigation, other crops 30.5%.
const _s = data.richter.sectoral.sectors;
const _ag = _s['Irrigated agriculture'];
const _feedMCM = _ag.crops['Alfalfa'].upperBasinTotal + _ag.crops['Alfalfa'].lowerBasinTotal
  + _ag.crops['Other Hay'].upperBasinTotal + _ag.crops['Other Hay'].lowerBasinTotal;
const _agMCM = _ag.upperBasinTotal + _ag.lowerBasinTotal;
const FEED_SHARE = _feedMCM / _agMCM, CROPS_SHARE = 1 - FEED_SHARE;
const FEED_MAX_AF = FEED_SHARE * data.baseline.ag;
const CROPS_MAX_AF = CROPS_SHARE * data.baseline.ag;
const CITY_MAX_AF = 0.4 * data.baseline.mci; // deep-conservation ceiling
const PARTY_META = {
  california: { name: 'California', pos: [-114.9, 33.5], color: 'var(--ca)' },
  arizona:    { name: 'Arizona',    pos: [-111.7, 34.1], color: 'var(--az)' },
  nevada:     { name: 'Nevada',     pos: [-114.8, 36.4], color: 'var(--nv)' },
  mexico:     { name: 'Mexico',     pos: [-113.9, 31.9], color: 'var(--mx)', labelAbove: true },
};
const q0 = new URLSearchParams(location.search);
const fork = {
  flow: Math.min(115, Math.max(60, Number(q0.get('flow')) || 100)),
  feed: Math.min(100, Math.max(0, Number(q0.get('feed')) || 0)),
  crops: Math.min(100, Math.max(0, Number(q0.get('crops')) || 0)),
  city: Math.min(40, Math.max(0, Number(q0.get('city')) || 0)),
  regime: REGIMES[q0.get('regime')] ? q0.get('regime') : 'framework2728',
};
let steadyShortageAF = 0;
let partyMarkers = {};

function syncForkUrl() {
  const q = new URLSearchParams(location.search);
  q.set('flow', String(fork.flow)); q.set('feed', String(fork.feed));
  q.set('crops', String(fork.crops)); q.set('city', String(fork.city)); q.set('regime', fork.regime);
  history.replaceState(null, '', `?${q}${location.hash}`);
}

function makePartyMarkers() {
  partyMarkers = {};
  const maxE = Math.max(...Object.values(ENTITLEMENTS_AF));
  for (const pid of PARTIES) {
    const meta = PARTY_META[pid];
    const R = Math.round(26 * Math.sqrt(ENTITLEMENTS_AF[pid] / maxE));
    const el = document.createElement('div');
    el.innerHTML = `<div class="ring"></div><div class="disc"></div><div class="lab"></div>`;
    Object.assign(el.style, { position: 'relative', width: `${R * 2}px`, height: `${R * 2}px`, pointerEvents: 'none', visibility: 'hidden' });
    el.querySelector('.ring').style.cssText = `position:absolute;inset:0;border:1.5px dashed ${meta.color};border-radius:50%;opacity:.8`;
    el.querySelector('.disc').style.cssText = `position:absolute;border-radius:50%;background:${meta.color};opacity:.7`;
    el.querySelector('.lab').style.cssText = `position:absolute;${meta.labelAbove ? 'bottom' : 'top'}:100%;left:50%;transform:translateX(-50%);font:600 11px var(--sans);color:var(--ink);white-space:nowrap;text-shadow:0 0 4px var(--page)`;
    partyMarkers[pid] = { marker: new maplibregl.Marker({ element: el }).setLngLat(meta.pos).addTo(map), el, R };
  }
}
function updateParties() {
  const { cuts } = REGIMES[fork.regime](steadyShortageAF);
  for (const pid of PARTIES) {
    const { el, R } = partyMarkers[pid] ?? {};
    if (!el) continue;
    const ent = ENTITLEMENTS_AF[pid], del = ent - cuts[pid];
    const r = Math.max(1, R * Math.sqrt(Math.max(del, 0) / ent));
    Object.assign(el.querySelector('.disc').style, {
      width: `${r * 2}px`, height: `${r * 2}px`, left: `${R - r}px`, top: `${R - r}px` });
    el.querySelector('.lab').textContent =
      `${PARTY_META[pid].name} ${(del / 1e6).toFixed(1)}/${(ent / 1e6).toFixed(1)}`;
  }
}
function applyFork() {
  const agCutAF = fork.feed / 100 * FEED_MAX_AF + fork.crops / 100 * CROPS_MAX_AF;
  const mciCutAF = fork.city / 100 * CITY_MAX_AF;
  const { steadyShortageAF: s } = data.setFuture({
    flowFrac: fork.flow / 100, agCutAF, mciCutAF });
  steadyShortageAF = s;
  strip = buildStrip($('strip'), data, { title: false });
  $('lv-flow').textContent = `${fork.flow}% · ${(data.meanFlow * fork.flow / 100 / 1e6).toFixed(1)} MAF/yr`;
  $('lv-feed').textContent = `${fork.feed}% · −${(fork.feed / 100 * FEED_MAX_AF / 1e6).toFixed(1)} MAF/yr`;
  $('lv-crops').textContent = `${fork.crops}% · −${(fork.crops / 100 * CROPS_MAX_AF / 1e6).toFixed(1)} MAF/yr`;
  $('lv-city').textContent = `${fork.city}% · −${(fork.city / 100 * CITY_MAX_AF / 1e6).toFixed(1)} MAF/yr`;
  $('forkout').textContent = s > 1e4
    ? `steady-state shortage ${(s / 1e6).toFixed(2)} MAF/yr under this flow — the rule below decides who bears it`
    : 'no steady-state shortage under this flow and demand';
  for (const b of $('regimes').children) b.setAttribute('aria-pressed', String(b.dataset.r === fork.regime));
  const { cuts } = REGIMES[fork.regime](steadyShortageAF);
  $('forkparties').innerHTML = PARTIES.map((pid) =>
    `<span style="color:${PARTY_META[pid].color}">●</span> ${PARTY_META[pid].name} <b>${((ENTITLEMENTS_AF[pid] - cuts[pid]) / 1e6).toFixed(1)}</b>/${(ENTITLEMENTS_AF[pid] / 1e6).toFixed(1)}`).join(' · ');
  updateParties();
  setTime(state.m);
}

// ---- map / dock ----------------------------------------------------------
function buildAll() {
  mapReady = false;
  map?.remove();
  map = makeMap('map', { interactive: false });
  map.on('load', () => {
    addOverlays(map, data);
    setDiscs = makeReservoirMarkers(map, data.lakes);
    map.addSource('canals', { type: 'geojson', data: canals });
    map.addLayer({ id: 'canals', type: 'line', source: 'canals',
      paint: { 'line-color': darkMedia.matches ? '#d95926' : '#eb6834',
        'line-width': 1.6, 'line-opacity': 0 } });
    stakeMarkers = STAKES.map(({ name, ll }) => {
      const el = document.createElement('div');
      el.textContent = name;
      el.style.cssText = `font:600 11px var(--sans);color:var(--ink);background:color-mix(in srgb,var(--surface) 85%,transparent);padding:2px 6px;border-radius:4px;box-shadow:0 0 0 1px var(--ring);white-space:nowrap;visibility:hidden`;
      return new maplibregl.Marker({ element: el }).setLngLat(ll).addTo(map);
    });
    makePartyMarkers();
    mapReady = true;
    onScroll(true);
    updateParties();
  });
  strip = buildStrip($('strip'), data, { title: false });
  buildFlowFig();
  drawSankey();
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
    if (map.getLayer('canals')) map.setPaintProperty('canals', 'line-opacity', mv.canals ? 0.9 : 0);
    for (const pm of Object.values(partyMarkers)) pm.el.style.visibility = mv.parties ? 'visible' : 'hidden';
  }
  setTime(mv.scrub ? mv.scrub[0] + (mv.scrub[1] - mv.scrub[0]) * progress : mv.time);
}

let raf = null;
addEventListener('scroll', () => { raf ??= requestAnimationFrame(() => { raf = null; onScroll(); }); }, { passive: true });
addEventListener('resize', () => onScroll(true));
darkMedia.addEventListener('change', buildAll);

$('lever-flow').value = fork.flow;
$('lever-feed').value = fork.feed;
$('lever-crops').value = fork.crops;
$('lever-city').value = fork.city;
$('lever-crops').addEventListener('input', (e) => { fork.crops = Number(e.target.value); syncForkUrl(); applyFork(); });
$('lever-city').addEventListener('input', (e) => { fork.city = Number(e.target.value); syncForkUrl(); applyFork(); });
$('lever-flow').addEventListener('input', (e) => { fork.flow = Number(e.target.value); syncForkUrl(); applyFork(); });
$('lever-feed').addEventListener('input', (e) => { fork.feed = Number(e.target.value); syncForkUrl(); applyFork(); });
$('regimes').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-r]');
  if (b) { fork.regime = b.dataset.r; syncForkUrl(); applyFork(); }
});
$('forklink').addEventListener('click', async (e) => {
  e.preventDefault();
  try { await navigator.clipboard.writeText(location.href); $('forklink').textContent = 'copied'; }
  catch { $('forklink').textContent = location.href; }
  setTimeout(() => { $('forklink').textContent = 'copy a link to this fork'; }, 1600);
});
buildAll();
applyFork();
setTime(SEAM);
if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ block: 'start' }), 800);
