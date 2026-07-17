/**
 * Extract positioned overworld sprites (trainers, NPCs, story Pokémon) for every
 * interior area map in areaMaps.ts. Emits src/data/areaMapEntitiesGenerated.ts.
 *
 * Usage:
 *   node scripts/sync-area-map-entities.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PNG } from "pngjs";
import { mapIdToDir } from "./map-origin-lib.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const TRAINER_SPRITE_DIR = path.join(ROOT, "public/sprites/trainers");
const OVERWORLD_SPRITE_DIR = path.join(ROOT, "public/sprites/overworld");
const OUT_TS = path.join(ROOT, "src/data/areaMapEntitiesGenerated.ts");

/** Gym leader gfx overrides (guide uses Wallace / Norman labels). */
const LEADER_GFX_OVERRIDE = {
  TRAINER_WALLACE: "OBJ_EVENT_GFX_WALLACE",
  TRAINER_NORMAN_1: "OBJ_EVENT_GFX_NORMAN",
};

const GYM_LEADER_GFX = new Set([
  "OBJ_EVENT_GFX_ROXANNE",
  "OBJ_EVENT_GFX_BRAWLY",
  "OBJ_EVENT_GFX_WATTSON",
  "OBJ_EVENT_GFX_FLANNERY",
  "OBJ_EVENT_GFX_NORMAN",
  "OBJ_EVENT_GFX_WINONA",
  "OBJ_EVENT_GFX_TATE",
  "OBJ_EVENT_GFX_LIZA",
  "OBJ_EVENT_GFX_WALLACE",
  "OBJ_EVENT_GFX_JUAN",
]);

const GYM_MAPS = {
  "gym-rustboro": ["RustboroCity_Gym"],
  "gym-dewford": ["DewfordTown_Gym"],
  "gym-mauville": ["MauvilleCity_Gym"],
  "gym-lavaridge": ["LavaridgeTown_Gym_1F", "LavaridgeTown_Gym_B1F"],
  "gym-petalburg": ["PetalburgCity_Gym"],
  "gym-fortree": ["FortreeCity_Gym"],
  "gym-mossdeep": ["MossdeepCity_Gym"],
  "gym-sootopolis": ["SootopolisCity_Gym_1F", "SootopolisCity_Gym_B1F"],
};

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
]);

/** Skip decorations, doll props, and hidden placeholder object events. */
function shouldSkipObjectEvent(oe) {
  const gfx = oe.graphics_id;
  const script = oe.script || "";
  if (SKIP_GFX.has(gfx)) return true;
  if (gfx.includes("_DOLL")) return true;
  if (/^OBJ_EVENT_GFX_VAR_/.test(gfx) && !/Rival/i.test(script)) return true;
  // Invisible triggers (e.g. Steven's house letter) must not draw as OW pins.
  if (oe.movement_type === "MOVEMENT_TYPE_INVISIBLE") return true;
  const flag = oe.flag || "";
  if (flag.includes("FLAG_DECORATION")) return true;
  if (flag.includes("FLAG_HIDE") && (!oe.script || oe.script === "0x0")) return true;
  return false;
}

/** Resolve runtime variable gfx only for real NPC scripts (e.g. Birch lab rival). */
function resolveGfxForEvent(oe) {
  const gfx = oe.graphics_id;
  const script = oe.script || "";
  if (gfx === "OBJ_EVENT_GFX_VAR_0" && /Rival/i.test(script)) return "OBJ_EVENT_GFX_BRENDAN_NORMAL";
  if (gfx === "OBJ_EVENT_GFX_VAR_1" && /Rival/i.test(script)) return "OBJ_EVENT_GFX_MAY_NORMAL";
  return gfx;
}

