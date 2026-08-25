# Project Brief: *Who Drinks the River?*
## A computational journalism experience on Colorado River water allocation

**Prepared as a handoff document.** Written to be read cold by another Claude instance (or human collaborator) with no prior context. Everything needed to start building should be here.

**Status:** planning / pre-build. No code written yet.
**Author of the underlying thinking:** Anselm Hook (orbitalfoundation).
**Date of brief:** August 2026.

---

## 0. How to use this document

Sections 1–3 are strategy and framing — read these to understand *why* the thing exists and what makes it different from a generic data visualization. Sections 4–8 are the domain substance. Sections 9–12 are the build spec. Section 13 lists what still needs verification before anything ships.

**Critical instruction for whoever picks this up:** every number in this document is marked with a confidence flag. Nothing marked `[VERIFY]` should reach a published artifact without being checked against primary sources. This project's entire value proposition is being more rigorous than the discourse it critiques; shipping a wrong number destroys it.

---

## 1. Strategic context

### 1.1 The origin problem

The parent project (orbital.foundation / simulate.world) has a long-term thesis: **let ordinary people build their own simulations, toys, and models to test out world scenarios before they happen.** Civic engagement through participatory modeling.

The problem encountered: building a general-purpose simulation sandbox for non-technical users is an enormous amount of labor with a payoff that arrives only after the platform is complete and only if users show up already knowing what they want to build. It's a classic platform bet, and it was bogging the work down.

### 1.2 The pivot

Instead of building the sandbox first, build **individual dedicated simulations as thesis pieces**. Each one is:

- an **article** (essay / think piece, technically grounded)
- plus **code** (open source, real model)
- plus **a playable demo** (web app, user manipulates policy and sees outcomes)

Each piece responds to something live in the media discourse and argues a position. The reusable engine is extracted *afterward*, from the second and third pieces, once real requirements have revealed themselves.

### 1.3 Why this sequencing is correct, not just expedient

Three independent arguments support it:

1. **Immediate payoff.** A single sim ships and gets read. A platform pays off only at completion.
2. **Model capability is rising underneath the project.** Tooling built today to make simulation authoring accessible to laypeople is the component most likely to be obsoleted by better models in two years. The *domain work* — the water accounting, the argument structure, the sourced numbers — holds its value regardless. **The sims are the durable asset; the tooling is the disposable part.** This is an inversion of the usual instinct and it should be stated explicitly in the essay.
3. **Avoids premature generalization.** Build the first one hardcoded and ugly. Extract reusable abstractions only when the second sim demands them.

### 1.4 The specific ambition

Not just "here is a model." The goal is **computational journalism**: a piece that intervenes in a live public argument, lets the reader manipulate the assumptions themselves, and where the model *adjudicates specific claims that real people are making right now*.

---

## 2. Why the Colorado River, and why now

### 2.1 Why water

Water is an unusually good domain for this format:

- It is **conserved**. Mass balance is non-negotiable; nobody can argue their way out of arithmetic.
- It is **measured** — gauges, satellite ET, reservoir accounting, decree reports.
- Human intuitions about it are **reliably wrong** at the relevant scales.
- It forces **zero-sum reasoning**, which is exactly what makes it politically hot and exactly what a model handles better than an op-ed.

### 2.2 Why the Colorado specifically

- The accounting is public and unusually well-documented.
- The core fact is genuinely counterintuitive and settles a lot of argument on contact: **the river is over-allocated at the source.** Paper rights exceed wet water. Nobody is stealing; the ledger simply doesn't balance.
- **Timing.** The 2007 Interim Guidelines governing shortage-sharing expire in 2026, and the post-2026 operating rules are under active negotiation between the seven basin states and Reclamation *right now*. `[VERIFY current status — this is the single most important timeliness check before publication]` This is the news hook. The piece is not a general explainer, it's an intervention in a live decision.

### 2.3 The follow-on piece

