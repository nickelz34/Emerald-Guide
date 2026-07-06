/**
 * Verify every item ball on non-composite pokeemerald maps is present in
 * src/data/areaMaps.ts (matched by mapId + per-map counts).
 *
 * Run: node scripts/verify-area-items.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, ".calib/manifest.json"), "utf8"));
const compositeIds = new Set(manifest.maps.map((m) => m.id));

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l && l.id) layoutById.set(l.id, l);

// Parse areaMaps.ts markers by mapId
const areaSrc = fs.readFileSync(path.join(ROOT, "src/data/areaMaps.ts"), "utf8");
const areaByMapId = new Map();
const mapRe = /mapId: "(MAP_[^"]+)"[\s\S]*?markers: \[([\s\S]*?)\n    \],/g;
let mm;
while ((mm = mapRe.exec(areaSrc))) {
  const mapId = mm[1];
  const body = mm[2];
  let items = 0;
  let hidden = 0;
  let berries = 0;
  for (const cat of body.matchAll(/category: "(item|hidden|berry)"/g)) {
    if (cat[1] === "item") items++;
    else if (cat[1] === "hidden") hidden++;
    else berries++;
  }
  areaByMapId.set(mapId, { items, hidden, berries });
}

const expected = [];
for (const dir of fs.readdirSync(MAPS_DIR)) {
  const mj = path.join(MAPS_DIR, dir, "map.json");
  if (!fs.existsSync(mj)) continue;
  const m = JSON.parse(fs.readFileSync(mj, "utf8"));
  if (!layoutById.has(m.layout)) continue;
  if (compositeIds.has(m.id)) continue;
  const objs = m.object_events ?? [];
  const bgs = m.bg_events ?? [];
  const itemBalls = objs.filter((o) => o.graphics_id === "OBJ_EVENT_GFX_ITEM_BALL");
  const berryTrees = objs.filter((o) => o.graphics_id === "OBJ_EVENT_GFX_BERRY_TREE");
  const hidden = bgs.filter((b) => b.type === "hidden_item");
  if (!itemBalls.length && !berryTrees.length && !hidden.length) continue;

  expected.push({
    mapId: m.id,
    name: m.name,
    items: itemBalls.length,
    hidden: hidden.length,
    berries: berryTrees.length,
  });
}

let totalExpItems = 0;
let totalExpHidden = 0;
let totalActItems = 0;
let totalActHidden = 0;
const missing = [];
const countMismatch = [];

for (const e of expected) {
  totalExpItems += e.items;
  totalExpHidden += e.hidden;
  const act = areaByMapId.get(e.mapId);
  if (!act) {
    missing.push({ ...e, reason: "map missing from areaMaps.ts" });
    continue;
  }
  totalActItems += act.items;
  totalActHidden += act.hidden;
  if (act.items !== e.items || act.hidden !== e.hidden || act.berries !== e.berries) {
    countMismatch.push({ ...e, actual: act });
  }
}

const hiddenOnly = expected.filter((e) => e.items === 0 && e.hidden > 0);

console.log("Area map item audit");
console.log("===================");
console.log(`Collectible area maps checked: ${expected.length}`);
console.log(`(Total area maps in guide may be higher — e.g. Battle Pyramid lobby/floor/top have no field pickups.)`);
console.log(`Item balls — source: ${totalExpItems}, areaMaps.ts: ${totalActItems}`);
console.log(`Hidden items — source: ${totalExpHidden}, areaMaps.ts: ${totalActHidden}`);

if (missing.length) {
  console.log(`\nMissing maps (${missing.length}):`);
  for (const m of missing) console.log(`  ${m.name} (${m.mapId})`);
}

if (countMismatch.length) {
  console.log(`\nCount mismatches (${countMismatch.length}):`);
  for (const m of countMismatch) {
    console.log(
      `  ${m.name}: expected it:${m.items} hi:${m.hidden} be:${m.berries} — got it:${m.actual.items} hi:${m.actual.hidden} be:${m.actual.berries}`,
    );
  }
}

console.log(`\nHidden-only maps (no item balls in game data): ${hiddenOnly.length}`);
for (const m of hiddenOnly) console.log(`  ${m.name} (${m.hidden} hidden)`);

if (missing.length || countMismatch.length) {
  console.log("\nFAIL — re-run: npm run gen:area-maps");
  process.exit(1);
}

console.log("\nOK — areaMaps.ts matches pokeemerald item balls and hidden items.");