const SCRIPT_LABELS = {
  LittlerootTown_ProfessorBirchsLab_EventScript_Birch: { class: "Professor", name: "Birch" },
  LittlerootTown_ProfessorBirchsLab_EventScript_Aide: { class: "Aide", name: "Aide" },
  LittlerootTown_ProfessorBirchsLab_EventScript_Rival: { class: "Rival", name: "Rival" },
  RusturfTunnel_EventScript_Wanda: { class: "NPC", name: "Wanda" },
  RusturfTunnel_EventScript_WandasBoyfriend: { class: "Black Belt", name: "Boyfriend" },
  RusturfTunnel_EventScript_Grunt: { class: "Team Aqua", name: "Grunt" },
  RusturfTunnel_EventScript_Peeko: { class: "Pokémon", name: "Peeko" },
  MeteorFalls_1F_1R_EventScript_ProfCozmo: { class: "Professor", name: "Cozmo" },
  GraniteCave_1F_EventScript_Hiker: { class: "Hiker", name: "Hiker" },
  MossdeepCity_StevensHouse_EventScript_Steven: { class: "Champion", name: "Steven" },
  GraniteCave_StevensRoom_EventScript_Steven: { class: "Champion", name: "Steven" },
};

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

function repairUtf16Buffer(buf) {
  if (buf.length < 4 || buf[1] !== 0 || buf[0] < 0x20 || buf[0] > 0x7e) return buf.toString("utf8");
  return buf.toString("utf16le");
}

async function loadMapJson(mapDir, cache) {
  const local = path.join(MAPS_DIR, mapDir, "map.json");
  let text;
  if (fs.existsSync(local)) {
    text = repairUtf16Buffer(fs.readFileSync(local));
  } else {
    text = await fetchTextCached(`data/maps/${mapDir}/map.json`, cache);
  }
  return JSON.parse(text);
}

/** MAP_* id → pokeemerald maps folder (from local checkout). */
function buildMapIdToDir() {
  const out = new Map();
  if (!fs.existsSync(MAPS_DIR)) return out;
  for (const dir of fs.readdirSync(MAPS_DIR)) {
    const mj = path.join(MAPS_DIR, dir, "map.json");
    if (!fs.existsSync(mj)) continue;
    try {
      const text = repairUtf16Buffer(fs.readFileSync(mj));
      const m = JSON.parse(text);
      if (m.id) out.set(m.id, dir);
    } catch {
      /* skip */
    }
  }
  return out;
}

const mapIdToFolder = buildMapIdToDir();
console.log(`Map id index: ${mapIdToFolder.size} maps`);

async function loadScripts(mapDir, cache) {
  const local = path.join(MAPS_DIR, mapDir, "scripts.inc");
  try {
    return fs.existsSync(local)
      ? fs.readFileSync(local, "utf8")
      : await fetchTextCached(`data/maps/${mapDir}/scripts.inc`, cache);
  } catch {
    return "";
  }
}

function parseScriptToTrainer(scriptsText) {
  const map = new Map();
  let current = null;
  for (const line of scriptsText.split(/\r?\n/)) {
    const label = line.match(/^([\w]+)::/);
    if (label) current = label[1];
    const tb = line.match(
      /trainerbattle(?:_(?:single|double|two_trainers|no_intro|continue_script|rematch(?:_double)?))?\s+(?:TRAINER_BATTLE_\w+,\s*)?(TRAINER_\w+)/,
    );
    if (tb && current) map.set(current, tb[1]);
  }
  return map;
}

