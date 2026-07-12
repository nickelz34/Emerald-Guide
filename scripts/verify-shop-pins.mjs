/**
 * Verify shop map pins stay accurate:
 *  1) When .calib/pokeemerald is present, regenerating gen-shop-pins matches
 *     shopPinsGenerated.ts
 *  2) Every shop pin is either generated, an entrance remapped to shop, or
 *     explicitly listed in APPROXIMATE_SHOP_PIN_IDS
 *  3) Hand-placed "Market" / outdoor shop pins are not still in MAP_POINTS
 *
 * Usage: node scripts/verify-shop-pins.mjs
 * CI / machines without pokeemerald skip the regen check (static rules still run).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const GEN = path.join(ROOT, "src/data/shopPinsGenerated.ts");
const MAP_POINTS = path.join(ROOT, "src/data/mapPoints.ts");
const GEN_POINTS = path.join(ROOT, "src/data/mapPointsGenerated.ts");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MANIFEST = path.join(ROOT, ".calib/manifest.json");

const SHOP_ENTRANCE_NAMES = new Set([
  "Mart",
  "Herb Shop",
  "Department Store",
  "Bike Shop",
  "Pretty Petal Flower Shop",
  "Glass Workshop",
  "Decoration Shop",
  "Market",
]);

function extractApproxIds(src) {
  const m = src.match(/APPROXIMATE_SHOP_PIN_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function extractMapPoints(src) {
  const points = [];
  for (const m of src.matchAll(
    /\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"\s*,\s*x:\s*([-\d.]+)\s*,\s*y:\s*([-\d.]+)/g,
  )) {
    points.push({ id: m[1], name: m[2], category: m[3], x: Number(m[4]), y: Number(m[5]) });
  }
  return points;
}

const canRegen = fs.existsSync(REPO) && fs.existsSync(MANIFEST);
let shopGeneratedSrc = fs.readFileSync(GEN, "utf8");

if (canRegen) {
  const before = shopGeneratedSrc;
  const run = spawnSync(process.execPath, [path.join(ROOT, "scripts/gen-shop-pins.mjs")], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (run.status !== 0) {
    console.error(run.stdout || "");
    console.error(run.stderr || "");
    process.exit(run.status || 1);
  }
  shopGeneratedSrc = fs.readFileSync(GEN, "utf8");
  if (before.replace(/\r\n/g, "\n") !== shopGeneratedSrc.replace(/\r\n/g, "\n")) {
    console.error("shopPinsGenerated.ts is stale — run: npm run gen:shop-pins");
    process.exit(1);
  }
} else {
  console.log("Skipping shop-pin regen (no .calib/pokeemerald) — static checks only.");
}

const mapSrc = fs.readFileSync(MAP_POINTS, "utf8");
const genSrc = fs.readFileSync(GEN_POINTS, "utf8");
const approx = new Set(extractApproxIds(mapSrc));
const hand = extractMapPoints(mapSrc);
const generatedEntrances = extractMapPoints(genSrc);
const shopGenerated = extractMapPoints(shopGeneratedSrc);

const errors = [];

for (const p of hand.filter((x) => x.category === "shop")) {
  if (approx.has(p.id)) continue;
  if (shopGenerated.some((g) => g.id === p.id)) {
    errors.push(`${p.id} is hand-placed in mapPoints.ts but also generated — remove the hand copy.`);
    continue;
  }
  errors.push(
    `${p.id} (${p.name}) is a hand-placed shop pin not listed in APPROXIMATE_SHOP_PIN_IDS. Prefer gen-shop-pins.mjs.`,
  );
}

for (const p of generatedEntrances) {
  if (!SHOP_ENTRANCE_NAMES.has(p.name)) continue;
  if (!(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100)) {
    errors.push(`Entrance shop ${p.id} has out-of-range coords ${p.x},${p.y}`);
  }
}

if (hand.some((p) => p.id === "shop-slateport-market")) {
  errors.push("shop-slateport-market must come from shopPinsGenerated.ts, not MAP_POINTS.");
}

if (errors.length) {
  console.error("Shop pin verification failed:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(
  `OK — ${shopGenerated.length} generated outdoor shop pin(s), ${approx.size} approximate landmark shop pin(s), entrance shops use mapPointsGenerated.`,
);
