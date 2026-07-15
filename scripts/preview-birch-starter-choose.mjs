/**
 * Ch. 4 Event 2 — Professor Birch's bag starter-choose cutscene.
 *
 * Renders the authentic pokeemerald Choose Starter UI (bag + grass tilemaps +
 * three Poké Ball sprites) and installs it as an area map so each ball is a
 * clickable baked hit-target labeled Treecko / Torchic / Mudkip.
 *
 * Requires .calib/pokeemerald (+ graphics/starter_choose assets).
 *
 * Usage: node scripts/preview-birch-starter-choose.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const STARTER_DIR = path.join(REPO, "graphics/starter_choose");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const PREVIEW = path.join(ROOT, "public/screenshots/previews/chapter4");
const ARTIFACT = "/opt/cursor/artifacts/birch-starter-choose";

const SCREEN_W = 240;
const SCREEN_H = 160;
const TILE = 8;
const MAP_STRIDE = 32; // GBA BG maps are 32 tiles wide

/** Emerald OAM centers for the three starter balls (starter_choose.c). */
const POKEBALL_COORDS = [
  { id: "treecko", name: "Treecko", x: 60, y: 64 },
  { id: "torchic", name: "Torchic", x: 120, y: 88 },
  { id: "mudkip", name: "Mudkip", x: 180, y: 64 },
];

if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald — clone pret/pokeemerald first.");
  process.exit(1);
}
if (!fs.existsSync(path.join(STARTER_DIR, "tiles.png"))) {
  console.error("Missing graphics/starter_choose — fetch pret/pokeemerald starter_choose assets.");
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writePng(filePath, png) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
  console.log(`  wrote ${path.relative(ROOT, filePath)} (${png.width}×${png.height})`);
}

function loadSheet(rel) {
  const png = PNG.sync.read(fs.readFileSync(path.join(STARTER_DIR, rel)));
  if (!png.palette) throw new Error(`${rel} must be indexed`);
  return png;
}

function tilePixel(sheet, tileId, lx, ly) {
  const tilesX = sheet.width >> 3;
  const tc = tileId % tilesX;
  const tr = (tileId / tilesX) | 0;
  const sx = tc * TILE + lx;
  const sy = tr * TILE + ly;
  if (sx >= sheet.width || sy >= sheet.height) return 0;
  const o = (sy * sheet.width + sx) * 4;
  const r = sheet.data[o];
  const g = sheet.data[o + 1];
  const b = sheet.data[o + 2];
  // Resolve to palette index (nearest exact match)
  for (let i = 0; i < sheet.palette.length; i++) {
    const [pr, pg, pb] = sheet.palette[i];
    if (pr === r && pg === g && pb === b) return i;
  }
  return 0;
}

/**
 * Paint a GBA BG tilemap onto `out`. When `transparentZero` is true, palette
 * index 0 pixels are skipped (bag overlay over grass).
 */
function blitTilemap(out, sheet, mapBin, { transparentZero = false } = {}) {
  const mapRows = (mapBin.length / 2 / MAP_STRIDE) | 0;
  const rows = Math.min(mapRows, SCREEN_H / TILE);
  const cols = SCREEN_W / TILE;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const mi = (row * MAP_STRIDE + col) * 2;
      const entry = mapBin[mi] | (mapBin[mi + 1] << 8);
      const tileId = entry & 0x3ff;
      const xflip = (entry >> 10) & 1;
      const yflip = (entry >> 11) & 1;
      for (let ly = 0; ly < TILE; ly++) {
        for (let lx = 0; lx < TILE; lx++) {
          const tx = xflip ? TILE - 1 - lx : lx;
          const ty = yflip ? TILE - 1 - ly : ly;
          const ci = tilePixel(sheet, tileId, tx, ty);
          if (transparentZero && ci === 0) continue;
          const [r, g, b] = sheet.palette[ci] || [0, 0, 0];
          const px = col * TILE + lx;
          const py = row * TILE + ly;
          const di = (py * SCREEN_W + px) * 4;
          out.data[di] = r;
          out.data[di + 1] = g;
          out.data[di + 2] = b;
          out.data[di + 3] = 255;
        }
      }
    }
  }
}

