/**
 * Extract gym leader + junior trainer overworld sprites from pokeemerald gym maps,
 * download missing PNGs, and emit src/data/gymSpritesGenerated.ts.
 *
 * Usage:
 *   node scripts/sync-gym-sprites.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const SPRITE_DIR = path.join(ROOT, "public/sprites/trainers");
const OUT_TS = path.join(ROOT, "src/data/gymSpritesGenerated.ts");
const OUT_ENTITIES_TS = path.join(ROOT, "src/data/gymMapEntitiesGenerated.ts");

/** mapPointId -> pokeemerald gym interior map folder(s) */
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

/** Leader trainer id -> graphics id when the guide differs from the decomp map event. */
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

const SKIP_MAP_GFX = new Set([
  "OBJ_EVENT_GFX_TRICK_HOUSE_STATUE",
  "OBJ_EVENT_GFX_ITEM_BALL",
  "OBJ_EVENT_GFX_BERRY_TREE",
  "OBJ_EVENT_GFX_PUSHABLE_BOULDER",
  "OBJ_EVENT_GFX_BREAKABLE_ROCK",
  "OBJ_EVENT_GFX_CUT_TREE",
  "OBJ_EVENT_GFX_FOLLOWABLE_POKEBALL",
]);

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

function areaIdFromMapName(name) {
  return name.toLowerCase().replace(/_/g, "-");
}

function toLocalX(x, W) {
  return +(((x + 0.5) / W) * 100).toFixed(2);
}

function toLocalY(y, H) {
  return +(((y + 1) / H) * 100).toFixed(2);
}

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
  const rel = `data/maps/${mapDir}/map.json`;
  const local = path.join(MAPS_DIR, mapDir, "map.json");
  let text;
  if (fs.existsSync(local)) {
    text = repairUtf16Buffer(fs.readFileSync(local));
  } else {
    text = await fetchTextCached(rel, cache);
  }
  return JSON.parse(text);
}

