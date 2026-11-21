---
name: house-ux
description: Anselm's house style for web apps and sites - Svelte 5 + Tailwind + Vite, system light/dark, mobile-first, one sparse brand color, floating controls instead of headers/footers, sober and sciency. Use when building or restyling any UI, choosing a stack, or reviewing a page.
user-invocable: false
---

# House UX

Stated repeatedly (ecopermit and reefstora `devlog/20260721-front-end.md`,
`2027/orbital/orbital-wiki/technical/20260531-interface-goals.md`).

- **Stack**: ES6 + **Svelte 5 (runes)** + **Tailwind** (v4) + **Vite**.
  Mock JSON first (`public/mock/*.json`, hot-reloadable). Backend when needed:
  fastify + **socket.io** + mongo. maplibre-gl for maps.
- **Client–server over socket.io, not vanilla HTTP/REST** (stated 2026-09-15,
  "strongly prefer"). Send a structured request `{name, payload}` over one
  open socket and switch on it server-side, rather than opening an HTTP
  channel per request. Reasons: one connection, streaming and push for free,
  client and server state stay in sync more easily. HTTP stays only where it
  must (login/register set cookies; static files; webhooks). He thinks in
  games terms: events that can be replayed to rebuild state, multiplayer as
  the default mental model, even when an app never needs it. Design the event
  vocabulary so replay would be possible; do not build replay unasked.
- **Light/dark via `prefers-color-scheme`**, never a toggle-only design.
- **Mobile-first**; hamburger on small screens.
- **One brand color, used sparingly.** He delegates the choice: "surprise me".
- **No big headers or footers; small floating elements only.** Favourite
  pattern: a top-right floating icon opening a small menu.
- **Sober and sciency, not promotional**: "peer-reviewed paper, not startup
  marketing".
- Modular/DRY; reuse before inventing; `orbital-*` services when they fit.
- Formal detail (`2027/orbital/orbital-sim/CLAUDE.md`): space not lines,
  ≤4px rounding, system font stacks (sans for prose, mono for data), sparse
  color, no web fonts, floating controls. hook.org is the deliberate
  web-font/serif exception (`hook-website/devnotes/20260807-initial-approach-technical-and-ux-design.md`).
- Recurring practice: a separate fixed status palette with icon+label, never
  color alone; shareable deep-link URL state (`?demo`, `#page`) so funder links
  never break; no login friction to view; `tabular-nums` on numeric columns;
  lander at bare `/`.
- **Real images or none.** No stock standing in for personal material; stock
  food photos allowed if labelled "illustrative".
- **Screenshot-verify BOTH light and dark modes** (see screenshot-verify).

## Product principle: "deterministic core, generative edge"

A rules engine makes the auditable decisions with citations, confidence and
stated gaps; LLMs only explain, draft and answer grounded questions.
Conversation is a lens over structured data, never the only UI. LLM tiering:
Anthropic API → local ollama → rules-only; label which tier answered.

## Frame before building

For a new app he wants devlog entries first: user stories and personas (find
the through-line), app areas, milestones. Then prototype. See any project's
`devlog/2026072*-plan.md` for the shape.

## Style reference he likes

https://miaai-lab.github.io/Fable-5.1-100-HTML-Files/ — 100 single-file HTML
style studies, each with its prompt. A menu of looks and phrasings when a page
needs more visual identity than the default; the rules above still apply, so
borrow a technique or mood, not a whole page.