function titleCase(s) {
  return s
    .replace(/POKéMON/gi, "Pokémon")
    .split(/\s+/)
    .map((w) => {
      if (/^(TM|HM)\d+$/i.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function gfxIdToPicName(gfxId) {
  const base = gfxId.replace(/^OBJ_EVENT_GFX_/, "");
  return base
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
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

function frameForMovement(mt) {
  switch (mt) {
    case "MOVEMENT_TYPE_FACE_UP":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_UP":
      return 1;
    case "MOVEMENT_TYPE_FACE_LEFT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_LEFT":
      return 2;
    case "MOVEMENT_TYPE_FACE_RIGHT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_RIGHT":
      return 3;
    default:
      if (mt?.includes("_UP") && !mt.includes("_DOWN")) return 1;
      if (mt?.includes("_LEFT") && !mt.includes("_RIGHT")) return 2;
      if (mt?.includes("_RIGHT") && !mt.includes("_LEFT")) return 3;
      return 0;
  }
}

function toLocalX(x, W) {
  return +(((x + 0.5) / W) * 100).toFixed(2);
}

function toLocalY(y, H) {
  return +(((y + 1) / H) * 100).toFixed(2);
}

function keyOutTransparency(filePath) {
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const key = png.palette?.[0] ?? { r: 115, g: 197, b: 164 };
  const kr = key.r ?? 115;
  const kg = key.g ?? 197;
  const kb = key.b ?? 164;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    if (r === kr && g === kg && b === kb) png.data[i + 3] = 0;
  }
  fs.writeFileSync(
    filePath,
    PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }),
  );
}

// ---- parse areaMaps.ts ----
const areaTs = fs.readFileSync(path.join(ROOT, "src/data/areaMaps.ts"), "utf8");
const areas = [];
for (const m of areaTs.matchAll(/\{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*mapId:\s*"([^"]+)"/g)) {
  areas.push({ id: m[1], mapId: m[2] });
}
console.log(`Area maps to process: ${areas.length}`);

// Gym context from gymData.ts
const gymDataTs = fs.readFileSync(path.join(ROOT, "src/data/gymData.ts"), "utf8");
const gymEntries = [...gymDataTs.matchAll(
  /mapPointId:\s*"([^"]+)"[\s\S]*?leaderTrainerId:\s*"(TRAINER_\w+)"/g,
)].map((m) => ({ mapPointId: m[1], leaderTrainerId: m[2] }));
const leaderByMapPoint = Object.fromEntries(gymEntries.map((g) => [g.mapPointId, g.leaderTrainerId]));
const MAP_DIR_TO_GYM = {};
for (const [mapPointId, dirs] of Object.entries(GYM_MAPS)) {
  for (const dir of dirs) {
    MAP_DIR_TO_GYM[dir] = { mapPointId, leaderTrainerId: leaderByMapPoint[mapPointId] };
  }
}

const cache = new Map();
const gfxH = await fetchTextCached("src/data/object_events/object_event_graphics.h", cache);
const picToPath = new Map();
for (const mt of gfxH.matchAll(
  /const u32 gObjectEventPic_(\w+)\[\]\s*=\s*INCGFX(?:_U32)?\("([^"]+\.png)"/g,
)) {
  picToPath.set(mt[1], mt[2]);
}

const infoH = await fetchTextCached("src/data/object_events/object_event_graphics_info.h", cache);
const ptrH = await fetchTextCached("src/data/object_events/object_event_graphics_info_pointers.h", cache);
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

function resolveGfxId(gfxId) {
  return gfxId;
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

function makeSprite(gfxId, movementType) {
  const dim = dimsForGfx(gfxId);
  const sheet = spritePathForGfx(gfxId);
  if (!sheet) return null;
  return {
    graphicsId: gfxId,
    spriteSheet: sheet,
    spriteWidth: dim.w,
    spriteHeight: dim.h,
    spriteFrame: frameForMovement(movementType),
  };
}

const trainersH = await fetchTextCached("src/data/trainers.h", cache);
const trainerMeta = new Map();
for (const mt of trainersH.matchAll(
  /\[TRAINER_(\w+)\]\s*=\s*\{[\s\S]*?\.trainerClass\s*=\s*(TRAINER_CLASS_\w+),[\s\S]*?\.trainerName\s*=\s*_\("([^"]*)"\)/g,
)) {
  trainerMeta.set(`TRAINER_${mt[1]}`, {
    class: titleCase(mt[2].replace(/^TRAINER_CLASS_/, "").replace(/_/g, " ")),
    name: titleCase(mt[3]),
  });
}

const layoutsJson = JSON.parse(await fetchTextCached("data/layouts/layouts.json", cache));
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));

const GFX_OVERRIDE_TRAINER = Object.fromEntries(
  Object.entries(LEADER_GFX_OVERRIDE).map(([tid, gfx]) => [gfx, tid]),
);

