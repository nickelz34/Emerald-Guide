/**
 * Patch AREA_MARKER_MAP_POS in mapCrops.ts from marker-tiles + AREA_MAP_BOUNDS.
 * Use when gen-map-crops.mjs cannot run (missing .calib/manifest.json).
 *
 * Run: node scripts/patch-marker-map-pos.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TILES = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/marker-tiles.json"), "utf8"));
const CAL = JSON.parse(fs.readFileSync(path.join(ROOT, "map_calibration_data.json"), "utf8"));
const calByMap = Object.fromEntries(CAL.map((c) => [c.map, c]));

const AREA_LAYOUT = {
  littleroot: "LittlerootTown",
  oldale: "OldaleTown",
  "route-101": "Route101",
  "route-102": "Route102",
  "route-103": "Route103",
  "petalburg-woods": "PetalburgWoods",
  "route-104": "Route104",
  petalburg: "PetalburgCity",
  rustboro: "RustboroCity",
  "route-116": "Route116",
  "rusturf-tunnel": "RusturfTunnel",
  dewford: "DewfordTown",
  slateport: "SlateportCity",
  mauville: "MauvilleCity",
  "route-110": "Route110",
  "route-117": "Route117",
  "route-118": "Route118",
  "mt-chimney": "MtChimney",
  "route-113": "Route113",
  lavaridge: "LavaridgeTown",
  fallarbor: "FallarborTown",
  "route-119": "Route119",
  fortree: "FortreeCity",
  "route-120": "Route120",
  mossdeep: "MossdeepCity",
  sootopolis: "SootopolisCity",
  lilycove: "LilycoveCity",
  pacifidlog: "PacifidlogTown",
  "sky-pillar": "SkyPillar_Outside",
  "sealed-chamber": "SealedChamber_InnerRoom",
  "ever-grande": "EverGrandeCity",
  "route-105": "Route105",
  "route-111": "Route111",
};

const round = (n) => Math.round(n * 10000) / 10000;

function tileToMapPct(bounds, tx, ty, tilesW, tilesH) {
  return {
    x: round(bounds.x + ((tx + 0.5) / tilesW) * bounds.w),
    y: round(bounds.y + ((ty + 0.5) / tilesH) * bounds.h),
  };
}

// Parse AREA_MAP_BOUNDS from mapCrops.ts
const cropsPath = path.join(ROOT, "src/data/mapCrops.ts");
const cropsSrc = fs.readFileSync(cropsPath, "utf8");
const boundsMatch = cropsSrc.match(/export const AREA_MAP_BOUNDS[^=]*=\s*(\{[\s\S]*?\n\});/);
if (!boundsMatch) throw new Error("Could not parse AREA_MAP_BOUNDS");
const bounds = Function(`return ${boundsMatch[1]}`)();

const updates = {};
for (const [areaId, markers] of Object.entries(TILES)) {
  if (areaId.startsWith("_")) continue;
  const b = bounds[areaId];
  const layout = calByMap[AREA_LAYOUT[areaId]];
  if (!b || !layout) continue;
  const tilesW = layout.tiles_w ?? layout.inferred_tiles_w ?? 20;
  const tilesH = layout.tiles_h ?? layout.inferred_tiles_h ?? 20;
  updates[areaId] = {};
  for (const [markerId, [tx, ty]] of Object.entries(markers)) {
    updates[areaId][markerId] = tileToMapPct(b, tx, ty, tilesW, tilesH);
  }
}

let src = cropsSrc;
let count = 0;
for (const [areaId, markerPos] of Object.entries(updates)) {
  for (const [markerId, pos] of Object.entries(markerPos)) {
    const re = new RegExp(
      `("${markerId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{\\s*x:\\s*)([\\d.]+)(,\\s*y:\\s*)([\\d.]+)(\\s*\\})`,
    );
    const m = src.match(re);
    if (!m) continue;
    const old = `{ x: ${m[2]}, y: ${m[4]} }`;
    const neu = `{ x: ${pos.x}, y: ${pos.y} }`;
    if (old === neu) continue;
    src = src.replace(re, `$1${pos.x}$3${pos.y}$5`);
    count++;
    console.log(`${areaId}/${markerId}: ${old} → ${neu}`);
  }
}

fs.writeFileSync(cropsPath, src);
console.log(`\nPatched ${count} positions in mapCrops.ts`);