async function loadScripts(mapDir, cache) {
  const rel = `data/maps/${mapDir}/scripts.inc`;
  const local = path.join(MAPS_DIR, mapDir, "scripts.inc");
  try {
    return fs.existsSync(local)
      ? fs.readFileSync(local, "utf8")
      : await fetchTextCached(rel, cache);
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

function gfxIdToPicName(gfxId) {
  const base = gfxId.replace(/^OBJ_EVENT_GFX_/, "");
  return base
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
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

function keyOutTransparency(filePath) {
  const png = PNG.sync.read(fs.readFileSync(filePath));
  const key = png.palette?.[0] ?? { r: 115, g: 197, b: 164 };
  const kr = key.r ?? key[0] ?? 115;
  const kg = key.g ?? key[1] ?? 197;
  const kb = key.b ?? key[2] ?? 164;
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

// ---- load gymData trainer ids from source ----
const gymDataTs = fs.readFileSync(path.join(ROOT, "src/data/gymData.ts"), "utf8");
const gymEntries = [...gymDataTs.matchAll(
  /mapPointId:\s*"([^"]+)"[\s\S]*?leaderTrainerId:\s*"(TRAINER_\w+)"/g,
)].map((m) => ({ mapPointId: m[1], leaderTrainerId: m[2] }));
const leaderIds = gymEntries.map((g) => g.leaderTrainerId);
const juniorIds = [...gymDataTs.matchAll(/trainerId:\s*"(TRAINER_\w+)"/g)].map((m) => m[1]);
const neededTrainerIds = new Set([...leaderIds, ...juniorIds]);
const leaderByMapPoint = Object.fromEntries(gymEntries.map((g) => [g.mapPointId, g.leaderTrainerId]));

console.log(`Gym trainers to resolve: ${neededTrainerIds.size}`);

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

function spritePathForGfx(gfxId) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) return null;
  return `sprites/trainers/${path.basename(rel)}`;
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

// ---- collect trainerId -> sprite from gym maps ----
const byTrainerId = new Map();
const leaderExtras = new Map();

for (const [mapPointId, mapDirs] of Object.entries(GYM_MAPS)) {
  const scriptMaps = [];
  const events = [];

  for (const mapDir of mapDirs) {
    const map = await loadMapJson(mapDir, cache);
    const scripts = await loadScripts(mapDir, cache);
    scriptMaps.push(parseScriptToTrainer(scripts));
    for (const oe of map.object_events || []) events.push({ ...oe, mapDir });
  }

  const scriptToTrainer = new Map();
  for (const sm of scriptMaps) {
    for (const [k, v] of sm) scriptToTrainer.set(k, v);
  }

  // Leaders from gym-leader graphics on the map
  const leaderEvents = events.filter(
    (oe) => GYM_LEADER_GFX.has(oe.graphics_id) && oe.script && !oe.script.startsWith("0x"),
  );

  for (const oe of events) {
    if (!oe.script || oe.script.startsWith("0x")) continue;
    const tid = scriptToTrainer.get(oe.script);
    if (!tid || !neededTrainerIds.has(tid)) continue;
    const sprite = makeSprite(oe.graphics_id, oe.movement_type);
    if (sprite) byTrainerId.set(tid, sprite);
  }

  // Tate & Liza share one trainer id — Tate is primary, Liza is extra
  const tateEvent = leaderEvents.find((oe) => oe.graphics_id === "OBJ_EVENT_GFX_TATE");
  const lizaEvent = leaderEvents.find((oe) => oe.graphics_id === "OBJ_EVENT_GFX_LIZA");
  const leaderTid = leaderByMapPoint[mapPointId];
  if (leaderTid === "TRAINER_TATE_AND_LIZA_1" && tateEvent && lizaEvent) {
    const tateSprite = makeSprite(tateEvent.graphics_id, tateEvent.movement_type);
    const lizaSprite = makeSprite(lizaEvent.graphics_id, lizaEvent.movement_type);
    if (tateSprite) byTrainerId.set(leaderTid, tateSprite);
    if (lizaSprite) leaderExtras.set(leaderTid, [lizaSprite]);
  }

  // Gym leaders whose object-event script differs from the battle script (e.g. Norman)
  for (const oe of leaderEvents) {
    if (!leaderTid || oe.graphics_id === "OBJ_EVENT_GFX_TATE" || oe.graphics_id === "OBJ_EVENT_GFX_LIZA") {
      continue;
    }
    const tid = scriptToTrainer.get(oe.script);
    if (tid === leaderTid) {
      const sprite = makeSprite(oe.graphics_id, oe.movement_type);
      if (sprite) byTrainerId.set(tid, sprite);
    }
  }
}

// Apply manual leader overrides (Wallace sprite while map uses Juan event)
for (const [tid, gfxId] of Object.entries(LEADER_GFX_OVERRIDE)) {
  if (!neededTrainerIds.has(tid)) continue;
  const sprite = makeSprite(gfxId, "MOVEMENT_TYPE_FACE_DOWN");
  if (sprite) byTrainerId.set(tid, sprite);
}

console.log(`Resolved sprites for ${byTrainerId.size}/${neededTrainerIds.size} trainer ids`);
const missing = [...neededTrainerIds].filter((id) => !byTrainerId.has(id));
if (missing.length) console.log("  Missing:", missing.join(", "));

// ---- download sprite PNGs ----
fs.mkdirSync(SPRITE_DIR, { recursive: true });
const gfxNeeded = new Set();
for (const s of byTrainerId.values()) gfxNeeded.add(s.graphicsId);
for (const extras of leaderExtras.values()) {
  for (const s of extras) gfxNeeded.add(s.graphicsId);
}

let dlOk = 0;
let dlFail = 0;
const downloaded = new Set();
for (const gfxId of gfxNeeded) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) {
    console.log("  missing pic path for", gfxId);
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
    keyOutTransparency(outPath);
    dlOk++;
    console.log("  downloaded", outName);
  } catch (e) {
    console.log("  download fail", rel, e.message);
    dlFail++;
  }
}

// Key transparency on all gym-related sheets (including cached)
for (const gfxId of gfxNeeded) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) continue;
  const outPath = path.join(SPRITE_DIR, path.basename(rel));
  if (fs.existsSync(outPath)) keyOutTransparency(outPath);
}

