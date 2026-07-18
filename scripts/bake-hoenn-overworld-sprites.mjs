/**
 * Bake trainers + NPCs + item / hidden / berry sprites onto transparent
 * per-category layers (and a composite preview) for the Hoenn overworld.
 *
 * Layers let HoennMap toggle visibility with the legend filters.
 * Leaves hoenn-map.png / .webp untouched.
 *
 * Usage: npm run bake:hoenn-overworld
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import sharp from "sharp";
import { MAP_TRAINERS } from "../src/data/mapTrainersGenerated.ts";
import { MAP_NPCS } from "../src/data/mapNpcsGenerated.ts";
import { NPC_DETAILS_BY_SCRIPT } from "../src/data/npcDetailsGenerated.ts";
import { GENERATED_POINTS } from "../src/data/mapPointsGenerated.ts";
import { MAP_POINTS } from "../src/data/mapPoints.ts";
import { COLLECTIBLE_SPRITES } from "../src/data/itemSpritesGenerated.ts";

function npcHasStory(npc) {
  if (!npc?.script) return false;
  const details = NPC_DETAILS_BY_SCRIPT[npc.script];
  return Boolean(details?.story?.length);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/maps/hoenn-map.png");
const OUT_DIR = path.join(ROOT, "public/maps");
const ARTIFACT = "/opt/cursor/artifacts/hoenn-overworld-baked";
const MAP_W = 12800;
const MAP_H = 6128;

/** Nearest-neighbor upscale so sprites read a bit better on the full map / phone. */
const SPRITE_SCALE = 2;

const LAYER_CATEGORIES = ["trainer", "npc", "item", "hidden", "berry"];
const COLLECTIBLE_CATEGORIES = new Set(["item", "hidden", "berry"]);

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

function emptyLayer(width, height) {
  const png = new PNG({ width, height, colorType: 6 });
  png.data.fill(0);
  return png;
}

function blitSprite(
  dest,
  src,
  dx,
  dy,
  { frameX = 0, frameW = 16, frameH = 32, flipX = false, scale = 1 } = {},
) {
  const outW = Math.max(1, Math.round(frameW * scale));
  const outH = Math.max(1, Math.round(frameH * scale));
  for (let row = 0; row < outH; row++) {
    for (let col = 0; col < outW; col++) {
      const srcCol = Math.min(frameW - 1, Math.floor(col / scale));
      const srcRow = Math.min(frameH - 1, Math.floor(row / scale));
      const sx = frameX + srcCol;
      const sy = srcRow;
      if (sx >= src.width || sy >= src.height) continue;
      const si = (sy * src.width + sx) * 4;
      const r = src.data[si];
      const g = src.data[si + 1];
      const b = src.data[si + 2];
      const a = src.data[si + 3];
      if (a < 16) continue;
      if (r === 255 && g === 0 && b === 255) continue;
      const tx = flipX ? dx + (outW - 1 - col) : dx + col;
      const ty = dy + row;
      if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
      const di = (ty * dest.width + tx) * 4;
      const srcA = a / 255;
      const dstA = dest.data[di + 3] / 255;
      const outA = srcA + dstA * (1 - srcA);
      if (outA <= 0) continue;
      dest.data[di] = Math.round((r * srcA + dest.data[di] * dstA * (1 - srcA)) / outA);
      dest.data[di + 1] = Math.round((g * srcA + dest.data[di + 1] * dstA * (1 - srcA)) / outA);
      dest.data[di + 2] = Math.round((b * srcA + dest.data[di + 2] * dstA * (1 - srcA)) / outA);
      dest.data[di + 3] = Math.round(outA * 255);
    }
  }
}

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
}

