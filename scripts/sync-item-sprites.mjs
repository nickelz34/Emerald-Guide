/**
 * Download overworld item-ball / berry-tree graphics and derive a grey/white
 * hidden-item ball from the item ball sprite. Emits src/data/itemSpritesGenerated.ts.
 *
 * Usage:
 *   node scripts/sync-item-sprites.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const OUT_DIR = path.join(ROOT, "public/sprites/items");
const OUT_TS = path.join(ROOT, "src/data/itemSpritesGenerated.ts");

const ASSETS = [
  {
    id: "item",
    rel: "graphics/object_events/pics/misc/item_ball.png",
    out: "item_ball.png",
    width: 16,
    height: 16,
    frame: 0,
  },
  {
    id: "berry",
    rel: "graphics/object_events/pics/berry_trees/cheri.png",
    out: "berry_tree.png",
    /** Mature cheri tree frame (16×32, one tile wide × two tall — matches in-game OAM). */
    crop: { x: 80, y: 0, w: 16, h: 32 },
    width: 16,
    height: 32,
    frame: 0,
  },
];

/** Recolor the visible item ball into a grey-top / white-bottom hidden-item ball. */
const HIDDEN_BALL_RECOLOR = new Map([
  ["82,16,0", [88, 88, 88]], // dark red highlight → dark grey
  ["205,98,74", [176, 176, 176]], // light red → light grey
  ["148,57,41", [136, 136, 136]], // mid red → mid grey
  ["74,74,123", [48, 48, 48]], // center band → dark grey
  ["156,156,189", [72, 72, 72]],
  ["205,205,222", [96, 96, 96]],
  // white + black outline unchanged
]);

function clonePng(png) {
  const out = new PNG({ width: png.width, height: png.height });
  png.data.copy(out.data);
  out.palette = png.palette;
  out.colorType = 6;
  return out;
}

function makeHiddenItemBall(itemBall) {
  const out = clonePng(itemBall);
  for (let i = 0; i < out.data.length; i += 4) {
    if (out.data[i + 3] === 0) continue;
    const key = `${out.data[i]},${out.data[i + 1]},${out.data[i + 2]}`;
    const next = HIDDEN_BALL_RECOLOR.get(key);
    if (!next) continue;
    out.data[i] = next[0];
    out.data[i + 1] = next[1];
    out.data[i + 2] = next[2];
  }
  return out;
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchBuffer(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function loadPng(rel) {
  const local = path.join(REPO, rel);
  const buf = fs.existsSync(local)
    ? fs.readFileSync(local)
    : await fetchBuffer(`${RAW}/${rel.replace(/\\/g, "/")}`);
  return PNG.sync.read(buf);
}

function keyOutTransparency(png) {
  const key = png.palette?.[0] ?? { r: 115, g: 197, b: 164 };
  const kr = key.r ?? 115;
  const kg = key.g ?? 197;
  const kb = key.b ?? 164;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    if (r === kr && g === kg && b === kb) png.data[i + 3] = 0;
  }
  return png;
}

function cropPng(src, { x, y, w, h }) {
  const out = new PNG({ width: w, height: h });
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const si = ((y + row) * src.width + (x + col)) * 4;
      const di = (row * w + col) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  out.palette = src.palette;
  out.colorType = 6;
  return out;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const sprites = {};
let itemBallPng = null;
for (const asset of ASSETS) {
  let png = await loadPng(asset.rel);
  png = keyOutTransparency(png);
  if (asset.crop) png = cropPng(png, asset.crop);
  if (asset.id === "item") itemBallPng = clonePng(png);
  const outPath = path.join(OUT_DIR, asset.out);
  fs.writeFileSync(
    outPath,
    PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }),
  );
  sprites[asset.id] = {
    spriteSheet: `sprites/items/${asset.out}`,
    spriteWidth: asset.width,
    spriteHeight: asset.height,
    spriteFrame: asset.frame,
  };
  console.log(`Wrote ${outPath}`);
}

if (itemBallPng) {
  const hidden = makeHiddenItemBall(itemBallPng);
  const hiddenOut = path.join(OUT_DIR, "hidden_item_ball.png");
  fs.writeFileSync(
    hiddenOut,
    PNG.sync.write({ ...hidden, colorType: 6, inputHasAlpha: true }),
  );
  sprites.hidden = {
    spriteSheet: "sprites/items/hidden_item_ball.png",
    spriteWidth: 16,
    spriteHeight: 16,
    spriteFrame: 0,
  };
  console.log(`Wrote ${hiddenOut}`);
  const legacyFinder = path.join(OUT_DIR, "itemfinder.png");
  if (fs.existsSync(legacyFinder)) fs.unlinkSync(legacyFinder);
}

const ts = `/** Auto-generated by scripts/sync-item-sprites.mjs — do not edit. */
import type { PoiCategory } from "./mapPoints";

export interface CollectibleSprite {
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
  spriteFrame: number;
}

export const COLLECTIBLE_SPRITES: Partial<Record<PoiCategory, CollectibleSprite>> = {
  item: ${JSON.stringify(sprites.item, null, 2).replace(/\n/g, "\n  ")},
  berry: ${JSON.stringify(sprites.berry, null, 2).replace(/\n/g, "\n  ")},
  hidden: ${JSON.stringify(sprites.hidden, null, 2).replace(/\n/g, "\n  ")},
};

export const COLLECTIBLE_SPRITE_CATEGORIES = ["item", "hidden", "berry"] as const;
export type CollectibleSpriteCategory = (typeof COLLECTIBLE_SPRITE_CATEGORIES)[number];

export function isCollectibleSpriteCategory(
  category: PoiCategory,
): category is CollectibleSpriteCategory {
  return category === "item" || category === "hidden" || category === "berry";
}

export function getCollectibleSprite(category: PoiCategory): CollectibleSprite | null {
  return COLLECTIBLE_SPRITES[category] ?? null;
}
`;

fs.writeFileSync(OUT_TS, ts);
console.log(`Wrote ${OUT_TS}`);
