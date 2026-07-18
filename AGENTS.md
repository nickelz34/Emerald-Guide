# Agent notes (Emerald Guide)

## Changelog is mandatory for user-facing ships

Whenever you change something players can see or feel — maps, walkthrough steps, UI/UX, hit targets, zoom, assets, selectors, copy, etc. — you MUST, in the same PR before merge:

1. Prepend a new top release in `src/data/changelog.ts` (Central Time ISO datetime, clear summary, headed bullet sections).
2. Bump `version` in `package.json` and `package-lock.json` to that new version.
3. Sync README version strings (`Current app version: **X.Y.Z**` and `` `vX.Y.Z` ``).

Do not merge user-facing work without those updates.

- `npm run build` and PR CI run `scripts/verify-changelog.mjs`, which fails if the top changelog version does not match package.json / lockfile / README.
- Pure internal tooling/docs with zero player-visible effect may skip the bump — say so explicitly in the PR.
