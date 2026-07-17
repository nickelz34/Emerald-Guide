/**
 * Bake Ch. 11–25 area-map NPCs/trainers into their PNGs (same pattern as
 * Ch. 1–10): paint OW sprites into the art and emit cutscene entities with
 * bakedInImage for legend / hit targets.
 *
 * Covers clear-cut interiors plus full gym floors, Petalburg Woods, Rusturf
 * Tunnel, and Trick House puzzle rooms.
 *
 * Usage: node scripts/bake-ch11-25-area-npcs.mjs
 *
 * Entity metadata: scripts/data/ch11-25-bake-entities.json
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT = "/opt/cursor/artifacts/ch11-25-area-npcs-baked";
const SOURCE = path.join(ROOT, "scripts/data/ch11-25-bake-entities.json");

if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald");
  process.exit(1);
}
if (!fs.existsSync(SOURCE)) {
  console.error("Missing", SOURCE);
  process.exit(1);
}

const sourceEntities = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

const layoutsJson = JSON.parse(
  fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"),
);
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l?.id) layoutById.set(l.id, l);

/** Palette tag → .pal file for each OBJ_EVENT_GFX_* */
const gfxPalette = new Map();
{
  const infoH = fs.readFileSync(
    path.join(REPO, "src/data/object_events/object_event_graphics_info.h"),
    "utf8",
  );
  const ptrH = fs.readFileSync(
    path.join(REPO, "src/data/object_events/object_event_graphics_info_pointers.h"),
    "utf8",
  );
  const infoPal = new Map();
  for (const m of infoH.matchAll(
    /gObjectEventGraphicsInfo_(\w+)\s*=\s*\{[\s\S]*?\.paletteTag\s*=\s*(OBJ_EVENT_PAL_TAG_\w+)/g,
  )) {
    infoPal.set(m[1], m[2]);
  }
  const palFile = {
    OBJ_EVENT_PAL_TAG_NPC_1: "npc_1.pal",
    OBJ_EVENT_PAL_TAG_NPC_2: "npc_2.pal",
    OBJ_EVENT_PAL_TAG_NPC_3: "npc_3.pal",
    OBJ_EVENT_PAL_TAG_NPC_4: "npc_4.pal",
    OBJ_EVENT_PAL_TAG_BRENDAN: "brendan.pal",
    OBJ_EVENT_PAL_TAG_MAY: "may.pal",
  };
  for (const m of ptrH.matchAll(
    /\[(OBJ_EVENT_GFX_\w+)\]\s*=\s*&gObjectEventGraphicsInfo_(\w+)/g,
  )) {
    const tag = infoPal.get(m[2]);
    const file = tag && palFile[tag];
    if (file) gfxPalette.set(m[1], `graphics/object_events/palettes/${file}`);
  }
}

const tilesetDir = (sym, kind) => {
  const name = sym
    .replace(/^gTileset_/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
  return `data/tilesets/${kind}/${name}`;
};

const tsCache = new Map();
function loadTileset(relDir) {
  if (tsCache.has(relDir)) return tsCache.get(relDir);
  const dir = path.join(REPO, relDir);
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, "tiles.png")));
  const { width: W, height: H, data } = png;
  const pal = png.palette || [];
  const rev = new Map();
  for (let i = 0; i < pal.length; i++) {
    const [r, g, b] = pal[i];
    rev.set((r << 16) | (g << 8) | b, i);
  }
  const tilesX = W >> 3;
  const tilesY = H >> 3;
  const nTiles = tilesX * tilesY;
  const tiles = new Array(nTiles);
  for (let t = 0; t < nTiles; t++) {
    const tc = t % tilesX;
    const tr = (t / tilesX) | 0;
    const arr = new Uint8Array(64);
    for (let py = 0; py < 8; py++) {
      for (let px = 0; px < 8; px++) {
        const x = tc * 8 + px;
        const y = tr * 8 + py;
        const o = (y * W + x) * 4;
        const key = (data[o] << 16) | (data[o + 1] << 8) | data[o + 2];
        arr[py * 8 + px] = rev.get(key) ?? 0;
      }
    }
    tiles[t] = arr;
  }
  const pals = new Array(16);
  for (let p = 0; p < 16; p++) {
    const pf = path.join(dir, "palettes", String(p).padStart(2, "0") + ".pal");
    const cols = new Uint8Array(48);
    if (fs.existsSync(pf)) {
      const lines = fs.readFileSync(pf, "utf8").split(/\r?\n/);
      for (let c = 0; c < 16; c++) {
        const parts = (lines[3 + c] || "").trim().split(/\s+/);
        cols[c * 3] = +parts[0] || 0;
        cols[c * 3 + 1] = +parts[1] || 0;
        cols[c * 3 + 2] = +parts[2] || 0;
      }
    }
    pals[p] = cols;
  }
  const meta = fs.readFileSync(path.join(dir, "metatiles.bin"));
  const obj = { tiles, nTiles, pals, meta };
  tsCache.set(relDir, obj);
  return obj;
}

