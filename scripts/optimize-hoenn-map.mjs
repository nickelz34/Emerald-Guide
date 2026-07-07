/**
 * Losslessly compress public/maps/hoenn-map.png and emit a WebP twin.
 * The source composite is often ~28MB uncompressed; optimized PNG is ~4MB and
 * lossless WebP ~1.4MB with identical pixels (verified via raw buffer compare).
 *
 * Run after render:hoenn or whenever hoenn-map.png is replaced.
 *   node scripts/optimize-hoenn-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/maps/hoenn-map.png");
const WEBP = path.join(ROOT, "public/maps/hoenn-map.webp");
const TMP = path.join(ROOT, "public/maps/hoenn-map.opt.png");

async function pixelsMatch(aPath, bPath) {
  const a = await sharp(aPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(bPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) return false;
  return a.data.equals(b.data);
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Missing ${SRC}`);
    process.exit(1);
  }

  const before = fs.statSync(SRC).size;
  console.log(`Optimizing ${SRC} (${(before / 1024 / 1024).toFixed(1)} MB)…`);

  await sharp(SRC)
    .png({ compressionLevel: 9, effort: 10, palette: false })
    .toFile(TMP);

  if (!(await pixelsMatch(SRC, TMP))) {
    fs.unlinkSync(TMP);
    throw new Error("Optimized PNG is not pixel-identical to source");
  }

  fs.renameSync(TMP, SRC);
  const pngSize = fs.statSync(SRC).size;

  await sharp(SRC).webp({ lossless: true, effort: 6 }).toFile(WEBP);

  if (!(await pixelsMatch(SRC, WEBP))) {
    fs.unlinkSync(WEBP);
    throw new Error("Lossless WebP is not pixel-identical to source");
  }

  const webpSize = fs.statSync(WEBP).size;
  console.log(`PNG  ${(pngSize / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - pngSize / before) * 100)}% smaller)`);
  console.log(`WebP ${(webpSize / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - webpSize / before) * 100)}% smaller)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