Second thesis piece: **the Rio Grande / Río Bravo and the 1944 US–Mexico water treaty.** Deliberately chosen because it shares infrastructure with piece one:

- Same treaty instrument (the 1944 treaty covers both rivers — Mexico delivers to Texas from the Rio Grande, the US delivers to Tijuana/Mexicali from the Colorado).
- Same modeling primitives (allocation vs. delivery, arrears, drought triggers).
- Recent news: a late-2025 delivery deal, and a May 2026 Supreme Court settlement in *Texas v. New Mexico and Colorado* constraining groundwater pumping in southern New Mexico. `[VERIFY both]`

One engine, two stories. This is the argument for building the engine at all.

### 2.4 Explicitly deferred

The border wall was considered and set aside. The disagreement there is not primarily empirical, so a model risks looking like advocacy dressed in equations. **Rule of thumb for topic selection: only model fights where a model can actually settle something.**

---

## 3. The claims ledger — the spine of the piece

This is the most important structural idea in the brief.

Rather than writing a general explainer, maintain a **running ledger of specific public claims**, each logged with its implied numbers and adjudicated by the model as CONFIRMED / REFUTED / REFRAMED. This is better than an explainer because readers arrive already holding one of these claims, and it makes the model *accountable to something* rather than free-floating.

The ledger should be a first-class artifact in the app — a page or panel, not a footnote. Each entry links to the model configuration that tests it.

### Claims collected so far (all real, from live social media discourse, Aug 2026)

---

**CLAIM 1 — "Every year we drain more than half of the Colorado River for cattle feed."**
*Source: @Unpop_Science, quoting @scottew sharing the Richter et al. 2024 Sankey diagram.*

**Verdict: REFRAMED — the claim is denominator-dependent.**

Cattle-feed crops (alfalfa plus other hay) are roughly **46% of direct human consumptive use** but roughly **32% of total water consumption** once you include reservoir evaporation, riparian and wetland evapotranspiration, and the Mexico delivery. `[VERIFY both figures against Richter et al. 2024]`

The irony worth noting in the article: those non-agricultural flows are *visible as separate bands in the very diagram being cited*. The gap between "half the water" and "half the irrigated water" is exactly the kind of thing the model exists to adjudicate.

**Source to obtain:** Richter, B.D. et al. (2024), "New water accounting reveals why the Colorado River no longer reaches the sea," *Communications Earth & Environment*. **This paper is the data spine of the entire project.** Get the supplementary data tables, not just the figure.

---

**CLAIM 2 — "There is plenty of capacity; we burn 14 million acres of land better suited to cattle feed every year."**
*Source: @anthony_schutz, reply to Claim 1.*

**Verdict: TESTABLE — this is the relocation hypothesis.**

If feed can be grown on rain-fed land elsewhere, then desert alfalfa is a *location choice*, not a food-security necessity. That is a modelable proposition: swap acreage to rain-fed regions and see what breaks (yield per acre, transport cost, hay quality, dairy proximity, timing).

**The steelman against it, which the model must represent honestly:**
- Hay must be dried in the field; rain during cutting ruins it. Aridity is a feature, not a bug. Same logic applies to seed crops needing dry harvest windows.
- Alfalfa is the West's **shock absorber** — it is the one major crop you can fallow mid-season without killing a permanent planting. Almonds and other tree crops you cannot. Low value per drop, high *option* value.
- Desert alfalfa achieves multiple cuttings per year that northern rain-fed regions cannot match. `[VERIFY cutting counts by region]`

---

**CLAIM 3 — "The value of the dairy and beef industries fed by Colorado-irrigated crops is totally negligible. We could just buy their water rights and retire them."**
*Source: @AndrewRdeC, quote-tweeting @mattyglesias on agricultural water pricing.*

This is two separable claims and both are instructive.

