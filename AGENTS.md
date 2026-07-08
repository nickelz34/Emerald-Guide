# AGENTS.md

## Cursor Cloud specific instructions

- This is a **static, frontend-only** Vite + React 19 + TypeScript SPA ("Emerald Guide", an interactive Pokémon Emerald playthrough guide). There is **no backend, database, or auth**, and it needs **no internet at runtime** — all Pokédex/encounter/map data is bundled under `src/data/` and `public/`.
- Dependencies are installed automatically by the startup update script (`npm install`). Node 18+ is required (the VM has Node 22).
- Run the app in dev mode with `npm run dev` (Vite dev server on `http://localhost:5173`). See `package.json` for the full script list.
- There are **no lint or test scripts** defined in `package.json`. The closest verification is the type-checked production build: `npm run build` (`tsc -b && vite build`).
- The `render:*`, `gen:*`, `sync:*`, `verify:*`, and `audit:*` npm scripts (and `scripts/*.mjs` / `.py`) are offline data/asset-generation and maintenance tools — they are **not** runtime services and are not needed to run or test the app. Some `sync:*` scripts reach external sources (pokeemerald GitHub, PokéAPI) and are only for maintainers regenerating bundled data.
- `vite build` prints a "chunks larger than 500 kB" warning; this is expected and not an error.
- The dev server base path defaults to `/` (production uses `VITE_BASE_PATH=/Emerald-Guide/` from `.env.production` for GitHub Pages).
