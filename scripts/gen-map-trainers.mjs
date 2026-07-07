/**
 * Extract all trainer object events from pokeemerald maps, download their
 * overworld sprite sheets, and emit data for the Hoenn Map + area map switcher.
 *
 * Trainers use authentic GBA overworld sprite sheets (16×32 walkers, 32×32
 * cyclists, etc.) with the correct facing frame from movement_type.
 *
 * Usage:
 *   node scripts/gen-map-trainers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PNG } from "pngjs";

/** Fix UTF-16 LE files that Cursor/Windows sometimes write (null byte every other char). */
function repairUtf16File(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 4 || buf[1] !== 0 || buf[0] < 0x20 || buf[0] > 0x7e) return;
  fs.writeFileSync(filePath, buf.toString("utf16le"), "utf8");
}

repairUtf16File(path.join(import.meta.dirname, "trainer-data-lib.mjs"));

const {
  parseEnumNames,
  parseSpeciesNames,
  parseMoveNames,
  parseItemNames,
  parseTypeNames,
  parseSpeciesTypes,
  parseTrainerParties,
  parseTrainerRecords,
  buildTrainerBattleLookup,
} = await import("./trainer-data-lib.mjs");

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const { loadManifest, mapIdToDir } = await import("./map-origin-lib.mjs");
const manifest = loadManifest(ROOT);
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const SPRITE_DIR = path.join(ROOT, "public/sprites/trainers");

const compositeIds = new Set(manifest.maps.map((m) => m.id));
const { wTiles, hTiles } = manifest;
const mapOrigin = new Map(manifest.maps.map((m) => [m.id, { gx: m.gx, gy: m.gy }]));

// Area maps we already ship (parse mapIds from generated file).
const areaMapIds = new Set();
const areaTs = fs.readFileSync(path.join(ROOT, "src/data/areaMaps.ts"), "utf8");
for (const m of areaTs.matchAll(/mapId:\s*"([^"]+)"/g)) areaMapIds.add(m[1]);

// ---- fetch helpers ----
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

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchBuffer(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
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

// ---- layouts + maps ----
const layoutsJson = JSON.parse(
  fs.existsSync(path.join(REPO, "data/layouts/layouts.json"))
    ? fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8")
    : await fetchText(`${RAW}/data/layouts/layouts.json`),
);
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));
const maps = new Map();

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
    return { ...m, w: l.width, h: l.height };
  } catch {
    return null;
  }
}

const mapIdsToLoad = new Set([
  ...manifest.maps.map((m) => m.id),
  ...areaMapIds,
]);
for (const mapId of mapIdsToLoad) {
  const loaded = await loadMapJson(mapId);
  if (loaded) maps.set(mapId, loaded);
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
const toLocalX = (x, W) => +(((x + 0.5) / W) * 100).toFixed(2);
const toLocalY = (y, H) => +(((y + 1) / H) * 100).toFixed(2);

// ---- trainers.h index ----
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

function classLabel(trainerClass) {
  return titleCase(
    (trainerClass || "")
      .replace(/^TRAINER_CLASS_/, "")
      .replace(/_/g, " ")
      .replace(/\bPkMn\b/i, "Pokémon")
      .replace(/\bPkmn\b/i, "Pokémon"),
  );
}

const trainersH = await fetchText(`${RAW}/src/data/trainers.h`);
const trainerById = new Map();
for (const mt of trainersH.matchAll(
  /\[TRAINER_(\w+)\]\s*=\s*\{[\s\S]*?\.trainerClass\s*=\s*(TRAINER_CLASS_\w+),[\s\S]*?\.trainerName\s*=\s*_\("([^"]*)"\)/g,
)) {
  trainerById.set(`TRAINER_${mt[1]}`, {
    class: classLabel(mt[2]),
    name: titleCase(mt[3]),
  });
}

// ---- scripts.inc: EventScript -> TRAINER_* ----
const scriptToTrainer = new Map();
for (const mapId of mapIdsToLoad) {
  const dir = mapIdToDir(mapId);
  const local = path.join(MAPS_DIR, dir, "scripts.inc");
  let text = "";
  try {
    text = fs.existsSync(local)
      ? fs.readFileSync(local, "utf8")
      : await fetchText(`${RAW}/data/maps/${dir}/scripts.inc`);
  } catch {
    continue;
  }
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const label = line.match(/^([\w]+)::/);
    if (label) current = label[1];
    const tb = line.match(
      /trainerbattle_(?:single|double|two_trainers|no_intro|continue_script)\s+(TRAINER_\w+)/,
    );
    if (tb && current) scriptToTrainer.set(current, tb[1]);
  }
}