**3a. "Negligible value" — Verdict: DENOMINATOR-DEPENDENT.**
As a share of basin-state GDP, agriculture is a couple of percent — the claim is true. In absolute terms it is billions of dollars, and it is **geographically concentrated** to the point where Imperial County (CA) and Yuma County (AZ) essentially *are* that industry. `[VERIFY county-level economic dependence figures]` So "negligible" is true at state scale and false at county scale, and the real argument is about **who bears the adjustment**, which is a distributional question a GDP share cannot answer.

**3b. "Just buy the water rights" — Verdict: FAILS ON MECHANICS, not on values.** This is the richest thing in the ledger and probably deserves its own model panel:

- **Return flows.** Retiring a paper right does not yield its face volume. A 5 acre-foot diversion might be only ~3 acre-feet consumed, the rest returning to the system and already relied upon downstream. You buy 5, you free 3. `[VERIFY typical diversion-to-consumption ratios by district]`
- **Non-linear price.** IRA-funded system conservation payments landed around the low hundreds of dollars per acre-foot for *temporary* forbearance. `[VERIFY — figure around $300–400/AF, check Reclamation SCPP award data]` Permanent retirement at scale bids that up steeply; the marginal seller is progressively more reluctant.
- **Legal immobility.** The no-injury rule protects other rights-holders from changes in use. State-line transfer restrictions mean water bought in one state frequently cannot legally move to another. Buying water is not the same as being able to *use* it where you want.
- **Salton Sea backfire.** Retiring Imperial Valley water exposes more lakebed, which becomes airborne dust. The buyout creates a public health liability. See §7.

**Model deliverable: a buyout budget slider showing dollars in versus wet water actually delivered to Lake Mead.** The gap between those two numbers is the whole story.

---

**CLAIM 4 — "Once productive farmland is permanently dried up, getting that agricultural economy back is extraordinarily difficult."**
*Source: @highcountryobservations, a disciplined statement of the agricultural counter-position.*

**Verdict: SUPPORTED — this is hysteresis, and most water models omit it.**

This claim is valuable precisely because it is the *good* version of the counter-argument and it hands the project a modelable mechanism rather than a values assertion.

**Historical evidence:**
- **Crowley County, Colorado.** Colorado Canal shares sold to Front Range cities in the 1970s–80s; the county never recovered its tax base, population, or services. The canonical "buy and dry" cautionary case. `[VERIFY details and dates]`
- **Owens Valley, California.** The older and harsher version.

**Modeling implication (important):** acre-feet are symmetric — you can add or remove them freely. Communities are not. The model needs a **state variable for local agricultural capacity** (irrigation infrastructure condition, processing/dairy infrastructure, labor and knowledge, tax base) that *decays once out of use and is expensive to rebuild*. This makes **permanent retirement and rotational fallowing genuinely different levers** rather than differently-labeled versions of the same cut.

This is the single most novel modeling contribution the project can make. Most water models treat these identically and thereby smuggle in an answer.

---

**CLAIM 5 — "Cows are ecologically beneficial / cattle are essential land management tools."**
*Source: Future Ecologies podcast, "Home on the Rangelands" (FE5.7, Part 1), which was recommended within the same discourse thread as supporting material.*

**Verdict: TRUE BUT ABOUT A DIFFERENT COW. This is the sharpest assumption error available and it should probably lead the piece.**

The episode is genuinely good and makes serious, well-sourced arguments:
- California grasslands are **novel ecosystems** — invaded by Mediterranean annual grasses, effectively unrestorable — so they must be managed rather than restored.
- Grazing removes the annual grass **thatch** that shades out native forbs and wildflowers. Roughly half of ~280 endangered species reviewed in California were found to benefit from livestock grazing in some circumstances (Huntsinger & Barry). `[VERIFY]`
- **Stock ponds** built for cattle have become substitute wetland habitat for California tiger salamander and red-legged frog, after the loss of lowland wetlands and beaver.
- Grazing manages **fine fuels** for wildfire where prescribed burning is impractical — "they're not going to eat your house."
- Ranchland **holds the line against subdivision**, solar installations, and shrub/woody encroachment.

