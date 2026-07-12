/**
 * Verify all main Hoenn map markers stay source-accurate:
 *  1) When .calib/pokeemerald is present, regenerating gen-map-landmarks /
 *     gen-shop-pins / gen-map-points matches committed generated TS files
 *  2) Hand MAP_POINTS only contains APPROXIMATE_MAP_PIN_IDS
 *  3) Route pins match AREA_MAP_BOUNDS centers from mapCrops.ts
 *  4) Shop pin rules (via verify-shop-pins)
 *
 * Usage: node scripts/verify-map-pins.mjs
 * CI / machines without pokeemerald skip regen drift checks.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseAreaMapBounds } from "./map-origin-lib.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MANIFEST = path.join(ROOT, ".calib/manifest.json");

const FILES = {
  landmarks: path.join(ROOT, "src/data/mapLandmarksGenerated.ts"),
  shops: path.join(ROOT, "src/data/shopPinsGenerated.ts"),
  points: path.join(ROOT, "src/data/mapPointsGenerated.ts"),
  routes: path.join(ROOT, "src/data/mapRoutesGenerated.ts"),
  mapPoints: path.join(ROOT, "src/data/mapPoints.ts"),
  mapCrops: path.join(ROOT, "src/data/mapCrops.ts"),
};

function extractApproxIds(src) {
  const m = src.match(/APPROXIMATE_MAP_PIN_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
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

function runGen(script, label) {
  const before = fs.existsSync(FILES[label]) ? fs.readFileSync(FILES[label], "utf8") : "";
  const run = spawnSync(process.execPath, [path.join(ROOT, "scripts", script)], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (run.status !== 0) {
    console.error(run.stdout || "");
    console.error(run.stderr || "");
    process.exit(run.status || 1);
  }
  const after = fs.readFileSync(FILES[label], "utf8");
  if (before.replace(/\r\n/g, "\n") !== after.replace(/\r\n/g, "\n")) {
    console.error(`${path.basename(FILES[label])} is stale — run: node scripts/${script}`);
    process.exit(1);
  }
}

const errors = [];
const canRegen = fs.existsSync(REPO) && fs.existsSync(MANIFEST);

if (canRegen) {
  runGen("gen-map-landmarks.mjs", "landmarks");
  runGen("gen-shop-pins.mjs", "shops");
  runGen("gen-map-points.mjs", "points");
} else {
  console.log("Skipping map-pin regen (no .calib/pokeemerald) — static checks only.");
}

const mapSrc = fs.readFileSync(FILES.mapPoints, "utf8");
const approx = new Set(extractApproxIds(mapSrc));
const hand = extractMapPoints(mapSrc);

if (!approx.size) {
  errors.push("APPROXIMATE_MAP_PIN_IDS missing or empty in mapPoints.ts");
}

for (const p of hand) {
  if (!approx.has(p.id)) {
    errors.push(
      `${p.id} (${p.category}) is hand-placed but not in APPROXIMATE_MAP_PIN_IDS — generate it or allowlist it.`,
    );
  }
}
for (const id of approx) {
  if (!hand.some((p) => p.id === id)) {
    errors.push(`APPROXIMATE_MAP_PIN_IDS lists ${id} but MAP_POINTS has no matching pin.`);
  }
}

const landmarkPins = extractMapPoints(fs.readFileSync(FILES.landmarks, "utf8"));
const shopPins = extractMapPoints(fs.readFileSync(FILES.shops, "utf8"));
for (const p of [...landmarkPins, ...shopPins]) {
  if (approx.has(p.id) || hand.some((h) => h.id === p.id)) {
    errors.push(`${p.id} is both generated and hand/approximate — keep a single source.`);
  }
}

const needTowns = [
  "littleroot",
  "oldale",
  "petalburg",
  "rustboro",
  "dewford",
  "slateport",
  "mauville",
  "verdanturf",
  "fallarbor",
  "lavaridge",
  "fortree",
  "lilycove",
  "mossdeep",
  "pacifidlog",
  "ever-grande",
];
const needGyms = [
  "gym-rustboro",
  "gym-dewford",
  "gym-mauville",
  "gym-lavaridge",
  "gym-petalburg",
  "gym-fortree",
  "gym-mossdeep",
];
const needLandmarks = [
  "petalburg-woods",
  "weather-institute",
  "safari-zone",
  "mt-pyre",
  "trick-house",
  "abandoned-ship",
  "sky-pillar",
  "pokemon-league",
];
for (const id of [...needTowns, ...needGyms, ...needLandmarks]) {
  if (!landmarkPins.some((p) => p.id === id)) {
    errors.push(`Missing generated landmark pin: ${id}`);
  }
}

const bounds = parseAreaMapBounds(fs.readFileSync(FILES.mapCrops, "utf8"));
const routes = extractMapPoints(fs.readFileSync(FILES.routes, "utf8"));
const round = (n) => Math.round(n * 10000) / 10000;
for (const r of routes) {
  const b = bounds[r.id];
  if (!b) {
    errors.push(`Route pin ${r.id} has no AREA_MAP_BOUNDS entry`);
    continue;
  }
  const cx = round(b.x + b.w / 2);
  const cy = round(b.y + b.h / 2);
  if (Math.abs(r.x - cx) > 0.0001 || Math.abs(r.y - cy) > 0.0001) {
    errors.push(`Route ${r.id} center drift: pin ${r.x},${r.y} vs bounds ${cx},${cy}`);
  }
}

const shopVerify = spawnSync(process.execPath, [path.join(ROOT, "scripts/verify-shop-pins.mjs")], {
  cwd: ROOT,
  encoding: "utf8",
});
if (shopVerify.status !== 0) {
  console.error(shopVerify.stdout || "");
  console.error(shopVerify.stderr || "");
  errors.push("verify-shop-pins failed");
}

if (errors.length) {
  console.error("Map pin verification failed:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(
  `OK — ${landmarkPins.length} landmark pins, ${shopPins.length} outdoor shop pin(s), ${routes.length} routes, ${approx.size} approximate hand pin(s)${canRegen ? "; mapPointsGenerated regen matches" : "; regen skipped"}.`,
);
