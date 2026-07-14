/**
 * Generates Gen 3–style 16×16 league milestone sprites (Elite Four, Champion, Hall of Fame)
 * matching the metallic grayscale palette of public/sprites/gym/badges.png.
 *
 * Usage: node scripts/gen-league-milestone-sprites.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/sprites/gym/league-milestones.png");

/** Palette keys → RGBA, chosen to match badges.png */
const P = {
  ".": null, // transparent
  K: [0, 0, 0, 255], // black outline
  D: [120, 120, 120, 255], // dark gray
  M: [176, 176, 176, 255], // mid gray
  L: [208, 208, 208, 255], // light gray
  H: [248, 248, 248, 255], // highlight
};

/**
 * Rows are 16 chars. Legend: . transparent, K black, D/M/L/H metallics.
 * Drawn to read clearly when scaled 2× like gym badges on the progress rail.
 */
const FRAMES = {
  // Elite Four — four chamber doors under a league pediment
  "elite-four": [
    "................",
    "...KKKKKKKKKK...",
    "..KLHHHHHHHHLK..",
    ".KLHMDMDMDMDHLK.",
    ".KHKKKKKKKKKKHK.",
    ".KMDK.KK.KK.KDK.",
    ".KLDKLKKLKKLKLK.",
    ".KHMKHKKHKKHKMK.",
    ".KMDK.KK.KK.KDK.",
    ".KLDKLKKLKKLKLK.",
    ".KHMKHKKHKKHKMK.",
    ".KMDKKKKKKKKKDK.",
    ".KLMMMMMMMMMMLK.",
    "..KKKKKKKKKKKK..",
    "...KDDDDDDDDK...",
    "....KKKKKKKK....",
  ],
  // Champion — jeweled crown
  champion: [
    "................",
    "................",
    "....K..H..K.....",
    "...KLK.K.KLK....",
    "..KLHLKHKLHLK...",
    ".KLHMMHHHMHLK...",
    ".KHMMMMMMMMHK...",
    ".KLHHHHHHHHHK...",
    ".KMMMMMMMMMMK...",
    ".KLHLHMHLHLHK...",
    "..KMMMMMMMMK....",
    "...KLHHHHHK.....",
    "....KKKKKK......",
    "................",
    "................",
    "................",
  ],
  // Hall of Fame — five-point star medal on a display pedestal
  "hall-of-fame": [
    "................",
    "......KKK.......",
    ".....KLHLK......",
    "....KLHHHLK.....",
    "..KKKHLHLHKKK...",
    ".KLHHHHHHHHHLK..",
    ".KHHLHLHLHLHHK..",
    ".KLHHHHHHHHHLK..",
    "..KKKHLHLHKKK...",
    "....KLHHHLK.....",
    ".....KLHLK......",
    "......KKKK......",
    "......KMMK......",
    ".....KLHHLK.....",
    "....KKKKKKKK....",
    "................",
  ],
};

const ORDER = ["elite-four", "champion", "hall-of-fame"];
const SIZE = 16;

function paintFrame(png, frameIndex, rows) {
  for (let y = 0; y < SIZE; y++) {
    const row = rows[y];
    if (row.length !== SIZE) {
      throw new Error(`${ORDER[frameIndex]} row ${y} has length ${row.length}, expected ${SIZE}`);
    }
    for (let x = 0; x < SIZE; x++) {
      const rgba = P[row[x]];
      const i = (y * png.width + (frameIndex * SIZE + x)) * 4;
      if (!rgba) {
        png.data[i] = 0;
        png.data[i + 1] = 0;
        png.data[i + 2] = 0;
        png.data[i + 3] = 0;
      } else {
        png.data[i] = rgba[0];
        png.data[i + 1] = rgba[1];
        png.data[i + 2] = rgba[2];
        png.data[i + 3] = rgba[3];
      }
    }
  }
}

const png = new PNG({ width: SIZE * ORDER.length, height: SIZE, colorType: 6 });
for (let i = 0; i < ORDER.length; i++) {
  paintFrame(png, i, FRAMES[ORDER[i]]);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write(png));
console.log(`Wrote ${OUT} (${png.width}×${png.height})`);
