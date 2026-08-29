// The spine (M1): free scrub over the century, the seam at today.
// Shared machinery lives in core.mjs (also used by story.html).
import { loadAll, makeMap, addOverlays, makeReservoirMarkers, buildStrip,
  M0, M_END, SEAM, mlabel, darkMedia } from './core.mjs';

const data = await loadAll();
const $ = (id) => document.getElementById(id);
const state = { m: SEAM, playing: false };
let map, setDiscs, strip, mapReady = false;

function buildAll() {
  mapReady = false;
  map?.remove();
  map = makeMap('map');
  map.on('load', () => {
    addOverlays(map, data);
    setDiscs = makeReservoirMarkers(map, data.lakes);
    mapReady = true;
    render();
  });
  strip = buildStrip($('chart'), data);
}

function render() {
  const r = data.reservoirsAt(state.m), c = data.combinedAt(state.m);
  $('rdate').textContent = mlabel(state.m);
  $('rera').textContent = c.era;
  $('rmead').textContent = (r.mead / 1e6).toFixed(1);
  $('rpowell').textContent = (r.powell / 1e6).toFixed(1);
  $('rcomb').textContent = (c.af / 1e6).toFixed(1);
  $('rnote').textContent = state.m > SEAM
    ? 'future: mean 2000–2024 flow, demand held at 2000–2019 average'
    : (state.m < 1937 * 12 + 5 ? 'before Hoover Dam: no reservoirs yet' : 'Reclamation record');
  strip.setCursor(state.m);
  if (mapReady) setDiscs(r);
}

const scrub = $('scrub');
scrub.min = M0; scrub.max = M_END; scrub.value = state.m;
scrub.addEventListener('input', () => { state.m = Number(scrub.value); render(); });

const chart = $('chart');
function seekFromPointer(e) {
  const rect = chart.getBoundingClientRect();
  const frac = Math.min(1, Math.max(0, ((e.clientX - rect.left) / rect.width * 800 - 30) / (800 - 38)));
  state.m = Math.round(M0 + frac * (M_END - M0)); scrub.value = state.m; render();
}
chart.parentElement.addEventListener('pointerdown', seekFromPointer);
chart.parentElement.addEventListener('pointermove', (e) => { if (e.buttons) seekFromPointer(e); });

$('play').addEventListener('click', () => {
  state.playing = !state.playing;
  $('play').textContent = state.playing ? '⏸' : '▶';
  if (state.playing) tick();
});
function tick() {
  if (!state.playing) return;
  state.m = state.m >= M_END ? M0 : state.m + 2;
  scrub.value = state.m; render();
  requestAnimationFrame(() => setTimeout(tick, 24));
}

darkMedia.addEventListener('change', () => { buildAll(); render(); });
buildAll();
render();