console.log(`Sprites: ${dlOk} ok, ${dlFail} failed`);

// ---- emit TypeScript ----
function emitSprite(obj) {
  return `{
    graphicsId: ${JSON.stringify(obj.graphicsId)},
    spriteSheet: ${JSON.stringify(obj.spriteSheet)},
    spriteWidth: ${obj.spriteWidth},
    spriteHeight: ${obj.spriteHeight},
    spriteFrame: ${obj.spriteFrame},
  }`;
}

const lines = [];
lines.push("// AUTO-GENERATED by scripts/sync-gym-sprites.mjs — do not edit by hand.");
lines.push("");
lines.push("export interface GymTrainerSprite {");
lines.push("  graphicsId: string;");
lines.push("  spriteSheet: string;");
lines.push("  spriteWidth: number;");
lines.push("  spriteHeight: number;");
lines.push("  spriteFrame: number;");
lines.push("}");
lines.push("");
lines.push("export const GYM_TRAINER_SPRITES: Record<string, GymTrainerSprite> = {");
for (const [tid, sprite] of [...byTrainerId.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`  ${JSON.stringify(tid)}: ${emitSprite(sprite)},`);
}
lines.push("};");
lines.push("");
lines.push("/** Secondary leader sprites (e.g. Liza alongside Tate). */");
lines.push("export const GYM_LEADER_EXTRA_SPRITES: Partial<Record<string, GymTrainerSprite[]>> = {");
for (const [tid, extras] of [...leaderExtras.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`  ${JSON.stringify(tid)}: [${extras.map((s) => emitSprite(s)).join(", ")}],`);
}
lines.push("};");
lines.push("");

fs.writeFileSync(OUT_TS, lines.join("\n"));
console.log(`Wrote ${OUT_TS}`);

// ---- gym interior map entities (positioned sprites on area maps) ----
const layoutsJson = JSON.parse(await fetchTextCached("data/layouts/layouts.json", cache));
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));
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

const MAP_DIR_TO_GYM = {};
for (const [mapPointId, dirs] of Object.entries(GYM_MAPS)) {
  for (const dir of dirs) {
    MAP_DIR_TO_GYM[dir] = { mapPointId, leaderTrainerId: leaderByMapPoint[mapPointId] };
  }
}

const GFX_OVERRIDE_TRAINER = Object.fromEntries(
  Object.entries(LEADER_GFX_OVERRIDE).map(([tid, gfx]) => [gfx, tid]),
);

function labelFromScript(script, gfxId) {
  if (!script || script === "0x0") {
    if (gfxId === "OBJ_EVENT_GFX_WALLY") return { class: "Rival", name: "Wally" };
    return null;
  }
  if (/GymGuide/i.test(script)) return { class: "Gym Guide", name: "Gym Guide" };
  const tail = script.match(/_EventScript_(.+)$/);
  if (tail) {
    const raw = tail[1].replace(/([a-z])([A-Z])/g, "$1 $2");
    return { class: titleCase(gfxId.replace(/^OBJ_EVENT_GFX_/, "").replace(/_/g, " ")), name: titleCase(raw) };
  }
  return null;
}

const gymMapEntities = new Map();
const ALL_GYM_DIRS = [...new Set(Object.values(GYM_MAPS).flat())];
let entityId = 0;