function resolveMeta(script, gfxId, trainerId, gymCtx) {
  if (GYM_LEADER_GFX.has(gfxId) && gymCtx) {
    const tid = gymCtx.leaderTrainerId;
    let name = gymCtx.leaderTrainerId.replace(/^TRAINER_/, "").replace(/_\d+$/, "");
    name = titleCase(name.replace(/_/g, " "));
    if (tid === "TRAINER_TATE_AND_LIZA_1") {
      name = gfxId === "OBJ_EVENT_GFX_LIZA" ? "Liza" : "Tate";
    }
    return { class: "Gym Leader", name, trainerId: tid };
  }
  if (trainerId && trainerMeta.has(trainerId)) {
    const t = trainerMeta.get(trainerId);
    return { class: t.class, name: t.name, trainerId };
  }
  if (SCRIPT_LABELS[script]) return { ...SCRIPT_LABELS[script], trainerId };
  if (/GymGuide/i.test(script)) return { class: "Gym Guide", name: "Gym Guide", trainerId };
  if (script && script !== "0x0") {
    const tail = script.match(/_EventScript_(.+)$/);
    if (tail) {
      const raw = tail[1].replace(/([a-z])([A-Z])/g, "$1 $2");
      return {
        class: classLabelFromGfx(gfxId),
        name: titleCase(raw),
        trainerId,
      };
    }
  }
  if (gfxId.includes("KYOGRE") || gfxId.includes("GROUDON") || gfxId.includes("RAYQUAZA")) {
    const name = titleCase(gfxId.replace(/^OBJ_EVENT_GFX_/, "").replace(/_/g, " "));
    return { class: "Legendary", name, trainerId };
  }
  if (picToPath.get(gfxIdToPicName(resolveGfxId(gfxId)))?.includes("/pokemon/")) {
    const name = titleCase(gfxId.replace(/^OBJ_EVENT_GFX_/, "").replace(/_/g, " "));
    return { class: "Pokémon", name, trainerId };
  }
  const cls = classLabelFromGfx(gfxId);
  if (script === "0x0" && cls) return { class: cls, name: cls, trainerId };
  return null;
}

const areaEntities = new Map();
const gfxNeeded = new Set();
let entityId = 0;

for (const { id: areaId, mapId } of areas) {
  // Petalburg Gym room crops bake NPCs into the PNG; full-map Y% coords land wrong.
  if (/^petalburgcity-gym(?:-|$)/.test(areaId) && !/-battle$|-intro$/.test(areaId)) {
    continue;
  }
  // Steven's house bakes Steven into the PNG (tiny interior; overlay pins stayed screen-sized).
  if (areaId === "mossdeepcity-stevenshouse") {
    continue;
  }
  // Ch. 7 Oldale Event 1 maps bake every NPC into the PNG.
  if (
    areaId === "oldaletown" ||
    areaId === "oldaletown-mart" ||
    areaId === "oldaletown-pokemoncenter-1f"
  ) {
    continue;
  }
  const mapDir = mapIdToFolder.get(mapId) ?? mapIdToDir(mapId);
  let map;
  try {
    map = await loadMapJson(mapDir, cache);
  } catch (e) {
    console.log("  skip map load", mapId, mapDir, e.message);
    continue;
  }
  const layout = layoutById.get(map.layout);
  if (!layout) continue;
  const W = layout.width;
  const H = layout.height;
  const scripts = await loadScripts(mapDir, cache);
  const scriptToTrainer = parseScriptToTrainer(scripts);
  const gymCtx = MAP_DIR_TO_GYM[mapDir] ?? MAP_DIR_TO_GYM[map.name];
  const list = [];

  for (const oe of map.object_events || []) {
    if (shouldSkipObjectEvent(oe)) continue;
    let trainerId = scriptToTrainer.get(oe.script);
    let gfxId = resolveGfxForEvent(oe);

    if (GYM_LEADER_GFX.has(gfxId) && gymCtx) {
      trainerId = gymCtx.leaderTrainerId;
      if (LEADER_GFX_OVERRIDE[trainerId]) gfxId = LEADER_GFX_OVERRIDE[trainerId];
    } else if (GFX_OVERRIDE_TRAINER[gfxId]) {
      trainerId = GFX_OVERRIDE_TRAINER[gfxId];
    }

    const sprite = makeSprite(gfxId, oe.movement_type);
    if (!sprite) continue;

    const meta = resolveMeta(oe.script, oe.graphics_id, trainerId, gymCtx);
    if (!meta) continue;

    const isBattle =
      oe.trainer_type &&
      oe.trainer_type !== "TRAINER_TYPE_NONE" &&
      oe.trainer_type !== "TRAINER_TYPE_BURIED";
    const isBuried = oe.trainer_type === "TRAINER_TYPE_BURIED";

    list.push({
      id: `area-e${entityId++}`,
      name: `${meta.class} ${meta.name}`.trim(),
      category: "trainer",
      trainerClass: meta.class,
      trainerName: meta.name,
      trainerId: meta.trainerId || trainerId || undefined,
      x: toLocalX(oe.x, W),
      y: toLocalY(oe.y, H),
      graphicsId: sprite.graphicsId,
      spriteSheet: sprite.spriteSheet,
      spriteWidth: sprite.spriteWidth,
      spriteHeight: sprite.spriteHeight,
      spriteFrame: sprite.spriteFrame,
      desc: isBattle ? "Trainer" : isBuried ? "Hidden trainer" : undefined,
      script: oe.script,
      trainerType: oe.trainer_type,
    });
    gfxNeeded.add(gfxId);
  }

  if (list.length) areaEntities.set(areaId, list);
}

