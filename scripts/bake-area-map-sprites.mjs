/**
 * TEST bake: paint area-map trainers + item / hidden / berry sprites onto
 * transparent per-category layers (and a composite) for HoennMap's map selector.
 *
 * Leaves the original `public/maps/areas/{areaId}.png` untouched.
 * Skips trainers that are already painted into the base PNG via cutscene bake
 * (`bakedInImage`) so composites don't double-up.
 *
 * Usage: npm run bake:area-maps
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import sharp from "sharp";
import { AREA_MAPS } from "../src/data/areaMaps.ts";
import { AREA_TRAINERS } from "../src/data/mapTrainersGenerated.ts";
import { AREA_MAP_CUTSCENE_ENTITIES } from "../src/data/areaMapCutsceneEntities.ts";
import { COLLECTIBLE_SPRITES } from "../src/data/itemSpritesGenerated.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT = "/opt/cursor/artifacts/area-maps-baked";
const MANIFEST_TS = path.join(ROOT, "src/data/areaMapBakeManifest.ts");

/** Native area maps are already 16px/tile — keep sprites 1:1 with the art. */
const SPRITE_SCALE = 1;

const LAYER_CATEGORIES = ["trainer", "item", "hidden", "berry"];
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

function trainerAlreadyInBase(areaId, trainer) {
  const cut = AREA_MAP_CUTSCENE_ENTITIES[areaId] ?? [];
  return cut.some((e) => {
    if (!e.bakedInImage) return false;
    if (trainer.trainerId && e.trainerId && trainer.trainerId === e.trainerId) return true;
    if (trainer.script && e.script && trainer.script === e.script) return true;
    return (
      Math.abs(trainer.x - e.x) < 0.5 &&
      Math.abs(trainer.y - e.y) < 0.5 &&
      trainer.spriteSheet === e.spriteSheet
    );
  });
}

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

function compositeLayers(base, layers) {
  const composite = loadRgbaPng_fromPng(base);
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
  return composite;
}

function loadRgbaPng_fromPng(png) {
  const out = new PNG({ width: png.width, height: png.height, colorType: 6 });
  out.data.set(png.data);
  return out;
}

const targets = AREA_MAPS.filter((area) => {
  const trainers = AREA_TRAINERS[area.id] ?? [];
  const collectibles = area.markers.filter((m) => COLLECTIBLE_CATEGORIES.has(m.category));
  return trainers.length > 0 || collectibles.length > 0;
});

console.log(
  `Baking ${targets.length} area maps @ ${SPRITE_SCALE}× (trainers + item/hidden/berry)`,
);

fs.mkdirSync(ARTIFACT, { recursive: true });

const manifest = {};
let totalPainted = 0;
const skipped = [];
let areasWritten = 0;

for (const area of targets) {
  const srcPath = path.join(ROOT, "public", area.image);
  if (!fs.existsSync(srcPath)) {
    skipped.push(`${area.id}: missing ${area.image}`);
    continue;
  }

  const base = loadRgbaPng(srcPath);
  if (base.width !== area.width || base.height !== area.height) {
    console.warn(
      `  ${area.id}: size ${base.width}×${base.height} vs data ${area.width}×${area.height}`,
    );
  }

  const layers = Object.fromEntries(
    LAYER_CATEGORIES.map((c) => [c, emptyLayer(base.width, base.height)]),
  );
  const counts = Object.fromEntries(LAYER_CATEGORIES.map((c) => [c, 0]));
  let painted = 0;
  let skippedInBase = 0;

  for (const tr of AREA_TRAINERS[area.id] ?? []) {
    if (trainerAlreadyInBase(area.id, tr)) {
      skippedInBase++;
      continue;
    }
    const fw = tr.spriteWidth ?? 16;
    const fh = tr.spriteHeight ?? 32;
    try {
      paint(
        layers.trainer,
        loadSprite(tr.spriteSheet),
        tr.x,
        tr.y,
        fw,
        fh,
        tr.spriteFrame ?? 0,
        Boolean(tr.spriteFlipX),
      );
      painted++;
      counts.trainer++;
    } catch (err) {
      skipped.push(`trainer ${tr.id}: ${err.message}`);
    }
  }

  for (const p of area.markers.filter((m) => COLLECTIBLE_CATEGORIES.has(m.category))) {
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

  // Still emit bake assets when trainers are already in the base (hit targets /
  // filter layers for collectibles) or when we painted anything new.
  const hasLayerContent = LAYER_CATEGORIES.some((c) => counts[c] > 0);
  const hasPrebakedTrainers = skippedInBase > 0;
  if (!hasLayerContent && !hasPrebakedTrainers) continue;

  const composite = compositeLayers(base, layers);
  const compositePath = path.join(AREA_DIR, `${area.id}-baked.png`);
  writePng(compositePath, composite);

  const layerSizes = {};
  for (const cat of LAYER_CATEGORIES) {
    if (counts[cat] === 0) continue;
    const pngPath = path.join(AREA_DIR, `${area.id}-baked-${cat}.png`);
    writePng(pngPath, layers[cat]);
    layerSizes[cat] = await optimizePair(pngPath);
  }
  const compositeSizes = await optimizePair(compositePath);

  manifest[area.id] = {
    width: base.width,
    height: base.height,
    counts,
    skippedInBase,
    layers: LAYER_CATEGORIES.filter((c) => counts[c] > 0),
    /** Trainers already in the base PNG — pins are hit-only; no trainer layer paint. */
    prebakedTrainers: hasPrebakedTrainers,
  };

  totalPainted += painted;
  areasWritten++;
  console.log(
    `  ${area.id}: painted ${painted}` +
      (skippedInBase ? ` (skipped ${skippedInBase} already in base)` : "") +
      ` → composite ${(compositeSizes.webp / 1024).toFixed(1)} KB webp`,
  );
}

const manifestBody = `// AUTO-GENERATED by scripts/bake-area-map-sprites.mjs — do not edit by hand.
/** Area maps with baked trainer/item/hidden/berry layers for HoennMap. */
export interface AreaMapBakeEntry {
  width: number;
  height: number;
  counts: Record<"trainer" | "item" | "hidden" | "berry", number>;
  skippedInBase: number;
  layers: Array<"trainer" | "item" | "hidden" | "berry">;
  prebakedTrainers: boolean;
}

export const AREA_MAP_BAKE_MANIFEST: Record<string, AreaMapBakeEntry> = ${JSON.stringify(
  manifest,
  null,
  2,
)};

export const AREA_MAP_BAKE_SPRITE_SCALE = ${SPRITE_SCALE};
`;

fs.writeFileSync(MANIFEST_TS, manifestBody);

fs.writeFileSync(
  path.join(ARTIFACT, "bake-meta.json"),
  JSON.stringify(
    {
      areasWritten,
      totalPainted,
      skipped: skipped.length,
      spriteScale: SPRITE_SCALE,
      areaIds: Object.keys(manifest),
    },
    null,
    2,
  ),
);

console.log(`\nDone. ${areasWritten} areas, ${totalPainted} sprites painted.`);
if (skipped.length) {
  console.warn(`Skipped ${skipped.length}:`);
  for (const s of skipped.slice(0, 30)) console.warn(" ", s);
}
console.log("Manifest:", MANIFEST_TS);
