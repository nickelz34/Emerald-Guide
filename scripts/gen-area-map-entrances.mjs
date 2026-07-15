/**
 * Generate entrance / exit / ladder markers for cave & dungeon area maps from
 * pokeemerald warp_events, with destination labels (e.g. "Ladder to B1F",
 * "Exit to Route 106").
 *
 * Emits src/data/areaMapEntrancesGenerated.ts keyed by AREA_MAPS id.
 * AreaMapView merges these onto the interactive map at runtime.
 *
 * Usage: node scripts/gen-area-map-entrances.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const OUT = path.join(ROOT, "src/data/areaMapEntrancesGenerated.ts");

if (!fs.existsSync(MAPS_DIR)) {
  console.error("Missing .calib/pokeemerald/data/maps — clone pret/pokeemerald first.");
  process.exit(1);
}

const layoutsJson = JSON.parse(
  fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"),
);
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l?.id) layoutById.set(l.id, l);

/** MAP_* id → pokeemerald folder + map.json */
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

function isDungeonFolder(folder) {
  return DUNGEON_RE.test(folder);
}

/**
 * Petalburg Gym is one tall pokeemerald map rendered as per-room crops in AREA_MAPS.
 * Tile Y ranges match scripts/split-petalburg-gym-rooms.mjs.
 */
const PETALBURG_GYM_MAP = "MAP_PETALBURG_CITY_GYM";
const PETALBURG_GYM_ROOM_H = 8;
const PETALBURG_GYM_ROOMS = [
  { id: "petalburgcity-gym-norman", floor: "Norman's room", tile0: 0 },
  { id: "petalburgcity-gym-jody", floor: "Challenge room — Jody", tile0: 13 },
  { id: "petalburgcity-gym-berke", floor: "Challenge room — Berke", tile0: 26 },
  { id: "petalburgcity-gym-parker", floor: "Challenge room — Parker", tile0: 39 },
  { id: "petalburgcity-gym-alexia", floor: "Challenge room — Alexia", tile0: 52 },
  { id: "petalburgcity-gym-george", floor: "Challenge room — George", tile0: 65 },
  { id: "petalburgcity-gym-randall", floor: "Challenge room — Randall", tile0: 78 },
  { id: "petalburgcity-gym-mary", floor: "Challenge room — Mary", tile0: 91 },
  { id: "petalburgcity-gym-entrance", floor: "Entrance", tile0: 104 },
];
const PETALBURG_GYM_ROOM_IDS = new Set(PETALBURG_GYM_ROOMS.map((r) => r.id));

function petalburgRoomForY(y) {
  return PETALBURG_GYM_ROOMS.find((r) => y >= r.tile0 && y < r.tile0 + PETALBURG_GYM_ROOM_H) || null;
}

/** Parse AREA_MAPS entries from the TS source (avoids importing generated TS). */
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

