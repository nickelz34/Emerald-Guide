/**
 * Bake trainers + NPCs + item / hidden / berry sprites onto transparent
 * per-category layers (and a composite preview) for the Hoenn overworld.
 *
 * Filter overlays are packed into lossless tile atlases (not full-map
 * 12800×6128 bitmaps) so toggling NPCs / Story only stays pixel-perfect
 * without decoding a mostly-transparent giant RGBA image on mobile.
 *
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
const MANIFEST_TS = path.join(ROOT, "src/data/hoennMapBakeLayers.ts");
const ARTIFACT = "/opt/cursor/artifacts/hoenn-overworld-baked";
const MAP_W = 12800;
const MAP_H = 6128;

/** Nearest-neighbor upscale so sprites read a bit better on the full map / phone. */
const SPRITE_SCALE = 2;
/**
 * Sparse overlay layers are split into this grid, then each occupied cell is
 * content-cropped and packed into one atlas (lossless). Smaller = less decode
 * work; more tiles in the atlas.
 */
const ATLAS_TILE = 512;
/** Shelf-pack atlas max width (keeps atlases reasonably square). */
const ATLAS_MAX_W = 2048;

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
  // Lossless only — never palette/quantize (must stay pixel-perfect).
  await sharp(pngPath).png({ compressionLevel: 9, effort: 10, palette: false }).toFile(tmp);
  fs.renameSync(tmp, pngPath);
  await sharp(pngPath).webp({ lossless: true, nearLossless: false, quality: 100, effort: 6 }).toFile(webpPath);
  return {
    png: fs.statSync(pngPath).size,
    webp: fs.statSync(webpPath).size,
  };
}

/** Axis-aligned bounds of non-transparent pixels, or null if empty. */
function contentBounds(png, x0 = 0, y0 = 0, x1 = png.width, y1 = png.height) {
  let minX = x1;
  let minY = y1;
  let maxX = x0 - 1;
  let maxY = y0 - 1;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (png.data[(y * png.width + x) * 4 + 3] === 0) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function cropPng(src, rect) {
  const out = emptyLayer(rect.w, rect.h);
  for (let y = 0; y < rect.h; y++) {
    const srcRow = ((rect.y + y) * src.width + rect.x) * 4;
    const dstRow = y * rect.w * 4;
    out.data.set(src.data.subarray(srcRow, srcRow + rect.w * 4), dstRow);
  }
  return out;
}

/** Content-tight crops for each non-empty ATLAS_TILE cell. */
function extractTileCrops(png, tileSize = ATLAS_TILE) {
  const crops = [];
  const tilesX = Math.ceil(png.width / tileSize);
  const tilesY = Math.ceil(png.height / tileSize);
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const x0 = tx * tileSize;
      const y0 = ty * tileSize;
      const bounds = contentBounds(
        png,
        x0,
        y0,
        Math.min(x0 + tileSize, png.width),
        Math.min(y0 + tileSize, png.height),
      );
      if (!bounds) continue;
      crops.push({ map: bounds, png: cropPng(png, bounds) });
    }
  }
  return crops;
}

/** Shelf-pack crops into one atlas. 1px gap avoids filter bleed between tiles. */
function packAtlas(crops, maxW = ATLAS_MAX_W, gap = 1) {
  const order = crops
    .map((c, i) => ({ i, w: c.png.width, h: c.png.height }))
    .sort((a, b) => b.h - a.h || b.w - a.w);
  let shelfX = 0;
  let shelfY = 0;
  let shelfH = 0;
  let atlasW = 0;
  let atlasH = 0;
  const placed = new Array(crops.length);
  for (const item of order) {
    if (shelfX > 0 && shelfX + item.w > maxW) {
      shelfY += shelfH + gap;
      shelfX = 0;
      shelfH = 0;
    }
    placed[item.i] = { x: shelfX, y: shelfY, w: item.w, h: item.h };
    shelfX += item.w + gap;
    shelfH = Math.max(shelfH, item.h);
    atlasW = Math.max(atlasW, shelfX - gap);
    atlasH = Math.max(atlasH, shelfY + item.h);
  }
  if (atlasW <= 0 || atlasH <= 0) return null;
  const atlas = emptyLayer(atlasW, atlasH);
  const tiles = [];
  for (let i = 0; i < crops.length; i++) {
    const crop = crops[i];
    const p = placed[i];
    for (let y = 0; y < crop.png.height; y++) {
      const srcRow = y * crop.png.width * 4;
      const dstRow = ((p.y + y) * atlasW + p.x) * 4;
      atlas.data.set(crop.png.data.subarray(srcRow, srcRow + crop.png.width * 4), dstRow);
    }
    tiles.push({
      mapX: crop.map.x,
      mapY: crop.map.y,
      mapW: crop.map.w,
      mapH: crop.map.h,
      atlasX: p.x,
      atlasY: p.y,
      atlasW: p.w,
      atlasH: p.h,
    });
  }
  return { atlas, tiles, width: atlasW, height: atlasH };
}

