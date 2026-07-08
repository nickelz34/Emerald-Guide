/**
 * Verify the town/city map pin sprite dimensions.
 * Art lives at public/sprites/map/town_pin.png (14×18 teardrop marker).
 *
 * Usage:
 *   node scripts/gen-town-pin.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/sprites/map/town_pin.png");
const EXPECT_W = 14;
const EXPECT_H = 18;

if (!fs.existsSync(OUT)) {
  console.error(`Missing ${OUT}`);
  process.exit(1);
}

const png = PNG.sync.read(fs.readFileSync(OUT));
if (png.width !== EXPECT_W || png.height !== EXPECT_H) {
  console.error(`Expected ${EXPECT_W}×${EXPECT_H}, got ${png.width}×${png.height}`);
  process.exit(1);
}

console.log(`OK ${OUT} (${png.width}×${png.height})`);