function titleCaseWords(s) {
  return s
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/\bStevens\b/gi, "Steven's")
    .replace(/\bCaptains\b/gi, "Captain's")
    .split(/\s+/)
    .map((w) => {
      if (/^B?\d+F$/i.test(w) || /^\d+R$/i.test(w)) return w.toUpperCase();
      if (/^(TM|HM)\d+$/i.test(w)) return w.toUpperCase();
      if (w.toLowerCase() === "pokémon" || w.toLowerCase() === "pokemon") return "Pokémon";
      if (w.endsWith("'s")) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase().replace(/'s$/, "'s");
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Folder prefix shared by floors of one dungeon (GraniteCave_1F → GraniteCave).
 * Gym interiors keep the Gym segment so PetalburgCity_Gym ≠ PetalburgCity.
 */
function complexKeyFromFolder(folder) {
  const gym = /^(.*?_Gym)/.exec(folder || "");
  if (gym) return gym[1];
  const i = (folder || "").indexOf("_");
  return i < 0 ? folder : folder.slice(0, i);
}

/** MAP_GRANITE_CAVE_B1F → readable parts */
function parseMapConstant(mapId, folderHint = "") {
  const raw = (mapId || "").replace(/^MAP_/, "");
  const parts = raw.split("_").filter(Boolean);
  let floorIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^(B?\d+F|\d+R|Exterior|Summit|Entrance|Inside|Outside|Lobby|Top|Deck)$/i.test(parts[i])) {
      floorIdx = i;
      break;
    }
  }
  let complexParts = parts;
  let floorParts = [];
  if (floorIdx >= 0) {
    complexParts = parts.slice(0, floorIdx);
    floorParts = parts.slice(floorIdx);
  } else if (folderHint) {
    // MAP_GRANITE_CAVE_STEVENS_ROOM — room suffix after dungeon name
    const key = complexKeyFromFolder(folderHint).replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
    const keyParts = key.split("_");
    if (parts.length > keyParts.length && parts.slice(0, keyParts.length).join("_") === keyParts.join("_")) {
      complexParts = keyParts;
      floorParts = parts.slice(keyParts.length);
    }
  }
  const complex = complexParts.join("_") || raw;
  const complexDisplay = titleCaseWords(complexParts.join(" ").replace(/\bSs\b/gi, "S.S."));
  const floorDisplay = floorParts
    .map((p) => (/^B?\d+F$/i.test(p) || /^\d+R$/i.test(p) ? p.toUpperCase() : titleCaseWords(p)))
    .join(" ");
  const display = [complexDisplay, floorDisplay].filter(Boolean).join(" ");
  return {
    raw,
    complex,
    complexKey: folderHint ? complexKeyFromFolder(folderHint) : complexParts[0] || complex,
    complexDisplay,
    floor: floorParts[0] || "",
    floorDisplay: floorDisplay || titleCaseWords(floorParts.join(" ")),
    display,
    roomLabel: floorDisplay || titleCaseWords(parts.slice(-2).join(" ")),
  };
}

function floorRank(floorTok) {
  if (!floorTok) return 0;
  const t = floorTok.toUpperCase();
  const bm = /^B(\d+)F$/.exec(t);
  if (bm) return -Number(bm[1]);
  const fm = /^(\d+)F$/.exec(t);
  if (fm) return Number(fm[1]);
  if (t === "ENTRANCE") return 0.5;
  if (t === "EXTERIOR") return 10;
  if (t === "SUMMIT") return 20;
  if (t === "DECK") return 3;
  return 0;
}

function isFloorLevelToken(t) {
  return /^(B?\d+F|Exterior|Summit|Entrance|Lobby|Top|Deck)$/i.test(t || "");
}

function connectorKind(fromFolder, fromP, destP, sameComplex) {
  if (!sameComplex) return "Exit";
  // Room doors (Steven's Room, Captain's Office, Petalburg challenge rooms) — not ladders.
  if (!isFloorLevelToken(destP.floor) || !isFloorLevelToken(fromP.floor)) return "Door";
  const fromR = floorRank(fromP.floor);
  const destR = floorRank(destP.floor);
  if (fromR !== destR) {
    if (/Gym/i.test(fromFolder)) return "Hole";
    if (/Hideout/i.test(fromFolder)) return "Warp";
    if (/AbandonedShip|Ship/i.test(fromFolder)) return "Stairs";
    if (/Pyre/i.test(fromFolder)) return "Stairs";
    return "Ladder";
  }
  if (/Gym|Hideout/i.test(fromFolder)) return "Warp";
  return "Door";
}

function directionVerb(fromP, destP) {
  if (!isFloorLevelToken(fromP.floor) || !isFloorLevelToken(destP.floor)) return "Leads to";
  const fromR = floorRank(fromP.floor);
  const destR = floorRank(destP.floor);
  if (destR < fromR) return "Goes down to";
  if (destR > fromR) return "Goes up to";
  return "Leads to";
}

/** Cardinal hint from the *source* warp tile (best for cave mouths). */
function sideFromSource(warp, tilesW, tilesH) {
  const x = warp.x / tilesW;
  const y = warp.y / tilesH;
  if (y < 0.22) return "north";
  if (y > 0.78) {
    if (x < 0.4) return "southwest";
    if (x > 0.6) return "southeast";
    return "south";
  }
  if (x < 0.18) return "west";
  if (x > 0.82) return "east";
  return "";
}

/** Optional north/south/east/west hint from the destination warp tile. */
function cardinalFromDest(destMapId, destWarpId) {
  const info = byMapId.get(destMapId);
  if (!info) return "";
  const warps = info.map.warp_events || [];
  const idx = Number(destWarpId);
  const tw = Number.isFinite(idx) ? warps[idx] : null;
  if (!tw) return "";
  const W = info.layout.width;
  const H = info.layout.height;
  const x = tw.x / W;
  const y = tw.y / H;
  if (y < 0.22) return "north";
  if (y > 0.78) return "south";
  if (x < 0.22) return "west";
  if (x > 0.78) return "east";
  return "";
}

function sameComplex(fromFolder, fromMapId, destMapId) {
  const destInfo = byMapId.get(destMapId);
  const destFolder = destInfo?.folder || "";
  const fromP = parseMapConstant(fromMapId, fromFolder);
  const destP = parseMapConstant(destMapId, destFolder);
  return (
    complexKeyFromFolder(fromFolder) === complexKeyFromFolder(destFolder || fromFolder) ||
    fromP.complex === destP.complex
  );
}

function epKey(mapId, warpIdx) {
  return `${mapId}#${warpIdx}`;
}

/** A, B, … Z, AA, AB, … — shared across both ends of a connector. */
function toLetterCode(i) {
  let n = i + 1;
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

class UnionFind {
  constructor() {
    this.parent = new Map();
  }
  add(x) {
    if (!this.parent.has(x)) this.parent.set(x, x);
  }
  find(x) {
    this.add(x);
    let p = this.parent.get(x);
    if (p !== x) {
      p = this.find(p);
      this.parent.set(x, p);
    }
    return p;
  }
  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

/**
 * Assign shared letters to reciprocal connectors (plus adjacent dual-door tiles).
 * Letters are unique on each map, and the same letter appears on the matching
 * warp on the other side — no transitive teleporter chaining.
 */
function buildConnectorCodes() {
  /** @type {Map<string, string>} source endpoint → letter */
  const codes = new Map();
  const byComplex = new Map();

  for (const [mapId, info] of byMapId) {
    if (!isDungeonFolder(info.folder)) continue;
    const ck = complexKeyFromFolder(info.folder);
    if (!byComplex.has(ck)) byComplex.set(ck, []);
    byComplex.get(ck).push({ mapId, info });
  }

  function edgeKey(a, b) {
    return a < b ? `${a}||${b}` : `${b}||${a}`;
  }

  function isAdjacent(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by) <= 1;
  }

  for (const [, maps] of byComplex) {
    const mapInfo = new Map(maps.map((m) => [m.mapId, m.info]));

    /** @type {Map<string, { endpoints: Set<string>, sources: { ep: string, mapId: string, x: number, y: number, floorRank: number }[], maps: Set<string> }>} */
    const edges = new Map();

    for (const { mapId, info } of maps) {
      const fromP = parseMapConstant(mapId, info.folder);
      const warps = info.map.warp_events || [];
      warps.forEach((w, idx) => {
        if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") return;
        if (!sameComplex(info.folder, mapId, w.dest_map)) return;
        const destIdx = Number(w.dest_warp_id);
        const a = epKey(mapId, idx);
        const b = epKey(w.dest_map, destIdx);
        const ek = edgeKey(a, b);
        if (!edges.has(ek)) {
          edges.set(ek, { endpoints: new Set(), sources: [], maps: new Set() });
        }
        const e = edges.get(ek);
        e.endpoints.add(a);
        e.endpoints.add(b);
        e.maps.add(mapId);
        e.maps.add(w.dest_map);
        e.sources.push({
          ep: a,
          mapId,
          x: w.x,
          y: w.y,
          floorRank: floorRank(fromP.floor),
        });
      });
    }

    // Merge adjacent dual-door/stair tiles that share the same destination endpoint.
    const edgeUf = new UnionFind();
    for (const ek of edges.keys()) edgeUf.add(ek);

    for (const { mapId, info } of maps) {
      const warps = info.map.warp_events || [];
      /** @type {Map<string, { idx: number, x: number, y: number, ek: string }[]>} */
      const byDest = new Map();
      warps.forEach((w, idx) => {
        if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") return;
        if (!sameComplex(info.folder, mapId, w.dest_map)) return;
        const destIdx = Number(w.dest_warp_id);
        const a = epKey(mapId, idx);
        const b = epKey(w.dest_map, destIdx);
        const ek = edgeKey(a, b);
        const key = `${w.dest_map}#${destIdx}`;
        if (!byDest.has(key)) byDest.set(key, []);
        byDest.get(key).push({ idx, x: w.x, y: w.y, ek });
      });
      for (const group of byDest.values()) {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            if (isAdjacent(group[i].x, group[i].y, group[j].x, group[j].y)) {
              edgeUf.union(group[i].ek, group[j].ek);
            }
          }
        }
      }
    }

    /** @type {Map<string, { endpoints: Set<string>, sources: typeof edges extends Map<any, infer V> ? V["sources"] : never, maps: Set<string> }>} */
    const comps = new Map();
    for (const [ek, edge] of edges) {
      const root = edgeUf.find(ek);
      if (!comps.has(root)) {
        comps.set(root, { endpoints: new Set(), sources: [], maps: new Set() });
      }
      const c = comps.get(root);
      for (const ep of edge.endpoints) c.endpoints.add(ep);
      for (const m of edge.maps) c.maps.add(m);
      c.sources.push(...edge.sources);
    }

    const ordered = [...comps.values()].sort((a, b) => {
      const ptsA = a.sources.length ? a.sources : [{ x: 0, y: 0, floorRank: 0 }];
      const ptsB = b.sources.length ? b.sources : [{ x: 0, y: 0, floorRank: 0 }];
      const aMaxF = Math.max(...ptsA.map((m) => m.floorRank));
      const bMaxF = Math.max(...ptsB.map((m) => m.floorRank));
      if (aMaxF !== bMaxF) return bMaxF - aMaxF;
      const aHigh = ptsA.filter((m) => m.floorRank === aMaxF);
      const bHigh = ptsB.filter((m) => m.floorRank === bMaxF);
      const aY = Math.min(...aHigh.map((m) => m.y));
      const bY = Math.min(...bHigh.map((m) => m.y));
      if (aY !== bY) return aY - bY;
      return Math.min(...aHigh.map((m) => m.x)) - Math.min(...bHigh.map((m) => m.x));
    });

    /** Letters already used by source warps on each map. */
    const usedOnMap = new Map();
    for (const mapId of mapInfo.keys()) usedOnMap.set(mapId, new Set());

    for (const comp of ordered) {
      const mapsTouched = [...new Set(comp.sources.map((s) => s.mapId))];
      let n = 0;
      let letter = toLetterCode(n);
      while (mapsTouched.some((m) => usedOnMap.get(m)?.has(letter))) {
        n++;
        letter = toLetterCode(n);
      }
      for (const m of mapsTouched) usedOnMap.get(m).add(letter);
      // Assign letter to every *source* endpoint in the component so both
      // sides of a reciprocal pair share it. Dest-only pads aren’t pins.
      for (const s of comp.sources) codes.set(s.ep, letter);
    }
  }

  return codes;
}