**But every one of those arguments is about rain-fed extensive rangeland grazing, which uses essentially no river water.** The Colorado River draw is *irrigated alfalfa feeding dairies and feedlots*. Same animal, two entirely separate water stories.

**Somebody will cite this podcast at you as a defense of irrigated alfalfa. It is not one.**

**Where they genuinely couple — and this must be in the model:** the supply chain links them. Cow-calf operations run on rangeland, then finish on irrigated feed. If retiring alfalfa makes ranching stop penciling out, the second-order consequences land on the rangeland side: subdivision, loss of grazing-based fuel management, heavier fire loads. **That is a real cost that appears nowhere in a water ledger.** Modeling it is what will make skeptical readers trust the model instead of suspecting it.

**Sources from the episode's citation list worth mining (the page publishes full citations, CC-BY-SA):**
- Siegel, K.J. et al. (2022), "Impacts of Livestock Grazing on the Probability of Burning in Wildfires Vary by Region and Vegetation Type in California," *J. Environmental Management* 322:116092. — *the quantitative hook for the fire pathway*
- Barry, S. & Huntsinger, L. (2021), "Rangeland Land-Sharing, Livestock Grazing's Role in the Conservation of Imperiled Species," *Sustainability* 13(8):4466.
- Bartolome, J.W. et al. (2014), "Grazing for Biodiversity in Californian Mediterranean Grasslands," *Rangelands* 36(5).
- Gennet, S. et al. (2017), "Livestock Grazing Supports Native Plants and Songbirds in a California Annual Grassland," *PLOS ONE* 12(6).
- Stahlheber, K.A. & D'Antonio, C.M. (2013), meta-analysis of grazing in California Mediterranean grasslands, *Biological Conservation* 157.

---

**CLAIM 6 — Prior finding from the user's own earlier work: California water rights are over-allocated by a large multiple.**
*Source: the user's previously built California water rights dataset (on GitHub, possibly under the orbitalfoundation org — locate it).*

User recalls approximately **192 million acre-feet of allocated rights against roughly 72 million acre-feet of actual water.** `[VERIFY — note that the published academic figure, Grantham & Viers 2014, found appropriative rights totaling roughly five times mean annual runoff, on the order of 370 MAF against ~70 MAF. The discrepancy needs resolving before either number is used publicly.]`

Whichever figure survives scrutiny, the California ratio is more extreme than the Colorado's and makes the over-allocation point vividly. Good candidate for a comparison panel.

---

### 3.1 The most important thing the ledger reveals

**Every serious participant in this argument agrees the basin must consume less water.** That is not in dispute anywhere across these claims.

So the entire live argument is about **who cuts, how permanently, and who pays.** That is a far better article frame than "is there enough water," and it is a question the model can genuinely adjudicate rather than moralize about.

---

## 4. Domain model — the physical system

### 4.1 Supply side

- **Upper Basin snowmelt** — the dominant input.
- **Lower Basin tributaries.**
- **Gila River** — accounted separately in Richter et al.
- **Reservoir depletion** — drawing down storage counts as supply in a given year; this is how the system has been papering over the deficit.

### 4.2 The structural deficit

- 1922 Compact apportioned 7.5 MAF each to Upper and Lower Basin; the 1944 treaty added 1.5 MAF to Mexico, for roughly **16.5 MAF of total apportionment**. `[VERIFY]`
- The compact was negotiated using flow estimates from an anomalously wet period.
- 20th-century natural flow at Lees Ferry averaged around **14.8 MAF**; 21st-century flow has run closer to **12.4 MAF**. `[VERIFY both]`
- Consequence: **the delta is what is left after everyone takes their legal share, and there is nothing left.**

The Colorado has not reliably reached the Sea of Cortez since the 1960s. The delta is largely dry apart from engineered pulse flows negotiated under treaty minutes (Minute 319, Minute 323). `[VERIFY minute numbers and pulse flow volumes]`

### 4.3 Demand side

