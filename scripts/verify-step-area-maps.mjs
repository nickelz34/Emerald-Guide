/**
 * Verify every AREA_MAPS id is referenced by at least one walkthrough step mapping.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const areaMapsSrc = readFileSync(join(root, "src/data/areaMaps.ts"), "utf8");
const stepAreaMapsSrc = readFileSync(join(root, "src/data/stepAreaMaps.ts"), "utf8");

/** Event / distribution-only maps with no walkthrough step. */
const OPTIONAL_UNLINKED = new Set([
  // Superseded by rustborocity-gym-roxanne-battle face-off on rustboro-2;
  // keep the full floor plan asset for gym entity data / future use.
  "rustborocity-gym",
]);

const mapBlockIds = [...areaMapsSrc.matchAll(/id: "([^"]+)",\r?\n\s+mapId:/g)].map((m) => m[1]);

const referenced = new Set();
for (const m of stepAreaMapsSrc.matchAll(/"([a-z0-9-]+)"/g)) {
  const id = m[1];
  if (mapBlockIds.includes(id)) referenced.add(id);
}

const unmapped = mapBlockIds.filter((id) => !referenced.has(id) && !OPTIONAL_UNLINKED.has(id));
const optional = mapBlockIds.filter((id) => OPTIONAL_UNLINKED.has(id));

if (unmapped.length) {
  console.error(`Area maps not linked to any walkthrough step (${unmapped.length}):`);
  for (const id of unmapped.sort()) console.error(`  - ${id}`);
  process.exit(1);
}

console.log(`OK: all ${mapBlockIds.length - optional.length} walkthrough area maps are linked (${optional.length} optional event-only).`);
