/**
 * Trainer party speciesId must be the National Pokédex number (#1–386).
 * pokeemerald SPECIES_* enum values are Hoenn-dex order with OLD_UNOWN gaps
 * and must not be used as sprite ids.
 *
 * Usage:
 *   node scripts/verify-trainer-parties.mjs
 *   node scripts/verify-trainer-parties.mjs --fix   # rewrite speciesId in generated data
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEX_PATH = path.join(ROOT, "src/data/dexGenerated.ts");
const PARTIES_PATH = path.join(ROOT, "src/data/trainerPartiesGenerated.ts");
const SPRITE_DIR = path.join(ROOT, "public/sprites/pokemon/emerald");
const fix = process.argv.includes("--fix");

function speciesSlug(name) {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/['’]/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/\s+/g, "-");
}

function loadDexLookups() {
  const src = fs.readFileSync(DEX_PATH, "utf8");
  const byName = new Map();
  const bySlug = new Map();
  for (const m of src.matchAll(
    /\{\s*"name":\s*"([^"]+)",\s*"slug":\s*"([^"]+)",(?:\s*"hoennNumber":\s*\d+,)?\s*"nationalNumber":\s*(\d+)/g,
  )) {
    const name = m[1];
    const slug = m[2];
    const n = Number(m[3]);
    if (!n || n < 1 || n > 386) continue;
    byName.set(name.toLowerCase(), n);
    bySlug.set(slug, n);
  }
  return { byName, bySlug };
}

function nationalForName(name, lookups) {
  if (!name || name === "?") return undefined;
  return lookups.byName.get(name.toLowerCase()) ?? lookups.bySlug.get(speciesSlug(name));
}

const lookups = loadDexLookups();
if (lookups.byName.size < 300) {
  console.error(`verify-trainer-parties: expected hundreds of dex names, got ${lookups.byName.size}`);
  process.exit(1);
}

let partiesSrc = fs.readFileSync(PARTIES_PATH, "utf8");
const mismatches = [];
const unknown = [];
const missingSprites = [];
let rewritten = 0;

const rewrittenSrc = partiesSrc.replace(
  /\{"species":"([^"]+)","speciesId":(\d+)/g,
  (full, species, idStr) => {
    const current = Number(idStr);
    const national = nationalForName(species, lookups);
    if (!national) {
      unknown.push(`${species} (id ${current})`);
      return full;
    }
    if (current !== national) {
      mismatches.push(`${species}: ${current} → ${national}`);
      rewritten++;
      return `{"species":"${species}","speciesId":${national}`;
    }
    const sprite = path.join(SPRITE_DIR, `${national}.png`);
    if (!fs.existsSync(sprite)) missingSprites.push(`${species} #${national}`);
    return full;
  },
);

if (fix && rewritten > 0) {
  fs.writeFileSync(PARTIES_PATH, rewrittenSrc);
  console.log(`Rewrote ${rewritten} trainer party speciesId values to National Dex numbers.`);
}

const remaining = [];
const checkSrc = fix ? rewrittenSrc : partiesSrc;
for (const m of checkSrc.matchAll(/\{"species":"([^"]+)","speciesId":(\d+)/g)) {
  const species = m[1];
  const current = Number(m[2]);
  const national = nationalForName(species, lookups);
  if (!national) {
    if (!unknown.includes(`${species} (id ${current})`)) unknown.push(`${species} (id ${current})`);
    continue;
  }
  if (current !== national) remaining.push(`${species}: ${current} (expected ${national})`);
  const sprite = path.join(SPRITE_DIR, `${national}.png`);
  if (!fs.existsSync(sprite) && !missingSprites.includes(`${species} #${national}`)) {
    missingSprites.push(`${species} #${national}`);
  }
}

if (!fix && mismatches.length) {
  console.error(`verify-trainer-parties: ${mismatches.length} speciesId value(s) are not National Dex numbers.`);
  for (const row of [...new Set(mismatches)].slice(0, 20)) console.error(`  ${row}`);
  if (new Set(mismatches).size > 20) console.error(`  … +${new Set(mismatches).size - 20} unique species`);
  process.exit(1);
}

if (remaining.length) {
  console.error(`verify-trainer-parties: ${remaining.length} speciesId value(s) still wrong after ${fix ? "rewrite" : "check"}.`);
  for (const row of remaining.slice(0, 20)) console.error(`  ${row}`);
  process.exit(1);
}

if (unknown.length) {
  console.error(`verify-trainer-parties: unknown species name(s): ${[...new Set(unknown)].join(", ")}`);
  process.exit(1);
}

if (missingSprites.length) {
  console.error(`verify-trainer-parties: missing sprite file(s): ${[...new Set(missingSprites)].slice(0, 20).join(", ")}`);
  process.exit(1);
}

console.log("OK — trainer party speciesId values are National Dex numbers with local sprites.");

/** Scan hand-authored name + dex pairs (evolution, breeding, battle basics, etc.). */
function walkSource(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue;
      walkSource(p, out);
    } else if (/\.(ts|tsx)$/.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

const SKIP_FILES = new Set([
  "changelog.ts",
  "dexGenerated.ts",
  "speciesDataGenerated.ts",
  "trainerPartiesGenerated.ts",
]);

const NAME_DEX_PATTERNS = [
  /fromName:\s*"([^"]+)",\s*fromDex:\s*(\d+)/g,
  /toName:\s*"([^"]+)",\s*toDex:\s*(\d+)/g,
  /name:\s*"([^"]+)",\s*dex:\s*(\d+)/g,
  /\{\s*name:\s*"([^"]+)",\s*dex:\s*(\d+)/g,
];

const authoredMismatches = [];
for (const file of walkSource(path.join(ROOT, "src"))) {
  if (SKIP_FILES.has(path.basename(file))) continue;
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  for (const re of NAME_DEX_PATTERNS) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      const species = m[1];
      const current = Number(m[2]);
      const national = nationalForName(species, lookups);
      if (!national) continue;
      if (current !== national) {
        authoredMismatches.push(`${rel}: ${species} #${current} (expected #${national})`);
      }
    }
  }
}

if (authoredMismatches.length) {
  console.error(
    `verify-trainer-parties: ${authoredMismatches.length} hand-authored name/dex pair(s) do not match National Dex.`,
  );
  for (const row of authoredMismatches.slice(0, 30)) console.error(`  ${row}`);
  if (authoredMismatches.length > 30) {
    console.error(`  … +${authoredMismatches.length - 30} more`);
  }
  process.exit(1);
}

console.log("OK — evolution, breeding, and other named dex ids match National Dex.");

