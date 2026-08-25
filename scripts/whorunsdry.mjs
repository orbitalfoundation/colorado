#!/usr/bin/env node
// Phase 2 demo: dial the flow, pick a regime, see WHO runs dry.
//   node scripts/whorunsdry.mjs [flowFraction=0.8]
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulate } from '../lib/engine.mjs';
import { baselineDemands } from '../lib/presets.mjs';
import { allocateRun, REGIMES, ENTITLEMENTS_AF, PARTIES } from '../lib/allocate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const richter = JSON.parse(readFileSync(join(root, 'data/richter2024.json'), 'utf8'));
const flowsJson = JSON.parse(readFileSync(join(root, 'data/lees-ferry-natural-flow.json'), 'utf8'));

const frac = Number(process.argv[2] ?? 0.8);
const meanFlow = flowsJson.averagesMAF['2000-2024'] * 1e6;
const flows = Array.from({ length: 30 }, (_, i) => ({ year: 2027 + i, naturalFlowAF: meanFlow * frac }));
const run = simulate(flows, baselineDemands(richter), { residualInflowAF: 1.77e6, startStorageAF: 12.1e6 });

const steady = run.years.slice(10); // after transient
const avgShort = steady.reduce((a, y) => a + y.unmetAF, 0) / steady.length;
console.log(`flow at ${(frac * 100).toFixed(0)}% of 2000-2024 mean; steady-state shortage ${(avgShort / 1e6).toFixed(2)} MAF/yr\n`);
console.log('party        entitlement   proportional      priority   framework27-28');
for (const p of PARTIES) {
  const row = [p.padEnd(12), (ENTITLEMENTS_AF[p] / 1e6).toFixed(1).padStart(8) + ' MAF'];
  for (const regime of ['proportional', 'priority', 'framework2728']) {
    const { cuts } = REGIMES[regime](avgShort);
    const pct = cuts[p] / ENTITLEMENTS_AF[p] * 100;
    row.push(`${(cuts[p] / 1e6).toFixed(2)} (${pct.toFixed(0).padStart(3)}%)`.padStart(13));
  }
  console.log(row.join('  '));
}
console.log('\ncut shown as MAF/yr (% of entitlement). "priority" is the stylized applicable-law stack — see lib/allocate.mjs header.');
