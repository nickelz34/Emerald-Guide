#!/usr/bin/env node
/**
 * Extract outdoor TRAINER_TYPE_NONE object events (town/route NPCs) for the
 * Hoenn Map "NPCs" legend layer.
 *
 * Uses the same composite origins / sprite sheets as gen-map-trainers.mjs.
 * Skips props (item balls, trucks, berry trees, invisible triggers, VAR gfx).
 *
 * Usage: node scripts/gen-map-npcs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const OUT_FILE = path.join(ROOT, "src/data/mapNpcsGenerated.ts");
const { loadManifest, mapIdToDir } = await import("./map-origin-lib.mjs");
const manifest = loadManifest(ROOT);
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";

const compositeIds = new Set(manifest.maps.map((m) => m.id));
const { wTiles, hTiles } = manifest;
const mapOrigin = new Map(manifest.maps.map((m) => [m.id, { gx: m.gx, gy: m.gy }]));

const SKIP_GFX = new Set([
  "OBJ_EVENT_GFX_TRICK_HOUSE_STATUE",
  "OBJ_EVENT_GFX_ITEM_BALL",
  "OBJ_EVENT_GFX_BERRY_TREE",
  "OBJ_EVENT_GFX_PUSHABLE_BOULDER",
  "OBJ_EVENT_GFX_BREAKABLE_ROCK",
  "OBJ_EVENT_GFX_CUT_TREE",
  "OBJ_EVENT_GFX_FOLLOWABLE_POKEBALL",
  "OBJ_EVENT_GFX_SS_TIDAL",
  "OBJ_EVENT_GFX_SUBMARINE_SHADOW",
  "OBJ_EVENT_GFX_TRUCK",
  "OBJ_EVENT_GFX_MOVING_BOX",
  "OBJ_EVENT_GFX_BIRCHS_BAG",
]);

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchText(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

async function fetchTextCached(relPath, cache) {
  const local = path.join(REPO, relPath);
  if (fs.existsSync(local)) return fs.readFileSync(local, "utf8");
  if (cache.has(relPath)) return cache.get(relPath);
  const text = await fetchText(`${RAW}/${relPath.replace(/\\/g, "/")}`);
  cache.set(relPath, text);
  return text;
}

const cache = new Map();
const layoutsJson = JSON.parse(await fetchTextCached("data/layouts/layouts.json", cache));
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));

async function loadMapJson(mapId) {
  const dir = mapIdToDir(mapId);
  const local = path.join(MAPS_DIR, dir, "map.json");
  try {
    const text = fs.existsSync(local)
      ? fs.readFileSync(local, "utf8")
      : await fetchText(`${RAW}/data/maps/${dir}/map.json`);
    const m = JSON.parse(text);
    const l = layoutById.get(m.layout);
    if (!l) return null;
    return { ...m, w: l.width, h: l.height, dir };
  } catch {
    return null;
  }
}

const gfxH = await fetchTextCached("src/data/object_events/object_event_graphics.h", cache);
const picToPath = new Map();
for (const mt of gfxH.matchAll(
  /const u32 gObjectEventPic_(\w+)\[\]\s*=\s*INCGFX(?:_U32)?\("([^"]+\.png)"/g,
)) {
  picToPath.set(mt[1], mt[2]);
}

const infoH = await fetchTextCached("src/data/object_events/object_event_graphics_info.h", cache);
const ptrH = await fetchTextCached(
  "src/data/object_events/object_event_graphics_info_pointers.h",
  cache,
);
const infoByName = new Map();
for (const mt of infoH.matchAll(
  /gObjectEventGraphicsInfo_(\w+)\s*=\s*\{[\s\S]*?\.width\s*=\s*(\d+),[\s\S]*?\.height\s*=\s*(\d+)/g,
)) {
  infoByName.set(mt[1], { w: +mt[2], h: +mt[3] });
}
const gfxDims = new Map();
for (const mt of ptrH.matchAll(/\[(OBJ_EVENT_GFX_\w+)\]\s*=\s*&gObjectEventGraphicsInfo_(\w+)/g)) {
  const info = infoByName.get(mt[2]);
  if (info) gfxDims.set(mt[1], info);
}

function dimsForGfx(gfxId) {
  return gfxDims.get(gfxId) ?? { w: 16, h: 32 };
}

function gfxIdToPicName(gfxId) {
  const base = gfxId.replace(/^OBJ_EVENT_GFX_/, "");
  return base
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function localSpriteFile(rel) {
  const stripped = rel.replace(/^graphics\/object_events\/pics\/(?:people|pokemon)\//, "");
  return stripped.replace(/\//g, "_");
}

function spritePathForGfx(gfxId) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) return null;
  const file = localSpriteFile(rel);
  if (rel.includes("/pokemon/")) return `sprites/overworld/${file}`;
  return `sprites/trainers/${file}`;
}

function frameForMovement(mt) {
  switch (mt) {
    case "MOVEMENT_TYPE_FACE_UP":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_UP":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_UP":
    case "MOVEMENT_TYPE_RUN_IN_PLACE_UP":
    case "MOVEMENT_TYPE_WALK_SLOWLY_IN_PLACE_UP":
      return 1;
    case "MOVEMENT_TYPE_FACE_LEFT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_LEFT":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_LEFT":
    case "MOVEMENT_TYPE_RUN_IN_PLACE_LEFT":
    case "MOVEMENT_TYPE_WALK_SLOWLY_IN_PLACE_LEFT":
      return 2;
    case "MOVEMENT_TYPE_FACE_RIGHT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_RIGHT":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_RIGHT":
    case "MOVEMENT_TYPE_RUN_IN_PLACE_RIGHT":
    case "MOVEMENT_TYPE_WALK_SLOWLY_IN_PLACE_RIGHT":
      return 3;
    default:
      if (mt.includes("_UP") && !mt.includes("_DOWN")) return 1;
      if (mt.includes("_LEFT") && !mt.includes("_RIGHT")) return 2;
      if (mt.includes("_RIGHT") && !mt.includes("_LEFT")) return 3;
      return 0;
  }
}

function titleCase(s) {
  return s
    .replace(/POKéMON/gi, "Pokémon")
    .split(/\s+/)
    .map((w) => {
      if (/^(TM|HM)\d+$/i.test(w)) return w.toUpperCase();
      if (/^(PP|HP)$/i.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function classLabelFromGfx(gfxId) {
  return titleCase(
    gfxId
      .replace(/^OBJ_EVENT_GFX_/, "")
      .replace(/_/g, " ")
      .replace(/\bM\b$/, "")
      .replace(/\bF\b$/, ""),
  );
}

function areaName(mapName) {
  return mapName
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/Route(\d)/, "Route $1");
}

function shouldSkipObjectEvent(oe) {
  const gfx = oe.graphics_id || "";
  const script = oe.script || "";
  if (SKIP_GFX.has(gfx)) return true;
  if (gfx.includes("_DOLL")) return true;
  if (/^OBJ_EVENT_GFX_VAR_/.test(gfx)) return true;
  if (oe.movement_type === "MOVEMENT_TYPE_INVISIBLE") return true;
  const flag = oe.flag || "";
  if (flag.includes("FLAG_DECORATION")) return true;
  if (flag.includes("FLAG_HIDE") && (!script || script === "0x0")) return true;
  return false;
}

function resolveName(script, gfxId) {
  if (script && script !== "0x0") {
    const tail = script.match(/_EventScript_(.+)$/);
    if (tail) {
      const raw = tail[1].replace(/([a-z])([A-Z])/g, "$1 $2");
      return titleCase(raw);
    }
  }
  return classLabelFromGfx(gfxId);
}

const toGlobalX = (id, lx) => {
  const o = mapOrigin.get(id);
  if (!o) return 0;
  return +(((o.gx + lx + 0.5) / wTiles) * 100).toFixed(2);
};
const toGlobalY = (id, ly) => {
  const o = mapOrigin.get(id);
  if (!o) return 0;
  return +(((o.gy + ly + 1) / hTiles) * 100).toFixed(2);
};

function publicSpriteExists(rel) {
  // rel like sprites/trainers/twin.png → public/sprites/trainers/twin.png
  return fs.existsSync(path.join(ROOT, "public", rel));
}

const npcs = [];
let idc = 0;
let mapsOk = 0;
let mapsSkip = 0;
let skippedNoSprite = 0;

for (const { id } of manifest.maps) {
  if (!compositeIds.has(id)) continue;
  const m = await loadMapJson(id);
  if (!m) {
    mapsSkip += 1;
    continue;
  }
  mapsOk += 1;
  const area = areaName(m.name || m.dir || id);
  let count = 0;
  for (const oe of m.object_events || []) {
    if (!oe.trainer_type || oe.trainer_type !== "TRAINER_TYPE_NONE") continue;
    if (shouldSkipObjectEvent(oe)) continue;
    const sheet = spritePathForGfx(oe.graphics_id);
    if (!sheet || !publicSpriteExists(sheet)) {
      skippedNoSprite += 1;
      continue;
    }
    const dim = dimsForGfx(oe.graphics_id);
    const name = resolveName(oe.script, oe.graphics_id);
    npcs.push({
      id: `npc${idc++}`,
      name,
      category: "npc",
      x: toGlobalX(id, oe.x),
      y: toGlobalY(id, oe.y),
      graphicsId: oe.graphics_id,
      spriteSheet: sheet,
      spriteWidth: dim.w,
      spriteHeight: dim.h,
      spriteFrame: frameForMovement(oe.movement_type || ""),
      note: area,
      trainerType: "TRAINER_TYPE_NONE",
      script: oe.script && oe.script !== "0x0" ? oe.script : undefined,
      mapId: id,
    });
    count += 1;
  }
  if (count) console.log(`  ${id}: ${count} NPCs`);
}

npcs.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const header = `/* AUTO-GENERATED by scripts/gen-map-npcs.mjs — do not edit by hand.
 * Outdoor TRAINER_TYPE_NONE object events for the NPCs legend layer.
 * Maps: ${mapsOk} ok, ${mapsSkip} skipped. NPCs: ${npcs.length} (no sprite: ${skippedNoSprite}).
 */
import type { MapPoint } from "./mapPoints";

export interface NpcPoint extends MapPoint {
  category: "npc";
  graphicsId: string;
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
  spriteFrame: number;
  trainerType?: string;
  script?: string;
  mapId?: string;
}

`;

const body = `export const MAP_NPCS: NpcPoint[] = ${JSON.stringify(npcs, null, 2)};\n`;
fs.writeFileSync(OUT_FILE, header + body, "utf8");
console.log(`Wrote ${npcs.length} NPCs → ${path.relative(ROOT, OUT_FILE)}`);
