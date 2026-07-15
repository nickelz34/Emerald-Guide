/**
 * Story meet cutscenes:
 *   - petalburg-1: Norman at Petalburg Gym entrance
 *   - petalburg-2: Wally catching Ralts on Route 102
 *   - route-104-1: Mr. Briney + Peeko in his cottage
 *
 * Usage: node scripts/preview-norman-wally-briney-cutscenes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const PREVIEW = path.join(ROOT, "public/screenshots/previews/norman-wally-briney");
const ARTIFACT = "/opt/cursor/artifacts/norman-wally-briney";

if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald");
  process.exit(1);
}

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map(layoutsJson.layouts.filter((l) => l?.id).map((l) => [l.id, l]));

const tilesetDir = (sym, kind) => {
  const name = sym.replace(/^gTileset_/, "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
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
  const nTiles = tilesX * (H >> 3);
  const tiles = new Array(nTiles);
  for (let t = 0; t < nTiles; t++) {
    const tc = t % tilesX;
    const tr = (t / tilesX) | 0;
    const arr = new Uint8Array(64);
    for (let py = 0; py < 8; py++) {
      for (let px = 0; px < 8; px++) {
        const o = ((tr * 8 + py) * W + (tc * 8 + px)) * 4;
        arr[py * 8 + px] = rev.get((data[o] << 16) | (data[o + 1] << 8) | data[o + 2]) ?? 0;
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

function renderLayout(layout, voidRgb = [72, 48, 40]) {
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
    ob[i] = voidRgb[0];
    ob[i + 1] = voidRgb[1];
    ob[i + 2] = voidRgb[2];
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
        ob.set(mt.subarray(ry * 64, ry * 64 + 64), ((py + ry) * OW + px) * 4);
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
  }
  return { png, palette };
}

function loadRgbaPng(absPath) {
  return { png: PNG.sync.read(fs.readFileSync(absPath)), palette: null };
}

function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW = 16, frameH = 32 } = {}) {
  const { png, palette } = sprite;
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const sx = frameX + col;
      if (sx < 0 || sx >= png.width || row < 0 || row >= png.height) continue;
      const si = (row * png.width + sx) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
      let a = png.data[si + 3];
      if (palette) {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < palette.length; i++) {
          const d = (r - palette[i].r) ** 2 + (g - palette[i].g) ** 2 + (b - palette[i].b) ** 2;
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
      } else if (a === 0) continue;
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

function placePerson(dest, sprite, tileX, tileY, facing) {
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  blitSprite(dest, sprite, tileX * 16, tileY * 16 - 16, {
    flipX: facing === "east",
    frameX: frame * 16,
    frameW: 16,
    frameH: 32,
  });
}

/** Wingull OW sheet is 96×16 (6×16 frames). */
function placeWingull(dest, sprite, tileX, tileY, facing = "south") {
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  blitSprite(dest, sprite, tileX * 16, tileY * 16, {
    flipX: facing === "east",
    frameX: frame * 16,
    frameW: 16,
    frameH: 16,
  });
}