// ---- object event graphics: PicName -> png path ----
const gfxH = await fetchText(`${RAW}/src/data/object_events/object_event_graphics.h`);
const picToPath = new Map();
for (const mt of gfxH.matchAll(
  /const u32 gObjectEventPic_(\w+)\[\]\s*=\s*INCGFX(?:_U32)?\("([^"]+\.png)"/g,
)) {
  picToPath.set(mt[1], mt[2]);
}

function gfxIdToPicName(gfxId) {
  const base = gfxId.replace(/^OBJ_EVENT_GFX_/, "");
  return base
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function spritePathForGfx(gfxId) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) return null;
  const file = path.basename(rel).replace(/\.png$/i, "");
  return `sprites/trainers/${file}.png`;
}

// ---- per-gfx sprite dimensions from object_event_graphics_info.h ----
const infoH = await fetchText(`${RAW}/src/data/object_events/object_event_graphics_info.h`);
const ptrH = await fetchText(`${RAW}/src/data/object_events/object_event_graphics_info_pointers.h`);
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

/** Map movement_type to standing frame index (0=down, 1=up, 2=left, 3=right). */
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

function areaName(mapName) {
  return mapName
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/Route(\d)/, "Route $1");
}

function resolveTrainerName(script, gfxId) {
  if (script === "BattlePyramid_TrainerBattle") {
    return {
      label: "Pyramid Trainer",
      class: classLabelFromGfx(gfxId),
      name: "Pyramid Trainer",
      trainerId: null,
    };
  }
  const tid = scriptToTrainer.get(script);
  if (tid && trainerById.has(tid)) {
    const t = trainerById.get(tid);
    return { label: `${t.class} ${t.name}`, class: t.class, name: t.name, trainerId: tid };
  }
  const m = /_EventScript_(.+)$/.exec(script || "");
  if (m) {
    const raw = m[1].replace(/([a-z])([A-Z])/g, "$1 $2");
    return {
      label: titleCase(raw),
      class: classLabelFromGfx(gfxId),
      name: titleCase(raw),
      trainerId: tid ?? null,
    };
  }
  return {
    label: classLabelFromGfx(gfxId),
    class: classLabelFromGfx(gfxId),
    name: "Trainer",
    trainerId: tid ?? null,
  };
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

function sightNote(trainerType, sight) {
  const n = Number(sight);
  if (trainerType === "TRAINER_TYPE_NORMAL" && n > 0) return `Sight range ${n} tiles`;
  if (trainerType === "TRAINER_TYPE_BURIED") return "Hidden (tree/rock disguise)";
  if (trainerType === "TRAINER_TYPE_TRAINER") return "Spot trainer";
  return "";
}

// ---- collect trainers ----
const overworld = [];
const byArea = new Map(); // area id -> trainers
const gfxNeeded = new Set();
let idc = 0;
const nid = () => `tr${idc++}`;

function addTrainer(rec) {
  gfxNeeded.add(rec.graphicsId);
  return rec;
}

// Overworld composite maps
for (const { id } of manifest.maps) {
  if (!compositeIds.has(id) || !maps.has(id)) continue;
  const m = maps.get(id);
  const area = areaName(m.name);
  for (const oe of m.object_events || []) {
    if (!oe.trainer_type || oe.trainer_type === "TRAINER_TYPE_NONE") continue;
    const { label, class: cls, name, trainerId } = resolveTrainerName(oe.script, oe.graphics_id);
    const sight = sightNote(oe.trainer_type, oe.trainer_sight_or_berry_tree_id);
    const sightN = Number(oe.trainer_sight_or_berry_tree_id) || 0;
    const dim = dimsForGfx(oe.graphics_id);
    overworld.push(
      addTrainer({
        id: nid(),
        name: label,
        trainerClass: cls,
        trainerName: name,
        trainerId: trainerId ?? undefined,
        script: oe.script,
        trainerType: oe.trainer_type,
        sightRange: oe.trainer_type === "TRAINER_TYPE_NORMAL" && sightN > 0 ? sightN : undefined,
        category: "trainer",
        x: toGlobalX(id, oe.x),
        y: toGlobalY(id, oe.y),
        graphicsId: oe.graphics_id,
        spriteFrame: frameForMovement(oe.movement_type),
        spriteWidth: dim.w,
        spriteHeight: dim.h,
        note: sight ? `${area} · ${sight}` : area,
        desc: sight || undefined,
        mapId: id,
      }),
    );
  }
}

// Area maps (non-composite standalone maps from areaMaps.ts)
for (const mapId of areaMapIds) {
  const m = maps.get(mapId);
  if (!m) continue;
  const areaId = m.name.toLowerCase().replace(/_/g, "-");
  const area = areaName(m.name);
  const list = [];
  for (const oe of m.object_events || []) {
    if (!oe.trainer_type || oe.trainer_type === "TRAINER_TYPE_NONE") continue;
    const { label, class: cls, name, trainerId } = resolveTrainerName(oe.script, oe.graphics_id);
    const sight = sightNote(oe.trainer_type, oe.trainer_sight_or_berry_tree_id);
    const sightN = Number(oe.trainer_sight_or_berry_tree_id) || 0;
    const dim = dimsForGfx(oe.graphics_id);
    list.push(
      addTrainer({
        id: nid(),
        name: label,
        trainerClass: cls,
        trainerName: name,
        trainerId: trainerId ?? undefined,
        script: oe.script,
        trainerType: oe.trainer_type,
        sightRange: oe.trainer_type === "TRAINER_TYPE_NORMAL" && sightN > 0 ? sightN : undefined,
        category: "trainer",
        x: toLocalX(oe.x, m.w),
        y: toLocalY(oe.y, m.h),
        graphicsId: oe.graphics_id,
        spriteFrame: frameForMovement(oe.movement_type),
        spriteWidth: dim.w,
        spriteHeight: dim.h,
        note: sight ? `${area} · ${sight}` : area,
        desc: sight || undefined,
        areaId,
        mapId,
      }),
    );
  }
  if (list.length) byArea.set(areaId, list);
}

console.log(`Overworld trainers: ${overworld.length}`);
console.log(`Area-map trainers: ${[...byArea.values()].reduce((s, a) => s + a.length, 0)} (${byArea.size} areas)`);
console.log(`Unique sprite gfx ids: ${gfxNeeded.size}`);

/** PokeNav Match Call rematch table from pokeemerald battle_setup.c */
function parseMatchCallRematchIds(battleSetupText) {
  const firstIds = new Set();
  const tableMatch = battleSetupText.match(
    /const struct RematchTrainer gRematchTable\[REMATCH_TABLE_ENTRIES\]\s*=\s*\{([\s\S]*?)\n\};/,
  );
  if (!tableMatch) throw new Error("gRematchTable not found in battle_setup.c");
  for (const m of tableMatch[1].matchAll(/REMATCH\(([^)]+)\)/g)) {
    const trainers = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter((p) => p.startsWith("TRAINER_"));
    if (trainers[0]) firstIds.add(trainers[0]);
  }
  return firstIds;
}