- **MCI** (municipal, commercial, industrial — households, cities, industry)
- **Agriculture**, broken out by crop: alfalfa, other hay, wheat, cotton, other crops
- **Reservoir evaporation** — large, frequently omitted from popular accounts
- **Riparian and wetland evapotranspiration** — likewise
- **Mexico delivery** under the 1944 treaty
- **Exports out of basin** (Upper Basin exported, Lower Basin exported — e.g. Front Range diversions, CAP)

### 4.4 Diversion vs. consumption — get this right or the model is wrong

The number that matters is **consumptive use**, not diversion. Return flows mean a large fraction of diverted water re-enters the system and is already relied upon downstream. Efficiency improvements that reduce *diversion* while leaving *consumption* unchanged produce zero basin-scale savings — the "efficiency paradox." A model that conflates the two will produce confidently wrong policy conclusions and will be attacked on exactly that point.

### 4.5 The legal layer — where modeling actually bites

The "Law of the River" is the real constraint set:

- 1922 Colorado River Compact
- 1928 Boulder Canyon Project Act
- 1944 US–Mexico Treaty
- 1948 Upper Colorado River Basin Compact
- 1963 *Arizona v. California*
- 1968 Colorado River Basin Project Act (establishes CAP's junior priority — CAP takes deep cuts first, which is why Arizona's politics are what they are)
- 2007 Interim Guidelines (**expiring 2026**)
- 2019 Drought Contingency Plan
- Post-2026 operating guidelines (**under negotiation now**)

Plus **prior appropriation** — "first in time, first in right" — at the state level. Seniority determines who gets cut, and it bears no relationship to economic value, population, or need.

**This is also the philosophical hook (see §11):** prior appropriation is a fossilized incentive structure that made sense in 1870s Colorado and cannot adapt now. That is an evolutionary argument about institutional design, and it is available without bending any numbers.

---

## 5. Data sources to gather

### Supply and storage
| Source | What it gives |
|---|---|
| USGS NWIS / gauge network | Streamflow time series |
| USBR 24-Month Study, HDB | Lake Mead / Lake Powell operational projections |
| NRCS SNOTEL | Snowpack, the upper-basin forecast signal |
| Reclamation Natural Flow database | Reconstructed natural flow at Lees Ferry |

### Demand and consumptive use
| Source | What it gives |
|---|---|
| **Richter et al. 2024 supplementary data** | The basin-wide accounting spine — get this first |
| USDA Cropland Data Layer | Irrigated acreage by crop, spatial |
| USDA NASS Census of Agriculture | Acreage, yield, farm economics by county |
| OpenET / Landsat ET products | **Actual consumptive use** — the number that matters |
| USBR Consumptive Uses and Losses Reports | Official accounting by state and sector |
| LCRAS (Lower Colorado River Accounting System) | Decree accounting for the Lower Basin |

### Economics
| Source | What it gives |
|---|---|
| County agricultural commissioner reports (CA) | Crop revenue by county |
| NASS crop values | Revenue per acre by crop |
| BEA county economic data | Local dependence, tax base |
| Reclamation SCPP award data | Actual observed price per acre-foot for conservation |

### Legal / treaty
| Source | What it gives |
|---|---|
| IBWC | Treaty minutes, Mexico deliveries, Rio Grande accounting |
| State engineer / water rights databases | Priority dates, decreed amounts |
| The user's existing California water rights dataset | Already built — locate and reuse |

### Impact translation
| Source | What it gives |
|---|---|
| California dry domestic well reporting | Household-level impact counts |
| USGS / NASA InSAR subsidence data | San Joaquin subsidence rates |
| Salton Sea Management Program monitoring | Exposed playa area, PM10 |
| Audubon / Pacific Flyway survey data | Bird counts at delta and Salton Sea |

---

## 6. Model architecture

### 6.1 Core structure

A **stock-and-flow mass balance** at annual (or monthly) timestep, with an **allocation solver** layered on top that resolves who gets water under a chosen legal regime, and an **impact translation layer** that converts acre-feet into human-legible consequences.