async function writeLayerAtlas(layerKey, layerPng, counts, sizes, manifest) {
  const crops = extractTileCrops(layerPng);
  if (crops.length === 0) {
    console.log(`  ${layerKey}: empty (skipped atlas)`);
    return;
  }
  const packed = packAtlas(crops);
  if (!packed) return;
  const pngPath = path.join(OUT_DIR, `hoenn-map-baked-${layerKey}-atlas.png`);
  writePng(pngPath, packed.atlas);
  console.log(
    `Optimizing ${path.basename(pngPath)} (${packed.width}×${packed.height}, ${packed.tiles.length} tiles)…`,
  );
  sizes[layerKey] = await optimizePair(pngPath);
  const decodePx = packed.tiles.reduce((n, t) => n + t.mapW * t.mapH, 0);
  console.log(
    `  ${layerKey}: png ${(sizes[layerKey].png / 1024).toFixed(1)} KB, webp ${(sizes[layerKey].webp / 1024).toFixed(1)} KB` +
      ` — ${packed.tiles.length} tiles, decode ~${(decodePx * 4 / 1024 / 1024).toFixed(2)} MB` +
      (counts[layerKey] != null ? ` (${counts[layerKey]} sprites)` : ""),
  );
  manifest[layerKey] = {
    atlasWidth: packed.width,
    atlasHeight: packed.height,
    tiles: packed.tiles,
  };
  // Remove legacy full-map layer files (decode bombs on mobile).
  for (const ext of ["png", "webp"]) {
    const legacy = path.join(OUT_DIR, `hoenn-map-baked-${layerKey}.${ext}`);
    if (fs.existsSync(legacy)) fs.unlinkSync(legacy);
  }
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
const manifest = {};
const atlasKeys = [...LAYER_CATEGORIES, "npc-story"];
const layerByKey = { ...layers, "npc-story": npcStoryLayer };
for (const key of atlasKeys) {
  await writeLayerAtlas(key, layerByKey[key], counts, sizes, manifest);
}

console.log("Optimizing composite…");
sizes.composite = await optimizePair(compositePath);

const manifestBody = `// AUTO-GENERATED by scripts/bake-hoenn-overworld-sprites.mjs — do not edit by hand.
/** Lossless tile-atlas overlays for HoennMap filter layers (pixel-perfect crops). */

export interface HoennBakeLayerTile {
  /** Placement on the overworld map, in source pixels. */
  mapX: number;
  mapY: number;
  mapW: number;
  mapH: number;
  /** Source rect inside the layer atlas image. */
  atlasX: number;
  atlasY: number;
  atlasW: number;
  atlasH: number;
}

export interface HoennBakeLayerAtlas {
  atlasWidth: number;
  atlasHeight: number;
  tiles: HoennBakeLayerTile[];
}

export const HOENN_MAP_BAKE_MAP_SIZE = { width: ${MAP_W}, height: ${MAP_H} } as const;
export const HOENN_MAP_BAKE_SPRITE_SCALE = ${SPRITE_SCALE};
export const HOENN_MAP_BAKE_LAYER_ATLASES: Record<string, HoennBakeLayerAtlas> = ${JSON.stringify(
  manifest,
  null,
  2,
)};
`;

fs.writeFileSync(MANIFEST_TS, manifestBody);

// Proof crop Route 102
const cropX = Math.max(0, Math.round(0.11 * MAP_W) - 240);
const cropY = Math.max(0, Math.round(0.66 * MAP_H) - 160);
await sharp(compositePath)
  .extract({ left: cropX, top: cropY, width: 480, height: 320 })
  .png()
  .toFile(path.join(ARTIFACT, "hoenn-bake-proof-route102.png"));

fs.writeFileSync(
  path.join(ARTIFACT, "bake-meta.json"),
  JSON.stringify(
    {
      painted,
      counts,
      skipped: skipped.length,
      sizes,
      spriteScale: SPRITE_SCALE,
      atlasTile: ATLAS_TILE,
      layers: Object.fromEntries(
        Object.entries(manifest).map(([k, v]) => [k, { tiles: v.tiles.length, atlas: `${v.atlasWidth}x${v.atlasHeight}` }]),
      ),
    },
    null,
    2,
  ),
);
console.log("Done. Atlases + composite under public/maps/; manifest →", MANIFEST_TS);