function trainerIdBase(id) {
  return id.replace(/_\d+$/, "");
}

function isMatchCallRematchable(trainerId, firstIds) {
  if (!trainerId) return false;
  if (firstIds.has(trainerId)) return true;
  const base = trainerIdBase(trainerId);
  for (const id of firstIds) {
    if (trainerIdBase(id) === base) return true;
  }
  return false;
}

console.log("Fetching Match Call rematch table…");
const battleSetupC = await fetchText(`${RAW}/src/battle_setup.c`);
const matchCallFirstIds = parseMatchCallRematchIds(battleSetupC);
console.log(`Match Call rematch trainers: ${matchCallFirstIds.size}`);

/** pret exports palette index 0 as opaque mint green — key it out for web use. */
function keyOutTransparency(filePath) {
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const key = png.palette?.[0] ?? { r: 115, g: 197, b: 164 };
  const kr = key.r ?? key[0] ?? 115;
  const kg = key.g ?? key[1] ?? 197;
  const kb = key.b ?? key[2] ?? 164;
  let cleared = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    if (r === kr && g === kg && b === kb) {
      png.data[i + 3] = 0;
      cleared++;
    }
  }
  fs.writeFileSync(
    filePath,
    PNG.sync.write({
      ...png,
      colorType: 6,
      inputHasAlpha: true,
    }),
  );
  return cleared;
}

