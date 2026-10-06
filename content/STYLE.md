# Writing for the Hardlock guide

The guide explains how the game plays to people who play it. It is a Fumadocs site.
Every page is MDX in `content/docs/(<part>)/<section>/<page>.mdx`, where `<part>` is one
of the three navbar tabs: `(fly)`, `(fight)`, `(reference)`. The parenthesised folder
never appears in URLs: `content/docs/(fight)/radar/locking.mdx` is `/radar/locking/`.

To add a page: write the MDX file with frontmatter, then add its file name to the
`pages` array in that section's `meta.json` (order = sidebar order). To add a section:
make a folder with a `meta.json` (`title`, `icon`, `pages`) and an `index.mdx` whose body
is `<SectionIndex />`, and list the folder in its part's `meta.json`. Icons are lucide
icon names (https://lucide.dev/icons). Prefer extending an existing page to adding one.

## What belongs here

Write only what a player needs to fly, fight, read the screen or make a decision.

- In: keys, HUD words and symbols, menu options and defaults, warnings and tones,
  the loadout, and the rules that decide whether a shot hits or a contact shows.
- Out: internal constants that change nothing a player would do differently, step
  rates, formulas a player cannot use, test results, code history, and notes
  about how the game is built.
- Each topic lives on one page. Other pages link to it instead of repeating it.
- If a number does not help a decision, leave it out. If it does, give it exactly.

## Accuracy

- Every statement comes from the game's source that you have read. If you did not
  read it, do not write it. If the code is ambiguous, say less, not more.
- When a page and the code disagree, the code wins. When the game's own text is
  wrong, fix the game, not the page.
- Give exact numbers with units. Round only when the page says "about".
- Mark game-tuning values with `<SimChoice />` right after the number (once per
  value per page is enough; a whole table can say "All values are sim choices.").
- Never add real-world performance, tactics, or figures from your own knowledge.
- Do not name War Thunder or Gaijin anywhere. "Mouse aim" is fine.

## The game is not open source

Never mention the game's code, files, functions, constants, tests, tools or
repository in page text, and never link to them. Say what the game does ("the seeker
drops the target after three missed looks"), not where or how it is written.

## Voice

- Write for a player, in second person ("you"), plain verbs, sentence case.
- Name game objects: a track on the scope, a HUD symbol, a warning tone, a sim choice.
- Frame everything as how the game models it. This is a game, never a real-world
  procedure. No field-manual tone, no "how to defeat a real radar".
- Explain the mechanic, then what it means when you play (a Callout kind="tip"
  is good for that).
- No filler intros. Open with the most useful sentence. One idea per paragraph.
- Do not use em dashes as sentence glue; use commas, colons, or two sentences.
- No ALL CAPS except the game's own on-screen strings (quote those exactly, e.g.
  SHOOT, MEMORY, SPLASH).
- Bold sparingly: the one phrase per paragraph a skimmer must see.

## Components (no imports needed)

Fumadocs built-ins, all registered in `components/mdx.tsx`:

- Numbered headings (`## 1. Choose the fighter`) become step-by-step **Steps** automatically.
- `<Tabs items={["A", "B"]}><Tab value="A">…</Tab><Tab value="B">…</Tab></Tabs>`
- `<Accordions multiple><Accordion title="…">…</Accordion></Accordions>`
- `<Cards><Card title="…" href="/radar/locking/">…</Card></Cards>`
- ```` ```mermaid ```` code blocks render as themed diagrams.
- Plain Markdown images zoom on click.

The guide's own components:

- `<Key k="T" />`, `<Key k="Space" hold />` for keys. Use the game's default bindings.
- `<SimChoice />` badge.
- `<Callout kind="note|tip|heat|radar|threat|sim" title="...">...</Callout>`.
  kind: heat = IR/flares topic, radar = radar topic, threat = danger to you,
  tip = "In the cockpit" practical consequence, sim = a deliberate game simplification.
- `<Facts><dt>…</dt><dd>…</dd></Facts>` for a short list of quick-reference values.
- `<Figure src="/img/hud/lock.png" alt="..." caption="..." />`. Available images:
  /img/hud/{search,tws,aesa_multi,lock,acm,missile,symbols}.png (800x400, drawn by the
  game's own HUD from scripted scenes, no simulation behind them; caption them that way),
  and /img/aircraft/<id>.webp renders of the game's aircraft models. Look at an image
  before captioning it; describe only what is visible.
- `<Diagram name="..." />` renders an SVG diagram from `components/diagrams.tsx`.
- Markdown tables are styled; keep cells short.
- Internal links: `[text](/radar/locking/)` with trailing slash.

## Page shape

```mdx
---
title: "Sentence-case title"
description: "One or two sentences that say what the page answers."
icon: Radar
---

Opening paragraph: the most important fact.

## Section heading
...
```

`##` sections become search entries, so give them specific names ("When it shoots",
not "Details"). MDX gotchas: escape `<` as `&lt;` and `{` `}` in prose; `<=`/`>=` in
prose must be written as words or `&le;`/`&ge;`.
