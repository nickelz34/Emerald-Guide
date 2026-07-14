/**
 * Generates Gen 3–style 16×16 league milestone sprites (Elite Four, Champion, Hall of Fame)
 * matching the metallic grayscale palette of public/sprites/gym/badges.png.
 *
 * Usage: node scripts/gen-league-milestone-sprites.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/sprites/gym/league-milestones.png");

/** Palette keys → RGBA, chosen to match badges.png */
const P = {
  ".": [0, 0, 0, 0], // transparent
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
    ".KLHLLLLLLLLHLK.",
    ".KHKLKLKLKLKLHK.",
    ".KLLKHHLHHHLKLK.",
    ".KHMKLLHLLHKMHK.",
    ".KLLKHHLHHHLKLK.",
    ".KHMKLLHLLHKMHK.",
    ".KLLKHHLHHHLKLK.",
    ".KHMKLLHLLHKMHK.",
    ".KLLKKKKKKKKKLK.",
    ".KLHHHHHHHHHHLK.",
    "..KKKKKKKKKKKK..",
    "...KMMMMMMMMK...",
    "....KKKKKKKK....",
  ],
  // Champion — jeweled crown
  champion: [
    "................",
    "................",
    "....K..H..K.....",
    "...KLK.K.KLK....",
    "..KLHLKHKLHLK...",
    ".KLHHHHHHHHHLK..",
    ".KHLLLLLLLLLHK..",
    ".KLHHHHHHHHHLK..",
    ".KHMMMMMMMMMHK..",
    ".KLHLHLHLHLHLK..",
    "..KLLLLLLLLLK...",
    "...KLHHHHHLK....",
    "....KKKKKKK.....",
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
    "..KKKLHHHLKKK...",
    ".KLHHHHHHHHHLK..",
    ".KHHLHHHHHLHHK..",
    ".KLHHHHHHHHHLK..",
    "..KKKLHHHLKKK...",
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

function buildRaw() {
  const width = SIZE * ORDER.length;
  const height = SIZE;
  const data = Buffer.alloc(width * height * 4);
  for (let frameIndex = 0; frameIndex < ORDER.length; frameIndex++) {
    const rows = FRAMES[ORDER[frameIndex]];
    for (let y = 0; y < SIZE; y++) {
      const row = rows[y];
      if (row.length !== SIZE) {
        throw new Error(`${ORDER[frameIndex]} row ${y} has length ${row.length}, expected ${SIZE}`);
      }
      for (let x = 0; x < SIZE; x++) {
        const rgba = P[row[x]];
        if (!rgba) throw new Error(`Unknown pixel "${row[x]}" in ${ORDER[frameIndex]}`);
        const i = (y * width + (frameIndex * SIZE + x)) * 4;
        data[i] = rgba[0];
        data[i + 1] = rgba[1];
        data[i + 2] = rgba[2];
        data[i + 3] = rgba[3];
      }
    }
  }
  return { width, height, data };
}

const { width, height, data } = buildRaw();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .toFile(OUT);
console.log(`Wrote ${OUT} (${width}×${height})`);