// ---- download sprite sheets ----
fs.mkdirSync(SPRITE_DIR, { recursive: true });
const downloaded = new Set();
let dlOk = 0;
let dlFail = 0;
for (const gfxId of gfxNeeded) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) {
    console.log("  missing pic path for", gfxId, "->", pic);
    dlFail++;
    continue;
  }
  const outName = path.basename(rel);
  const outPath = path.join(SPRITE_DIR, outName);
  if (downloaded.has(outName)) continue;
  downloaded.add(outName);
  if (fs.existsSync(outPath)) {
    dlOk++;
    continue;
  }
  try {
    const buf = await fetchBuffer(`${RAW}/${rel}`);
    fs.writeFileSync(outPath, buf);
    dlOk++;
  } catch (e) {
    console.log("  download fail", rel, e.message);
    dlFail++;
  }
}
console.log(`Sprites: ${dlOk} ok, ${dlFail} failed`);

// Key out the GBA transparency color on every sheet (including cached files).
const allSheets = fs.readdirSync(SPRITE_DIR).filter((f) => f.endsWith(".png"));
let keyed = 0;
for (const f of allSheets) {
  const cleared = keyOutTransparency(path.join(SPRITE_DIR, f));
  if (cleared > 0) keyed++;
}
console.log(`Transparency keyed on ${keyed}/${allSheets.length} sprite sheets`);

// Attach sprite paths (skip trainers whose sprite failed)
function withSprite(t) {
  const sheet = spritePathForGfx(t.graphicsId);
  if (!sheet || !fs.existsSync(path.join(ROOT, "public", sheet))) return null;
  const rematchable = isMatchCallRematchable(t.trainerId, matchCallFirstIds);
  return { ...t, spriteSheet: sheet, rematchable };
}

const owOut = overworld.map(withSprite).filter(Boolean);
const areaOut = {};
for (const [aid, list] of byArea) {
  const filtered = list.map(withSprite).filter(Boolean);
  if (filtered.length) areaOut[aid] = filtered;
}

// ---- trainer parties from pokeemerald battle data ----
console.log("Fetching trainer party data…");
const [
  trainersFullH,
  partiesH,
  speciesNamesH,
  moveNamesH,
  itemNamesH,
  speciesInfoH,
  pokemonConstH,
  speciesConstH,
] = await Promise.all([
  fetchText(`${RAW}/src/data/trainers.h`),
  fetchText(`${RAW}/src/data/trainer_parties.h`),
  fetchText(`${RAW}/src/data/text/species_names.h`),
  fetchText(`${RAW}/src/data/text/move_names.h`),
  fetchText(`${RAW}/src/data/items.h`),
  fetchText(`${RAW}/src/data/pokemon/species_info.h`),
  fetchText(`${RAW}/include/constants/pokemon.h`),
  fetchText(`${RAW}/include/constants/species.h`),
]);

const typeNames = parseTypeNames(pokemonConstH);
const speciesNames = parseSpeciesNames(speciesNamesH);
const moveNames = parseMoveNames(moveNamesH);
const itemNames = parseItemNames(itemNamesH);
const speciesNums = parseEnumNames(speciesConstH, "SPECIES_");
const speciesTypes = parseSpeciesTypes(speciesInfoH, typeNames);
const parties = parseTrainerParties(
  partiesH,
  speciesNames,
  moveNames,
  itemNames,
  speciesTypes,
  speciesNums,
);
const trainerRecords = parseTrainerRecords(trainersFullH);
const battleLookup = buildTrainerBattleLookup(trainerRecords, parties, itemNames);
console.log(`Trainer parties: ${battleLookup.size} entries`);

