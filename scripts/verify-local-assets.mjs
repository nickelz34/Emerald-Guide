/**
 * Verify the shipped app needs no external network for sprites or guide data.
 * Checks:
 *  1) No absolute http(s) URLs in src/ or index.html (changelog excluded)
 *  2) Every sprites|maps|screenshots path referenced from src/ exists under public/
 *
 * Usage: node scripts/verify-local-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name)) out.push(p);
  }
  return out;
}

const codeFiles = [
  ...walk(SRC, (n) => /\.(ts|tsx|css|html)$/.test(n)),
  path.join(ROOT, "index.html"),
].filter((p) => fs.existsSync(p));

const urlHits = [];
const urlRe = /https?:\/\/[^\s"'`)]+/g;
const allowUrl = (u) =>
  /w3\.org|schema\.org|reactjs\.org|typescriptlang\.org|vitejs\.dev/i.test(u);

for (const file of codeFiles) {
  const norm = file.replace(/\\/g, "/");
  if (norm.endsWith("src/data/changelog.ts")) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(urlRe)) {
    if (allowUrl(m[0])) continue;
    urlHits.push(`${path.relative(ROOT, file)}: ${m[0]}`);
  }
}

const assetRe =
  /["']((?:sprites|maps|screenshots)\/[^"']+\.(?:png|webp|jpe?g|gif|svg))["']/gi;
const refs = new Map();
for (const file of walk(SRC, (n) => /\.(ts|tsx|css|json)$/.test(n))) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(assetRe)) {
    const rel = m[1].replace(/\\/g, "/");
    if (!refs.has(rel)) refs.set(rel, path.relative(ROOT, file));
  }
}

const missing = [];
for (const rel of [...refs.keys()].sort()) {
  if (!fs.existsSync(path.join(PUBLIC, rel))) {
    missing.push(`${rel} (from ${refs.get(rel)})`);
  }
}

console.log(`Checked ${codeFiles.length} source files, ${refs.size} asset refs.`);
if (urlHits.length) {
  console.error(`\nExternal URL(s) in runtime source (${urlHits.length}):`);
  for (const h of urlHits.slice(0, 50)) console.error("  " + h);
}
if (missing.length) {
  console.error(`\nMissing public/ asset(s) (${missing.length}):`);
  for (const h of missing.slice(0, 50)) console.error("  " + h);
}

if (urlHits.length || missing.length) process.exit(1);
console.log("OK — runtime assets are local; no external data URLs in app source.");
