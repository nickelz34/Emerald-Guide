/**
 * Report walkthrough steps that lack encounter area mapping.
 * Parses ENCOUNTER_EXEMPT_STEPS and DUNGEON_AREA_PREFIXES from areaData.ts (single source of truth).
 *
 * Run: node scripts/verify-encounter-coverage.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const WALKTHROUGH_FILES = [
  "src/data/walkthrough.ts",
  "src/data/postgameWalkthrough.ts",
  "src/data/pregameWalkthrough.ts",
];

const areaSrc = readFileSync(join(root, "src/data/areaData.ts"), "utf8");

function parseStringSet(name) {
  const re = new RegExp(`export const ${name}[^=]*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`);
  const m = areaSrc.match(re);
  if (!m) throw new Error(`Could not parse ${name} from areaData.ts`);
  return new Set([...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
}

function parseConstArray(name) {
  const re = new RegExp(`const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\] as const`);
  const m = areaSrc.match(re);
  if (!m) throw new Error(`Could not parse ${name} from areaData.ts`);
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

const ENCOUNTER_EXEMPT = parseStringSet("ENCOUNTER_EXEMPT_STEPS");
const TOWN = parseConstArray("TOWN_AREA_PREFIXES");
const DUNGEON = parseConstArray("DUNGEON_AREA_PREFIXES");

const mapBlock = areaSrc.match(/export const STEP_AREA_MAP[^=]*=\s*(\{[\s\S]*?\n\};)/)?.[1];
if (!mapBlock) throw new Error("Could not parse STEP_AREA_MAP");
const STEP_AREA_MAP = Function(`return ${mapBlock.replace(/;$/, "")}`)();

function collectStepIds(src) {
  const ids = [];
  const stepBlocks = src.split(/\n\s+steps: \[/).slice(1);
  for (const block of stepBlocks) {
    const end = block.indexOf("\n  ],");
    const chunk = end >= 0 ? block.slice(0, end) : block;
    for (const m of chunk.matchAll(/\n\s+id: "([^"]+)"/g)) {
      ids.push(m[1]);
    }
  }
  return ids.filter(isWalkthroughStepId);
}

function isWalkthroughStepId(id) {
  if (/^route-\d+$/.test(id)) return false;
  if (
    id === "contests-lilycove" ||
    id === "contests-postgame" ||
    id === "contest-prep" ||
    id === "postgame-hoenn" ||
    id === "postgame-opening" ||
    id === "league"
  ) {
    return false;
  }
  return /-\d+$/.test(id) || /^(postgame|pregame|battle-frontier|trick|mirage)-/.test(id);
}

function inferAreaId(stepId) {
  const routeMatch = stepId.match(/^(route-\d+)-\d+$/);
  if (routeMatch) return routeMatch[1];
  if (ENCOUNTER_EXEMPT.has(stepId) || /-gym-\d+$/.test(stepId)) return undefined;
  const sortedDungeons = [...DUNGEON].sort((a, b) => b.length - a.length);
  for (const prefix of sortedDungeons) {
    if (stepId.startsWith(`${prefix}-`)) return prefix;
  }
  for (const prefix of TOWN) {
    if (stepId.startsWith(`${prefix}-`)) return prefix;
  }
  return undefined;
}

function getAreasForStep(stepId) {
  if (ENCOUNTER_EXEMPT.has(stepId)) return [];
  const mapped = STEP_AREA_MAP[stepId];
  if (mapped?.length) return mapped;
  const inferred = inferAreaId(stepId);
  return inferred ? [inferred] : [];
}

const stepIds = [];
for (const rel of WALKTHROUGH_FILES) {
  const src = readFileSync(join(root, rel), "utf8");
  stepIds.push(...collectStepIds(src));
}

const unique = [...new Set(stepIds)].sort();
const missing = unique.filter((id) => getAreasForStep(id).length === 0 && !ENCOUNTER_EXEMPT.has(id));
const explicit = unique.filter((id) => STEP_AREA_MAP[id]?.length);
const inferred = unique.filter((id) => !STEP_AREA_MAP[id] && getAreasForStep(id).length > 0);

console.log(`Walkthrough steps: ${unique.length}`);
console.log(`  explicit STEP_AREA_MAP: ${explicit.length}`);
console.log(`  inferred only: ${inferred.length}`);
console.log(`  encounter-exempt: ${unique.filter((id) => ENCOUNTER_EXEMPT.has(id)).length}`);
console.log(`  missing encounter area: ${missing.length}`);

if (missing.length) {
  console.error("\nSteps still needing STEP_AREA_MAP or infer prefix:");
  for (const id of missing) console.error(`  - ${id}`);
  process.exit(1);
}

console.log("\nOK: every non-exempt walkthrough step resolves an encounter area.");