// ---- emit TypeScript ----
const lines = [];
lines.push("// AUTO-GENERATED by scripts/gen-map-trainers.mjs — do not edit by hand.");
lines.push('import type { MapPoint } from "./mapPoints";');
lines.push("");
lines.push("export interface TrainerPoint extends MapPoint {");
lines.push('  category: "trainer";');
lines.push("  trainerClass: string;");
lines.push("  trainerName: string;");
lines.push("  graphicsId: string;");
lines.push("  spriteSheet: string;");
lines.push("  /** Frame width/height in px (16×32 walkers, 32×32 cyclists, etc.). */");
lines.push("  spriteWidth: number;");
lines.push("  spriteHeight: number;");
lines.push("  /** Standing frame index (0=down, 1=up, 2=left, 3=right). */");
lines.push("  spriteFrame: number;");
lines.push("  mapId?: string;");
lines.push("  trainerId?: string;");
lines.push("  script?: string;");
lines.push("  trainerType?: string;");
lines.push("  /** Line-of-sight tiles for TRAINER_TYPE_NORMAL. */");
lines.push("  sightRange?: number;");
lines.push("  /** Registered for PokeNav Match Call rematches (gRematchTable in Emerald). */");
lines.push("  rematchable?: boolean;");
lines.push("}");
lines.push("");
lines.push("/** First-battle TRAINER_* ids from Emerald's Match Call rematch table. */");
lines.push(
  `export const MATCH_CALL_REMATCH_TRAINER_IDS: ReadonlySet<string> = new Set(${JSON.stringify([...matchCallFirstIds].sort())});`,
);
lines.push("");
lines.push("export function isMatchCallRematchable(trainerId?: string): boolean {");
lines.push("  if (!trainerId) return false;");
lines.push("  if (MATCH_CALL_REMATCH_TRAINER_IDS.has(trainerId)) return true;");
lines.push("  const base = trainerId.replace(/_\\d+$/, \"\");");
lines.push("  for (const id of MATCH_CALL_REMATCH_TRAINER_IDS) {");
lines.push("    if (id.replace(/_\\d+$/, \"\") === base) return true;");
lines.push("  }");
lines.push("  return false;");
lines.push("}");
lines.push("");
function emitTrainer(t, indent = 2) {
  const pad = " ".repeat(indent);
  const desc = t.desc ? `, desc: ${JSON.stringify(t.desc)}` : "";
  const tid = t.trainerId ? `, trainerId: ${JSON.stringify(t.trainerId)}` : "";
  const script = t.script ? `, script: ${JSON.stringify(t.script)}` : "";
  const tt = t.trainerType ? `, trainerType: ${JSON.stringify(t.trainerType)}` : "";
  const sight = t.sightRange ? `, sightRange: ${t.sightRange}` : "";
  const rematch = t.rematchable ? ", rematchable: true" : "";
  return `${pad}{ id: ${JSON.stringify(t.id)}, name: ${JSON.stringify(t.name)}, category: "trainer", trainerClass: ${JSON.stringify(t.trainerClass)}, trainerName: ${JSON.stringify(t.trainerName)}, x: ${t.x}, y: ${t.y}, graphicsId: ${JSON.stringify(t.graphicsId)}, spriteSheet: ${JSON.stringify(t.spriteSheet)}, spriteWidth: ${t.spriteWidth}, spriteHeight: ${t.spriteHeight}, spriteFrame: ${t.spriteFrame}, note: ${JSON.stringify(t.note)}${desc}${tid}${script}${tt}${sight}${rematch}, mapId: ${JSON.stringify(t.mapId)} },`;
}
lines.push("export const MAP_TRAINERS: TrainerPoint[] = [");
for (const t of owOut) {
  lines.push(emitTrainer(t));
}
lines.push("];");
lines.push("");
lines.push("export const AREA_TRAINERS: Record<string, TrainerPoint[]> = {");
for (const [aid, list] of Object.entries(areaOut).sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(`  ${JSON.stringify(aid)}: [`);
  for (const t of list) {
    lines.push(emitTrainer(t, 4));
  }
  lines.push("  ],");
}
lines.push("};");
lines.push("");

fs.writeFileSync(path.join(ROOT, "src/data/mapTrainersGenerated.ts"), lines.join("\n"));
console.log(`\nWrote src/data/mapTrainersGenerated.ts (${owOut.length} overworld, ${Object.keys(areaOut).length} area groups)`);

// Emit trainer battle parties (keyed by TRAINER_* id)
const partyLines = [];
partyLines.push("// AUTO-GENERATED by scripts/gen-map-trainers.mjs — do not edit by hand.");
partyLines.push("");
partyLines.push("export interface TrainerPartyMon {");
partyLines.push("  species: string;");
partyLines.push("  speciesId: number;");
partyLines.push("  level: number;");
partyLines.push("  types: string[];");
partyLines.push("  iv?: number;");
partyLines.push("  heldItem?: string;");
partyLines.push("  moves?: string[];");
partyLines.push("}");
partyLines.push("");
partyLines.push("export interface TrainerBattleData {");
partyLines.push("  doubleBattle: boolean;");
partyLines.push("  partyFlags?: string;");
partyLines.push("  items: string[];");
partyLines.push("  party: TrainerPartyMon[];");
partyLines.push("}");
partyLines.push("");
partyLines.push("export const TRAINER_BATTLES: Record<string, TrainerBattleData> = {");
for (const [tid, data] of [...battleLookup.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  partyLines.push(`  ${JSON.stringify(tid)}: ${JSON.stringify(data)},`);
}
partyLines.push("};");
partyLines.push("");
fs.writeFileSync(path.join(ROOT, "src/data/trainerPartiesGenerated.ts"), partyLines.join("\n"));
console.log(`Wrote src/data/trainerPartiesGenerated.ts (${battleLookup.size} trainers)`);
