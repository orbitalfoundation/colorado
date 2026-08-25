# 2026-08-24 — Phase 0: the facts moved under us

Same-day follow-up to the plan entry. Phase 0 verification is substantially
done (full detail in `docs/verification.md`); three findings change the piece.

## 1. The news hook inverted — and got better

The brief assumed we'd be intervening in a live post-2026 negotiation. Wrong:
the seven states deadlocked, the Final EIS landed July 31, 2026, and Interior
signed the Record of Decision **August 21, 2026 — three days before this
entry** — imposing a 10-year adaptive "Decision Framework" (2027–2036) with
two-year operating intervals. Lake Mead set its all-time record low the same
week (1,039.27 ft, 26.5% full, Aug 23). The frame shifts from "weigh in
before the decision" to: **the fight now repeats every two years, forever —
here is the machine for reasoning about it.** Arguably stronger, and less
time-pressured. Read the ROD itself before characterizing it in print.

## 2. The alfalfa number the discourse uses is off by 10x — in a useful way

"Alfalfa is worth low tens of dollars per acre-foot" doesn't survive
verification. Published values: ~$170/AF (CA, Pacific Institute) to
$299–452/AF (AZ, U. of Arizona). The "tens of dollars" meme conflates crop
value with the *price of water* (~$20/AF at IID). The corrected story is
better than the meme: alfalfa's revenue per acre-foot is the same order of
magnitude as what the government paid farmers *not* to irrigate
($330–418/AF). The margin between "grow" and "get paid to fallow" is thin —
which is exactly the kind of non-obvious result the model should surface.

## 3. The California dataset is a memory, not a file

No CA water-rights dataset with volumes exists in any local repo. water-atlas
fetches 63,990 eWRIMS diversion points (locations only); the CKAN join for
face values was never built. The number previously shipped (water-atlas
splash/FAQ) is Grantham & Viers 2014: **~5x over-allocation** — 400 billion
m³ of rights vs mean annual runoff (paper), popularized as 370 vs 70 MAF
(UC Davis release). The brief's "192 vs 72 MAF" appears nowhere; retired.

## What's now solid

Primary data in-repo, with ETL and a validation gate (all committed):

- Richter et al. 2024 (paper + supplementary + HydroShare tables) →
  `data/richter2024.json`. The seven published shares reproduce from the raw
  tables (`node scripts/validate.mjs`). Units are MCM/yr — total consumption
  23,749 MCM ≈ 19.25 MAF/yr, 2000–2019 avg.
- Reclamation Lees Ferry natural flow 1906–2024 →
  `data/lees-ferry-natural-flow.json`: 15.22 MAF/yr (1906–1999) vs
  12.40 MAF/yr (2000–2024), cross-checked against published NFDB means.
- Law of the River, Crowley County, IID/Imperial County, Rio Grande dates,
  SCPP/Lower-Basin program prices, FE5.7 — all verified with sources in
  `docs/verification.md`. A short list of still-open `[VERIFY]` flags
  remains there.

## Next

Phase 1 proper: the mass-balance engine over the natural-flow series with
reservoir storage as a stock, driving toward "dial the flow down and watch
who runs dry." Then the allocation solver (priority vs. proportional), now
validated against the *new* 2027–2036 framework tiers rather than the
expiring 2007 guidelines — another consequence of finding #1.
