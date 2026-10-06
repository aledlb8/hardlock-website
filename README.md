# Hardlock Guide

The player's guide to Hardlock, built with [Fumadocs](https://fumadocs.dev)
on Next.js 16 and Tailwind CSS 4.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local preview at http://localhost:3000 |
| `npm run build` | Static export to `out/` (host it anywhere) |
| `npm start` | Serve `out/` locally |

Set `NEXT_PUBLIC_SITE_URL` when building for a real host so social cards get absolute URLs.

## Where things are

- `content/docs/` holds the pages. `content/STYLE.md` explains how to write and add one.
- `lib/source.ts` is the Fumadocs content source (MDX plugins: steps, Mermaid).
- `app/(docs)/` is the Notebook docs layout with the three navbar tabs.
- `app/(home)/` is the landing page.
- `components/guide.tsx` holds the guide's own MDX components (keycaps, callouts,
  figures, the sim-choice badge); `components/diagrams.tsx` and
  `components/NotchExplorer.tsx` hold the diagrams.
- `public/img/hud/` are HUD captures from the game's `hud_preview` tool, and
  `public/img/aircraft/` are renders of the game's aircraft models.

Also built: static search (`/api/search`), per-page social images (`/og/...`),
and `llms.txt` / `llms-full.txt` for AI tools.