const CONNECTOR_CODES = buildConnectorCodes();

function isReciprocalWarp(fromMapId, fromWarpIdx, destMapId, destWarpId) {
  const destInfo = byMapId.get(destMapId);
  if (!destInfo) return false;
  const warps = destInfo.map.warp_events || [];
  const tw = warps[Number(destWarpId)];
  if (!tw) return false;
  return tw.dest_map === fromMapId && Number(tw.dest_warp_id) === Number(fromWarpIdx);
}

function warpLabel(fromFolder, fromMapId, destMapId, destWarpId, sourceWarp, tilesW, tilesH, fromWarpIdx) {
  const destInfo = byMapId.get(destMapId);
  const destFolder = destInfo?.folder || "";
  const fromP = parseMapConstant(fromMapId, fromFolder);
  const destP = parseMapConstant(destMapId, destFolder);
  const same = sameComplex(fromFolder, fromMapId, destMapId);
  const kind = connectorKind(fromFolder, fromP, destP, same);
  const card =
    (sourceWarp ? sideFromSource(sourceWarp, tilesW, tilesH) : "") ||
    cardinalFromDest(destMapId, destWarpId);
  const code = same ? CONNECTOR_CODES.get(epKey(fromMapId, fromWarpIdx)) || "" : "";
  const reciprocal = same && isReciprocalWarp(fromMapId, fromWarpIdx, destMapId, destWarpId);

  if (!same) {
    const destName = destP.display.replace(/\bMap\b/g, "").trim();
    const where = card ? ` (${card})` : "";
    return {
      name: card ? `Exit to ${destName} — ${card}` : `Exit to ${destName}`,
      desc: `Leaves ${fromP.display || fromP.complexDisplay} for ${destName}${where}.`,
      code: "",
    };
  }

  // Same-map gym teleporters (Mossdeep) — label by destination pad side.
  if (fromMapId === destMapId && /Gym/i.test(fromFolder)) {
    const destCard = cardinalFromDest(destMapId, destWarpId) || card || "";
    const destLabel = destCard ? `${destCard} pad` : "paired pad";
    const codeBit = code ? `${code} ` : "";
    const matchBit =
      code && reciprocal ? ` Matches Warp ${code} on the ${destLabel}.` : "";
    return {
      name: `Warp ${codeBit}to ${destLabel}`.replace(/\s+/g, " ").trim(),
      desc: `Teleports within the gym to the ${destLabel}.${matchBit}`,
      code,
    };
  }

  const destShort = destP.floorDisplay || destP.roomLabel || destP.display;
  const verb = directionVerb(fromP, destP);
  const codeBit = code ? `${code} ` : "";
  const matchBit =
    code && reciprocal ? ` Matches ${kind} ${code} on ${destShort}.` : "";
  if (kind === "Ladder" || kind === "Stairs" || kind === "Warp" || kind === "Hole") {
    return {
      name: `${kind} ${codeBit}to ${destShort}`.replace(/\s+/g, " ").trim(),
      desc: `${verb} ${destP.display}.${matchBit}`,
      code,
    };
  }
  return {
    name: `Door ${codeBit}to ${destShort}`.replace(/\s+/g, " ").trim(),
    desc: `${verb} ${destP.display}.${matchBit}`,
    code,
  };
}

