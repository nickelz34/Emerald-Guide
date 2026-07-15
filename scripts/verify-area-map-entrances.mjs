/**
 * Verify AREA_MAP_ENTRANCES against pokeemerald warp_events:
 * coords, dest fields, exit vs connector labeling, letter uniqueness,
 * and reciprocal letter pairing across floors.
 *
 * Skips if .calib/pokeemerald/data/maps is missing (CI without calibration).
 *
 * Usage: node scripts/verify-area-map-entrances.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAPS_DIR = path.join(ROOT, ".calib/pokeemerald/data/maps");
const LAYOUTS = path.join(ROOT, ".calib/pokeemerald/data/layouts/layouts.json");
const AREA_MAPS_TS = path.join(ROOT, "src/data/areaMaps.ts");
const ENTRANCES_TS = path.join(ROOT, "src/data/areaMapEntrancesGenerated.ts");
const STEP_AREA_MAPS_TS = path.join(ROOT, "src/data/stepAreaMaps.ts");

if (!fs.existsSync(MAPS_DIR) || !fs.existsSync(LAYOUTS)) {
  console.log("Skipping area-map entrance verify (no .calib/pokeemerald) — static data only.");
  process.exit(0);
}

const layoutsJson = JSON.parse(fs.readFileSync(LAYOUTS, "utf8"));
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l?.id) layoutById.set(l.id, l);

const byMapId = new Map();
for (const dir of fs.readdirSync(MAPS_DIR)) {
  const mjPath = path.join(MAPS_DIR, dir, "map.json");
  if (!fs.existsSync(mjPath)) continue;
  const m = JSON.parse(fs.readFileSync(mjPath, "utf8"));
  const layout = layoutById.get(m.layout);
  if (!layout) continue;
  byMapId.set(m.id, { dir, map: m, layout, folder: dir });
}

const DUNGEON_RE =
  /Cave|Tunnel|Falls|Pyre|Hideout|Woods|VictoryRoad|AbandonedShip|Seafloor|Shoal|FieryPath|Scorched|Artisan|DesertUnderpass|NewMauville|Underwater|JaggedPass|SafariZone|IslandCave|MirageTower|SkyPillar|CaveOfOrigin|MarineCave|TerraCave|AncientTomb|NavelRock|BirthIsland|SouthernIsland|FarawayIsland|TrainerHill|AlteringCave|Gym/i;

function complexKey(folder) {
  const gym = /^(.*?_Gym)/.exec(folder || "");
  if (gym) return gym[1];
  const i = (folder || "").indexOf("_");
  return i < 0 ? folder : folder.slice(0, i);
}

const PETALBURG_GYM_MAP = "MAP_PETALBURG_CITY_GYM";
const PETALBURG_GYM_ROOM_H = 8;
const PETALBURG_GYM_ROOMS = [
  { id: "petalburgcity-gym-norman", tile0: 0 },
  { id: "petalburgcity-gym-jody", tile0: 13 },
  { id: "petalburgcity-gym-berke", tile0: 26 },
  { id: "petalburgcity-gym-parker", tile0: 39 },
  { id: "petalburgcity-gym-alexia", tile0: 52 },
  { id: "petalburgcity-gym-george", tile0: 65 },
  { id: "petalburgcity-gym-randall", tile0: 78 },
  { id: "petalburgcity-gym-mary", tile0: 91 },
  { id: "petalburgcity-gym-entrance", tile0: 104 },
];
const PETALBURG_GYM_ROOM_IDS = new Set(PETALBURG_GYM_ROOMS.map((r) => r.id));
const petalburgRoomById = new Map(PETALBURG_GYM_ROOMS.map((r) => [r.id, r]));

function petalburgRoomForY(y) {
  return PETALBURG_GYM_ROOMS.find((r) => y >= r.tile0 && y < r.tile0 + PETALBURG_GYM_ROOM_H) || null;
}

function toLocalX(tileX, tilesW) {
  return +(((tileX + 0.5) / tilesW) * 100).toFixed(2);
}
function toLocalY(tileY, tilesH) {
  return +(((tileY + 0.5) / tilesH) * 100).toFixed(2);
}

function parseAreaMaps(src) {
  const areas = [];
  const re =
    /\{\s*(?:\/\/[^\n]*\n\s*)*id:\s*"([^"]+)",\s*(?:\/\/[^\n]*\n\s*)*mapId:\s*"(MAP_[^"]+)",[\s\S]*?width:\s*(\d+),\s*height:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src))) {
    areas.push({ id: m[1], mapId: m[2], width: +m[3], height: +m[4] });
  }
  return areas;
}

function parseEntrances(src) {
  const areas = {};
  let cur = null;
  for (const line of src.split("\n")) {
    const am = line.match(/^  "([^"]+)": \[$/);
    if (am) {
      cur = am[1];
      areas[cur] = [];
      continue;
    }
    const mk = line.match(
      /\{ id: "([^"]+)", name: ("(?:\\.|[^"\\])*"), category: "entrance", x: ([0-9.]+), y: ([0-9.]+), desc: ("(?:\\.|[^"\\])*")(?:, code: "([^"]+)")?, destMap: "([^"]+)", destWarpId: "([^"]+)" \}/,
    );
    if (mk && cur) {
      areas[cur].push({
        id: mk[1],
        name: JSON.parse(mk[2]),
        x: +mk[3],
        y: +mk[4],
        desc: JSON.parse(mk[5]),
        code: mk[6] || "",
        destMap: mk[7],
        destWarpId: mk[8],
      });
    }
  }
  return areas;
}

const areas = parseAreaMaps(fs.readFileSync(AREA_MAPS_TS, "utf8"));
const entrances = parseEntrances(fs.readFileSync(ENTRANCES_TS, "utf8"));
const areaById = new Map(areas.map((a) => [a.id, a]));
const areaIdByMapId = new Map();
for (const a of areas) {
  const info = byMapId.get(a.mapId);
  if (!info) continue;
  const full = a.width === info.layout.width * 16 && a.height === info.layout.height * 16;
  if (!areaIdByMapId.has(a.mapId) || full) areaIdByMapId.set(a.mapId, a.id);
}

const errors = [];
let markersChecked = 0;
let reciprocalOk = 0;
let exitsChecked = 0;

for (const area of areas) {
  const info = byMapId.get(area.mapId);
  if (!info) continue;
  if (!DUNGEON_RE.test(info.folder)) continue;
  // Full Petalburg tower is crop source only; room crops verified separately.
  if (area.id === "petalburgcity-gym" || PETALBURG_GYM_ROOM_IDS.has(area.id)) continue;
  if (area.width !== info.layout.width * 16 || area.height !== info.layout.height * 16) continue;

  const warps = info.map.warp_events || [];
  const expected = warps.filter(
    (w) => w.dest_map && w.dest_map !== "MAP_NONE" && w.dest_map !== "MAP_DYNAMIC",
  );
  const got = entrances[area.id] || [];
  if (expected.length && got.length !== expected.length) {
    errors.push(
      `${area.id}: warp count ${expected.length} vs markers ${got.length}`,
    );
  }

  let mi = 0;
  for (let wi = 0; wi < warps.length; wi++) {
    const w = warps[wi];
    if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") continue;
    const mk = got[mi++];
    if (!mk) {
      errors.push(`${area.id}: missing marker for warp[${wi}]`);
      continue;
    }
    markersChecked++;

    if (mk.destMap !== w.dest_map) {
      errors.push(`${area.id} ${mk.id}: destMap ${mk.destMap} != ${w.dest_map}`);
    }
    if (mk.destWarpId !== String(w.dest_warp_id)) {
      errors.push(`${area.id} ${mk.id}: destWarpId ${mk.destWarpId} != ${w.dest_warp_id}`);
    }

    const ex = toLocalX(w.x, info.layout.width);
    const ey = toLocalY(w.y, info.layout.height);
    const sameTile = warps.filter((x) => x.x === w.x && x.y === w.y);
    const maxSpread = sameTile.length > 1 ? 2.5 * sameTile.length : 0.01;
    if (Math.abs(mk.x - ex) > maxSpread + 0.05 || Math.abs(mk.y - ey) > 0.05) {
      errors.push(
        `${area.id} ${mk.id}: coords (${mk.x},${mk.y}) != warp (${ex},${ey})`,
      );
    }

    const destInfo = byMapId.get(w.dest_map);
    const isExit = !destInfo || complexKey(info.folder) !== complexKey(destInfo.folder);

    if (isExit) {
      exitsChecked++;
      if (mk.code) errors.push(`${area.id} ${mk.id}: exit has code ${mk.code}`);
      if (!/^Exit to /.test(mk.name)) {
        errors.push(`${area.id} ${mk.id}: expected Exit label, got "${mk.name}"`);
      }
      continue;
    }

    const destIdx = Number(w.dest_warp_id);
    const back = destInfo.map.warp_events?.[destIdx];
    const reciprocal =
      back && back.dest_map === area.mapId && Number(back.dest_warp_id) === wi;

    if (reciprocal) {
      const destAreaId = areaIdByMapId.get(w.dest_map);
      const destMarks = destAreaId ? entrances[destAreaId] : null;
      if (!destMarks) continue;

      let dSeen = 0;
      let destMk = null;
      const dWarps = destInfo.map.warp_events || [];
      for (let di = 0; di < dWarps.length; di++) {
        const dw = dWarps[di];
        if (!dw.dest_map || dw.dest_map === "MAP_NONE" || dw.dest_map === "MAP_DYNAMIC") continue;
        if (di === destIdx) {
          destMk = destMarks[dSeen];
          break;
        }
        dSeen++;
      }
      if (!destMk) {
        errors.push(
          `${area.id} ${mk.id}: reciprocal dest warp missing marker on ${destAreaId}`,
        );
        continue;
      }
      if (mk.code !== destMk.code) {
        errors.push(
          `${area.id} "${mk.name}" (${mk.code || "∅"}) != ${destAreaId} "${destMk.name}" (${destMk.code || "∅"})`,
        );
      } else if (mk.code) {
        reciprocalOk++;
      }
      if (mk.code && !/Matches /.test(mk.desc)) {
        errors.push(`${area.id} ${mk.id}: reciprocal missing Matches in desc`);
      }
    } else if (mk.code && /Matches /.test(mk.desc)) {
      errors.push(`${area.id} ${mk.id}: non-reciprocal claims Matches`);
    }
  }
}

// Petalburg Gym room crops — warps remapped into each challenge-room image.
{
  const info = byMapId.get(PETALBURG_GYM_MAP);
  if (info) {
    const warps = info.map.warp_events || [];
    const tilesW = info.layout.width;
    for (const room of PETALBURG_GYM_ROOMS) {
      const roomWarps = [];
      warps.forEach((w, wi) => {
        if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") return;
        if (w.y < room.tile0 || w.y >= room.tile0 + PETALBURG_GYM_ROOM_H) return;
        roomWarps.push({ w, wi });
      });
      const got = entrances[room.id] || [];
      if (got.length !== roomWarps.length) {
        errors.push(
          `${room.id}: warp count ${roomWarps.length} vs markers ${got.length}`,
        );
      }
      let mi = 0;
      for (const { w, wi } of roomWarps) {
        const mk = got[mi++];
        if (!mk) {
          errors.push(`${room.id}: missing marker for warp[${wi}]`);
          continue;
        }
        markersChecked++;
        if (mk.destMap !== w.dest_map) {
          errors.push(`${room.id} ${mk.id}: destMap ${mk.destMap} != ${w.dest_map}`);
        }
        if (mk.destWarpId !== String(w.dest_warp_id)) {
          errors.push(`${room.id} ${mk.id}: destWarpId ${mk.destWarpId} != ${w.dest_warp_id}`);
        }
        const ex = toLocalX(w.x, tilesW);
        const ey = +(((w.y - room.tile0 + 0.5) / PETALBURG_GYM_ROOM_H) * 100).toFixed(2);
        const sameTile = roomWarps.filter((x) => x.w.x === w.x && x.w.y === w.y);
        const maxSpread = sameTile.length > 1 ? 2.5 * sameTile.length : 0.01;
        if (Math.abs(mk.x - ex) > maxSpread + 0.05 || Math.abs(mk.y - ey) > 0.05) {
          errors.push(`${room.id} ${mk.id}: coords (${mk.x},${mk.y}) != warp (${ex},${ey})`);
        }

        const destInfo = byMapId.get(w.dest_map);
        const isExit = !destInfo || complexKey(info.folder) !== complexKey(destInfo.folder);
        if (isExit) {
          exitsChecked++;
          if (mk.code) errors.push(`${room.id} ${mk.id}: exit has code ${mk.code}`);
          if (!/^Exit to /.test(mk.name)) {
            errors.push(`${room.id} ${mk.id}: expected Exit label, got "${mk.name}"`);
          }
          continue;
        }

        // Internal doors stay on the same map — look up the dest room crop.
        const destWarp = warps[Number(w.dest_warp_id)];
        const destRoom = destWarp ? petalburgRoomForY(destWarp.y) : null;
        const back = destWarp;
        const reciprocal =
          back && back.dest_map === PETALBURG_GYM_MAP && Number(back.dest_warp_id) === wi;
        if (reciprocal && destRoom) {
          const destMarks = entrances[destRoom.id] || [];
          let dSeen = 0;
          let destMk = null;
          for (let di = 0; di < warps.length; di++) {
            const dw = warps[di];
            if (!dw.dest_map || dw.dest_map === "MAP_NONE" || dw.dest_map === "MAP_DYNAMIC") continue;
            if (dw.y < destRoom.tile0 || dw.y >= destRoom.tile0 + PETALBURG_GYM_ROOM_H) continue;
            if (di === Number(w.dest_warp_id)) {
              destMk = destMarks[dSeen];
              break;
            }
            dSeen++;
          }
          if (!destMk) {
            errors.push(
              `${room.id} ${mk.id}: reciprocal dest warp missing marker on ${destRoom.id}`,
            );
          } else if (mk.code !== destMk.code) {
            errors.push(
              `${room.id} "${mk.name}" (${mk.code || "∅"}) != ${destRoom.id} "${destMk.name}" (${destMk.code || "∅"})`,
            );
          } else if (mk.code) {
            reciprocalOk++;
          }
          if (mk.code && !/Matches /.test(mk.desc)) {
            errors.push(`${room.id} ${mk.id}: reciprocal missing Matches in desc`);
          }
        } else if (mk.code && /Matches /.test(mk.desc)) {
          errors.push(`${room.id} ${mk.id}: non-reciprocal claims Matches`);
        }
      }
    }
  }
}

// Letter uniqueness: unrelated edges must not share a code on one map.
for (const [areaId, marks] of Object.entries(entrances)) {
  if (PETALBURG_GYM_ROOM_IDS.has(areaId) || areaId === "petalburgcity-gym") continue;
  const area = areaById.get(areaId);
  if (!area) continue;
  const info = byMapId.get(area.mapId);
  if (!info) continue;
  const warps = info.map.warp_events || [];
  const byCode = new Map();
  let mi = 0;
  for (let wi = 0; wi < warps.length; wi++) {
    const w = warps[wi];
    if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") continue;
    const mk = marks[mi++];
    if (!mk?.code) continue;
    const a = `${area.mapId}#${wi}`;
    const b = `${w.dest_map}#${Number(w.dest_warp_id)}`;
    const edge = a < b ? `${a}||${b}` : `${b}||${a}`;
    if (!byCode.has(mk.code)) byCode.set(mk.code, { edges: new Set(), names: [] });
    byCode.get(mk.code).edges.add(edge);
    byCode.get(mk.code).names.push(mk.name);
  }
  for (const [code, { edges, names }] of byCode) {
    if (edges.size <= 1) continue;
    const ends = [...edges].flatMap((e) => e.split("||"));
    const counts = ends.reduce((m, e) => ((m[e] = (m[e] || 0) + 1), m), {});
    const shared = Object.values(counts).some((c) => c === edges.size);
    if (!shared) {
      errors.push(
        `${areaId}: letter ${code} used on unrelated connectors — ${names.join(" | ")}`,
      );
    }
  }
}

// Petalburg room letter uniqueness (per room crop).
for (const room of PETALBURG_GYM_ROOMS) {
  const marks = entrances[room.id] || [];
  const info = byMapId.get(PETALBURG_GYM_MAP);
  if (!info) continue;
  const warps = info.map.warp_events || [];
  const byCode = new Map();
  let mi = 0;
  warps.forEach((w, wi) => {
    if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") return;
    if (w.y < room.tile0 || w.y >= room.tile0 + PETALBURG_GYM_ROOM_H) return;
    const mk = marks[mi++];
    if (!mk?.code) return;
    const a = `${PETALBURG_GYM_MAP}#${wi}`;
    const b = `${w.dest_map}#${Number(w.dest_warp_id)}`;
    const edge = a < b ? `${a}||${b}` : `${b}||${a}`;
    if (!byCode.has(mk.code)) byCode.set(mk.code, { edges: new Set(), names: [] });
    byCode.get(mk.code).edges.add(edge);
    byCode.get(mk.code).names.push(mk.name);
  });
  for (const [code, { edges, names }] of byCode) {
    if (edges.size <= 1) continue;
    const ends = [...edges].flatMap((e) => e.split("||"));
    const counts = ends.reduce((m, e) => ((m[e] = (m[e] || 0) + 1), m), {});
    const shared = Object.values(counts).some((c) => c === edges.size);
    if (!shared) {
      errors.push(
        `${room.id}: letter ${code} used on unrelated connectors — ${names.join(" | ")}`,
      );
    }
  }
}

// Walkthrough-referenced full dungeon maps with warps must have markers.
if (fs.existsSync(STEP_AREA_MAPS_TS)) {
  const stepSrc = fs.readFileSync(STEP_AREA_MAPS_TS, "utf8");
  const used = new Set([...stepSrc.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
  for (const id of used) {
    const area = areaById.get(id);
    if (!area) continue;
    const info = byMapId.get(area.mapId);
    if (!info || !DUNGEON_RE.test(info.folder)) continue;
    if (PETALBURG_GYM_ROOM_IDS.has(id)) {
      const room = petalburgRoomById.get(id);
      const warps = (info.map.warp_events || []).filter(
        (w) =>
          w.dest_map &&
          w.dest_map !== "MAP_NONE" &&
          w.dest_map !== "MAP_DYNAMIC" &&
          w.y >= room.tile0 &&
          w.y < room.tile0 + PETALBURG_GYM_ROOM_H,
      );
      const n = entrances[id]?.length || 0;
      if (warps.length && n !== warps.length) {
        errors.push(`walkthrough map ${id}: expected ${warps.length} entrances, got ${n}`);
      }
      continue;
    }
    if (area.width !== info.layout.width * 16 || area.height !== info.layout.height * 16) continue;
    const warps = (info.map.warp_events || []).filter(
      (w) => w.dest_map && w.dest_map !== "MAP_NONE" && w.dest_map !== "MAP_DYNAMIC",
    );
    if (!warps.length) continue;
    const n = entrances[id]?.length || 0;
    if (n !== warps.length) {
      errors.push(
        `walkthrough map ${id}: expected ${warps.length} entrances, got ${n}`,
      );
    }
  }
}

if (errors.length) {
  console.error("Area-map entrance verify FAILED:");
  for (const e of errors) console.error(" ✗", e);
  process.exit(1);
}

console.log(
  `OK — ${markersChecked} markers, ${reciprocalOk} reciprocal pairs, ${exitsChecked} exits checked.`,
);
