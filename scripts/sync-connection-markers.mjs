/**
 * Sync walkthrough route-exit marker tiles from pokeemerald map connections.
 * Updates scripts/marker-tiles.json, then run:
 *   node scripts/apply-marker-calibration.mjs
 *   node scripts/gen-map-crops.mjs
 *
 * Run: node scripts/sync-connection-markers.mjs [--write]
 */
import fs from "fs";
import path from "path";
import https from "https";

const ROOT = path.resolve(import.meta.dirname, "..");
const TILES_PATH = path.join(ROOT, "scripts/marker-tiles.json");
const WRITE = process.argv.includes("--write");
const BASE = "https://raw.githubusercontent.com/pret/pokeemerald/master/data/maps";
const LAYOUTS_URL =
  "https://raw.githubusercontent.com/pret/pokeemerald/master/data/layouts/layouts.json";

/** areaId → pokeemerald map folder name */
const MAP_NAME = {
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

/** Marker slug fragment → pokeemerald MAP_* id */
const SLUG_TO_MAP = {
  littleroot: "MAP_LITTLEROOT_TOWN",
  oldale: "MAP_OLDALE_TOWN",
  petalburg: "MAP_PETALBURG_CITY",
  rustboro: "MAP_RUSTBORO_CITY",
  dewford: "MAP_DEWFORD_TOWN",
  slateport: "MAP_SLATEPORT_CITY",
  mauville: "MAP_MAUVILLE_CITY",
  lavaridge: "MAP_LAVARIDGE_TOWN",
  fallarbor: "MAP_FALLARBOR_TOWN",
  fortree: "MAP_FORTREE_CITY",
  mossdeep: "MAP_MOSSDEEP_CITY",
  sootopolis: "MAP_SOOTOPOLIS_CITY",
  lilycove: "MAP_LILYCOVE_CITY",
  pacifidlog: "MAP_PACIFIDLOG_TOWN",
  "ever-grande": "MAP_EVER_GRANDE_CITY",
  woods: "MAP_PETALBURG_WOODS",
  tunnel: "MAP_RUSTURF_TUNNEL",
  harbor: "MAP_SLATEPORT_CITY_HARBOR",
  dock: "MAP_DEWFORD_TOWN_HARBOR",
};

/** Explicit marker → target map when id/label heuristics are ambiguous */
const MARKER_TARGET = {
  "route-120": { "r120-north": "MAP_FORTREE_CITY", "r120-south": "MAP_ROUTE121" },
  "route-119": { "r119-north": "MAP_FORTREE_CITY", "r119-south": "MAP_ROUTE118" },
  "route-111": { "r111-north": "MAP_ROUTE113", "r111-south": "MAP_MAUVILLE_CITY" },
  petalburg: { "pet-woods": "MAP_PETALBURG_WOODS" },
  slateport: { "sl-north": "MAP_ROUTE110", "sl-south": "MAP_ROUTE109", "sl-harbor": "MAP_SLATEPORT_CITY_HARBOR" },
  rustboro: { "rust-r104": "MAP_ROUTE104", "rust-r116": "MAP_ROUTE116" },
  mauville: { "mau-r110": "MAP_ROUTE110", "mau-r117": "MAP_ROUTE117", "mau-r118": "MAP_ROUTE118" },
  "route-104": { "r104-rustboro": "MAP_RUSTBORO_CITY", "r104-woods": "MAP_PETALBURG_WOODS" },
  "route-116": { "r116-rustboro": "MAP_RUSTBORO_CITY", "r116-tunnel": "MAP_RUSTURF_TUNNEL" },
  fallarbor: { "fall-r113": "MAP_ROUTE113" },
  "route-113": { "r113-fallarbor": "MAP_FALLARBOR_TOWN", "r113-east": "MAP_ROUTE123" },
  "route-117": { "r117-mauville": "MAP_MAUVILLE_CITY" },
  "route-118": { "r118-mauville": "MAP_MAUVILLE_CITY" },
  "route-110": { "r110-north": "MAP_MAUVILLE_CITY", "r110-south": "MAP_SLATEPORT_CITY" },
};

/** Markers that are warps/NPCs/items — never auto-sync from connections */
const SKIP_MARKERS = new Set([
  "r104-berry",
  "r104-surf",
  "dew-dock",
  "lav-springs",
  "fall-meteor",
  "pac-surf",
  "r105-surf",
  "pw-exit-n",
  "pw-exit-sw",
  "pw-exit-se",
]);

function mapIdToFolderCandidates(mapId) {
  const parts = mapId.replace(/^MAP_/, "").split("_");
  const compact = parts.map((p) => p.charAt(0) + p.slice(1).toLowerCase()).join("");
  const underscored = parts.map((p) => p.charAt(0) + p.slice(1).toLowerCase()).join("_");
  return [...new Set([compact, underscored])];
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString();
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function connectionExitTile(mapW, mapH, direction, offset, otherW, otherH) {
  const off = Number(offset) || 0;
  const overlapW = Math.min(mapW, otherW);
  const overlapH = Math.min(mapH, otherH);
  switch (direction) {
    case "up":
      return [
        Math.max(0, Math.floor((mapW - otherW) / 2) + off) + Math.floor(overlapW / 2),
        0,
      ];
    case "down":
      return [
        Math.max(0, Math.floor((mapW - otherW) / 2) + off) + Math.floor(overlapW / 2),
        mapH - 1,
      ];
    case "left":
      return [
        0,
        Math.max(0, Math.floor((mapH - otherH) / 2) + off) + Math.floor(overlapH / 2),
      ];
    case "right":
      return [
        mapW - 1,
        Math.max(0, Math.floor((mapH - otherH) / 2) + off) + Math.floor(overlapH / 2),
      ];
    default:
      return null;
  }
}

function routeNumToMap(n) {
  return `MAP_ROUTE${n}`;
}

function inferTargetMap(areaId, markerId) {
  if (MARKER_TARGET[areaId]?.[markerId]) return MARKER_TARGET[areaId][markerId];

  let m = markerId.match(/-r(\d+)$/);
  if (m) return routeNumToMap(m[1]);

  m = markerId.match(/^r(\d+)-(.+)$/);
  if (m) {
    const slug = m[2];
    if (SLUG_TO_MAP[slug]) return SLUG_TO_MAP[slug];
    if (slug.startsWith("r") && /^\d+$/.test(slug.slice(1))) return routeNumToMap(slug.slice(1));
  }

  m = markerId.match(/-route(\d+)$/i);
  if (m) return routeNumToMap(m[1]);

  if (markerId.endsWith("-north")) return { direction: "up" };
  if (markerId.endsWith("-south")) return { direction: "down" };
  if (markerId.endsWith("-east")) return { direction: "right" };
  if (markerId.endsWith("-west")) return { direction: "left" };

  return null;
}

async function main() {
  const tiles = JSON.parse(fs.readFileSync(TILES_PATH, "utf8"));
  const layouts = await fetchJson(LAYOUTS_URL);
  const layoutById = new Map(layouts.layouts.map((l) => [l.id, l]));

  const mapCache = new Map();
  async function loadMap(folderOrId) {
    const key = folderOrId;
    if (mapCache.has(key)) return mapCache.get(key);

    const candidates = folderOrId.startsWith("MAP_")
      ? mapIdToFolderCandidates(folderOrId)
      : [folderOrId];

    let lastErr;
    for (const folder of candidates) {
      try {
        const m = await fetchJson(`${BASE}/${folder}/map.json`);
        const lay = layoutById.get(m.layout);
        const data = { ...m, w: lay?.width ?? 20, h: lay?.height ?? 20, folder };
        mapCache.set(key, data);
        mapCache.set(folder, data);
        mapCache.set(m.id, data);
        return data;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr ?? new Error(`Could not load map ${folderOrId}`);
  }

  const changes = [];

  for (const [areaId, markers] of Object.entries(tiles)) {
    if (areaId.startsWith("_")) continue;
    const folder = MAP_NAME[areaId];
    if (!folder) continue;

    const map = await loadMap(folder);

    for (const [markerId, oldTile] of Object.entries(markers)) {
      if (SKIP_MARKERS.has(markerId)) continue;

      const target = inferTargetMap(areaId, markerId);
      if (!target) continue;

      let conn;
      if (typeof target === "string") {
        conn = (map.connections ?? []).find((c) => c.map === target);
      } else if (target.direction) {
        const matches = (map.connections ?? []).filter((c) => c.direction === target.direction);
        conn = matches.length === 1 ? matches[0] : null;
      }

      if (!conn) continue;

      const otherMap = await loadMap(conn.map);
      const newTile = connectionExitTile(map.w, map.h, conn.direction, conn.offset, otherMap.w, otherMap.h);
      if (!newTile) continue;

      const same = oldTile[0] === newTile[0] && oldTile[1] === newTile[1];
      if (!same) {
        changes.push({ areaId, markerId, oldTile, newTile, conn: conn.map, direction: conn.direction });
        markers[markerId] = newTile;
      }
    }
  }

  console.log(`Found ${changes.length} connection marker updates:\n`);
  for (const c of changes) {
    console.log(
      `  ${c.areaId}/${c.markerId}: [${c.oldTile}] → [${c.newTile}] (${c.direction} → ${c.conn})`,
    );
  }

  if (changes.length && WRITE) {
    fs.writeFileSync(TILES_PATH, `${JSON.stringify(tiles, null, 2)}\n`);
    console.log(`\nWrote ${TILES_PATH}`);
  } else if (changes.length) {
    console.log("\nDry run — pass --write to apply");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
