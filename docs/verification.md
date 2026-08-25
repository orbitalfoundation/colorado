# Phase 0 verification ledger

Burn-down of the `[VERIFY]` flags in `docs/brief.md`. Rules: a fact is
VERIFIED only when checked against a primary or authoritative source that is
cited here; CORRECTED means the brief's figure was wrong and the right one is
recorded; DRAFT means usable for development scaffolding but blocked from
publication. Machines propose, humans promote.

Status: in progress (started 2026-08-24).

## Richter et al. 2024 — the data spine ✅ VERIFIED (primary source in repo)

Citation confirmed: Richter, B.D., Lamsal, G., Marston, L., Dhakal, S.,
Sangha, L.S., Rushforth, R.R., Wei, D., Ruddell, B.L., Davis, K.F.,
Hernandez-Cruz, A., Sandoval-Solis, S., Schmidt, J.C. (2024). "New water
accounting reveals why the Colorado River no longer reaches the sea."
*Communications Earth & Environment* 5:134. doi:10.1038/s43247-024-01291-0.
Open access. Local copies: `reference/richter2024/` (article PDF, two
supplementary PDFs, HydroShare data tables from
hydroshare.org/resource/2098ae29ae704d9aacfd08e030690392).

Paper's own stated findings (verbatim from the article text, p.1 and p.3):

- "Irrigated agriculture is responsible for 74% of direct human uses and 52%
  of overall water consumption."
- "Cattle feed crops including alfalfa and other grass hays account for 46%
  of all direct water consumption", 32% of all water consumed from the basin,
  and 62% of all agricultural water consumed.
- Cattle-feed crops consume 90% of Upper Basin irrigation water; in Mexico's
  share they are 86% of direct human use.
- Riparian/wetland ET is 19% of overall consumption; reservoir evaporation 11%.
- Basin overconsumed (total consumption > runoff) in 16 of 21 years during
  2000–2020; average annual overdraft ~10%; the two big reservoirs fell to
  three-quarters empty by end of 2022.
- Accounting period: 2000–2019 averages. **Units in Table 1/2 and the
  HydroShare tables are million cubic meters (MCM) per year**, not acre-feet;
  English-unit versions are Tables SI-1/SI-2 in the supplementary PDF.
  1 MAF = 1,233.48 MCM. Grand total consumption 23,749 MCM/yr ≈ 19.25 MAF/yr
  (includes Gila, exports, Mexico, reservoir evaporation, riparian ET).

Brief's Claim 1 verdict CONFIRMED as REFRAMED: computed from the paper's own
Table 1 data — cattle feed 7,881 MCM = 33.2% of total consumption and 46.9%
of direct human use (total minus reservoir evap minus riparian ET); the paper
publishes these as 32% and 46% (its rounding/denominator). "More than half
the river for cattle feed" is only reachable by using the direct-use
denominator *and* the ag-only numerator confusion; the honest range is
32–46% depending on stated denominator.

Model validation target (brief Phase 1): reproduce Table 1's totals —
GRAND TOTALS row: Upper Basin 6,460.47; Upper exports 923.97; Lower Basin
(w/o Gila) 10,660.60; Lower exports 1,558.54; Gila 2,144.78; Mexico 1,748;
Mexico exports 252; total 23,749 MCM/yr.

Legal-timeline nugget from the paper (p.3): the 2001 Interim *Surplus*
Guidelines are the agreement expiring in 2026 in the paper's list; the 2007
Interim Guidelines for shortages are a separate instrument. The brief's "2007
Interim Guidelines expire in 2026" needs the precise instrument names checked
against Reclamation — see the post-2026 section below.

## Pending (agents in flight, 2026-08-24)

- Law-of-the-River numbers: compact/treaty apportionments, Lees Ferry flow
  averages, delta/pulse-flow minutes, CAP junior priority, post-2026
  negotiation status, current shortage tier and reservoir state.
- Economics: SCPP $/AF, alfalfa $/AF, Crowley County, IID entitlement,
  Imperial County ag economy.
- News: Rio Grande late-2025 arrears deal; 2026 Texas v. New Mexico outcome.
- Grantham & Viers 2014 California over-allocation figures; locate Anselm's
  own CA water-rights dataset (candidate: `~/projects/2026/water-atlas`).
- Future Ecologies FE5.7 episode details.