for (const mapDir of ALL_GYM_DIRS) {
  const map = await loadMapJson(mapDir, cache);
  const layout = layoutById.get(map.layout);
  if (!layout) continue;
  const W = layout.width;
  const H = layout.height;
  const areaId = areaIdFromMapName(map.name || mapDir);
  const scripts = await loadScripts(mapDir, cache);
  const scriptToTrainer = parseScriptToTrainer(scripts);
  const gymCtx = MAP_DIR_TO_GYM[mapDir];
  const list = [];

  for (const oe of map.object_events || []) {
    if (SKIP_MAP_GFX.has(oe.graphics_id)) continue;
    const sprite = makeSprite(oe.graphics_id, oe.movement_type);
    if (!sprite) continue;

    let trainerId = scriptToTrainer.get(oe.script);
    let meta = trainerId ? trainerMeta.get(trainerId) : null;

    if (GYM_LEADER_GFX.has(oe.graphics_id) && gymCtx) {
      trainerId = gymCtx.leaderTrainerId;
      meta = { class: "Gym Leader", name: titleCase(gymCtx.leaderTrainerId.replace(/^TRAINER_/, "").replace(/_\d+$/, "")) };
      if (trainerId === "TRAINER_TATE_AND_LIZA_1") {
        meta.name = oe.graphics_id === "OBJ_EVENT_GFX_LIZA" ? "Liza" : "Tate";
      }
      if (LEADER_GFX_OVERRIDE[trainerId]) {
        const overrideSprite = makeSprite(LEADER_GFX_OVERRIDE[trainerId], oe.movement_type);
        if (overrideSprite) Object.assign(sprite, overrideSprite);
      }
    } else if (GFX_OVERRIDE_TRAINER[oe.graphics_id]) {
      trainerId = GFX_OVERRIDE_TRAINER[oe.graphics_id];
      meta = trainerMeta.get(trainerId) ?? { class: "Gym Leader", name: "Leader" };
    }

    if (!meta) {
      const fromScript = labelFromScript(oe.script, oe.graphics_id);
      if (!fromScript) continue;
      meta = fromScript;
    }

    const isBattleTrainer = oe.trainer_type && oe.trainer_type !== "TRAINER_TYPE_NONE";
    const label = `${meta.class} ${meta.name}`.trim();
    list.push({
      id: `gym-e${entityId++}`,
      name: label,
      category: "trainer",
      trainerClass: meta.class,
      trainerName: meta.name,
      trainerId: trainerId || undefined,
      x: toLocalX(oe.x, W),
      y: toLocalY(oe.y, H),
      graphicsId: sprite.graphicsId,
      spriteSheet: sprite.spriteSheet,
      spriteWidth: sprite.spriteWidth,
      spriteHeight: sprite.spriteHeight,
      spriteFrame: sprite.spriteFrame,
      desc: isBattleTrainer ? "Gym trainer" : undefined,
      script: oe.script,
      trainerType: oe.trainer_type,
    });
    gfxNeeded.add(sprite.graphicsId);
  }

  if (list.length) gymMapEntities.set(areaId, list);
}

console.log(`Gym map entities: ${[...gymMapEntities.values()].reduce((s, a) => s + a.length, 0)} across ${gymMapEntities.size} maps`);

// Re-download any entity-only sprites
for (const gfxId of gfxNeeded) {
  const pic = gfxIdToPicName(gfxId);
  const rel = picToPath.get(pic);
  if (!rel) continue;
  const outPath = path.join(SPRITE_DIR, path.basename(rel));
  if (!fs.existsSync(outPath)) {
    try {
      const buf = await fetchBuffer(`${RAW}/${rel}`);
      fs.writeFileSync(outPath, buf);
      keyOutTransparency(outPath);
      console.log("  downloaded", path.basename(rel));
    } catch {
      /* skip */
    }
  } else {
    keyOutTransparency(outPath);
  }
}

const entityLines = [];
entityLines.push("// AUTO-GENERATED by scripts/sync-gym-sprites.mjs — do not edit by hand.");
entityLines.push('import type { TrainerPoint } from "./mapTrainersGenerated";');
entityLines.push("");
entityLines.push("/** Positioned overworld sprites on gym interior area maps. */");
entityLines.push("export const GYM_MAP_ENTITIES: Record<string, TrainerPoint[]> = {");
for (const [areaId, entities] of [...gymMapEntities.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  entityLines.push(`  ${JSON.stringify(areaId)}: [`);
  for (const e of entities) {
    entityLines.push(`    {
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
  entityLines.push("  ],");
}
entityLines.push("};");
entityLines.push("");

fs.writeFileSync(OUT_ENTITIES_TS, entityLines.join("\n"));
console.log(`Wrote ${OUT_ENTITIES_TS}`);
