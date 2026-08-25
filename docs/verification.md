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

## Law of the River & hydrology (web-verified 2026-08-24)

- **Apportionments ✅ VERIFIED**: 7.5 MAF/yr to each basin (1922 Compact),
  +1.5 MAF/yr to Mexico (1944 Treaty, signed Feb 3, 1944) = 16.5 MAF; the
  Compact's Article III(b) adds a conditional 1.0 MAF for the Lower Basin
  (→ 17.5 MAF paper total). State which framing whenever quoted.
  Sources: CRS R45546 (congress.gov), watereducation.org.
- **Lees Ferry natural flow ✅ VERIFIED with period labels**: 14.76 MAF/yr
  (1906–2018) vs 12.47 MAF/yr (2000–2018), computed from Reclamation's
  Natural Flow Data Base (via inkstain.net analysis); USU gives 14.67 vs 12.3
  through 2021. Brief's "~14.8 vs ~12.4" is fine ONLY with periods stated.
- **Delta ✅ VERIFIED**: no regular flow to the Gulf of California since 1960
  (flood-year exceptions 1983, 1993, 1998). Minute 319 signed **Nov 20,
  2012** (IBWC document date; some secondary sources wrongly say Nov 12);
  2014 pulse flow = 130 MCM / 105,000 AF, river reached the sea for the
  first time in 13 years (USGS EROS). Minute 323 signed Sep 21, 2017;
  nine-year deal, ≥210,000 AF for delta restoration as ongoing flows.
- **CAP junior priority ✅ VERIFIED**: 1968 Colorado River Basin Project Act
  §301(b) subordinates CAP to California's 4.4 MAF in shortage
  (usbr.gov statute PDF; CRS R45546).
- **Reservoir evaporation ✅ VERIFIED, scope-dependent — label which**:
  860 KAF/yr evaporation Lake Mead→Mexico border (Reclamation report,
  Feb 2024, 2017–2021 data; +445 KAF riparian ET = ~1.3 MAF losses on that
  reach); ~1.135 MAF/yr Mead+Powell combined at full pool
  (coloradoriverscience.org); ~1.5 MAF/yr system-wide (USGS via The
  Conversation). Richter 2024's own number: 2,529 MCM/yr ≈ 2.05 MAF (all
  reservoirs, 2000–2019 avg).

### ⚠️ CORRECTED — the news hook (brief §2.2 is stale)

The post-2026 process **concluded**. The seven states failed to reach
consensus; Reclamation released the Final EIS **July 31, 2026**, and Interior
signed the **Record of Decision on August 21, 2026** adopting the "Decision
Framework for Colorado River Guidelines: Coordinated Operations of Lake
Powell and Lake Mead (2027–2036)" — a 10-year adaptive framework with 2-year
operating intervals; the 2027–2028 Operating Guidelines adopt the Lower Basin
states' self-proposed reductions (usbr.gov/ColoradoRiverBasin/post2026; ROD
PDF P26_RecordofDecision_Final.pdf; DLA Piper Aug 2026; Maven's Notebook
2026-08-20 "era of near-continuous negotiation"). Draft EIS comment period
closed Mar 2, 2026 with 18,127 submissions.

Also: **Lake Mead set its all-time record low in August 2026** — 1,039.27 ft,
26.5% full as of Aug 23, 2026, below the 2022 record (reservoirbench.com;
Las Vegas Review-Journal). Powell ~21–23% full, projected 3,515.89 ft /
5.03 MAF at end of WY2026 (usbr.gov). 2026 is a Tier 1 shortage year
(declared Aug 2025, Mead projected 1,055.88 ft).

**Reframing consequence**: the piece is no longer an intervention in a live
negotiation — it's an explainer/adjudicator landing days after a federally
imposed framework, during a record-low summer, with "near-continuous
negotiation" (2-year intervals) ahead. Arguably a *better* hook: every two
years this fight repeats; here is the machine to reason about it.

## California dataset & local scavenge audit (2026-08-24)

- **CORRECTED (brief Claim 6)**: no California water-rights dataset exists on
  disk. `~/projects/2026/water-atlas` fetches SWRCB eWRIMS Points of
  Diversion (63,990 points) but *locations only* — no acre-feet; the CKAN
  join for face values (by APPL_ID) is documented as never built
  (water-atlas notes, 20260620-current-todos). The "192 MAF vs 72 MAF" the
  brief attributes to prior work appears nowhere; what water-atlas actually
  ships is **~370 MAF of appropriative rights vs ~70 MAF mean annual runoff
  (~5x), citing Grantham & Viers 2014** (site/src/lib/Faq.svelte,
  Splash.svelte), with ~250 vs ~71 MAF as the older New California Water
  Atlas framing. Use 370/70 (pending agent confirmation of the paper
  itself); retire 192.
- Scavenge list (paths in water-atlas, cloudreef-sim, orbital-sim):
  `orbital-sim/packages/agents/hormuz/` cascade + `observe.js` (best
  template for a parameter-driven scenario cascade); `cloudreef-sim/agents/
  time.js` (adaptive tick loop); `water-atlas/aggregator/` (ETL: throttled
  http + sqlite + one-file-per-source registry + GeoJSON prebake);
  `orbital-sim/viz/src/chart/index.js` (Observable Plot wrapper);
  `water-atlas/site/src/lib/Splash.svelte` paper-vs-wet two-bar visual —
  directly reusable for the over-allocation set-piece.

## Pending (economics/news agent still in flight)

- SCPP $/AF; alfalfa $/AF; Crowley County; IID entitlement & Imperial County
  ag economy; Rio Grande late-2025 arrears deal; 2026 Texas v. New Mexico
  outcome; Grantham & Viers 2014 exact figures; Richter citation
  cross-check; Future Ecologies FE5.7 details.
