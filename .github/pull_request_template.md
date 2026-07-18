## Summary

<!-- What changed and why (player-facing first). -->

## Changelog

User-facing changes **must** ship with:

- [ ] New top entry in `src/data/changelog.ts` (specific bullets under clear headings)
- [ ] `package.json` / `package-lock.json` version bumped to match that entry
- [ ] README version strings synced (`Current app version` + badge `vX.Y.Z`)

`npm run build` fails if those versions drift (`scripts/verify-changelog.mjs`).

Skip the bump only for pure internal/docs/tooling PRs with **no** player-visible effect.

## Test plan

- [ ] 
