/**
 * Ensure every shipped build keeps version + changelog + README in lockstep.
 *
 * User-facing PRs must:
 *   1. Prepend a new top entry in src/data/changelog.ts
 *   2. Bump package.json / package-lock.json to that version
 *   3. Sync README.md version strings
 *
 * Usage: node scripts/verify-changelog.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

function fail(msg) {
  console.error(`verify-changelog: ${msg}`);
  process.exit(1);
}

const pkgPath = path.join(ROOT, "package.json");
const lockPath = path.join(ROOT, "package-lock.json");
const readmePath = path.join(ROOT, "README.md");
const changelogPath = path.join(ROOT, "src/data/changelog.ts");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
const readme = fs.readFileSync(readmePath, "utf8");
const changelogSrc = fs.readFileSync(changelogPath, "utf8");

const pkgVersion = pkg.version;
if (!pkgVersion || !/^\d+\.\d+\.\d+$/.test(pkgVersion)) {
  fail(`package.json version is missing or invalid: ${JSON.stringify(pkgVersion)}`);
}

if (lock.version !== pkgVersion) {
  fail(`package-lock.json version (${lock.version}) != package.json (${pkgVersion})`);
}
const lockRoot = lock.packages?.[""]?.version;
if (lockRoot && lockRoot !== pkgVersion) {
  fail(`package-lock.json packages[""].version (${lockRoot}) != package.json (${pkgVersion})`);
}

const versionBlocks = [...changelogSrc.matchAll(/version:\s*"(\d+\.\d+\.\d+)"/g)].map(
  (m) => m[1],
);
if (versionBlocks.length === 0) {
  fail("changelog.ts has no version entries");
}
const topVersion = versionBlocks[0];
if (topVersion !== pkgVersion) {
  fail(
    `Top changelog version (${topVersion}) != package.json (${pkgVersion}). ` +
      `User-facing changes must prepend a changelog entry and bump the version.`,
  );
}

// First release object after CHANGELOG = [
const arrayMarker = "export const CHANGELOG: ChangelogRelease[] = [";
const arrayIdx = changelogSrc.indexOf(arrayMarker);
if (arrayIdx === -1) {
  fail("changelog.ts is missing the CHANGELOG array declaration");
}
const afterOpen = changelogSrc.slice(arrayIdx + arrayMarker.length);
const firstObjMatch = afterOpen.match(/\{[\s\S]*?\n  \},/);
if (!firstObjMatch) {
  fail("Could not parse the top changelog release object");
}
const topEntry = firstObjMatch[0];
if (!new RegExp(`version:\\s*"${pkgVersion.replace(/\./g, "\\.")}"`).test(topEntry)) {
  fail(`Top changelog object is not version ${pkgVersion}`);
}
if (!/date:\s*"([^"]+)"/.test(topEntry)) {
  fail("Top changelog entry is missing a date");
}
if (!/summary:\s*(?:\n\s*)?"[^"]+"/.test(topEntry) && !/summary:\s*\n\s*"[^"]+"/.test(topEntry)) {
  // Allow multi-line summary: summary:\n      "..."
  if (!/summary:\s*\n[\s\S]*?"[^"]+"/.test(topEntry)) {
    fail("Top changelog entry is missing a summary");
  }
}
if (!/sections:\s*\[/.test(topEntry) || !/items:\s*\[/.test(topEntry)) {
  fail("Top changelog entry must include at least one section with items");
}
const itemCount = (topEntry.match(/^\s+"[^"]+",\s*$/gm) || []).length;
if (itemCount < 1) {
  fail("Top changelog entry has no bullet items");
}

if (!readme.includes(`Current app version: **${pkgVersion}**`)) {
  fail(`README.md is missing "Current app version: **${pkgVersion}**"`);
}
if (!readme.includes(`\`v${pkgVersion}\``)) {
  fail(`README.md is missing version badge text \`v${pkgVersion}\``);
}

console.log(`OK  changelog + version sync @ ${pkgVersion} (${itemCount} top-entry items)`);