function blitScaledOpaque(dest, src, dx, dy, outW, outH) {
  const { png } = src;
  for (let row = 0; row < outH; row++) {
    for (let col = 0; col < outW; col++) {
      const sx = Math.min(png.width - 1, ((col * png.width) / outW) | 0);
      const sy = Math.min(png.height - 1, ((row * png.height) / outH) | 0);
      const si = (sy * png.width + sx) * 4;
      if (png.data[si + 3] === 0) continue;
      // Skip near-white battle BG keys
      const r = png.data[si];
      const g = png.data[si + 1];
      const b = png.data[si + 2];
      if (r > 248 && g > 248 && b > 248) continue;
      const tx = dx + col;
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

function cropPng(src, { x, y, w, h }, voidRgb = [72, 48, 40]) {
  const out = new PNG({ width: w, height: h, colorType: 6 });
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const sx = x + col;
      const sy = y + row;
      const di = (row * w + col) * 4;
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) {
        out.data[di] = voidRgb[0];
        out.data[di + 1] = voidRgb[1];
        out.data[di + 2] = voidRgb[2];
        out.data[di + 3] = 255;
        continue;
      }
      const si = (sy * src.width + sx) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function scaleNearest(src, scale) {
  const out = new PNG({ width: src.width * scale, height: src.height * scale, colorType: 6 });
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

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
  console.log(file, png.width, png.height);
}

function publish(name, png) {
  writePng(path.join(AREA_DIR, `${name}.png`), png);
  writePng(path.join(PREVIEW, `event-${name}.png`), png);
  writePng(path.join(PREVIEW, `event-${name}@2x.png`), scaleNearest(png, 2));
  writePng(path.join(ARTIFACT, `event-${name}.png`), png);
  writePng(path.join(ARTIFACT, `event-${name}@2x.png`), scaleNearest(png, 2));
  writePng(path.join("/opt/cursor/artifacts/screenshots", `${name}@2x.png`), scaleNearest(png, 2));
}

fs.mkdirSync(AREA_DIR, { recursive: true });
fs.mkdirSync(PREVIEW, { recursive: true });
fs.mkdirSync(ARTIFACT, { recursive: true });
fs.mkdirSync("/opt/cursor/artifacts/screenshots", { recursive: true });

const norman = loadIndexedSprite(
  "graphics/object_events/pics/people/gym_leaders/norman.png",
  "graphics/object_events/palettes/npc_4.pal",
);
const wally = loadIndexedSprite(
  "graphics/object_events/pics/people/wally.png",
  "graphics/object_events/palettes/npc_1.pal",
);
const briney = loadIndexedSprite(
  "graphics/object_events/pics/people/expert_m.png",
  "graphics/object_events/palettes/npc_4.pal",
);
const brendan = loadIndexedSprite(
  "graphics/object_events/pics/people/brendan/walking.png",
  "graphics/object_events/palettes/brendan.pal",
);
const wingull = loadIndexedSprite(
  "graphics/object_events/pics/pokemon/wingull.png",
  "graphics/object_events/palettes/npc_1.pal",
);
const zigzagoon = loadIndexedSprite(
  "graphics/object_events/pics/pokemon/zigzagoon.png",
  "graphics/object_events/palettes/npc_1.pal",
);
const raltsFront = loadRgbaPng(path.join(ROOT, "public/sprites/pokemon/emerald/280.png"));

// ——— 1. Norman intro (gym entrance, early game position) ———
{
  const mj = JSON.parse(fs.readFileSync(path.join(REPO, "data/maps/PetalburgCity_Gym/map.json"), "utf8"));
  const layout = layoutById.get(mj.layout);
  const base = renderLayout(layout, [56, 48, 64]);
  const scene = clonePng(base);
  // Early-game: Norman moved to entrance (4,107) facing south; player south of him.
  placePerson(scene, norman, 4, 107, "south");
  placePerson(scene, brendan, 4, 109, "north");
  const crop = {
    x: 4 * 16 + 8 - 120,
    y: 108 * 16 + 8 - 80,
    w: 240,
    h: 160,
  };
  publish("petalburgcity-gym-norman-intro", cropPng(scene, crop, [56, 48, 64]));
}

// ——— 2. Wally catching Ralts (Route 102 west grass) ———
{
  const mj = JSON.parse(fs.readFileSync(path.join(REPO, "data/maps/Route102/map.json"), "utf8"));
  const layout = layoutById.get(mj.layout);
  const base = renderLayout(layout, [56, 104, 168]);
  const scene = clonePng(base);
  // Tutorial ends near the Petalburg↔Route102 border in west-route grass.
  placePerson(scene, wally, 4, 7, "east");
  placePerson(scene, brendan, 3, 8, "east");
  // Wally's loaned Zigzagoon slightly ahead
  blitSprite(scene, zigzagoon, 5 * 16, 7 * 16, { frameX: 32, frameW: 16, frameH: 16 });
  // Wild Ralts (battle sprite scaled into the grass)
  blitScaledOpaque(scene, raltsFront, 7 * 16 - 8, 6 * 16 - 8, 32, 32);
  const crop = { x: 0, y: 2 * 16, w: 240, h: 160 };
  publish("route102-wally-catch", cropPng(scene, crop, [56, 104, 168]));
}

// ——— 3. Mr. Briney cottage interior ———
{
  const mj = JSON.parse(
    fs.readFileSync(path.join(REPO, "data/maps/Route104_MrBrineysHouse/map.json"), "utf8"),
  );
  const layout = layoutById.get(mj.layout);
  const base = renderLayout(layout, [88, 72, 56]);
  const scene = clonePng(base);
  placePerson(scene, briney, 5, 3, "south");
  placeWingull(scene, wingull, 6, 3, "south");
  placePerson(scene, brendan, 5, 6, "north");
  // House is 192×144 — pad to GBA-ish 240×160 centered
  const pad = cropPng(
    scene,
    { x: (192 - 240) / 2, y: (144 - 160) / 2, w: 240, h: 160 },
    [88, 72, 56],
  );
  publish("route104-mrbrineyshouse", pad);
}

fs.writeFileSync(
  path.join(PREVIEW, "README.md"),
  `# Norman / Wally / Briney cutscenes

- **petalburgcity-gym-norman-intro** — Meet Norman at the Petalburg Gym entrance (Ch. 8 Event 1)
- **route102-wally-catch** — Wally’s catching tutorial on Route 102 (Ch. 8 Event 2)
- **route104-mrbrineyshouse** — Meet Mr. Briney & Peeko in his cottage (Ch. 9 Event 1)
`,
);
console.log("done");