function toLocalX(tileX, tilesW) {
  return +(((tileX + 0.5) / tilesW) * 100).toFixed(2);
}
function toLocalY(tileY, tilesH) {
  return +(((tileY + 0.5) / tilesH) * 100).toFixed(2);
}

/** Spread markers that share a tile so stacked warps stay clickable. */
function spreadXY(warps, w, idx, tilesW, tilesH) {
  const same = warps.filter((x) => x.x === w.x && x.y === w.y);
  const i = same.indexOf(w);
  const baseX = toLocalX(w.x, tilesW);
  const baseY = toLocalY(w.y, tilesH);
  if (same.length <= 1) return { x: baseX, y: baseY };
  const spread = 2.5;
  return {
    x: +(baseX + (i - (same.length - 1) / 2) * spread).toFixed(2),
    y: baseY,
  };
}

const areaSrc = fs.readFileSync(path.join(ROOT, "src/data/areaMaps.ts"), "utf8");
const areas = parseAreaMaps(areaSrc);

const byAreaId = {};
let total = 0;
let mapsWith = 0;

for (const area of areas) {
  const info = byMapId.get(area.mapId);
  if (!info) continue;
  if (!isDungeonFolder(info.folder)) continue;
  // Full Petalburg Gym tower is a crop source only — pins live on room crops.
  if (area.id === "petalburgcity-gym") continue;
  // Petalburg room crops are handled below (remapped tile coords).
  if (PETALBURG_GYM_ROOM_IDS.has(area.id)) continue;

  const tilesW = info.layout.width;
  const tilesH = info.layout.height;
  // Only pin warps on full-layout area renders (skip face-off crops).
  if (area.width !== tilesW * 16 || area.height !== tilesH * 16) continue;

  const warps = info.map.warp_events || [];
  if (!warps.length) continue;

  const markers = [];
  let idx = 0;
  for (let warpIdx = 0; warpIdx < warps.length; warpIdx++) {
    const w = warps[warpIdx];
    if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") continue;
    const { name, desc, code } = warpLabel(
      info.folder,
      area.mapId,
      w.dest_map,
      w.dest_warp_id,
      w,
      tilesW,
      tilesH,
      warpIdx,
    );
    const { x, y } = spreadXY(warps, w, idx, tilesW, tilesH);
    markers.push({
      id: `aen-${area.id}-${idx}`,
      name,
      category: "entrance",
      x,
      y,
      desc,
      code: code || undefined,
      destMap: w.dest_map,
      destWarpId: String(w.dest_warp_id ?? ""),
    });
    idx++;
  }
  if (!markers.length) continue;
  byAreaId[area.id] = markers;
  mapsWith++;
  total += markers.length;
}

