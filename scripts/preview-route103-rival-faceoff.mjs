/**
 * Route 103 Rival Battle #1 — baked face-off at the moment the Big Poké Ball
 * transition starts forming (Emerald PatternWeave early blend).
 *
 * Usage: node scripts/preview-route103-rival-faceoff.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const PREVIEW = path.join(ROOT, "public/screenshots/previews/chapter6");
const ARTIFACT = "/opt/cursor/artifacts/chapter6-rival-faceoff";

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

function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW = 16, frameH = 32 } = {}) {
  const { png, palette } = sprite;
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const si = (row * png.width + (frameX + col)) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
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
      } else if (png.data[si + 3] === 0) continue;
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

function clonePng(src) {
  const out = new PNG({ width: src.width, height: src.height, colorType: 6 });
  out.data.set(src.data);
  return out;
}

function cropPng(src, { x, y, w, h }) {
  const out = new PNG({ width: w, height: h, colorType: 6 });
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const sx = x + col;
      const sy = y + row;
      const di = (row * w + col) * 4;
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) {
        out.data[di] = 56;
        out.data[di + 1] = 104;
        out.data[di + 2] = 168;
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

function loadJascPal(rel) {
  const lines = fs.readFileSync(path.join(REPO, rel), "utf8").split(/\r?\n/);
  const cols = [];
  for (let i = 3; i < 19; i++) {
    const parts = (lines[i] || "").trim().split(/\s+/).map(Number);
    cols.push({ r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0 });
  }
  return cols;
}

/** Render Emerald big_pokeball BG at GBA 240×160 using tiles + tilemap + field-effect palette. */
function renderBigPokeball() {
  const sheet = PNG.sync.read(fs.readFileSync(path.join(REPO, "graphics/battle_transitions/big_pokeball.png")));
  const mapBin = fs.readFileSync(path.join(REPO, "graphics/battle_transitions/big_pokeball_map.bin"));
  const pal = loadJascPal("graphics/field_effects/palettes/pokeball.pal");

  // Nearest-index map from sheet RGB → palette index for color remap
  const sheetToIdx = (r, g, b) => {
    if (sheet.palette) {
      // sheet is indexed; find matching palette entry via RGB nearest in sheet.palette then remapped
    }
    let best = 0;
    let bestD = Infinity;
    const srcPal = sheet.palette || [];
    // Prefer sheet palette index if exact
    for (let i = 0; i < srcPal.length; i++) {
      const [sr, sg, sb] = srcPal[i];
      const d = (r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  };

  const tilesX = sheet.width >> 3; // 4
  const getTilePx = (tileId, lx, ly) => {
    const tc = tileId % tilesX;
    const tr = (tileId / tilesX) | 0;
    const sx = tc * 8 + lx;
    const sy = tr * 8 + ly;
    if (sx >= sheet.width || sy >= sheet.height) return 0;
    const o = (sy * sheet.width + sx) * 4;
    return sheetToIdx(sheet.data[o], sheet.data[o + 1], sheet.data[o + 2]);
  };

  const W = 240;
  const H = 160;
  const out = new PNG({ width: W, height: H, colorType: 6 });
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 30; col++) {
      const mi = (row * 30 + col) * 2;
      const entry = mapBin[mi] | (mapBin[mi + 1] << 8);
      const tileId = entry & 0x3ff;
      const xflip = (entry >> 10) & 1;
      const yflip = (entry >> 11) & 1;
      for (let ly = 0; ly < 8; ly++) {
        for (let lx = 0; lx < 8; lx++) {
          const tx = xflip ? 7 - lx : lx;
          const ty = yflip ? 7 - ly : ly;
          const ci = getTilePx(tileId, tx, ty);
          const c = pal[ci] || pal[0];
          const px = col * 8 + lx;
          const py = row * 8 + ly;
          const di = (py * W + px) * 4;
          // Index 0 is treated as transparent in GBA overlays for this tile (empty BG)
          if (ci === 0) {
            out.data[di + 3] = 0;
          } else {
            out.data[di] = c.r;
            out.data[di + 1] = c.g;
            out.data[di + 2] = c.b;
            out.data[di + 3] = 255;
          }
        }
      }
    }
  }
  return out;
}