console.log(
  `Area map entities: ${[...areaEntities.values()].reduce((s, a) => s + a.length, 0)} across ${areaEntities.size} maps`,
);

// ---- download sprites ----
fs.mkdirSync(TRAINER_SPRITE_DIR, { recursive: true });
fs.mkdirSync(OVERWORLD_SPRITE_DIR, { recursive: true });
let dlOk = 0;
let dlFail = 0;
const downloaded = new Set();

for (const gfxId of gfxNeeded) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) {
    dlFail++;
    continue;
  }
  const outName = localSpriteFile(rel);
  if (downloaded.has(outName)) continue;
  downloaded.add(outName);
  const outDir = rel.includes("/pokemon/") ? OVERWORLD_SPRITE_DIR : TRAINER_SPRITE_DIR;
  const outPath = path.join(outDir, outName);
  if (fs.existsSync(outPath)) {
    dlOk++;
    continue;
  }
  try {
    const buf = await fetchBuffer(`${RAW}/${rel}`);
    fs.writeFileSync(outPath, buf);
    keyOutTransparency(outPath);
    dlOk++;
    console.log("  downloaded", outName);
  } catch (e) {
    console.log("  download fail", rel, e.message);
    dlFail++;
  }
}

for (const gfxId of gfxNeeded) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) continue;
  const outDir = rel.includes("/pokemon/") ? OVERWORLD_SPRITE_DIR : TRAINER_SPRITE_DIR;
  const outPath = path.join(outDir, localSpriteFile(rel));
  if (fs.existsSync(outPath)) keyOutTransparency(outPath);
}

console.log(`Sprites: ${dlOk} ok, ${dlFail} failed`);

// ---- emit TypeScript ----
const lines = [];
lines.push("// AUTO-GENERATED by scripts/sync-area-map-entities.mjs — do not edit by hand.");
lines.push('import type { TrainerPoint } from "./mapTrainersGenerated";');
lines.push("");
lines.push("/** Positioned sprites on interior area maps (trainers, NPCs, story Pokémon). */");
lines.push("export const AREA_MAP_ENTITIES: Record<string, TrainerPoint[]> = {");
for (const [areaId, entities] of [...areaEntities.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`  ${JSON.stringify(areaId)}: [`);
  for (const e of entities) {
    lines.push(`    {
      id: ${JSON.stringify(e.id)},
      name: ${JSON.stringify(e.name)},
      category: "trainer",
      trainerClass: ${JSON.stringify(e.trainerClass)},
      trainerName: ${JSON.stringify(e.trainerName)},
      ${e.trainerId ? `trainerId: ${JSON.stringify(e.trainerId)},` : ""}
      x: ${e.x},
      y: ${e.y},
      graphicsId: ${JSON.stringify(e.graphicsId)},
      spriteSheet: ${JSON.stringify(e.spriteSheet)},
      spriteWidth: ${e.spriteWidth},
      spriteHeight: ${e.spriteHeight},
      spriteFrame: ${e.spriteFrame},
      ${e.desc ? `desc: ${JSON.stringify(e.desc)},` : ""}
      ${e.script ? `script: ${JSON.stringify(e.script)},` : ""}
      ${e.trainerType ? `trainerType: ${JSON.stringify(e.trainerType)},` : ""}
    },`);
  }
  lines.push("  ],");
}
lines.push("};");
lines.push("");

fs.writeFileSync(OUT_TS, lines.join("\n"));
console.log(`Wrote ${OUT_TS}`);
