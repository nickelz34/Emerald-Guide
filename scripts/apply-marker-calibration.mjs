/**
 * Recalibrate map marker x/y from pret/pokeemerald tile coords.
 * Run: node scripts/apply-marker-calibration.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TILES = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/marker-tiles.json"), "utf8"));
const CAL = JSON.parse(fs.readFileSync(path.join(ROOT, "map_calibration_data.json"), "utf8"));
const calByMap = Object.fromEntries(CAL.map((c) => [c.map, c]));

/** areaId → primary screenshot used for overlay */
const AREA_SCREENSHOT = {
  littleroot: "littleroot_town_e.png",
  oldale: "oldale.png",
  "route-101": "route-101.png",
  "route-102": "route-102.png",
  "route-103": "route-103.png",
  "petalburg-woods": "petalburg-woods.png",
  "route-104": "route-104.png",
  petalburg: "petalburg_city_e.png",
  rustboro: "rustboro_city_e.png",
  "route-116": "route-116.png",
  "rusturf-tunnel": "rusturf-tunnel.png",
  "granite-cave": "granite-cave.png",
  dewford: "dewford_town_e.png",
  slateport: "slateport_city_e.png",
  mauville: "mauville_city_e.png",
  "route-110": "route110.png",
  "route-117": "route-117.png",
  "route-118": "route-118.png",
  "mt-chimney": "mt_chimney_e.png",
  "route-113": "route-113.png",
  lavaridge: "lavaridge_town_e.png",
  fallarbor: "fallarbor.png",
  "route-119": "route-119.png",
  fortree: "fortree_city_e.png",
  "route-120": "route-120.png",
  mossdeep: "mossdeep_city_e.png",
  sootopolis: "sootopolis_city_e.png",
  lilycove: "lilycove.png",
  pacifidlog: "pacifidlog.png",
  "sky-pillar": "sky-pillar.png",
  "victory-road": "victory_road_e.png",
  "sealed-chamber": "sealed-chamber.png",
  "marine-cave": "marine-cave.png",
  "ever-grande": "ever-grande.png",
  "battle-frontier": "battle_frontier_e.png",
  "route-105": "route-105.png",
  "route-111": "route-111.png",
};

/** areaId → layout map name in calibration JSON (for dimension check) */
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

/** Screenshots that don't match game layout — hand-tuned % positions */
const MANUAL_PCT = {
  "granite-cave": {
    "gc-entrance": { x: 51, y: 78 },
    "gc-beach": { x: 72, y: 42 },
  },
  "victory-road": {
    "vr-cave": { x: 47, y: 88 },
    "vr-league-path": { x: 72, y: 14 },
    "vr-exterior": { x: 55, y: 38 },
  },
  "marine-cave": {
    "mc-kyogre": { x: 52, y: 35 },
    "mc-player": { x: 50, y: 62 },
    "mc-exit": { x: 50, y: 88 },
  },
  "battle-frontier": {
    "bf-factory": { x: 9, y: 53.5 },
    "bf-arena": { x: 74.6, y: 41 },
    "bf-tower": { x: 56.6, y: 20.1 },
    "bf-exchange": { x: 52, y: 39.6 },
  },
};

/** Stitched BF east-side warps: add west map width (896px) to pixel x */
const BF_STITCH = { westW: 896, totalW: 2048, totalH: 1152 };

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function tileToPct(tx, ty, imgW, imgH) {
  return {
    x: Math.round(((tx * 16 + 8) / imgW) * 1000) / 10,
    y: Math.round(((ty * 16 + 8) / imgH) * 1000) / 10,
  };
}

function bfEastPct(tx, ty) {
  const px = BF_STITCH.westW + tx * 16 + 8;
  return tileToPct(px / 16, ty, BF_STITCH.totalW, BF_STITCH.totalH);
}

function resolvePct(areaId, markerId, tx, ty) {
  if (MANUAL_PCT[areaId]?.[markerId]) return MANUAL_PCT[areaId][markerId];

  const shot = AREA_SCREENSHOT[areaId];
  const { w, h } = pngSize(path.join(ROOT, "public/screenshots", shot));
  const layout = calByMap[AREA_LAYOUT[areaId]];
  if (layout && layout.img_w === w && layout.img_h === h) {
    return tileToPct(tx, ty, w, h);
  }
  return tileToPct(tx, ty, w, h);
}

// Build id → {x,y} lookup
const coords = {};
for (const [areaId, markers] of Object.entries(TILES)) {
  if (areaId.startsWith("_")) continue;
  coords[areaId] = {};
  for (const [markerId, tile] of Object.entries(markers)) {
    const [tx, ty] = tile;
    coords[areaId][markerId] = resolvePct(areaId, markerId, tx, ty);
  }
}

// Patch mapAnnotations.ts
const annPath = path.join(ROOT, "src/data/mapAnnotations.ts");
let src = fs.readFileSync(annPath, "utf8");

src = src.replace(
  /\/\*\*\s*\n \* Marker positions from pret\/pokeemerald[\s\S]*?\*\/\s*\nexport const MAP_ANNOTATIONS/,
  `/**
 * Marker positions from pret/pokeemerald map tile coords (16px/tile).
 * Formula: pct = ((tile*16+8) / screenshotDimension) * 100
 * Hand-tuned for cropped screenshots (granite-cave, victory-road, marine-cave, battle-frontier).
 * Regenerate: node scripts/apply-marker-calibration.mjs
 */
export const MAP_ANNOTATIONS`,
);

let updated = 0;
for (const [areaId, markerCoords] of Object.entries(coords)) {
  for (const [markerId, { x, y }] of Object.entries(markerCoords)) {
    const re = new RegExp(
      `(id:\\s*"${markerId}"[\\s\\S]*?)(x:\\s*)([\\d.]+)(,\\s*y:\\s*)([\\d.]+)`,
    );
    const m = src.match(re);
    if (!m) {
      console.warn(`MISSING marker ${areaId}/${markerId}`);
      continue;
    }
    const oldX = m[3];
    const oldY = m[5];
    if (oldX === String(x) && oldY === String(y)) continue;
    src = src.replace(re, `$1$2${x}$4${y}`);
    updated++;
    console.log(`${areaId}/${markerId}: ${oldX},${oldY} → ${x},${y}`);
  }
}

// Manual-only areas (not in TILES)
for (const [areaId, markers] of Object.entries(MANUAL_PCT)) {
  for (const [markerId, { x, y }] of Object.entries(markers)) {
    if (coords[areaId]?.[markerId]) continue;
    const re = new RegExp(
      `(id:\\s*"${markerId}"[\\s\\S]*?)(x:\\s*)([\\d.]+)(,\\s*y:\\s*)([\\d.]+)`,
    );
    if (!src.match(re)) continue;
    src = src.replace(re, `$1$2${x}$4${y}`);
    updated++;
    console.log(`${areaId}/${markerId} (manual): → ${x},${y}`);
  }
}

fs.writeFileSync(annPath, src);
console.log(`\nUpdated ${updated} marker coordinates in mapAnnotations.ts`);