function blitPokeball(dest, ballSheet, cx, cy, frame = 0) {
  const fw = 32;
  const fh = 32;
  const frameX = 0;
  const frameY = frame * fh;
  const dx = cx - fw / 2;
  const dy = cy - fh / 2;
  for (let row = 0; row < fh; row++) {
    for (let col = 0; col < fw; col++) {
      const sx = frameX + col;
      const sy = frameY + row;
      if (sx >= ballSheet.width || sy >= ballSheet.height) continue;
      const si = (sy * ballSheet.width + sx) * 4;
      const r = ballSheet.data[si];
      const g = ballSheet.data[si + 1];
      const b = ballSheet.data[si + 2];
      // Index 0 chroma key (green screen in pokeball_selection palette)
      let ci = 0;
      for (let i = 0; i < ballSheet.palette.length; i++) {
        const [pr, pg, pb] = ballSheet.palette[i];
        if (pr === r && pg === g && pb === b) {
          ci = i;
          break;
        }
      }
      if (ci === 0) continue;
      const px = dx + col;
      const py = dy + row;
      if (px < 0 || py < 0 || px >= SCREEN_W || py >= SCREEN_H) continue;
      const di = (py * SCREEN_W + px) * 4;
      dest.data[di] = r;
      dest.data[di + 1] = g;
      dest.data[di + 2] = b;
      dest.data[di + 3] = 255;
    }
  }
}

function scale2x(src) {
  const out = new PNG({ width: src.width * 2, height: src.height * 2, colorType: 6 });
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const si = (y * src.width + x) * 4;
      for (let oy = 0; oy < 2; oy++) {
        for (let ox = 0; ox < 2; ox++) {
          const di = ((y * 2 + oy) * out.width + (x * 2 + ox)) * 4;
          out.data[di] = src.data[si];
          out.data[di + 1] = src.data[si + 1];
          out.data[di + 2] = src.data[si + 2];
          out.data[di + 3] = src.data[si + 3];
        }
      }
    }
  }
  return out;
}

console.log("Birch starter-choose cutscene");
{
  const tiles = loadSheet("tiles.png");
  const ball = loadSheet("pokeball_selection.png");
  const grassMap = fs.readFileSync(path.join(STARTER_DIR, "birch_grass.bin"));
  const bagMap = fs.readFileSync(path.join(STARTER_DIR, "birch_bag.bin"));

  const scene = new PNG({ width: SCREEN_W, height: SCREEN_H, colorType: 6 });
  // Fill opaque blue-green so any gaps aren't transparent in the lightbox
  for (let i = 0; i < scene.data.length; i += 4) {
    scene.data[i] = 56;
    scene.data[i + 1] = 120;
    scene.data[i + 2] = 88;
    scene.data[i + 3] = 255;
  }

  // BG2 grass (behind), then BG3 bag (in front; color 0 transparent)
  blitTilemap(scene, tiles, grassMap, { transparentZero: false });
  blitTilemap(scene, tiles, bagMap, { transparentZero: true });

  for (const ballPos of POKEBALL_COORDS) {
    blitPokeball(scene, ball, ballPos.x, ballPos.y, 0);
  }

  ensureDir(AREA_DIR);
  ensureDir(PREVIEW);
  ensureDir(ARTIFACT);

  writePng(path.join(AREA_DIR, "route101-birch-starter-choose.png"), scene);
  writePng(path.join(PREVIEW, "event-2-birch-starter-choose.png"), scene);
  writePng(path.join(PREVIEW, "event-2-birch-starter-choose@2x.png"), scale2x(scene));
  writePng(path.join(ARTIFACT, "event-2-birch-starter-choose.png"), scene);
  writePng(path.join(ARTIFACT, "event-2-birch-starter-choose@2x.png"), scale2x(scene));

  // Marker percentages for AREA_MAP_CUTSCENE_ENTITIES (sprite center → % of 240×160)
  console.log("\nBall marker percents (for cutscene entities):");
  for (const b of POKEBALL_COORDS) {
    const x = +((b.x / SCREEN_W) * 100).toFixed(2);
    const y = +((b.y / SCREEN_H) * 100).toFixed(2);
    console.log(`  ${b.name}: x=${x}, y=${y}`);
  }
}
