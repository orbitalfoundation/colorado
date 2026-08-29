// M2: the movements skeleton. A fixed map choreographed by scroll; the
// timeline follows the reader through movements IV (1906 -> today) and
// V (today -> 2056). Placeholder figures are labeled in the cards.
import { loadAll, makeMap, addOverlays, makeReservoirMarkers, buildStrip,
  M0, M_END, SEAM, mlabel, darkMedia } from './core.mjs';

const data = await loadAll();

// city/stakeholder placeholder dots for movement III (well-known locations)
const STAKES = [
  { name: 'Las Vegas', ll: [-115.14, 36.17] },
  { name: 'Phoenix (CAP)', ll: [-112.07, 33.45] },
  { name: 'Imperial Valley', ll: [-115.56, 32.79] },
  { name: 'Yuma', ll: [-114.63, 32.69] },
  { name: 'Front Range export', ll: [-104.99, 39.74] },
  { name: 'Mexicali & the delta', ll: [-115.0, 32.2] },
];

const MOVES = {
  'm-river':   { bounds: [[-117.5, 30.8], [-105.2, 43.6]], time: SEAM },
  'm-born':    { bounds: [[-112.5, 37.8], [-105.6, 43.7]], time: SEAM },
  'm-drinks':  { bounds: [[-118.8, 31.0], [-108.5, 37.6]], time: SEAM, stakes: true },
  'm-history': { bounds: [[-116.6, 33.9], [-109.4, 38.6]], scrub: [M0, SEAM] },
  'm-future':  { bounds: [[-117.5, 30.8], [-105.2, 43.6]], scrub: [SEAM, M_END] },
};

const $ = (id) => document.getElementById(id);
let map, setDiscs, strip, stakeMarkers = [], mapReady = false;

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
