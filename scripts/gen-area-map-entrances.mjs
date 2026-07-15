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
  /Cave|Tunnel|Falls|Pyre|Hideout|Woods|VictoryRoad|AbandonedShip|Seafloor|Shoal|FieryPath|Scorched|Artisan|DesertUnderpass|NewMauville|Underwater|JaggedPass|SafariZone|IslandCave|MirageTower|SkyPillar|CaveOfOrigin|MarineCave|TerraCave|AncientTomb|NavelRock|BirthIsland|SouthernIsland|FarawayIsland|TrainerHill|AlteringCave/i;

function isDungeonFolder(folder) {
  return DUNGEON_RE.test(folder);
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

/** Folder prefix shared by floors of one dungeon (GraniteCave_1F → GraniteCave). */
function complexKeyFromFolder(folder) {
  const i = folder.indexOf("_");
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
  // Room doors (Steven's Room, Captain's Office, etc.) — not ladders.
  if (!isFloorLevelToken(destP.floor) || !isFloorLevelToken(fromP.floor)) return "Door";
  const fromR = floorRank(fromP.floor);
  const destR = floorRank(destP.floor);
  if (fromR !== destR) {
    if (/Hideout/i.test(fromFolder)) return "Warp";
    if (/AbandonedShip|Ship/i.test(fromFolder)) return "Stairs";
    if (/Pyre/i.test(fromFolder)) return "Stairs";
    return "Ladder";
  }
  if (/Hideout/i.test(fromFolder)) return "Warp";
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
 * Pair same-complex warps so ladders/stairs/doors/warps share one letter on
 * both floors (and dual doorway tiles going to the same dest share too).
 */
function buildConnectorCodes() {
  /** @type {Map<string, string>} endpoint → letter */
  const codes = new Map();
  const byComplex = new Map();

  for (const [mapId, info] of byMapId) {
    if (!isDungeonFolder(info.folder)) continue;
    const ck = complexKeyFromFolder(info.folder);
    if (!byComplex.has(ck)) byComplex.set(ck, []);
    byComplex.get(ck).push({ mapId, info });
  }

  for (const [, maps] of byComplex) {
    const uf = new UnionFind();
    /** @type {Map<string, { x: number, y: number, floorRank: number }[]>} */
    const metas = new Map();
    const siblingGroups = new Map();

    for (const { mapId, info } of maps) {
      const fromP = parseMapConstant(mapId, info.folder);
      const warps = info.map.warp_events || [];
      warps.forEach((w, idx) => {
        if (!w.dest_map || w.dest_map === "MAP_NONE" || w.dest_map === "MAP_DYNAMIC") return;
        if (!sameComplex(info.folder, mapId, w.dest_map)) return;
        const a = epKey(mapId, idx);
        const b = epKey(w.dest_map, w.dest_warp_id);
        uf.union(a, b);
        const meta = { x: w.x, y: w.y, floorRank: floorRank(fromP.floor) };
        if (!metas.has(a)) metas.set(a, []);
        metas.get(a).push(meta);
        const sib = `${mapId}|${w.dest_map}|${w.dest_warp_id}`;
        if (!siblingGroups.has(sib)) siblingGroups.set(sib, []);
        siblingGroups.get(sib).push(a);
      });
    }

    for (const group of siblingGroups.values()) {
      for (let i = 1; i < group.length; i++) uf.union(group[0], group[i]);
    }

    /** @type {Map<string, { nodes: string[], points: { x: number, y: number, floorRank: number }[] }>} */
    const comps = new Map();
    for (const node of uf.parent.keys()) {
      const root = uf.find(node);
      if (!comps.has(root)) comps.set(root, { nodes: [], points: [] });
      comps.get(root).nodes.push(node);
      if (metas.has(node)) comps.get(root).points.push(...metas.get(node));
    }

    const ordered = [...comps.values()].sort((a, b) => {
      const ptsA = a.points.length ? a.points : [{ x: 0, y: 0, floorRank: 0 }];
      const ptsB = b.points.length ? b.points : [{ x: 0, y: 0, floorRank: 0 }];
      // Prefer connectors players hit first (higher floors), then reading order.
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

    ordered.forEach((comp, i) => {
      const letter = toLetterCode(i);
      for (const node of comp.nodes) codes.set(node, letter);
    });
  }

  return codes;
}

const CONNECTOR_CODES = buildConnectorCodes();

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

  if (!same) {
    const destName = destP.display.replace(/\bMap\b/g, "").trim();
    const where = card ? ` (${card})` : "";
    return {
      name: card ? `Exit to ${destName} — ${card}` : `Exit to ${destName}`,
      desc: `Leaves ${fromP.display || fromP.complexDisplay} for ${destName}${where}.`,
      code: "",
    };
  }

  const destShort = destP.floorDisplay || destP.roomLabel || destP.display;
  const verb = directionVerb(fromP, destP);
  const codeBit = code ? `${code} ` : "";
  const matchBit = code ? ` Matches ${kind} ${code} on ${destShort}.` : "";
  if (kind === "Ladder" || kind === "Stairs" || kind === "Warp") {
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
  "granitecave-b1f",
  "granitecave-b2f",
  "petalburgwoods",
  "victoryroad-1f",
  "victoryroad-b1f",
  "aquahideout-b1f",
]) {
  const m = byAreaId[sample];
  if (!m) continue;
  console.log(`\n${sample}:`);
  for (const e of m) console.log(`  • ${e.name} — ${e.desc}`);
}