const metaCache = new Map();
function getMetatile(pdir, sdir, id) {
  const key = `${pdir}|${sdir}|${id}`;
  let m = metaCache.get(key);
  if (m) return m;
  const prim = loadTileset(pdir);
  const sec = loadTileset(sdir);
  const out = new Uint8Array(1024);
  const mSrc = id < 512 ? prim : sec;
  const mOff = (id < 512 ? id : id - 512) * 16;
  if (mOff + 16 <= mSrc.meta.length) {
    for (let layer = 0; layer < 2; layer++) {
      for (let s = 0; s < 4; s++) {
        const e = mOff + (layer * 4 + s) * 2;
        const val = mSrc.meta[e] | (mSrc.meta[e + 1] << 8);
        const tileId = val & 0x3ff;
        const xflip = (val >> 10) & 1;
        const yflip = (val >> 11) & 1;
        const pal = (val >> 12) & 0xf;
        const tsrc = tileId < 512 ? prim : sec;
        const tid = tileId < 512 ? tileId : tileId - 512;
        if (tid >= tsrc.nTiles) continue;
        const tile = tsrc.tiles[tid];
        const cols = pal < 6 ? prim.pals[pal] : sec.pals[pal];
        const sx = (s & 1) * 8;
        const sy = (s >> 1) * 8;
        for (let py = 0; py < 8; py++) {
          const ty = yflip ? 7 - py : py;
          for (let px = 0; px < 8; px++) {
            const tx = xflip ? 7 - px : px;
            const ci = tile[ty * 8 + tx];
            if (layer === 1 && ci === 0) continue;
            const o = ((sy + py) * 16 + (sx + px)) * 4;
            out[o] = cols[ci * 3];
            out[o + 1] = cols[ci * 3 + 1];
            out[o + 2] = cols[ci * 3 + 2];
            out[o + 3] = 255;
          }
        }
      }
    }
  }
  metaCache.set(key, out);
  return out;
}

function renderLayout(layout) {
  const W = layout.width;
  const H = layout.height;
  const pdir = tilesetDir(layout.primary_tileset, "primary");
  const sdir = tilesetDir(layout.secondary_tileset, "secondary");
  const bin = fs.readFileSync(path.join(REPO, layout.blockdata_filepath));
  const OW = W * 16;
  const OH = H * 16;
  const png = new PNG({ width: OW, height: OH, colorType: 6 });
  const ob = png.data;
  for (let i = 0; i < ob.length; i += 4) {
    ob[i] = 56;
    ob[i + 1] = 104;
    ob[i + 2] = 168;
    ob[i + 3] = 255;
  }
  for (let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      const ci = (row * W + col) * 2;
      if (ci + 1 >= bin.length) continue;
      const val = bin[ci] | (bin[ci + 1] << 8);
      const mt = getMetatile(pdir, sdir, val & 0x3ff);
      const px = col * 16;
      const py = row * 16;
      for (let ry = 0; ry < 16; ry++) {
        const dst = ((py + ry) * OW + px) * 4;
        ob.set(mt.subarray(ry * 64, ry * 64 + 64), dst);
      }
    }
  }
  return png;
}

function loadIndexedSprite(relPng, relPal) {
  const png = PNG.sync.read(fs.readFileSync(path.join(REPO, relPng)));
  let palette = null;
  if (relPal) {
    const lines = fs.readFileSync(path.join(REPO, relPal), "utf8").split(/\r?\n/);
    palette = [];
    for (let c = 0; c < 16; c++) {
      const parts = (lines[3 + c] || "").trim().split(/\s+/).map(Number);
      palette.push({ r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0 });
    }
  } else if (png.palette) {
    palette = png.palette.map(([r, g, b]) => ({ r, g, b }));
  }
  return { png, palette };
}

function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW = 16, frameH = 32 } = {}) {
  const { png, palette } = sprite;
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const sx = frameX + col;
      const sy = row;
      if (sx >= png.width || sy >= png.height) continue;
      const si = (sy * png.width + sx) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
      let a = png.data[si + 3];
      if (palette) {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < palette.length; i++) {
          const pr = palette[i].r;
          const pg = palette[i].g;
          const pb = palette[i].b;
          const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best === 0) continue;
        r = palette[best].r;
        g = palette[best].g;
        b = palette[best].b;
        if (r === 255 && g === 0 && b === 255) continue;
        a = 255;
      } else if (a === 0 || (r === 255 && g === 0 && b === 255)) {
        continue;
      }
      const tx = flipX ? dx + (frameW - 1 - col) : dx + col;
      const ty = dy + row;
      if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
      const di = (ty * dest.width + tx) * 4;
      dest.data[di] = r;
      dest.data[di + 1] = g;
      dest.data[di + 2] = b;
      dest.data[di + 3] = 255;
    }
  }
}

