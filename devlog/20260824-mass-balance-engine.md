# 2026-08-24 — the mass-balance engine runs

Phase 1 landed same-day (`lib/engine.mjs`, `lib/presets.mjs`,
`scripts/backtest.mjs`, `scripts/scenario.mjs`). Structure and the one hard
lesson:

## Shape

One storage node (combined Mead+Powell live, ~49.4 MAF), annual timestep,
fed by Reclamation's naturalized Lees Ferry flow. Demand = **direct human
consumption only** (ag + MCI + Mexico, from Richter's recorded 2000–2019
series). Evaporation scales with storage^(2/3). Gila excluded both sides.
Above capacity → spill to delta; below the floor → unmet demand (whose cut it
is belongs to the Phase 2 allocation solver).

## The lesson: naturalized flow already nets natural losses

First version subtracted Richter's riparian/wetland ET as demand and needed
an impossible ~4+ MAF/yr of free tributary water to match history —
structural error, caught by the calibration bound. Reclamation's naturalized
series already embeds natural riparian losses; subtracting them again is
double-counting. With direct-human-only demand, the single calibrated
residual (tributary gains minus remaining overlaps) fits at **1.77 MAF/yr —
inside the 1–2 MAF/yr hydrologically expected range**. The calibration bound
acting as a structural-error tripwire is worth keeping as a pattern.

## Backtest

2000–2024 with recorded consumption and recorded natural flow: reproduces
the storage collapse, the 2011 and 2023 wet-year rebounds, and the
"three-quarters empty by end of 2022" anchor (that one is in-sample — it's
the calibration target; the shape checks are out-of-sample). Known bias:
early-2000s drawdown a few MAF too deep. `node scripts/backtest.mjs`.

## First scenario numbers (the piece's core move)

From today's observed 12.1 MAF storage, demand at the 2000–2019 average:

- at **110%** of the 2000–2024 mean flow the system recovers (21 MAF by yr 40)
- at **100%** it still grinds to the floor in ~24 years
- at 90% shortages start in year 4; at 80%, year 2.

The counterintuitive finding: holding today's demand, even average-recent-
drought flow is not enough *to recover*, because refilling reservoirs raises
evaporation — the system stabilizes empty. Recovery needs wet years or cuts.
"Dial the flow down and watch who runs dry" already works as arithmetic;
"who specifically" is Phase 2.

## Deliberately deferred

Per-reservoir split (Mead vs Powell), the allocation solver (priority vs
proportional — validate against the new 2027–2036 framework, not the expired
2007 guidelines), impact translation, and any UI. Also several DRAFT
constants in `lib/engine.mjs` (start storage, dead-pool floor, storageRef)
need sourcing before anything ships.
