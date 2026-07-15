/**
 * Render Chapter 4 (Route 101) + Chapter 5 (Oldale) maps from pokeemerald,
 * write preview PNGs, and install area-map assets used by the walkthrough.
 *
 * With pregame chapters enabled:
 *   Ch. 4 — Route 101 (Birch rescue / starter / back to lab)
 *   Ch. 5 — Oldale Town (Center, Mart, crossroads)
 *
 * Requires .calib/pokeemerald.
 *
 * Usage: node scripts/preview-ch4-ch5-cutscenes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const PREVIEW_DIRS = [
  path.join(ROOT, "public/screenshots/previews/chapter4"),
  path.join(ROOT, "public/screenshots/previews/chapter5"),
  "/opt/cursor/artifacts/chapter4-5-cutscenes",
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
  birch: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/prof_birch.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
  bag: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/misc/birchs_bag.png",
      "graphics/object_events/palettes/npc_2.pal",
    ),
  // Overworld chase still uses EnemyZigzagoon gfx in pokeemerald (battle is Poochyena).
  chaseMon: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/pokemon/enemy_zigzagoon.png",
      "graphics/object_events/palettes/enemy_zigzagoon.pal",
    ),
  poochyena: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/pokemon/poochyena.png",
      "graphics/object_events/palettes/poochyena.pal",
    ),
  youngster: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/youngster.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  boy2: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/boy_2.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  mart: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/mart_employee.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  nurse: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/nurse.png",
      "graphics/object_events/palettes/npc_1.pal",
    ),
  girl3: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/girl_3.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
  maniac: () =>
    loadIndexedSprite(
      "graphics/object_events/pics/people/maniac.png",
      "graphics/object_events/palettes/npc_3.pal",
    ),
};

function placePerson(dest, sprite, tileX, tileY, facing = "south") {
  const frame = FACE[facing] ?? 0;
  const flipX = facing === "east";
  // 16×32 people: feet on tile
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

function place32(dest, sprite, tileX, tileY, { frame = 0, flipX = false } = {}) {
  // 32×32: centered on tile, feet aligned
  blitSprite(dest, sprite, tileX * 16 - 8, tileY * 16 - 16, {
    flipX,
    frameX: frame * 32,
    frameW: 32,
    frameH: 32,
  });
}

const ch4Dirs = [PREVIEW_DIRS[0], PREVIEW_DIRS[2]];
const ch5Dirs = [PREVIEW_DIRS[1], PREVIEW_DIRS[2]];

console.log("Chapter 4 — Route 101");
{
  const { map, layout } = loadMap("Route101");
  const base = renderLayout(layout);

  // Ambient route (no intro chase objects)
  const ambient = clonePng(base);
  for (const oe of map.object_events || []) {
    if (oe.graphics_id === "OBJ_EVENT_GFX_YOUNGSTER") {
      placePerson(ambient, SPRITES.youngster(), oe.x, oe.y, "south");
    } else if (oe.graphics_id === "OBJ_EVENT_GFX_BOY_2") {
      placePerson(ambient, SPRITES.boy2(), oe.x, oe.y, "south");
    }
  }
  writePreview("event-1-route101-tiles", base, ch4Dirs);
  writePreview("event-1-route101-ambient", ambient, ch4Dirs);
  writeArea("route101.png", ambient);

  // Birch rescue cutscene — map.json chase spawn (LOCALID birch @ 9,13; bag 7,14; mon 10,13)
  const rescue = clonePng(base);
  place16(rescue, SPRITES.bag(), 7, 14);
  placePerson(rescue, SPRITES.birch(), 9, 13, "east");
  // Decomp still uses EnemyZigzagoon overworld gfx for the chase
  place32(rescue, SPRITES.chaseMon(), 10, 13, { frame: FACE.west });
  writePreview("event-1-2-birch-rescue-decomp-gfx", rescue, ch4Dirs);

  // Story-accurate alternate with Poochyena (battle species) instead of Zigzagoon leftover
  const rescueStory = clonePng(base);
  place16(rescueStory, SPRITES.bag(), 7, 14);
  placePerson(rescueStory, SPRITES.birch(), 9, 13, "east");
  place32(rescueStory, SPRITES.poochyena(), 10, 13, { frame: FACE.west });
  writePreview("event-1-2-birch-rescue-poochyena", rescueStory, ch4Dirs);

  // Focus crop around the rescue (include bag + birch + mon + some grass)
  const focus = cropPng(rescueStory, {
    x: 4 * 16,
    y: 9 * 16,
    w: 10 * 16,
    h: 8 * 16,
  });
  writePreview("event-1-2-birch-rescue-focus", focus, ch4Dirs);

  // Lab for event 3 — reuse existing area asset; also emit preview
  const lab = loadMap("LittlerootTown_ProfessorBirchsLab");
  const labPng = renderLayout(lab.layout);
  writePreview("event-3-birchs-lab", labPng, ch4Dirs);
}

console.log("Chapter 5 — Oldale Town");
{
  const { map, layout } = loadMap("OldaleTown");
  const base = renderLayout(layout);
  const town = clonePng(base);
  for (const oe of map.object_events || []) {
    // Skip rival VAR_0 (gender-swapped graphics)
    if (oe.graphics_id === "OBJ_EVENT_GFX_GIRL_3") {
      placePerson(town, SPRITES.girl3(), oe.x, oe.y, "south");
    } else if (oe.graphics_id === "OBJ_EVENT_GFX_MART_EMPLOYEE") {
      placePerson(town, SPRITES.mart(), oe.x, oe.y, "south");
    } else if (oe.graphics_id === "OBJ_EVENT_GFX_MANIAC") {
      placePerson(town, SPRITES.maniac(), oe.x, oe.y, "south");
    }
  }
  writePreview("event-1-2-oldale-town", town, ch5Dirs);
  writePreview("event-1-2-oldale-town-tiles", base, ch5Dirs);
  writeArea("oldaletown.png", town);

  const center = loadMap("OldaleTown_PokemonCenter_1F");
  const centerPng = renderLayout(center.layout);
  const centerObjs = clonePng(centerPng);
  for (const oe of center.map.object_events || []) {
    if (oe.graphics_id === "OBJ_EVENT_GFX_NURSE") {
      placePerson(centerObjs, SPRITES.nurse(), oe.x, oe.y, "south");
    }
  }
  writePreview("event-1-pokemon-center", centerObjs, ch5Dirs);
  writeArea("oldaletown-pokemoncenter-1f.png", centerObjs);

  const mart = loadMap("OldaleTown_Mart");
  const martPng = renderLayout(mart.layout);
  const martObjs = clonePng(martPng);
  for (const oe of mart.map.object_events || []) {
    if (oe.graphics_id === "OBJ_EVENT_GFX_MART_EMPLOYEE") {
      placePerson(martObjs, SPRITES.mart(), oe.x, oe.y, "east");
    }
  }
  writePreview("event-1-pokemart", martObjs, ch5Dirs);
  writeArea("oldaletown-mart.png", martObjs);
}

fs.writeFileSync(
  path.join(PREVIEW_DIRS[0], "README.md"),
  `# Chapter 4 cutscene previews (Route 101)

With pregame chapters enabled this is **Ch. 4**.

| Event | Map | Notes |
| --- | --- | --- |
| 1 — Rescue Birch | Route 101 | \`event-1-2-birch-rescue-*\` cutscenes + full route map |
| 2 — Choose starter | Choose Starter UI | \`event-2-birch-starter-choose\` — bag + three labeled balls |
| 3 — Keep starter | Birch's Lab | \`event-3-birchs-lab\` (also existing area map) |

Decomp note: the overworld chase object still uses **EnemyZigzagoon** graphics;
Emerald's battle/text is **Poochyena**. Preview includes both.
`,
);

fs.writeFileSync(
  path.join(PREVIEW_DIRS[1], "README.md"),
  `# Chapter 5 cutscene previews (Oldale Town)

With pregame chapters enabled this is **Ch. 5**.

| Event | Map | Notes |
| --- | --- | --- |
| 1 — First stop | Oldale + Center + Mart | Town exterior and both interiors |
| 2 — Choose your path | Oldale Town | Crossroads / town overview |
`,
);

console.log("Done.");
