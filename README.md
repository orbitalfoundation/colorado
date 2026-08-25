# colorado — *Who Drinks the River?*

**Staged prototype: https://colorado.exe.xyz**

A computational journalism piece about Colorado River water allocation: an
essay, an open model, and a playable web app in one page. Readers arrive
holding a claim from the live discourse, see the model adjudicate it, then get
the levers themselves — cut method, pricing, buyouts, fallowing vs. retirement,
delta flow — with consequences translated into human units. There is no win
state; that's the point.

First thesis piece of the orbital pivot: standalone sims instead of a
general sandbox, shared machinery extracted later (from piece two, the
Rio Grande — not before).

- `docs/brief.md` — the substance spec (claims ledger, domain model, data
  sources, editorial integrity rules). Read this first.
- `devlog/` — dated working notes; `devlog/20260824-plan-of-attack.md` is the
  plan.
- `reference/` — source materials, including the conversation that produced
  the brief.

Working with it:

```sh
node scripts/etl/parse-richter.mjs      # bake Richter 2024 tables -> data/
python3 scripts/etl/parse-natural-flow.py  # bake Lees Ferry flows -> data/
node scripts/validate.mjs               # data must reproduce published shares
node scripts/backtest.mjs               # engine vs the 2000-2024 collapse
node scripts/whorunsdry.mjs 0.8         # allocation regimes at 80% flow
bash deploy/deploy.sh                   # assemble + rsync to colorado.exe.xyz
```

Status: model core (Phase 1) and allocation solver (Phase 2) working and
staged; impact translation, demand levers, and the essay are ahead. No
published number ships while marked `[VERIFY]` in `docs/verification.md` —
DRAFT-flagged constants remain in `lib/engine.mjs`.