```
INPUTS                 ALLOCATION            CONSUMPTION          IMPACTS
─────────              ──────────            ───────────          ───────
snowpack        ┐                     ┐                    ┐
natural flow    ├──► [legal regime] ──┼──► [sector/crop] ──┼──► [ecological]
tributaries     │     priority         │     ET-based       │    [health]
storage         ┘     proportional     │     return flows   │    [economic]
                      negotiated       ┘                    ┘    [community]
                                            │
                                            ▼
                                    [capacity state variable]
                                     decays under retirement
                                     persists under fallowing
```

### 6.2 State variables that must persist across timesteps

- Reservoir storage (Mead, Powell)
- Soil moisture / groundwater levels
- **Local agricultural capacity index** (per district) — the hysteresis mechanism from Claim 4
- Cumulative subsidence
- Exposed Salton Sea playa area
- Perennial plantings in ground (tree crops can't be fallowed; they're a commitment)

### 6.3 Explicit uncertainty

Every output should carry a range, not a point estimate. Where a parameter is contested, expose it as a lever with the contested range as its bounds rather than picking a value silently. **Contested parameters become interaction, not hidden assumptions.** This is both more honest and more engaging.

---

## 7. The impact translation layer

This is where most water models stop — at acre-feet — and expect the reader to care. They don't. The translation is the hard part and it is where the journalism lives.

**Translations that land:**

| Physical output | Human-legible impact |
|---|---|
| Delta flow volume | Hectares of wetland wetted; Pacific Flyway bird counts (delta and Salton Sea are documented stopovers) |
| Groundwater drawdown | **Number of dry domestic wells** — a household number, and California has real counts |
| Aquifer overdraft | Subsidence in feet/year → broken canals, cracked foundations, with dollar repair costs |
| Salton Sea level decline | Exposed lakebed → airborne dust → respiratory impact in Imperial County, which has real epidemiology behind it |
| Farm retirement | County tax base, school enrollment, jobs |
| Reservoir level | Hydropower generation, and the "dead pool" threshold |

**Warning:** be careful with any lives-lost figure. Attribution gets shaky fast and a critic will attack that number rather than engaging with the model. Morbidity, asthma incidence, and dollar costs are defensible; mortality attribution mostly is not.

**Note the asymmetry to fix:** the pro-buyout side has a crisp quantitative weapon (dollars of value per acre-foot; alfalfa comes out very low, in the low tens of dollars per acre-foot `[VERIFY]`). The agricultural side's argument — "supports rural communities" — has no number and therefore loses by default. **A fair model must make the strongest version of the agricultural argument quantitative enough to win or lose honestly:** jobs per acre-foot, county tax base, school enrollment, capacity decay. Supplying that number to the side that lacks it is an act of good faith that will be noticed.

---

## 8. Policy levers to expose to the user

These five cover most of the real policy debate:

