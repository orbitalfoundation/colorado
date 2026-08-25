#!/usr/bin/env node
// The core interaction, as numbers: dial the river's flow and watch the
// system. Runs 40 years at a chosen fraction of the 2000-2024 mean natural
// flow, with 2000-2019 average direct demands held constant, starting from
// today's observed storage (~12.1 MAF, Aug 2026). Proportional cuts only —
// the allocation solver (who specifically runs dry) is Phase 2.
//   node scripts/scenario.mjs            # sweep 110%..60%
//   node scripts/scenario.mjs 0.8        # one fraction, yearly detail
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulate } from '../lib/engine.mjs';
import { baselineDemands } from '../lib/presets.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const richter = JSON.parse(readFileSync(join(root, 'data/richter2024.json'), 'utf8'));
const flowsJson = JSON.parse(readFileSync(join(root, 'data/lees-ferry-natural-flow.json'), 'utf8'));

const RESIDUAL = 1.77e6;    // from scripts/backtest.mjs calibration
const START = 12.1e6;       // observed combined storage, 2026-08-23
const meanFlow = flowsJson.averagesMAF['2000-2024'] * 1e6;
const demands = baselineDemands(richter);
const totalDemand = Object.values(demands).reduce((a, b) => a + b, 0);

function run(frac, years = 40) {
  const flows = Array.from({ length: years }, (_, i) => ({ year: 2027 + i, naturalFlowAF: meanFlow * frac }));
  return simulate(flows, demands, { residualInflowAF: RESIDUAL, startStorageAF: START });
}

const arg = Number(process.argv[2]);
if (arg) {
  const r = run(arg);
  console.log(`flow at ${(arg * 100).toFixed(0)}% of 2000-2024 mean (${(meanFlow * arg / 1e6).toFixed(1)} MAF/yr), demand ${(totalDemand / 1e6).toFixed(1)} MAF/yr`);
  for (const y of r.years) console.log(y.year, (y.storageAF / 1e6).toFixed(1), 'MAF', y.unmetAF ? `UNMET ${(y.unmetAF / 1e6).toFixed(2)} MAF` : '');
} else {
  console.log(`demand held at 2000-2019 average: ${(totalDemand / 1e6).toFixed(1)} MAF/yr direct (+ storage-dependent evap)`);
  console.log('flow%   MAF/yr   yrs-to-first-shortage   avg-unmet(MAF/yr, yrs 20-40)   storage@yr40');
  for (const frac of [1.1, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6]) {
    const r = run(frac);
    const first = r.years.find((y) => y.unmetAF > 0);
    const tail = r.years.slice(20);
    const avgUnmet = tail.reduce((a, y) => a + y.unmetAF, 0) / tail.length / 1e6;
    console.log([
      `${(frac * 100).toFixed(0)}%`.padStart(4),
      (meanFlow * frac / 1e6).toFixed(1).padStart(7),
      (first ? String(first.year - 2027) : 'never').padStart(12),
      avgUnmet.toFixed(2).padStart(18),
      (r.years.at(-1).storageAF / 1e6).toFixed(1).padStart(16) + ' MAF',
    ].join('  '));
  }
}