function facingFromMovement(mt) {
  switch (mt) {
    case "MOVEMENT_TYPE_FACE_UP":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_UP":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_UP":
      return "north";
    case "MOVEMENT_TYPE_FACE_LEFT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_LEFT":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_LEFT":
      return "west";
    case "MOVEMENT_TYPE_FACE_RIGHT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_RIGHT":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_RIGHT":
      return "east";
    default:
      if (mt?.includes("_UP") && !mt.includes("_DOWN")) return "north";
      if (mt?.includes("_LEFT") && !mt.includes("_RIGHT")) return "west";
      if (mt?.includes("_RIGHT") && !mt.includes("_LEFT")) return "east";
      return "south";
  }
}

function facingFromSpriteFrame(frame) {
  if (frame === 1) return "north";
  if (frame === 2) return "west";
  if (frame === 3) return "east";
  return "south";
}

function placeOw(dest, sprite, tileX, tileY, facing, frameH = 32) {
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  const dy = frameH === 16 ? tileY * 16 : tileY * 16 - 16;
  blitSprite(dest, sprite, tileX * 16, dy, {
    flipX: facing === "east",
    frameX: frame * 16,
    frameW: 16,
    frameH,
  });
}

function toLocalX(x, W) {
  return +(((x + 0.5) / W) * 100).toFixed(2);
}
function toLocalY(y, H) {
  return +(((y + 1) / H) * 100).toFixed(2);
}

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
}

function clonePng(src) {
  const out = new PNG({ width: src.width, height: src.height, colorType: 6 });
  out.data.set(src.data);
  return out;
}

