/**
 * Audit marker-tiles.json against pret/pokeemerald map.json.
 * Run: node scripts/audit-walkthrough-markers.mjs
 */
import fs from "fs";
import path from "path";
import https from "https";

const ROOT = path.resolve(import.meta.dirname, "..");
const TILES = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/marker-tiles.json"), "utf8"));
const BASE = "https://raw.githubusercontent.com/pret/pokeemerald/master/data/maps";

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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function nearest(tile, points) {
  if (!points.length) return null;
  let best = points[0];
  let bestD = dist(tile, best);
  for (const p of points.slice(1)) {
    const d = dist(tile, p);
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }
  return { tile: best, dist: bestD };
}

function warpLabel(w) {
  return `${w.dest_map}#${w.dest_warp_id} @(${w.x},${w.y})`;
}

function parseMap(m) {
  const warps = m.warp_events ?? [];
  const trainers = (m.object_events ?? []).filter(
    (o) => o.trainer_type && o.trainer_type !== "TRAINER_TYPE_NONE",
  );
  const items = (m.object_events ?? []).filter((o) => o.graphics_id === "OBJ_EVENT_GFX_ITEM_BALL");
  const berries = (m.object_events ?? []).filter((o) => o.graphics_id === "OBJ_EVENT_GFX_BERRY_TREE");
  const boats = (m.object_events ?? []).filter((o) => o.graphics_id === "OBJ_EVENT_GFX_MR_BRINEYS_BOAT");
  const hidden = (m.bg_events ?? []).filter((b) => b.type === "hidden_item");
  const signs = (m.bg_events ?? []).filter((b) => b.type === "sign");
  const npcs = (m.object_events ?? []).filter(
    (o) => o.trainer_type === "TRAINER_TYPE_NONE" && o.graphics_id !== "OBJ_EVENT_GFX_ITEM_BALL",
  );
  return { warps, trainers, items, berries, boats, hidden, signs, npcs };
}