async function optimizePair(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  const tmp = `${pngPath}.opt.png`;
  await sharp(pngPath).png({ compressionLevel: 9, effort: 10, palette: false }).toFile(tmp);
  fs.renameSync(tmp, pngPath);
  await sharp(pngPath).webp({ lossless: true, effort: 4 }).toFile(webpPath);
  return {
    png: fs.statSync(pngPath).size,
    webp: fs.statSync(webpPath).size,
  };
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

const base = loadRgbaPng(SRC);
if (base.width !== MAP_W || base.height !== MAP_H) {
  console.warn(`Unexpected map size ${base.width}×${base.height} (expected ${MAP_W}×${MAP_H})`);
}

const layers = Object.fromEntries(LAYER_CATEGORIES.map((c) => [c, emptyLayer(base.width, base.height)]));
/** Story-only subset of the NPC layer for the Story only legend filter. */
const npcStoryLayer = emptyLayer(base.width, base.height);
const collectibles = [...MAP_POINTS, ...GENERATED_POINTS].filter((p) =>
  COLLECTIBLE_CATEGORIES.has(p.category),
);
const trainers = MAP_TRAINERS;
const npcs = MAP_NPCS;
const storyNpcs = npcs.filter(npcHasStory);

console.log(
  `Baking ${trainers.length} trainers + ${npcs.length} NPCs (${storyNpcs.length} story) + ${collectibles.length} collectibles ` +
    `@ ${SPRITE_SCALE}× into per-category layers`,
);

let painted = 0;
const skipped = [];
const counts = Object.fromEntries(LAYER_CATEGORIES.map((c) => [c, 0]));
counts["npc-story"] = 0;

function paint(dest, sheet, xPct, yPct, fw, fh, frame, flipX) {
  const outW = Math.round(fw * SPRITE_SCALE);
  const outH = Math.round(fh * SPRITE_SCALE);
  const px = Math.round((xPct / 100) * dest.width - outW / 2);
  const py = Math.round((yPct / 100) * dest.height - outH);
  blitSprite(dest, sheet, px, py, {
    frameX: frame * fw,
    frameW: fw,
    frameH: fh,
    flipX,
    scale: SPRITE_SCALE,
  });
}

for (const tr of trainers) {
  const fw = tr.spriteWidth ?? 16;
  const fh = tr.spriteHeight ?? 32;
  try {
    paint(layers.trainer, loadSprite(tr.spriteSheet), tr.x, tr.y, fw, fh, tr.spriteFrame ?? 0, Boolean(tr.spriteFlipX));
    painted++;
    counts.trainer++;
  } catch (err) {
    skipped.push(`trainer ${tr.id}: ${err.message}`);
  }
}

for (const npc of npcs) {
  const fw = npc.spriteWidth ?? 16;
  const fh = npc.spriteHeight ?? 32;
  try {
    const sheet = loadSprite(npc.spriteSheet);
    paint(layers.npc, sheet, npc.x, npc.y, fw, fh, npc.spriteFrame ?? 0, Boolean(npc.spriteFlipX));
    painted++;
    counts.npc++;
    if (npcHasStory(npc)) {
      paint(npcStoryLayer, sheet, npc.x, npc.y, fw, fh, npc.spriteFrame ?? 0, Boolean(npc.spriteFlipX));
      counts["npc-story"]++;
    }
  } catch (err) {
    skipped.push(`npc ${npc.id}: ${err.message}`);
  }
}

for (const p of collectibles) {
  const sprite = COLLECTIBLE_SPRITES[p.category];
  if (!sprite) {
    skipped.push(`collectible ${p.id}: no sprite for ${p.category}`);
    continue;
  }
  try {
    paint(
      layers[p.category],
      loadSprite(sprite.spriteSheet),
      p.x,
      p.y,
      sprite.spriteWidth,
      sprite.spriteHeight,
      sprite.spriteFrame ?? 0,
      false,
    );
    painted++;
    counts[p.category]++;
  } catch (err) {
    skipped.push(`collectible ${p.id}: ${err.message}`);
  }
}

console.log(`Painted ${painted} sprites`, counts);
if (skipped.length) {
  console.warn(`Skipped ${skipped.length}:`);
  for (const s of skipped.slice(0, 20)) console.warn(" ", s);
}

fs.mkdirSync(ARTIFACT, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Composite preview (base + all layers) for offline QA
const composite = loadRgbaPng(SRC);
for (const cat of LAYER_CATEGORIES) {
  const layer = layers[cat];
  for (let i = 0; i < composite.data.length; i += 4) {
    const a = layer.data[i + 3] / 255;
    if (a < 0.01) continue;
    composite.data[i] = Math.round(layer.data[i] * a + composite.data[i] * (1 - a));
    composite.data[i + 1] = Math.round(layer.data[i + 1] * a + composite.data[i + 1] * (1 - a));
    composite.data[i + 2] = Math.round(layer.data[i + 2] * a + composite.data[i + 2] * (1 - a));
    composite.data[i + 3] = 255;
  }
}
const compositePath = path.join(OUT_DIR, "hoenn-map-baked.png");
writePng(compositePath, composite);

const sizes = {};
for (const cat of LAYER_CATEGORIES) {
  const pngPath = path.join(OUT_DIR, `hoenn-map-baked-${cat}.png`);
  writePng(pngPath, layers[cat]);
  console.log(`Optimizing ${path.basename(pngPath)}…`);
  sizes[cat] = await optimizePair(pngPath);
  console.log(
    `  ${cat}: png ${(sizes[cat].png / 1024 / 1024).toFixed(2)} MB, webp ${(sizes[cat].webp / 1024 / 1024).toFixed(2)} MB`,
  );
}

{
  const pngPath = path.join(OUT_DIR, "hoenn-map-baked-npc-story.png");
  writePng(pngPath, npcStoryLayer);
  console.log(`Optimizing ${path.basename(pngPath)}…`);
  sizes["npc-story"] = await optimizePair(pngPath);
  console.log(
    `  npc-story: png ${(sizes["npc-story"].png / 1024 / 1024).toFixed(2)} MB, webp ${(sizes["npc-story"].webp / 1024 / 1024).toFixed(2)} MB (${counts["npc-story"]} sprites)`,
  );
}

console.log("Optimizing composite…");
sizes.composite = await optimizePair(compositePath);

// Proof crop Route 102
const cropX = Math.max(0, Math.round(0.11 * MAP_W) - 240);
const cropY = Math.max(0, Math.round(0.66 * MAP_H) - 160);
await sharp(compositePath)
  .extract({ left: cropX, top: cropY, width: 480, height: 320 })
  .png()
  .toFile(path.join(ARTIFACT, "hoenn-bake-proof-route102.png"));

fs.writeFileSync(
  path.join(ARTIFACT, "bake-meta.json"),
  JSON.stringify({ painted, counts, skipped: skipped.length, sizes, spriteScale: SPRITE_SCALE }, null, 2),
);
console.log("Done. Layers + composite written under public/maps/");