1. **Cut allocation method** — strict priority-date seniority vs. proportional cuts. Lets users see what prior appropriation actually does to a junior city (and why CAP's 1968 junior status matters so much).
2. **Crop switching** — with acreage and revenue costs attached, and the constraint that perennials can't be switched cheaply.
3. **Water pricing** — from near-zero to a real price, with demand response. *(This is the Yglesias point in Claim 3's parent tweet: nobody is choosing between uses because the price signal doesn't exist. Arguably the critique that survives is not "alfalfa uses too much water" but "water is priced near zero so no allocation decision is ever actually made.")*
4. **Groundwater substitution** — the cheat everyone reaches for, which shows up as subsidence later. Must have a delayed consequence.
5. **Minimum environmental flow at the delta** — set a target and ask what upstream cuts are required to actually reach the sea.

**Plus, from the claims ledger:**

6. **Buyout budget** — dollars in vs. wet water delivered to Mead (Claim 3b).
7. **Permanent retirement vs. rotational fallowing** — the hysteresis lever (Claim 4). These must behave differently.
8. **Feed relocation** — move alfalfa acreage to rain-fed regions and see what breaks (Claim 2).

---

## 9. Web app architecture

### 9.1 Available orbitalfoundation tooling

From the org (github.com/orbitalfoundation), the relevant pieces:

- **`orbital-sys`** — experimental messaging kernel for data-driven apps; used elsewhere as a pubsub module to decouple components. **This is the natural backbone.** The architecture described in the org wiki — an event bus where most events are database writes to component properties of entities, with *observers* reacting to state changes to produce system-like effects, and a tick driven by screen refresh — maps cleanly onto a simulation loop. An ECS-shaped reactive system is close to ideal for stock-and-flow modeling with derived views.
- **`orbital`** — JavaScript/WASM agent sandbox with a declarative grammar for describing collections of agents with security policies. Relevant if any part of the model goes agent-based (individual water districts or rights-holders as agents, for instance, rather than pure aggregate flows).
- **`cloudreef-sim`** — an existing simulation in the org; worth reading first for established patterns before inventing new ones.
- **`orbital-volume`**, **`orbital-reef`** — inspect for relevance.
- **`orbital-puppet`** — embodied LLM avatar with viseme lip-sync, WebGPU-based. *Probably not appropriate here.* An explainer avatar risks undercutting the rigor the piece depends on. Flagging as available but recommending against for this specific piece.
- **`pluto`, `charon`** — archived Rust agent sandboxes; historical context only.

`[VERIFY current state of all of these — the org listing was read from search results, not from the repos directly. Read the actual READMEs before committing to any of them.]`

### 9.2 Recommended shape

- **Client-side model.** The whole thing should run in-browser. No server round-trip per parameter change. Water balance at annual timestep over a few decades and a few dozen districts is trivially fast in JS. This matters because instant feedback is what turns a chart into a toy, and a toy is what gets shared.
- **`orbital-sys` as the event backbone**, with observers deriving views from model state. Model state lives in one place; charts, maps, and the ledger panel are all observers on it.
- **Scenario URLs.** Every configuration must serialize into a shareable link. This is the single highest-leverage feature for a journalism piece — arguments on social media get conducted by exchanging scenario links. *Build this early, not as a nice-to-have.*
- **The claims ledger as a navigable panel.** Each claim links to the scenario that tests it. Reader arrives holding an opinion, clicks it, sees it adjudicated.
- **Data pre-baked.** Don't hit live APIs from the client. Pull, clean, and version the data into static JSON with a documented ETL step. Reproducibility is part of the argument.
- **Open source, with the ETL included.** The data pipeline being auditable is a substantive claim about the project's method, not just a license choice.

### 9.3 Interaction design principle

The reader should be able to **fail to find a solution.** If every configuration the user tries leaves the delta dry or someone's community destroyed, that *is* the finding, and experiencing it directly is more persuasive than being told. Do not design a win state. Design an honest constraint space.

---

## 10. Editorial integrity rules

These exist because the project's only real asset is being trusted more than the discourse it critiques.

1. **Every claim in the ledger gets the strongest version of its counter-argument represented in the model.** Especially the ones the author disagrees with.
2. **No number ships unverified.** Every `[VERIFY]` flag in this document is a blocker.
3. **Denominators are always stated.** Most of the errors in the ledger are denominator errors.
4. **Diversion and consumption are never conflated.**
5. **Contested parameters become levers, not hidden defaults.**
6. **Philosophy stays at the top and bottom of the essay, not woven through the numbers.** Readers who came for the model will forgive a thesis; they will not forgive suspecting the numbers were bent to serve it.
7. **Publish the counter-scenario.** If there's a configuration that makes the opposing side's case well, link to it explicitly. It costs little and buys enormous credibility.

---

## 11. Essay structure

The written piece accompanying the model. Suggested shape:

1. **Open on a specific claim from the ledger** — probably Claim 1 or Claim 5, because both are wrong in an interesting rather than a stupid way.
2. **The structural fact**: the river is over-allocated at the source, and has been since 1922. Nobody is stealing.
3. **The two cows** (Claim 5). This is the best set-piece: same animal, two water stories, and a widely-shared piece of good journalism that gets misapplied.
4. **The buyout mechanics** (Claim 3b). Why the obvious solution doesn't do what it appears to.
5. **Hysteresis** (Claim 4). Why permanent and temporary are not the same lever, and Crowley County.
6. **The actual disagreement**: everyone agrees consumption must fall. The fight is who, how permanently, and who pays.
7. **The philosophical close** — prior appropriation as a fossilized incentive structure: rules that were adaptive in 1870s Colorado, locked in, and now unable to respond to their environment. Institutions as evolved artifacts that can become maladaptive without anyone acting in bad faith. This connects to the author's broader evolutionary thinking and to the wider project thesis about modeling as civic capacity.
8. **Hand the model over.** "Here's the thing. Try to solve it. Send me your link."

---

## 12. Build phases

**Phase 0 — Verification.** Resolve every `[VERIFY]` flag. Obtain Richter et al. 2024 supplementary data. Locate and audit the existing California water rights dataset. Read the actual orbitalfoundation repo READMEs. *Nothing else starts until this is done.*

**Phase 1 — Model core.** Mass balance, no UI. Node script. Validate against Richter's published totals — if the model can't reproduce the published accounting, it's wrong.

**Phase 2 — Allocation solver.** Priority vs. proportional. Validate against known shortage-tier behavior under the 2007 Guidelines.

**Phase 3 — Impact layer.** The translations from §7.

**Phase 4 — Web app.** `orbital-sys` backbone, levers, charts, scenario URLs.

**Phase 5 — Claims ledger UI.** Each claim wired to a scenario.

**Phase 6 — Essay + publication.** Time to the post-2026 guidelines news cycle.

**Phase 7 — Rio Grande.** Extract the reusable engine *here*, driven by what the second piece actually needs. Not before.

---

## 13. Open questions for whoever builds this

1. **Spatial resolution.** Basin-wide aggregate, by state, or by irrigation district? District-level is where the interesting distributional effects live, but data availability varies enormously. Recommend: state-level with Imperial, Yuma, and Palo Verde broken out separately, since those three carry the alfalfa argument.
2. **Timestep.** Annual is simpler and matches most accounting. Monthly captures the irrigation season and reservoir operations properly but multiplies data requirements. Recommend annual for v1.
3. **Agent-based or aggregate?** Aggregate flows are simpler and sufficient for most claims. Agent-based (districts as agents with priority dates and economic decision rules) would make the `orbital` sandbox relevant and would capture the buyout market dynamics from Claim 3b more honestly. Open question whether that's v1 or v2.
4. **Climate scenarios.** Fixed historical flow, or projected declining flow? The post-2026 negotiation is fundamentally about what flow assumption to plan on, which argues for exposing it as a lever.
5. **How far to model the beef/dairy supply chain?** Claim 5's second-order rangeland effect requires at least a coarse representation of cow-calf → finishing. Where's the honest stopping point?
6. **Does the California over-allocation comparison belong in piece one, or is it scope creep?**

---

## 14. One-paragraph summary for context-setting

*A web-based computational journalism piece about Colorado River water allocation. Reader manipulates policy levers — cut method, pricing, crop switching, buyout budget, retirement vs. fallowing, delta flow targets — and sees consequences translated into ecological, health, economic, and community impacts. Structured around a ledger of real claims made in current public discourse, each adjudicated by the model as confirmed, refuted, or reframed. Built to intervene in the live post-2026 operating guidelines negotiation. Built client-side on the orbital-sys event architecture, open source with an auditable data pipeline. First of a series of thesis pieces; the reusable simulation engine gets extracted from piece two, not designed up front.*

---

*Prepared for handoff. All confidence flags are load-bearing.*
