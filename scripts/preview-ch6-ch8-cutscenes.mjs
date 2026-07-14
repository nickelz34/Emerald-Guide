/**
 * Render Chapter 6–8 cutscene maps from pokeemerald (pregame numbering):
 *   Ch. 6 — Route 103 (rival)
 *   Ch. 7 — Route 102 (trainers / Ralts / into Petalburg)
 *   Ch. 8 — Petalburg City (Norman, Wally tutorial, stock up)
 *
 * Installs tiles/ambient area maps under public/maps/areas/.
 * Interactive cutscene sprites live in areaMapCutsceneEntities.ts.
 *
 * Requires .calib/pokeemerald.
 *
 * Usage: node scripts/preview-ch6-ch8-cutscenes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const PREVIEW_DIRS = [
  path.join(ROOT, "public/screenshots/previews/chapter6"),
  path.join(ROOT, "public/screenshots/previews/chapter7"),
  path.join(ROOT, "public/screenshots/previews/chapter8"),
  "/opt/cursor/artifacts/chapter6-8-cutscenes",
];

if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald — clone pret/pokeemerald first.");
  process.exit(1);
}

const layoutsJson = JSON.parse(
  fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"),
);
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l?.id) layoutById.set(l.id, l);

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

function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW, frameH } = {}) {
  const { png, palette } = sprite;
  const fw = frameW ?? png.width;
  const fh = frameH ?? png.height;
  for (let row = 0; row < fh; row++) {
    for (let col = 0; col < fw; col++) {
      const sx = frameX + col;
      const sy = row;
      const si = (sy * png.width + sx) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
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
      } else if (png.data[si + 3] === 0) {
        continue;
      }
      const tx = flipX ? dx + (fw - 1 - col) : dx + col;
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

function clonePng(src) {
  const out = new PNG({ width: src.width, height: src.height, colorType: 6 });
  out.data.set(src.data);
  return out;
}

function scaleNearest(src, scale) {
  const out = new PNG({
    width: src.width * scale,
    height: src.height * scale,
    colorType: 6,
  });
  for (let y = 0; y < out.height; y++) {
    for (let x = 0; x < out.width; x++) {
      const si = (((y / scale) | 0) * src.width + ((x / scale) | 0)) * 4;
      const di = (y * out.width + x) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function cropPng(src, { x, y, w, h }) {
  const out = new PNG({ width: w, height: h, colorType: 6 });
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const sx = x + col;
      const sy = y + row;
      const si = (sy * src.width + sx) * 4;
      const di = (row * w + col) * 4;
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) {
        out.data[di] = 56;
        out.data[di + 1] = 104;
        out.data[di + 2] = 168;
        out.data[di + 3] = 255;
        continue;
      }
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function writePreview(basename, png, dirs) {
  const buf = PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true });
  const big = scaleNearest(png, 2);
  const bigBuf = PNG.sync.write({ ...big, colorType: 6, inputHasAlpha: true });
  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${basename}.png`), buf);
    fs.writeFileSync(path.join(dir, `${basename}@2x.png`), bigBuf);
  }
  console.log(`  preview ${basename}.png (${png.width}×${png.height})`);
}

function writeArea(file, png) {
  fs.mkdirSync(AREA_DIR, { recursive: true });
  const out = path.join(AREA_DIR, file);
  fs.writeFileSync(out, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
  console.log(`  area   ${file} (${png.width}×${png.height})`);
}

function loadMap(dirName) {
  const mj = JSON.parse(
    fs.readFileSync(path.join(REPO, "data/maps", dirName, "map.json"), "utf8"),
  );
  const layout = layoutById.get(mj.layout);
  if (!layout) throw new Error(`Missing layout ${mj.layout}`);
  return { map: mj, layout };
}

/** Emerald standing frames: 0 south, 1 north, 2 west (east = 2 + hFlip). */
const FACE = { south: 0, north: 1, west: 2, east: 2 };

