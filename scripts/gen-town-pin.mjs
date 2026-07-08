/**
 * Build the town/city map pin — hand-authored pixel art matching the
 * requested teardrop marker (12×19, red body, gold cap, 2×2 white center).
 *
 * Output: public/sprites/map/town_pin.png
 *
 * Usage:
 *   node scripts/gen-town-pin.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/sprites/map/town_pin.png");
const W = 12;
const H = 19;

const C = {
  ".": null,
  o: [16, 24, 56, 255],
  y: [184, 128, 16, 255],
  Y: [255, 220, 56, 255],
  r: [152, 40, 32, 255],
  R: [224, 48, 40, 255],
  l: [248, 104, 80, 255],
  d: [136, 32, 24, 255],
  w: [255, 255, 255, 255],
};

/** 12×19 teardrop map pin */
const ART = `
............
............
....ooo.....
...oyYYo....
..oyYYYyo...
.oylRRRro...
.oylRRRRro..
.oyrRRRRro..
.oyrRwwRro..
.oyrdwwdro..
.oyrRRRRro..
..oyRRRro...
...oyRro....
....oro.....
.....o......
.....o......
............
............
............
`.trim().split("\n");

const png = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) {
  const row = ART[y];
  if (row.length !== W) throw new Error(`Row ${y}: width ${row.length} != ${W}`);
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const rgba = C[row[x]];
    if (!rgba) {
      png.data[i + 3] = 0;
      continue;
    }
    png.data[i] = rgba[0];
    png.data[i + 1] = rgba[1];
    png.data[i + 2] = rgba[2];
    png.data[i + 3] = rgba[3];
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
console.log(`Wrote ${OUT} (${W}×${H})`);
