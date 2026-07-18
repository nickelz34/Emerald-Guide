/**
 * TEST bake: paint trainers + item / hidden / berry sprites into a copy of the
 * full Hoenn overworld map (public/maps/hoenn-map-baked.png).
 *
 * Leaves hoenn-map.png / .webp untouched. HoennMap.tsx can opt into the baked
 * atlas and switch those categories to invisible hit targets.
 *
 * Usage: npm run bake:hoenn-overworld
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { MAP_TRAINERS } from "../src/data/mapTrainersGenerated.ts";
import { GENERATED_POINTS } from "../src/data/mapPointsGenerated.ts";
import { MAP_POINTS } from "../src/data/mapPoints.ts";
import { COLLECTIBLE_SPRITES } from "../src/data/itemSpritesGenerated.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/maps/hoenn-map.png");
const OUT = path.join(ROOT, "public/maps/hoenn-map-baked.png");
const ARTIFACT = "/opt/cursor/artifacts/hoenn-overworld-baked";
const MAP_W = 12800;
const MAP_H = 6128;

const BAKE_CATEGORIES = new Set(["item", "hidden", "berry"]);

function loadRgbaPng(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  if (png.colorType === 6 && png.width) return png;
  const out = new PNG({ width: png.width, height: png.height, colorType: 6 });
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const i = (png.width * y + x) << 2;
      out.data[i] = png.data[i];
      out.data[i + 1] = png.data[i + 1];
      out.data[i + 2] = png.data[i + 2];
      out.data[i + 3] = png.data[i + 3] ?? 255;
    }
  }
  return out;
}

function blitSprite(dest, src, dx, dy, { frameX = 0, frameW = 16, frameH = 32, flipX = false } = {}) {
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const sx = frameX + col;
      const sy = row;
      if (sx >= src.width || sy >= src.height) continue;
      const si = (sy * src.width + sx) * 4;
      const r = src.data[si];
      const g = src.data[si + 1];
      const b = src.data[si + 2];
      const a = src.data[si + 3];
      if (a < 16) continue;
      if (r === 255 && g === 0 && b === 255) continue;
      const tx = flipX ? dx + (frameW - 1 - col) : dx + col;
      const ty = dy + row;
      if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
      const di = (ty * dest.width + tx) * 4;
      const alpha = a / 255;
      dest.data[di] = Math.round(r * alpha + dest.data[di] * (1 - alpha));
      dest.data[di + 1] = Math.round(g * alpha + dest.data[di + 1] * (1 - alpha));
      dest.data[di + 2] = Math.round(b * alpha + dest.data[di + 2] * (1 - alpha));
      dest.data[di + 3] = 255;
    }
  }
}

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
}

const spriteCache = new Map();
function loadSprite(rel) {
  if (spriteCache.has(rel)) return spriteCache.get(rel);
  const file = path.join(ROOT, "public", rel);
  if (!fs.existsSync(file)) throw new Error(`Missing sprite ${rel}`);
  const png = loadRgbaPng(file);
  spriteCache.set(rel, png);
  return png;
}

if (!fs.existsSync(SRC)) {
  console.error("Missing", SRC);
  process.exit(1);
}

console.log("Loading", SRC, "…");
const scene = loadRgbaPng(SRC);
if (scene.width !== MAP_W || scene.height !== MAP_H) {
  console.warn(`Unexpected map size ${scene.width}×${scene.height} (expected ${MAP_W}×${MAP_H})`);
}

const collectibles = [...MAP_POINTS, ...GENERATED_POINTS].filter((p) => BAKE_CATEGORIES.has(p.category));
const trainers = MAP_TRAINERS;

console.log(
  `Baking ${trainers.length} trainers + ${collectibles.length} collectibles ` +
    `(item/hidden/berry) into ${path.relative(ROOT, OUT)}`,
);

let painted = 0;
const skipped = [];

for (const tr of trainers) {
  const fw = tr.spriteWidth ?? 16;
  const fh = tr.spriteHeight ?? 32;
  const frame = tr.spriteFrame ?? 0;
  const flipX = Boolean(tr.spriteFlipX);
  try {
    const sheet = loadSprite(tr.spriteSheet);
    const px = Math.round((tr.x / 100) * scene.width - fw / 2);
    const py = Math.round((tr.y / 100) * scene.height - fh);
    blitSprite(scene, sheet, px, py, {
      frameX: frame * fw,
      frameW: fw,
      frameH: fh,
      flipX,
    });
    painted++;
  } catch (err) {
    skipped.push(`trainer ${tr.id}: ${err.message}`);
  }
}

for (const p of collectibles) {
  const sprite = COLLECTIBLE_SPRITES[p.category];
  if (!sprite) {
    skipped.push(`collectible ${p.id}: no sprite for ${p.category}`);
    continue;
  }
  try {
    const sheet = loadSprite(sprite.spriteSheet);
    const fw = sprite.spriteWidth;
    const fh = sprite.spriteHeight;
    const px = Math.round((p.x / 100) * scene.width - fw / 2);
    const py = Math.round((p.y / 100) * scene.height - fh);
    blitSprite(scene, sheet, px, py, {
      frameX: (sprite.spriteFrame ?? 0) * fw,
      frameW: fw,
      frameH: fh,
    });
    painted++;
  } catch (err) {
    skipped.push(`collectible ${p.id}: ${err.message}`);
  }
}

console.log(`Painted ${painted} sprites`);
if (skipped.length) {
  console.warn(`Skipped ${skipped.length}:`);
  for (const s of skipped.slice(0, 20)) console.warn(" ", s);
  if (skipped.length > 20) console.warn(`  …and ${skipped.length - 20} more`);
}

writePng(OUT, scene);
fs.mkdirSync(ARTIFACT, { recursive: true });
// Small proof crop around Littleroot / Route 101 area for visual QA
const cropX = Math.round((0.48 / 100) * scene.width);
const cropY = Math.round((68 / 100) * scene.height);
const cw = 480;
const ch = 320;
const proof = new PNG({ width: cw, height: ch, colorType: 6 });
for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const sx = cropX + x;
    const sy = cropY + y;
    const si = (sy * scene.width + sx) * 4;
    const di = (y * cw + x) * 4;
    proof.data[di] = scene.data[si];
    proof.data[di + 1] = scene.data[si + 1];
    proof.data[di + 2] = scene.data[si + 2];
    proof.data[di + 3] = scene.data[si + 3];
  }
}
writePng(path.join(ARTIFACT, "hoenn-bake-proof-littleroot.png"), proof);
writePng(path.join(ARTIFACT, "hoenn-map-baked.png"), scene);

const meta = {
  painted,
  trainers: trainers.length,
  collectibles: collectibles.length,
  skipped: skipped.length,
  out: path.relative(ROOT, OUT),
  bytes: fs.statSync(OUT).size,
};
fs.writeFileSync(path.join(ARTIFACT, "bake-meta.json"), JSON.stringify(meta, null, 2));
console.log("Wrote", OUT, `(${(meta.bytes / 1024 / 1024).toFixed(1)} MB)`);
console.log("Artifact proof:", path.join(ARTIFACT, "hoenn-bake-proof-littleroot.png"));