const SPRITES = {
  may: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/may/walking.png",
      "graphics/object_events/palettes/may.pal",
    ),
  brendan: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/brendan/walking.png",
      "graphics/object_events/palettes/brendan.pal",
    ),
  mom: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/mom.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  norman: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/gym_leaders/norman.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
  wally: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/wally.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
  zigzagoon: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/pokemon/zigzagoon.png",
      "graphics/object_events/palettes/enemy_zigzagoon.pal",
    ),
  boy1: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/boy_1.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  boy2: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/boy_2.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  lass: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/lass.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  youngster: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/youngster.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  bugCatcher: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/bug_catcher.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  littleBoy: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/little_boy.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  man3: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/man_3.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
  woman2: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/woman_2.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  twin: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/twin.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  fisherman: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/fisherman.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  gentleman: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/gentleman.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
  fatMan: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/fat_man.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  nurse: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/nurse.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  mart: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/mart_employee.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
};

function placePerson(dest, sprite, tileX, tileY, facing = "south") {
  const frame = FACE[facing] ?? 0;
  const flipX = facing === "east";
  blitSprite(dest, sprite, tileX * 16, tileY * 16 - 16, {
    flipX,
    frameX: frame * 16,
    frameW: 16,
    frameH: 32,
  });
}

function place16(dest, sprite, tileX, tileY, { frame = 0, flipX = false, frameW = 16 } = {}) {
  blitSprite(dest, sprite, tileX * 16, tileY * 16, {
    flipX,
    frameX: frame * frameW,
    frameW,
    frameH: 16,
  });
}

const PEOPLE = {
  OBJ_EVENT_GFX_BOY_1: ["boy1", "south"],
  OBJ_EVENT_GFX_BOY_2: ["boy2", "south"],
  OBJ_EVENT_GFX_LASS: ["lass", "south"],
  OBJ_EVENT_GFX_YOUNGSTER: ["youngster", "south"],
  OBJ_EVENT_GFX_BUG_CATCHER: ["bugCatcher", "south"],
  OBJ_EVENT_GFX_LITTLE_BOY: ["littleBoy", "south"],
  OBJ_EVENT_GFX_MAN_3: ["man3", "south"],
  OBJ_EVENT_GFX_WOMAN_2: ["woman2", "south"],
  OBJ_EVENT_GFX_TWIN: ["twin", "south"],
  OBJ_EVENT_GFX_FISHERMAN: ["fisherman", "south"],
  OBJ_EVENT_GFX_GENTLEMAN: ["gentleman", "south"],
  OBJ_EVENT_GFX_FAT_MAN: ["fatMan", "south"],
  OBJ_EVENT_GFX_NURSE: ["nurse", "south"],
  OBJ_EVENT_GFX_MART_EMPLOYEE: ["mart", "east"],
};

function placeAmbient(dest, map) {
  for (const oe of map.object_events || []) {
    const hit = PEOPLE[oe.graphics_id];
    if (!hit) continue;
    const [key, facing] = hit;
    placePerson(dest, SPRITES[key](), oe.x, oe.y, facing);
  }
}

const ch6 = [PREVIEW_DIRS[0], PREVIEW_DIRS[3]];
const ch7 = [PREVIEW_DIRS[1], PREVIEW_DIRS[3]];
const ch8 = [PREVIEW_DIRS[2], PREVIEW_DIRS[3]];

console.log("Chapter 6 — Route 103");
{
  const { map, layout } = loadMap("Route103");
  const base = renderLayout(layout);
  const ambient = clonePng(base);
  placeAmbient(ambient, map);
  writePreview("event-1-route103-tiles", base, ch6);
  writePreview("event-1-route103-ambient", ambient, ch6);
  writeArea("route103.png", base); // tiles-only; rival is an interactive overlay

  // Rival at map.json VAR_0 (10, 3) — May (player as Brendan)
  const rival = clonePng(base);
  placePerson(rival, SPRITES.may(), 10, 3, "south");
  writePreview("event-1-2-rival-may", rival, ch6);
  const rivalFocus = cropPng(rival, { x: 5 * 16, y: 0, w: 12 * 16, h: 10 * 16 });
  writePreview("event-1-2-rival-focus", rivalFocus, ch6);
}

console.log("Chapter 6 — Littleroot (Mom / Running Shoes)");
{
  const { map, layout } = loadMap("LittlerootTown");
  const base = renderLayout(layout);
  writePreview("event-3-littleroot-tiles", base, ch6);
  writeArea("littleroottown.png", base);
  const mom = clonePng(base);
  placePerson(mom, SPRITES.mom(), 5, 8, "south");
  writePreview("event-3-mom-running-shoes", mom, ch6);
}