/** Expected entity hints per marker id (partial match on dest_map or script) */
function checkMarker(areaId, markerId, tile, data) {
  const issues = [];
  const id = markerId.toLowerCase();

  // Exit / warp markers — should be near a warp (skip route-to-route connection exits)
  const isRouteConnection =
    /-r\d+$/.test(id) ||
    /^r\d+-/.test(id) ||
    /-route\d+$/i.test(id) ||
    id.endsWith("-north") ||
    id.endsWith("-south") ||
    id.endsWith("-east") ||
    id.endsWith("-west");

  const skipWarpExitCheck =
    id === "pet-woods" ||
    id.includes("dock") ||
    (id.includes("surf") && !id.includes("grass") && areaId === "pacifidlog");

  if (
    !isRouteConnection &&
    !skipWarpExitCheck &&
    (id.includes("exit") ||
      id.includes("-r10") ||
      id.includes("route") ||
      id.endsWith("-north") ||
      id.endsWith("-south") ||
      id.includes("harbor") ||
      id.includes("woods") ||
      id.includes("tunnel") ||
      id.includes("cave") ||
      id.includes("entrance") ||
      id.includes("league") ||
      id.includes("vr") ||
      (id.includes("surf") && !id.includes("grass")))
  ) {
    const w = nearest(tile, data.warps.map((x) => [x.x, x.y]));
    if (w && w.dist > 3) {
      issues.push(`far from nearest warp ${warpLabel(data.warps.find((x) => x.x === w.tile[0] && x.y === w.tile[1]))} (d=${w.dist.toFixed(1)})`);
    }
  }

  if (id.includes("dock")) {
    const boatTiles = [
      ...data.boats.map((x) => [x.x, x.y]),
      ...data.npcs
        .filter((o) => o.graphics_id === "OBJ_EVENT_GFX_EXPERT_M")
        .map((x) => [x.x, x.y]),
    ];
    const b = nearest(tile, boatTiles);
    if (b && b.dist > 2) {
      issues.push(`far from Briney boat/NPC (d=${b.dist.toFixed(1)})`);
    } else if (!boatTiles.length) {
      issues.push("no Briney boat on map");
    }
  }

  if (id.includes("grunt") || id.includes("calvin") || id.includes("tiana") || id.includes("rival") || id.includes("maxie") || id.includes("winstrate")) {
    const t = nearest(tile, data.trainers.map((x) => [x.x, x.y]));
    const n = nearest(tile, data.npcs.map((x) => [x.x, x.y]));
    const best = t && n ? (t.dist <= n.dist ? { kind: "trainer", ...t } : { kind: "npc", ...n }) : t ? { kind: "trainer", ...t } : n ? { kind: "npc", ...n } : null;
    if (best && best.dist > 2) {
      issues.push(`far from nearest trainer/npc (d=${best.dist.toFixed(1)})`);
    } else if (!best) {
      issues.push("no trainers/npcs on map");
    }
  }

  if (id.includes("item") || id.includes("berry") || id.includes("hp") || (id.includes("meteor") && areaId !== "fallarbor") || (id.includes("secret") && areaId === "slateport")) {
    const all = [
      ...data.items.map((x) => [x.x, x.y]),
      ...data.berries.map((x) => [x.x, x.y]),
      ...data.hidden.map((x) => [x.x, x.y]),
      ...data.npcs.map((x) => [x.x, x.y]),
    ];
    const n = nearest(tile, all);
    if (n && n.dist > 2) {
      issues.push(`far from nearest item/npc (d=${n.dist.toFixed(1)})`);
    }
  }

  if (id.includes("springs")) {
    const springsNpcs = data.npcs.filter((o) => o.graphics_id?.includes("HOT_SPRINGS"));
    const n = nearest(tile, springsNpcs.map((x) => [x.x, x.y]));
    if (n && n.dist > 2) {
      issues.push(`far from hot springs NPC (d=${n.dist.toFixed(1)})`);
    }
  }

  // Gym / building / mart / center — near interior warp
  if (
    id.includes("gym") ||
    id.includes("mart") ||
    id.includes("center") ||
    id.includes("pc") ||
    id.includes("museum") ||
    id.includes("devon") ||
    id.includes("school") ||
    id.includes("contest") ||
    id.includes("stern") ||
    id.includes("game") ||
    id.includes("bike") ||
    id.includes("space") ||
    id.includes("dept") ||
    id.includes("daycare") ||
    id.includes("lab") ||
    id.includes("house") ||
    id.includes("wally") ||
    (id.includes("meteor") && areaId === "fallarbor")
  ) {
    const interior = data.warps.filter((w) => w.dest_map && !w.dest_map.includes("ROUTE") && !w.dest_map.includes("MAP_PETALBURG_WOODS"));
    const w = nearest(tile, interior.map((x) => [x.x, x.y]));
    if (w && w.dist > 4) {
      const match = data.warps.find((x) => x.x === w.tile[0] && x.y === w.tile[1]);
      issues.push(`far from nearest building warp ${match ? warpLabel(match) : w.tile} (d=${w.dist.toFixed(1)})`);
    }
  }

  return issues;
}

async function main() {
  const problems = [];

  for (const [areaId, markers] of Object.entries(TILES)) {
    if (areaId.startsWith("_")) continue;
    const mapName = MAP_NAME[areaId];
    if (!mapName) {
      problems.push({ areaId, markerId: "*", issue: "no MAP_NAME mapping" });
      continue;
    }

    let m;
    try {
      m = await fetchJson(`${BASE}/${mapName}/map.json`);
    } catch (e) {
      problems.push({ areaId, markerId: "*", issue: `fetch failed: ${e.message}` });
      continue;
    }

    const data = parseMap(m);
    console.log(`\n=== ${areaId} (${mapName}) ===`);
    console.log(`warps=${data.warps.length} trainers=${data.trainers.length} items=${data.items.length} hidden=${data.hidden.length}`);

    for (const [markerId, tile] of Object.entries(markers)) {
      const issues = checkMarker(areaId, markerId, tile, data);
      const wNear = nearest(tile, data.warps.map((x) => [x.x, x.y]));
      if (issues.length) {
        problems.push({ areaId, markerId, tile, issues });
        console.log(`  ⚠ ${markerId} ${JSON.stringify(tile)}: ${issues.join("; ")}`);
        if (wNear && wNear.dist <= 5) {
          const w = data.warps.find((x) => x.x === wNear.tile[0] && x.y === wNear.tile[1]);
          console.log(`     nearest warp: ${w ? warpLabel(w) : wNear.tile}`);
        }
      }
    }
  }

  const markerProblems = problems.filter((p) => p.markerId !== "*");
  console.log(`\n\n=== SUMMARY: ${markerProblems.length} markers with issues (${problems.length} areas total) ===`);
  for (const p of problems) {
    console.log(`${p.areaId}/${p.markerId}: ${p.tile ? JSON.stringify(p.tile) : ""} — ${p.issues?.join("; ") ?? p.issue}`);
  }
  if (markerProblems.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
