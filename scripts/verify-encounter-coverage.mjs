/**
 * Report walkthrough steps that lack encounter area mapping.
 * Steps in ENCOUNTER_EXEMPT are allowed to have no wild table (contests, League, pregame).
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

/** Steps where wild encounters are not expected in the UI. */
const ENCOUNTER_EXEMPT = new Set([
  "contest-prep-1",
  "contest-prep-2",
  "contest-prep-3",
  "contests-lilycove-1",
  "contests-lilycove-2",
  "contests-lilycove-3",
  "contests-lilycove-4",
  "contests-lilycove-5",
  "contests-postgame-1",
  "contests-postgame-2",
  "league-1",
  "league-2",
  "league-3",
  "pregame-evolution-1",
  "pregame-evolution-2",
  "pregame-evolution-3",
  "pregame-evolution-4",
  "pregame-evolution-5",
  "pregame-breeding-1",
  "pregame-breeding-2",
  "pregame-breeding-3",
  "petalburg-gym-1",
  "petalburg-gym-2",
  "petalburg-gym-3",
  "sootopolis-gym-1",
  "sootopolis-gym-2",
  "sootopolis-gym-3",
  "lavaridge-2",
  "rustboro-2",
  "dewford-2",
  "fortree-2",
  "mossdeep-1",
  "mauville-2",
]);

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

/** Drop chapter slugs picked up when scanning between nested steps arrays. */
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

const areaSrc = readFileSync(join(root, "src/data/areaData.ts"), "utf8");
const mapBlock = areaSrc.match(/export const STEP_AREA_MAP[^=]*=\s*(\{[\s\S]*?\n\};)/)?.[1];
if (!mapBlock) throw new Error("Could not parse STEP_AREA_MAP");
const STEP_AREA_MAP = Function(`return ${mapBlock.replace(/;$/, "")}`)();

const TOWN = [
  "littleroot",
  "oldale",
  "petalburg",
  "rustboro",
  "dewford",
  "slateport",
  "mauville",
  "lavaridge",
  "fallarbor",
  "fortree",
  "lilycove",
  "mossdeep",
  "sootopolis",
  "pacifidlog",
  "ever-grande",
  "battle-frontier",
  "verdanturf",
];
const DUNGEON = [
  "granite-cave",
  "petalburg-woods",
  "rusturf-tunnel",
  "mt-chimney",
  "mt-pyre",
  "victory-road",
  "sky-pillar",
  "sealed-chamber",
  "safari-zone",
  "abandoned-ship",
  "shoal-cave",
  "magma-hideout",
  "seafloor-cavern",
];

function inferAreaId(stepId) {
  const routeMatch = stepId.match(/^(route-\d+)-\d+$/);
  if (routeMatch) return routeMatch[1];
  if (/-gym-\d+$/.test(stepId)) return undefined;
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
const missing = unique.filter((id) => !ENCOUNTER_EXEMPT.has(id) && getAreasForStep(id).length === 0);
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
