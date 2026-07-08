/**
 * Generate the town/city map pin sprite (red teardrop with gold cap).
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

/** 13×18 pixel art — '.' = transparent */
const ART = `
.............
.............
.....ooo.....
....oyyyo....
...oyYYYo....
..oyYRRYo...
..oyRRRRo...
..oyRRRRo...
..oyRRwRo...
..oyRwwwRo..
...oyRRRo...
....oyYo...
.....ooo...
......o....
......o....
.............
.............
`.trim().split("\n");

const PALETTE = {
  o: [32, 40, 72, 255],
  y: [200, 152, 24, 255],
  Y: [255, 216, 56, 255],
  R: [216, 56, 48, 255],
  w: [255, 255, 255, 255],
};

const W = ART[0].length;
const H = ART.length;
const png = new PNG({ width: W, height: H });

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const ch = ART[y][x];
    const i = (y * W + x) * 4;
    const c = PALETTE[ch];
    if (!c) {
      png.data[i + 3] = 0;
      continue;
    }
    png.data[i] = c[0];
    png.data[i + 1] = c[1];
    png.data[i + 2] = c[2];
    png.data[i + 3] = c[3];
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
console.log(`Wrote ${OUT} (${W}×${H})`);