/** Room-local entrance pins for Petalburg Gym challenge-room crops. */
function generatePetalburgGymRoomEntrances() {
  const info = byMapId.get(PETALBURG_GYM_MAP);
  if (!info) return;
  const warps = info.map.warp_events || [];
  const tilesW = info.layout.width;

  for (const room of PETALBURG_GYM_ROOMS) {
    const roomWarps = [];
    warps.forEach((w, warpIdx) => {
      if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") return;
      if (w.y < room.tile0 || w.y >= room.tile0 + PETALBURG_GYM_ROOM_H) return;
      roomWarps.push({ w, warpIdx });
    });
    if (!roomWarps.length) continue;

    const markers = [];
    let idx = 0;
    for (const { w, warpIdx } of roomWarps) {
      let name;
      let desc;
      let code = "";

      if (w.dest_map !== PETALBURG_GYM_MAP) {
        const labeled = warpLabel(
          info.folder,
          PETALBURG_GYM_MAP,
          w.dest_map,
          w.dest_warp_id,
          w,
          tilesW,
          info.layout.height,
          warpIdx,
        );
        name = labeled.name;
        desc = labeled.desc;
        code = labeled.code || "";
      } else {
        const destWarp = warps[Number(w.dest_warp_id)];
        const destRoom = destWarp ? petalburgRoomForY(destWarp.y) : null;
        const destShort = destRoom?.floor || "another room";
        code = CONNECTOR_CODES.get(epKey(PETALBURG_GYM_MAP, warpIdx)) || "";
        const reciprocal = isReciprocalWarp(
          PETALBURG_GYM_MAP,
          warpIdx,
          w.dest_map,
          w.dest_warp_id,
        );
        const codeBit = code ? `${code} ` : "";
        const matchBit =
          code && reciprocal && destRoom
            ? ` Matches Door ${code} on ${destShort}.`
            : "";
        name = `Door ${codeBit}to ${destShort}`.replace(/\s+/g, " ").trim();
        desc = `Leads to ${destShort}.${matchBit}`;
      }

      const sameTile = roomWarps.filter((x) => x.w.x === w.x && x.w.y === w.y);
      const si = sameTile.findIndex((x) => x.warpIdx === warpIdx);
      const baseX = toLocalX(w.x, tilesW);
      const baseY = +(((w.y - room.tile0 + 0.5) / PETALBURG_GYM_ROOM_H) * 100).toFixed(2);
      const spread = sameTile.length > 1 ? 2.5 : 0;
      const x = +(baseX + (si - (sameTile.length - 1) / 2) * spread).toFixed(2);

      markers.push({
        id: `aen-${room.id}-${idx}`,
        name,
        category: "entrance",
        x,
        y: baseY,
        desc,
        code: code || undefined,
        destMap: w.dest_map,
        destWarpId: String(w.dest_warp_id ?? ""),
      });
      idx++;
    }

    byAreaId[room.id] = markers;
    mapsWith++;
    total += markers.length;
  }
}

