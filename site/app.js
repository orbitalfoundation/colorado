// Who Drinks the River? — client. Pure ES modules, no build step.
import { simulate } from './lib/engine.mjs';
import { baselineDemands } from './lib/presets.mjs';
import { REGIMES, ENTITLEMENTS_AF, PARTIES } from './lib/allocate.mjs';

const [richter, flowsJson] = await Promise.all([
  fetch('./data/richter2024.json').then((r) => r.json()),
  fetch('./data/lees-ferry-natural-flow.json').then((r) => r.json()),
]);

const MEAN_FLOW = flowsJson.averagesMAF['2000-2024'] * 1e6;
const DEMANDS = baselineDemands(richter);
const RESIDUAL = 1.77e6, START = 12.1e6, YEARS = 30, Y0 = 2027;
const PARTY_META = {
  california: { name: 'California', color: 'var(--ca)' },
  arizona:    { name: 'Arizona',    color: 'var(--az)' },
  nevada:     { name: 'Nevada',     color: 'var(--nv)' },
  mexico:     { name: 'Mexico',     color: 'var(--mx)' },
};
const REGIME_HINTS = {
  proportional: 'Everyone loses the same share of their entitlement. No seniority.',
  priority: 'Juniors absorb everything before seniors lose a drop — a party-level stylization of prior appropriation.',
  framework2728: 'The post-2026 Record of Decision: the negotiated split for the first 1.5 MAF of cuts, seniority beyond it.',
};

// state <-> URL
const state = { flow: 100, regime: 'framework2728' };
{
  const q = new URLSearchParams(location.search);
  const f = Number(q.get('flow')); if (f >= 60 && f <= 115) state.flow = f;
  if (REGIMES[q.get('regime')]) state.regime = q.get('regime');
}
function syncUrl() {
  const q = new URLSearchParams({ flow: String(state.flow), regime: state.regime });
  history.replaceState(null, '', `?${q}`);
}

function run() {
  const flows = Array.from({ length: YEARS }, (_, i) => ({
    year: Y0 + i, naturalFlowAF: MEAN_FLOW * state.flow / 100 }));
  return simulate(flows, DEMANDS, { residualInflowAF: RESIDUAL, startStorageAF: START });
}

const fmt = (af, d = 1) => (af / 1e6).toFixed(d);
const $ = (id) => document.getElementById(id);

function render() {
  const r = run();
  const steady = r.years.slice(10);
  const shortAF = steady.reduce((a, y) => a + y.unmetAF, 0) / steady.length;
  const { cuts } = REGIMES[state.regime](shortAF);

  $('flowv').textContent = `${state.flow}% · ${fmt(MEAN_FLOW * state.flow / 100)} MAF/yr`;
  $('shortn').textContent = fmt(shortAF, 2);
  $('storn').textContent = fmt(r.years[19].storageAF);
  $('regimehint').textContent = REGIME_HINTS[state.regime];
  for (const b of $('regimes').children)
    b.setAttribute('aria-pressed', String(b.dataset.r === state.regime));

  drawStorage(r);
  drawBars(cuts);
}

// ---- storage line chart -------------------------------------------------
const CAP = 49.4e6, W = 680, H = 260, M = { t: 14, r: 12, b: 26, l: 40 };
const sx = (i) => M.l + (i / (YEARS - 1)) * (W - M.l - M.r);
const sy = (af) => M.t + (1 - af / CAP) * (H - M.t - M.b);
let lastRun = null;

function drawStorage(r) {
  lastRun = r;
  const g = [];
  for (const maf of [0, 10, 20, 30, 40]) {
    const y = sy(maf * 1e6);
    g.push(`<line x1="${M.l}" y1="${y}" x2="${W - M.r}" y2="${y}" stroke="var(--grid)" stroke-width="1"/>`,
      `<text x="${M.l - 6}" y="${y + 3}" text-anchor="end">${maf}</text>`);
  }
  const capY = sy(CAP);
  g.push(`<line x1="${M.l}" y1="${capY}" x2="${W - M.r}" y2="${capY}" stroke="var(--baseline)" stroke-dasharray="3 4" stroke-width="1"/>`,
    `<text x="${W - M.r}" y="${capY - 4}" text-anchor="end">full · 49.4 MAF</text>`);
  for (const i of [0, 9, 19, 29])
    g.push(`<text x="${sx(i)}" y="${H - 8}" text-anchor="middle">${Y0 + i}</text>`);
  const pts = r.years.map((y, i) => `${sx(i)},${sy(y.storageAF)}`).join(' ');
  g.push(`<polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>`);
  g.push(`<line id="cross" y1="${M.t}" y2="${H - M.b}" stroke="var(--baseline)" stroke-width="1" opacity="0"/>`);
  g.push(`<circle id="dot" r="3.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2" opacity="0"/>`);
  $('storage').innerHTML = g.join('');
}

const wrap = $('storagewrap'), tip = $('stip');
wrap.addEventListener('pointermove', (e) => {
  if (!lastRun) return;
  const rect = wrap.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width * W;
  const i = Math.max(0, Math.min(YEARS - 1, Math.round((px - M.l) / (W - M.l - M.r) * (YEARS - 1))));
  const y = lastRun.years[i];
  const cross = $('cross'), dot = $('dot');
  cross.setAttribute('x1', sx(i)); cross.setAttribute('x2', sx(i)); cross.setAttribute('opacity', '1');
  dot.setAttribute('cx', sx(i)); dot.setAttribute('cy', sy(y.storageAF)); dot.setAttribute('opacity', '1');
  tip.style.display = 'block';
  tip.textContent = `${y.year} · ${fmt(y.storageAF)} MAF${y.unmetAF ? ` · shortage ${fmt(y.unmetAF, 2)}` : ''}`;
  const tx = sx(i) / W * rect.width;
  tip.style.left = `${Math.min(tx + 10, rect.width - tip.offsetWidth - 4)}px`;
  tip.style.top = `${sy(y.storageAF) / H * rect.height - 34}px`;
});
wrap.addEventListener('pointerleave', () => {
  tip.style.display = 'none';
  $('cross')?.setAttribute('opacity', '0'); $('dot')?.setAttribute('opacity', '0');
});

// ---- party bars ---------------------------------------------------------
function drawBars(cuts) {
  const maxE = Math.max(...Object.values(ENTITLEMENTS_AF));
  $('bars').innerHTML = PARTIES.map((p) => {
    const e = ENTITLEMENTS_AF[p], cut = cuts[p], del = e - cut;
    const m = PARTY_META[p];
    const wTrack = e / maxE * 100, wFill = e ? del / e * 100 : 0;
    const cutTxt = cut > 5e3 ? ` · cut ${fmt(cut, 2)}` : '';
    return `<div class="brow">
      <div class="head"><span class="who">${m.name}</span>
        <span class="amt">${fmt(del, 2)} of ${fmt(e, 1)} MAF${cutTxt}</span></div>
      <div class="track" style="width:${wTrack}%">
        <div class="fill" style="width:${wFill}%;background:${m.color}"></div>
      </div></div>`;
  }).join('');
}

// ---- wiring -------------------------------------------------------------
$('flow').value = state.flow;
$('flow').addEventListener('input', (e) => { state.flow = Number(e.target.value); syncUrl(); render(); });
$('regimes').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-r]');
  if (b) { state.regime = b.dataset.r; syncUrl(); render(); }
});
$('copylink').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); $('copylink').textContent = 'copied'; }
  catch { $('copylink').textContent = location.href; }
  setTimeout(() => { $('copylink').textContent = 'copy link to this scenario'; }, 1600);
});
syncUrl();
render();
