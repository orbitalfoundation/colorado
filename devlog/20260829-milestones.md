# 2026-08-29 — milestones for the four-dimensional redo

Each milestone is independently shippable to colorado.exe.xyz, judged by eye
(screenshots, both themes) and by feel before the next begins. No rush; the
order is the plan, the dates are not.

- **M1 — The spine.** One page: basin map + timeline with the seam at today.
  Real river geometry and basin boundary, Mead and Powell drawn from real
  storage data on the left of the seam, the engine continuing them on the
  right. Scrub 1906 → 2056. Nothing else. *Accept: the core gesture feels
  right; geometry and record are real; both themes verified.*
- **M2 — Movements skeleton.** Scrollytelling structure over the spine: the
  five layperson questions as movements, camera choreography per movement,
  placeholder figures. *Accept: the scroll tells the spatial story without
  any prose polish.*
- **M3 — How did we get here.** The history movement done: scrub the century,
  compact-vs-actual-flow animation, the 2000–2026 collapse. *Accept: history
  reads as animated data, not paragraphs.*
- **M4 — Who drinks it.** Interactive Sankey with the denominator toggle;
  stakeholder geography (districts, diversions ETL: CAP, All-American,
  Front Range exports). *Accept: the two-cows and half-the-river claims are
  adjudicable on screen.*
- **M5 — Playtest the future.** Levers integrated at the seam: flow, regime,
  and the first demand levers; who-takes-the-cut rendered on the map, not
  just bars. *Accept: forking the future is one obvious gesture.*
- **M6 — Forks.** Named, reasoned scenario branches in URLs; curated gallery
  of exhibited futures. *Accept: two people can argue by exchanging links.*
- **M7 — The claims ledger.** Real posts as cards, each wired to a live model
  state. *Accept: every card's verdict is inspectable.*
- **M8 — Rigorous and pretty.** 3D terrain flyover if it earns its place
  (orbital-volume / elevation tiles); impact translation into human units.
- **M9 — Publication.** Essay woven through the movements; grounded
  explain-this-state pipeline (LLM narrates engine output only); every
  `[VERIFY]` and DRAFT flag resolved; Substack + outreach.

Framework extraction (Hormuz / Rio Grande) happens after, per the brief.

---

**M1 shipped same day**: https://colorado.exe.xyz/spine.html — real geometry
(USGS WBD HUC2 14+15, Natural Earth rivers/lakes), real storage (Reclamation
hydrodata monthly, Mead 1937–, Powell 1963–), engine beyond the seam. You can
scrub Hoover filling, Powell filling, the 1980s peak, the collapse, and cross
into the modeled decline. Verified by eye, light and dark, desktop and phone.
Notes: CARTO keyless rasters are dead (watermark) → Esri gray canvas;
OpenFreeMap vector renders in real browsers but not under headless
verification → deferred; `scripts/shot.mjs` is the new CDP screenshot tool
with real wall-clock waits (virtual-time races web workers).

**TODO (Anselm, 2026-08-29):** since everybody also has Claude, add a page for
humans *and* Claudes to reconstruct scenarios: a stable, machine-readable
description of the model, data provenance, lever semantics, and any scenario's
full parameter state (think llms.txt meets reproducibility appendix — fetch
one URL, rebuild the run, verify the numbers). Slots naturally alongside M6
(forks) since a fork URL should BE the reconstruction record.

**M2 shipped same day**: https://colorado.exe.xyz/story.html — five movements
choreographing the fixed map (whole basin → headwaters → lower-basin
stakeholders → reservoir country → back out), scroll-linked time through
movements IV (1906→today) and V (today→2056), stakeholder placeholder labels
shown only in movement III, slim always-on strip dock. Shared spine machinery
extracted to site/core.mjs (spine.js refactored onto it). Verified live by
eye; the 1947 frame (Mead 19.5, Powell an empty ring) and the 2037 frame
(modeled, combined 7.2) prove the follow-the-reader timeline. Gotchas:
maplibre Marker owns style.opacity (use visibility to hide markers);
deploy.sh must copy site/*.mjs.

**TODO (Anselm, 2026-08-29, second batch):**
- The story gets the **emotional sandwich arc** (per the writing policy in
  ~/projects/CLAUDE.md): a romantic movement on the river itself up front —
  indigenous use and presence (the basin holds 30 tribal nations, per
  Richter et al.'s intro; source everything, tribes are stakeholders not
  scenery), a pretty picture or two (**real images only** — NASA/USGS/LoC
  public domain; the house rule about stock photos applies doubly here) —
  meat in the middle, widening hopeful close.
- **The river speaks for itself**: an LLM prompted to *be* the river,
  talking about what it wants. Same grounding leash as the explain-the-state
  pipeline — the persona is a register, not a license; it narrates real
  numbers (its own flow, its dry delta, its temperature) and cites the
  ledger; clearly labeled as a voice, not an oracle. Candidate placement:
  the romantic intro movement and/or a conversational panel in M9.

**M3 shipped same day**: movement IV split into "Paper water" (1906→1966,
camera on canyon country; a flow-vs-paper figure inside the card draws the
Lees Ferry record bar by bar with your scroll, the wet-years band shaded, the
15 and 16.5 MAF promise lines appearing when signed) and "Spending the
savings" (1966→today, the 46.9 MAF 1986 peak then the drain). An event ticker
fires as the scrub passes each verified Law-of-the-River moment, 1922 Compact
through the Aug 2026 ROD. History reads as animated data. Verified live,
light/dark, desktop/mobile.

**M4 shipped same day**: movement III done. Real diversion geometry from OSM
(CAP 66 segments, All-American 24, Coachella 82 — ODbL; the Colorado River
Aqueduct is mostly tunnels tagged differently in OSM, deferred rather than
faked) drawn in orange only during the demand movement. Hand-rolled Sankey
from the Richter accounting with the **denominator toggle**: "share of
everything consumed" (cattle feed 33%) vs "share of direct human use" (47%),
non-human bands dimming out; ?denom=direct deep-links the mode. The
half-the-river claim and the two-cows distinction are now adjudicable on
screen. Verified both modes, light/dark, desktop/mobile.

**M5 shipped 2026-08-30**: the future forks in place. Movement V carries
levers (flow 60–115%, retire-cattle-feed-irrigation 0–100%, three allocation
rules); the engine reruns on every change, the dock strip redraws its dashed
side, and party deliveries render as colored capacity rings on the map plus a
guaranteed text line in the card. Fork state serializes to the URL
(?flow=&feed=&regime=) with a copy-link button — the M6 fork mechanism's
seed. Demonstrated: 80% flow + 50% feed retirement = no steady-state
shortage (the lever visibly buys the river back); 85% flow under seniority
vs framework vs proportional shows three different maps. Stylizations
labeled in-card. Known niggle: Mexico's map disc can sit below the fold at
some camera settlements (its numbers always show in the card line).
Claims-ledger sources captured: deCoriolis/Yglesias verbatim, NYT Aug 21
(with the quarter/third-vs-tranche reconciliation flag).