console.log("Chapter 7 — Route 102");
{
  const { map, layout } = loadMap("Route102");
  const base = renderLayout(layout);
  const ambient = clonePng(base);
  placeAmbient(ambient, map);
  writePreview("event-1-route102-tiles", base, ch7);
  writePreview("event-1-route102-ambient", ambient, ch7);
  writeArea("route102.png", base);

  // Wally catch tutorial (story lives on Route 102 west of Petalburg)
  const wally = clonePng(base);
  placePerson(wally, SPRITES.wally(), 6, 10, "east");
  place16(wally, SPRITES.zigzagoon(), 8, 10, { frame: FACE.west });
  writePreview("event-wally-catch", wally, ch7);
  writePreview("event-wally-catch", wally, ch8);
  writeArea("route102-wally.png", base); // same tiles; Wally is interactive overlay
}

console.log("Chapter 8 — Petalburg City");
{
  const { map, layout } = loadMap("PetalburgCity");
  const base = renderLayout(layout);
  writePreview("event-3-petalburg-tiles", base, ch8);
  writeArea("petalburgcity.png", base);
  const ambient = clonePng(base);
  placeAmbient(ambient, map);
  writePreview("event-3-petalburg-ambient", ambient, ch8);

  const center = loadMap("PetalburgCity_PokemonCenter_1F");
  const centerPng = renderLayout(center.layout);
  const centerObjs = clonePng(centerPng);
  placeAmbient(centerObjs, center.map);
  writePreview("event-3-pokemon-center", centerObjs, ch8);
  writeArea("petalburgcity-pokemoncenter-1f.png", centerObjs);

  const mart = loadMap("PetalburgCity_Mart");
  const martPng = renderLayout(mart.layout);
  const martObjs = clonePng(martPng);
  placeAmbient(martObjs, mart.map);
  writePreview("event-3-pokemart", martObjs, ch8);
  writeArea("petalburgcity-mart.png", martObjs);
}

console.log("Chapter 8 — Petalburg Gym entrance (Norman + Wally meet)");
{
  const { layout } = loadMap("PetalburgCity_Gym");
  const full = renderLayout(layout);
  // Entrance meet: Norman @ (4,107), Wally @ (5,108) — crop bottom 14 tiles
  const topTile = 98;
  const cropH = 14;
  const entrance = cropPng(full, {
    x: 0,
    y: topTile * 16,
    w: layout.width * 16,
    h: cropH * 16,
  });
  writePreview("event-1-gym-entrance-tiles", entrance, ch8);
  writeArea("petalburgcity-gym-entrance.png", entrance);
  const meet = clonePng(entrance);
  placePerson(meet, SPRITES.norman(), 4, 107 - topTile, "south");
  placePerson(meet, SPRITES.wally(), 5, 108 - topTile, "south");
  writePreview("event-1-norman-wally-meet", meet, ch8);
}

fs.writeFileSync(
  path.join(PREVIEW_DIRS[0], "README.md"),
  `# Chapter 6 cutscene previews (Route 103)

With pregame chapters enabled this is **Ch. 6**.

| Event | Map | Notes |
| --- | --- | --- |
| 1 — Find your rival | Route 103 | Rival (May) near the water at (10, 3) |
| 2 — Rival Battle #1 | Route 103 | Same route / rival focus |
| 3 — Pokédex & Running Shoes | Birch's Lab + Littleroot | Lab area map + Mom outside the house |
`,
);

fs.writeFileSync(
  path.join(PREVIEW_DIRS[1], "README.md"),
  `# Chapter 7 cutscene previews (Route 102)

With pregame chapters enabled this is **Ch. 7**.

| Event | Map | Notes |
| --- | --- | --- |
| 1 — Trainers west | Route 102 | Full route tiles |
| 2 — Rare Ralts | Route 102 | Same route |
| 3 — Enter Petalburg | Petalburg City | City overview |
`,
);

fs.writeFileSync(
  path.join(PREVIEW_DIRS[2], "README.md"),
  `# Chapter 8 cutscene previews (Petalburg City)

With pregame chapters enabled this is **Ch. 8**.

| Event | Map | Notes |
| --- | --- | --- |
| 1 — Meet Norman | Gym entrance crop | Norman + Wally at the door |
| 2 — Wally catching tutorial | Route 102 (wally) | Wally + Zigzagoon on Route 102 |
| 3 — Stock up | Petalburg + Center + Mart | Town supply run before Route 104 |
`,
);

console.log("Done.");