/**
 * Early PatternWeave moment: Poké Ball overlay just beginning to form —
 * shimmering sine offset + low blend alpha so trainers stay clearly visible.
 */
function compositeFormingBall(scene, ball, { alpha = 0.42, amp = 10, phase = 0.55 } = {}) {
  const out = clonePng(scene);
  const W = scene.width;
  const H = scene.height;
  for (let y = 0; y < H; y++) {
    // SetSinWave-style horizontal displacement that settles as amplitude drops in-game
    const offset = Math.round(Math.sin((y * phase + 0.4) * Math.PI * 2) * amp);
    for (let x = 0; x < W; x++) {
      const sx = x + offset;
      if (sx < 0 || sx >= ball.width) continue;
      // Map scene width onto ball's 240 if needed
      const bx = Math.min(ball.width - 1, Math.round((sx / W) * ball.width));
      const by = Math.min(ball.height - 1, y);
      const bi = (by * ball.width + bx) * 4;
      if (ball.data[bi + 3] === 0) continue;
      const di = (y * W + x) * 4;
      // Extra fade toward edges of ball for "just starting to form" look
      const cx = (bx - ball.width / 2) / (ball.width / 2);
      const cy = (by - ball.height / 2) / (ball.height / 2);
      const r2 = cx * cx + cy * cy;
      const form = Math.max(0, 1 - r2 * 0.55); // stronger in center as ball coalesces
      const a = alpha * form;
      if (a <= 0.02) continue;
      out.data[di] = Math.round(out.data[di] * (1 - a) + ball.data[bi] * a);
      out.data[di + 1] = Math.round(out.data[di + 1] * (1 - a) + ball.data[bi + 1] * a);
      out.data[di + 2] = Math.round(out.data[di + 2] * (1 - a) + ball.data[bi + 2] * a);
    }
  }
  return out;
}

const mj = JSON.parse(fs.readFileSync(path.join(REPO, "data/maps/Route103/map.json"), "utf8"));
const layout = layoutById.get(mj.layout);
const base = renderLayout(layout);
const may = loadIndexedSprite(
  "graphics/object_events/pics/people/may/walking.png",
  "graphics/object_events/palettes/may.pal",
);
const brendan = loadIndexedSprite(
  "graphics/object_events/pics/people/brendan/walking.png",
  "graphics/object_events/palettes/brendan.pal",
);

// Same facing as before: May @ (10,3) south, Brendan @ (10,5) north — looking at each other.
const scene = clonePng(base);
placePerson(scene, may, 10, 3, "south");
placePerson(scene, brendan, 10, 5, "north");

// GBA-sized crop (240×160) centered on the face-off for a true transition frame
const crop = { x: 3 * 16, y: 0, w: 240, h: 160 };
const focus = cropPng(scene, crop);

const ball = renderBigPokeball();
const forming = compositeFormingBall(focus, ball, { alpha: 0.48, amp: 12, phase: 0.6 });

fs.mkdirSync(AREA_DIR, { recursive: true });
writePng(path.join(AREA_DIR, "route103-rival-battle.png"), forming);
for (const dir of [PREVIEW, ARTIFACT]) {
  writePng(path.join(dir, "event-2-rival-faceoff.png"), forming);
  writePng(path.join(dir, "event-2-rival-faceoff@2x.png"), scaleNearest(forming, 2));
  writePng(path.join(dir, "event-2-rival-faceoff-clean.png"), focus);
  writePng(path.join(dir, "big-pokeball-layer.png"), ball);
}
fs.writeFileSync(
  path.join(PREVIEW, "README.md"),
  `# Chapter 6 — Route 103 rival face-off

Baked cutscene for Rival Battle #1 at the moment Emerald's **Big Poké Ball**
transition starts weaving onto the screen. Brendan and May keep facing each other.
`,
);
console.log("done");