/** public spriteSheet → pokeemerald PNG path */
function repoPngFromPublic(spriteSheet) {
  if (spriteSheet.startsWith("sprites/overworld/")) {
    const name = spriteSheet.replace("sprites/overworld/", "").replace(/\.png$/, "");
    return `graphics/object_events/pics/pokemon/${name}.png`;
  }
  let rest = spriteSheet.replace(/^sprites\/trainers\//, "").replace(/\.png$/, "");
  if (rest.startsWith("gym_leaders_")) {
    return `graphics/object_events/pics/people/gym_leaders/${rest.slice("gym_leaders_".length)}.png`;
  }
  if (rest.startsWith("team_aqua_")) {
    return `graphics/object_events/pics/people/team_aqua/${rest.slice("team_aqua_".length)}.png`;
  }
  if (rest.startsWith("team_magma_")) {
    return `graphics/object_events/pics/people/team_magma/${rest.slice("team_magma_".length)}.png`;
  }
  if (rest === "brendan_walking") {
    return "graphics/object_events/pics/people/brendan/walking.png";
  }
  if (rest === "may_walking") {
    return "graphics/object_events/pics/people/may/walking.png";
  }
  return `graphics/object_events/pics/people/${rest}.png`;
}

const spriteCache = new Map();
function spriteForEntity(ent) {
  const key = `${ent.graphicsId}|${ent.spriteSheet}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const repoPng = repoPngFromPublic(ent.spriteSheet);
  const repoPal = gfxPalette.get(ent.graphicsId) || null;
  if (!fs.existsSync(path.join(REPO, repoPng))) {
    throw new Error(`Missing sprite PNG ${repoPng} for ${ent.graphicsId}`);
  }
  const s = loadIndexedSprite(repoPng, repoPal);
  spriteCache.set(key, s);
  return s;
}

const MAPS = [
  { areaId: "sstidallowerdeck", mapDir: "SSTidalLowerDeck", file: "sstidallowerdeck-npcs.png" },
  { areaId: "route110-trickhouseend", mapDir: "Route110_TrickHouseEnd", file: "route110-trickhouseend-npcs.png" },
  { areaId: "petalburgwoods", mapDir: "PetalburgWoods", file: "petalburgwoods-npcs.png" },
  { areaId: "rusturftunnel", mapDir: "RusturfTunnel", file: "rusturftunnel-npcs.png" },
  { areaId: "rustborocity-gym", mapDir: "RustboroCity_Gym", file: "rustborocity-gym-npcs.png" },
  { areaId: "dewfordtown-gym", mapDir: "DewfordTown_Gym", file: "dewfordtown-gym-npcs.png" },
  { areaId: "mauvillecity-gym", mapDir: "MauvilleCity_Gym", file: "mauvillecity-gym-npcs.png" },
  { areaId: "route110-trickhousepuzzle1", mapDir: "Route110_TrickHousePuzzle1", file: "route110-trickhousepuzzle1-npcs.png" },
  { areaId: "route110-trickhousepuzzle2", mapDir: "Route110_TrickHousePuzzle2", file: "route110-trickhousepuzzle2-npcs.png" },
  { areaId: "route110-trickhousepuzzle3", mapDir: "Route110_TrickHousePuzzle3", file: "route110-trickhousepuzzle3-npcs.png" },
  { areaId: "route110-trickhousepuzzle4", mapDir: "Route110_TrickHousePuzzle4", file: "route110-trickhousepuzzle4-npcs.png" },
  { areaId: "route110-trickhousepuzzle6", mapDir: "Route110_TrickHousePuzzle6", file: "route110-trickhousepuzzle6-npcs.png" },
  { areaId: "route110-trickhousepuzzle7", mapDir: "Route110_TrickHousePuzzle7", file: "route110-trickhousepuzzle7-npcs.png" },
  { areaId: "route110-trickhousepuzzle8", mapDir: "Route110_TrickHousePuzzle8", file: "route110-trickhousepuzzle8-npcs.png" },
];

fs.mkdirSync(ARTIFACT, { recursive: true });
const cutsceneByArea = {};
const FACE = { south: 0, north: 1, west: 2, east: 2 };

for (const mapSpec of MAPS) {
  const ents = sourceEntities[mapSpec.areaId];
  if (!ents?.length) {
    console.error("No source entities for", mapSpec.areaId);
    process.exit(1);
  }
  const mapJson = JSON.parse(
    fs.readFileSync(path.join(REPO, "data/maps", mapSpec.mapDir, "map.json"), "utf8"),
  );
  const layout = layoutById.get(mapJson.layout);
  if (!layout) {
    console.error("Missing layout", mapJson.layout);
    process.exit(1);
  }
  const W = layout.width;
  const H = layout.height;
  const base = renderLayout(layout);
  const scene = clonePng(base);
  writePng(path.join(ARTIFACT, mapSpec.file.replace(".png", "-clean.png")), base);

  const baked = [];
  for (const ent of ents) {
    const oe = (mapJson.object_events || []).find((e) => e.script === ent.script);
    if (!oe) {
      console.warn("  missing OE for", ent.id, ent.script);
      continue;
    }
    // Prefer map.json movement — generated overlays use frame 3 for east
    // without flipX, while bake uses frame 2 + spriteFlipX.
    const facing = facingFromMovement(oe.movement_type);
    const frameH = ent.spriteHeight === 16 ? 16 : 32;
    placeOw(scene, spriteForEntity(ent), oe.x, oe.y, facing, frameH);
    const id = String(ent.id).startsWith("area-")
      ? `${mapSpec.areaId}-${(ent.trainerName || ent.name || "npc")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`
      : ent.id;
    baked.push({
      id,
      name: ent.name,
      category: ent.category || "trainer",
      x: toLocalX(oe.x, W),
      y: toLocalY(oe.y, H),
      desc: ent.desc || `${ent.name} on ${mapSpec.areaId}.`,
      spriteSheet: ent.spriteSheet,
      spriteWidth: ent.spriteWidth || 16,
      spriteHeight: frameH,
      spriteFrame: FACE[facing] ?? 0,
      ...(facing === "east" ? { spriteFlipX: true } : {}),
      note: mapSpec.areaId,
      bakedInImage: true,
      ...(ent.trainerClass ? { trainerClass: ent.trainerClass } : {}),
      ...(ent.trainerName ? { trainerName: ent.trainerName } : {}),
      ...(ent.trainerId ? { trainerId: ent.trainerId } : {}),
      graphicsId: ent.graphicsId,
      script: ent.script,
    });
    console.log(`  ${mapSpec.areaId}: ${ent.name} @(${oe.x},${oe.y}) ${facing}`);
  }

  const alsoWrite = [mapSpec.file.replace("-npcs.png", ".png")];
  for (const file of [mapSpec.file, ...alsoWrite]) {
    writePng(path.join(AREA_DIR, file), scene);
    writePng(path.join(ARTIFACT, file), scene);
  }
  cutsceneByArea[mapSpec.areaId] = baked;
}

fs.writeFileSync(
  path.join(ARTIFACT, "cutscene-entities.json"),
  JSON.stringify(cutsceneByArea, null, 2),
);
console.log("Wrote", path.join(ARTIFACT, "cutscene-entities.json"));
console.log(
  "Total entities:",
  Object.values(cutsceneByArea).reduce((n, a) => n + a.length, 0),
);
