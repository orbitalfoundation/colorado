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

**M5.5 shipped 2026-08-30**: the emotional front bread + richer levers.
Movement 0 ("Take a breath, and look at where a river ends") opens on the
delta: the real NASA Landsat image in the card while the map camera sits on
the same ground, where the river's blue line visibly stops in the desert —
found data-poetry, the geometry really ends there. Copy hecklered clean
(0 tics, burstiness 0.52). Leopold-1922 and tribal-nations claims flagged in
the ledger. Levers grew to four: flow, retire cattle feed (69.5% of mainstem
irrigation, computed from Richter accounting units), retire other crops
(30.5%), urban conservation (capped 40%). New fork discovered: 90% flow +
modest shared cuts (−2.5 MAF total) and the reservoirs RECOVER to 17 MAF by
2037 — the shared-sacrifice-rebuilds-the-buffer scenario.

**TODO (Anselm, 2026-08-30):** cite the research and advisory ecosystem
somewhere in the piece — the model should point at the people who do this
professionally. Candidate bodies to verify and link (names from memory, all
to be confirmed before citing): the Colorado River Research Group, the
Getches-Wilkinson Center (CU Boulder), the Utton Center (UNM), the Babbitt
Center for Land and Water Policy (Lincoln Institute), the Water & Tribes
Initiative, the Upper Colorado River Commission, the Colorado River Board of
California, CRWUA, and Reclamation's own Basin Study program. Natural home:
a sources/further-reading section near the M9 reconstruction page.

**M5.6 shipped 2026-08-30 — consequences.** Anselm's critique: "all outcomes
feel ok, there are no consequences." Fixed with a computed consequences panel
under the levers, every line from ledger-verified numbers: bad management now
reads "critical: the system hits bottom in 2029 — after that, cuts stop being
policy and become physics", with hydropower failure, the shortage expressed
in multiples of Nevada's entire share, and the delta's permanent dryness
called out even in recovery futures. Good management now carries its invoice:
forbearance at $330–418/AF ("every year, forever"), farm revenue off the
land, and the other-crops lever marked serious because that water is winter
vegetables and unfallowable orchards at $1,000–3,000/AF. A lever drawer
("what the sliders gloss over", hecklered clean at 0.61 burstiness) carries
the agronomy steelman: alfalfa as rotation-filler and shock absorber, Crowley
County as the retirement-vs-fallowing lesson, the urban 40% ceiling. Still
absent and honestly labeled: hysteresis, return flows, groundwater, buyout
price escalation. TODO added: cite the research/advisory ecosystem (names to
verify) near the M9 sources page.

**M5.7 shipped 2026-08-30 — hysteresis as interaction.** The ag levers now
have fallow/retire modes. Retire is a ratchet: the retired fraction persists
in session and URL (rf/rc params), and dragging the slider back down snaps
it up again — irreversibility you feel in the thumb, Crowley County as
interaction design. Economics went mode-aware: fallow rents water at the
verified $330–418/AF-yr (with a serious flag past 1 MAF where today's prices
won't hold); retirement is one-time (deliberately unpriced — the market
escalates, per ledger) and carries the return-flow caveat (a purchased right
frees less wet water than its paper face, ratio still [VERIFY]). The
stylization note updated to claim exactly what is and isn't computed.

**Closing movements shipped 2026-08-30.** The sandwich is whole: movement VI
("One green spring") returns to the delta camera from movement 0 with the
real April 2014 pulse-flow Landsat frame — water threading the dry bed past
San Luis Río Colorado — and the verified facts: 105,000 AF (under 1% of a
year's paper promises), the sea touched for the first time in thirteen
years, >40% green-up where the pulse passed. "The delta is not gone. It is
dormant, and it answers water." Movement VII ("Fork the river") widens to
the whole basin for the philosophical close: prior appropriation as
fossilized incentive, the every-two-years framework as standing argument,
the invitation to fork and correct. Copy hecklered (0 tics, burstiness
0.62). Seven movements now; the mark reads "preview" — friends are viewing.

**Essay published as working draft 2026-08-30** at /essay.html (Anselm's
order): draft 2 minus editorial scaffolding, labeled "working draft ·
comments welcome", linked from the story's mark and closing movement. Byline
his; Substack version still goes through his revision pass. Draft 2 changes:
verbatim deCoriolis/Yglesias quotes, NYT attributed (twice: as denominator
specimen and for the cut sizes), "Play the river" section describing the
real seven-movement experience with the ratchet, "One green spring" hope
beat before the close. Hecklered 0 tics / burstiness 0.69; arc matches the
score.

**The river speaks (layer 1 + plumbing) shipped 2026-08-30.** A floating chip
gives the river an ambient first-person voice: eleven scripted lines keyed to
movement and fork state (all numbers ledger-verified; heckler correctly
flags the voice as rhythmically distinct from Anselm's — it is a different
speaker, aphoristic by design, zero tics). Layer 2 is fully plumbed per
Anselm's OpenRouter idea: a node container ("river") beside Caddy proxies
POST /api/river to OpenRouter with grounding enforced server-side (numbers
only from FACTS+STATE blocks, no persona breaks, no em-dashes), throttled
5/min/IP, 20/day/IP, 400/day global; /api/river/health gates the ask-box UI.
No model ID is guessed: the service goes live only when BOTH
OPENROUTER_API_KEY and RIVER_MODEL are set in /srv/river.env on the VM.
Decision recorded: ollama on the exe VM rejected (2 vCPU, no GPU — slow,
hallucination-prone small models for the most voice-sensitive feature);
home-box-via-ZeroTier remains a possible free layer later. Gotcha:
explicit CSS display beats the hidden attribute — [hidden]{display:none}.

**The river is live 2026-08-30.** OpenRouter key wired (spend-capped, his
call on leakage), model `openai/gpt-oss-120b` chosen from the live catalog
at $0.037/$0.17 per M tokens — under 3¢/day at the 400-reply cap, and the
same model family as the Strix Halo box. Lessons: docker restart does not
re-read --env-file (recreate the container); gpt-oss's reasoning tokens eat
max_tokens (700 + reasoning effort low); and the grounding leash needed a
no-conversion clause — asked for gallons per second, the river first
*derived* a wrong cfs figure; now it answers "I keep my accounts in
acre-feet." Known wobble: rhetorical magnitude words ("feeds billions")
slip through; the "voice, not oracle" label carries that for now. The
ask-box is live in the story chip; scripted lines remain the fallback.
Anselm's framing captured: the river speaking for itself IS the sales
pitch, and embodying these forces generalizes — a chorus of embodied
stakeholders (Mead, the Compact, an Imperial farmer) is a future pattern,
Hormuz included.
