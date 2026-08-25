#!/usr/bin/env node
// Phase 1 gate: the baked data must reproduce Richter 2024's published findings.
import { readFileSync } from 'node:fs';
import { loadBudget, validate, maf } from '../lib/budget.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const richter = JSON.parse(readFileSync(join(root, 'data', 'richter2024.json'), 'utf8'));
const budget = loadBudget(richter);
const result = validate(budget);
for (const c of result.checks) {
  const mark = Math.abs(c.got - c.published) <= 1.35 ? 'ok ' : 'FAIL';
  console.log(`${mark}  ${c.name}: computed ${c.got}% (published ${c.published}%)`);
}
console.log(`\ntotal consumption ${budget.total} MCM/yr = ${maf(budget.total).toFixed(2)} MAF/yr`);
if (!result.ok) { console.error('VALIDATION FAILED:', result.failures); process.exit(1); }
