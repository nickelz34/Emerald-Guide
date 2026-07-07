/**
 * Shared helpers for map composite origins (manifest / AREA_MAP_BOUNDS).
 */
import fs from "node:fs";
import path from "node:path";

export const W_TILES = 800;
export const H_TILES = 383;

/** Convert pokeemerald MAP_* id to guide areaId slug. */
export function mapIdToAreaId(mapId) {
  const raw = mapId.replace(/^MAP_/, "");
  if (raw.startsWith("ROUTE")) {
    return `route-${raw.slice(5).toLowerCase()}`;
  }
  if (raw.endsWith("_TOWN") || raw.endsWith("_CITY")) {
    return raw
      .replace(/_TOWN$/, "")
      .replace(/_CITY$/, "")
      .toLowerCase()
      .replace(/_/g, "-");
  }
  return raw.toLowerCase().replace(/_/g, "-");
}

/** MAP_ROUTE102 → Route102 folder name. */
export function mapIdToDir(mapId) {
  const raw = mapId.replace(/^MAP_/, "");
  if (raw.startsWith("ROUTE")) {
    return `Route${raw.slice(5)}`;
  }
  // Outdoor towns/cities/woods: LittlerootTown, PetalburgWoods, RustboroCity
  if (
    raw.endsWith("_TOWN") ||
    raw.endsWith("_CITY") ||
    raw.endsWith("_WOODS") ||
    raw.endsWith("_TUNNEL") ||
    raw === "MT_CHIMNEY" ||
    raw === "SKY_PILLAR_OUTSIDE"
  ) {
    return raw
      .split("_")
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join("");
  }
  const parts = raw.split("_");
  const head = parts[0].charAt(0) + parts[0].slice(1).toLowerCase();
  if (parts.length === 1) return head;
  const tail = parts
    .slice(1)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join("_");
  return `${head}_${tail}`;
}

export function parseAreaMapBounds(cropsSrc) {
  const boundsMatch = cropsSrc.match(/export const AREA_MAP_BOUNDS[^=]*=\s*(\{[\s\S]*?\n\});/);
  if (!boundsMatch) throw new Error("Could not parse AREA_MAP_BOUNDS from mapCrops.ts");
  return Function(`return ${boundsMatch[1]}`)();
}

const AREA_TO_MAP_ID = {
  littleroot: "MAP_LITTLEROOT_TOWN",
  oldale: "MAP_OLDALE_TOWN",
  "route-101": "MAP_ROUTE101",
  "route-102": "MAP_ROUTE102",
  "route-103": "MAP_ROUTE103",
  petalburg: "MAP_PETALBURG_CITY",
  rustboro: "MAP_RUSTBORO_CITY",
  dewford: "MAP_DEWFORD_TOWN",
  slateport: "MAP_SLATEPORT_CITY",
  mauville: "MAP_MAUVILLE_CITY",
  "route-110": "MAP_ROUTE110",
  "route-104": "MAP_ROUTE104",
  "route-116": "MAP_ROUTE116",
  "route-117": "MAP_ROUTE117",
  "route-118": "MAP_ROUTE118",
  "route-119": "MAP_ROUTE119",
  "route-120": "MAP_ROUTE120",
  fortree: "MAP_FORTREE_CITY",
  lilycove: "MAP_LILYCOVE_CITY",
  mossdeep: "MAP_MOSSDEEP_CITY",
  pacifidlog: "MAP_PACIFIDLOG_TOWN",
  "ever-grande": "MAP_EVER_GRANDE_CITY",
  lavaridge: "MAP_LAVARIDGE_TOWN",
  fallarbor: "MAP_FALLARBOR_TOWN",
  "route-113": "MAP_ROUTE113",
  "route-111": "MAP_ROUTE111",
  "route-112": "MAP_ROUTE112",
  "route-105": "MAP_ROUTE105",
  "route-106": "MAP_ROUTE106",
  "route-107": "MAP_ROUTE107",
  "route-108": "MAP_ROUTE108",
  "route-109": "MAP_ROUTE109",
  "route-121": "MAP_ROUTE121",
  "route-122": "MAP_ROUTE122",
  "route-123": "MAP_ROUTE123",
  "route-124": "MAP_ROUTE124",
  "route-125": "MAP_ROUTE125",
  "route-126": "MAP_ROUTE126",
  "route-127": "MAP_ROUTE127",
  "route-128": "MAP_ROUTE128",
  "route-129": "MAP_ROUTE129",
  "route-130": "MAP_ROUTE130",
  "route-131": "MAP_ROUTE131",
  "route-132": "MAP_ROUTE132",
  "route-133": "MAP_ROUTE133",
  "route-134": "MAP_ROUTE134",
  "route-115": "MAP_ROUTE115",
  "route-114": "MAP_ROUTE114",
  sootopolis: "MAP_SOOTOPOLIS_CITY",
};

/** Build a manifest-shaped object from committed mapCrops.ts when .calib is absent. */
export function buildManifestFromMapCrops(root) {
  const cropsSrc = fs.readFileSync(path.join(root, "src/data/mapCrops.ts"), "utf8");
  const bounds = parseAreaMapBounds(cropsSrc);
  const maps = [];
  for (const [areaId, b] of Object.entries(bounds)) {
    const mapId = AREA_TO_MAP_ID[areaId];
    if (!mapId) continue;
    maps.push({
      id: mapId,
      gx: (b.x / 100) * W_TILES,
      gy: (b.y / 100) * H_TILES,
      w: (b.w / 100) * W_TILES,
      h: (b.h / 100) * H_TILES,
    });
  }
  return { wTiles: W_TILES, hTiles: H_TILES, minX: 0, minY: 0, maps };
}

export function loadManifest(root) {
  const manifestPath = path.join(root, ".calib/manifest.json");
  if (fs.existsSync(manifestPath)) {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }
  return buildManifestFromMapCrops(root);
}

export function feetMapPct(gx, gy, tx, ty, wTiles = W_TILES, hTiles = H_TILES) {
  return {
    x: +(((gx + tx + 0.5) / wTiles) * 100).toFixed(2),
    y: +(((gy + ty + 1) / hTiles) * 100).toFixed(2),
  };
}

export function tileDistance(ax, ay, bx, by) {
  const dx = (ax - bx) / (100 / W_TILES);
  const dy = (ay - by) / (100 / H_TILES);
  return Math.hypot(dx, dy);
}