generatePetalburgGymRoomEntrances();

const lines = [];
lines.push("// AUTO-GENERATED by scripts/gen-area-map-entrances.mjs — do not edit by hand.");
lines.push("// Cave/dungeon entrance, exit, and ladder pins with destination labels.");
lines.push('import type { AreaMapMarker } from "./areaMaps";');
lines.push("");
lines.push("export interface AreaEntranceMarker extends AreaMapMarker {");
lines.push('  category: "entrance";');
lines.push("  /** Shared A/B/C code pairing this connector with its other end. */");
lines.push("  code?: string;");
lines.push("  /** pokeemerald dest_map constant. */");
lines.push("  destMap: string;");
lines.push("  destWarpId: string;");
lines.push("}");
lines.push("");
lines.push("/** Entrance markers keyed by AREA_MAPS id. */");
lines.push("export const AREA_MAP_ENTRANCES: Record<string, AreaEntranceMarker[]> = {");
for (const id of Object.keys(byAreaId).sort()) {
  lines.push(`  ${JSON.stringify(id)}: [`);
  for (const mk of byAreaId[id]) {
    const codePart = mk.code ? `, code: ${JSON.stringify(mk.code)}` : "";
    lines.push(
      `    { id: ${JSON.stringify(mk.id)}, name: ${JSON.stringify(mk.name)}, category: "entrance", x: ${mk.x}, y: ${mk.y}, desc: ${JSON.stringify(mk.desc)}${codePart}, destMap: ${JSON.stringify(mk.destMap)}, destWarpId: ${JSON.stringify(mk.destWarpId)} },`,
    );
  }
  lines.push("  ],");
}
lines.push("};");
lines.push("");

fs.writeFileSync(OUT, lines.join("\n"));
console.log(`Wrote ${total} entrance markers across ${mapsWith} dungeon area maps → ${path.relative(ROOT, OUT)}`);

// Preview a few labels
for (const sample of [
  "granitecave-1f",
  "lavaridgetown-gym-1f",
  "lavaridgetown-gym-b1f",
  "sootopoliscity-gym-1f",
  "mossdeepcity-gym",
  "petalburgcity-gym-entrance",
  "petalburgcity-gym-norman",
]) {
  const m = byAreaId[sample];
  if (!m) continue;
  console.log(`\n${sample}:`);
  for (const e of m.slice(0, 8)) console.log(`  • ${e.name} — ${e.desc}`);
  if (m.length > 8) console.log(`  … +${m.length - 8} more`);
}
