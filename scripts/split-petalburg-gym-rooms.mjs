/**
 * Split Petalburg City Gym into per-room crops (top → bottom).
 * Also prints remapped trainer pin coords for gymMapEntitiesGenerated.
 *
 * Usage: node scripts/split-petalburg-gym-rooms.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/maps/areas/petalburgcity-gym.png");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT = "/opt/cursor/artifacts/petalburg-gym-rooms";

/** Detected from the full render: 9 rooms × 128px with black voids between. */
const ROOMS = [
  { id: "petalburgcity-gym-norman", file: "petalburgcity-gym-norman.png", floor: "Norman's room", y0: 0, tile0: 0, entities: [{ name: "Norman", tileX: 4, tileY: 2, key: "norman" }] },
  { id: "petalburgcity-gym-jody", file: "petalburgcity-gym-jody.png", floor: "Challenge room — Jody", y0: 208, tile0: 13, entities: [{ name: "Jody", tileX: 4, tileY: 16, key: "jody" }] },
  { id: "petalburgcity-gym-berke", file: "petalburgcity-gym-berke.png", floor: "Challenge room — Berke", y0: 416, tile0: 26, entities: [{ name: "Berke", tileX: 4, tileY: 29, key: "berke" }] },
  { id: "petalburgcity-gym-parker", file: "petalburgcity-gym-parker.png", floor: "Challenge room — Parker", y0: 624, tile0: 39, entities: [{ name: "Parker", tileX: 4, tileY: 42, key: "parker" }] },
  { id: "petalburgcity-gym-alexia", file: "petalburgcity-gym-alexia.png", floor: "Challenge room — Alexia", y0: 832, tile0: 52, entities: [{ name: "Alexia", tileX: 4, tileY: 55, key: "alexia" }] },
  { id: "petalburgcity-gym-george", file: "petalburgcity-gym-george.png", floor: "Challenge room — George", y0: 1040, tile0: 65, entities: [{ name: "George", tileX: 4, tileY: 68, key: "george" }] },
  { id: "petalburgcity-gym-randall", file: "petalburgcity-gym-randall.png", floor: "Challenge room — Randall", y0: 1248, tile0: 78, entities: [{ name: "Randall", tileX: 4, tileY: 81, key: "randall" }] },
  { id: "petalburgcity-gym-mary", file: "petalburgcity-gym-mary.png", floor: "Challenge room — Mary", y0: 1456, tile0: 91, entities: [{ name: "Mary", tileX: 4, tileY: 94, key: "mary" }] },
  {
    id: "petalburgcity-gym-entrance",
    file: "petalburgcity-gym-entrance.png",
    floor: "Entrance",
    y0: 1664,
    tile0: 104,
    entities: [
      { name: "Gym Guide", tileX: 3, tileY: 109, key: "guide" },
      { name: "Wally", tileX: 4, tileY: 111, key: "wally" },
    ],
  },
];

const ROOM_H = 128;
const ROOM_TILE_H = 8;
const MAP_W = 9;

function toLocalX(x, W = MAP_W) {
  return +(((x + 0.5) / W) * 100).toFixed(2);
}
function toLocalYInRoom(y, tile0) {
  return +(((y - tile0 + 1) / ROOM_TILE_H) * 100).toFixed(2);
}

function cropPng(src, { x, y, w, h }) {
  const out = new PNG({ width: w, height: h, colorType: 6 });
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
  return out;
}

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
  console.log(file, png.width, png.height);
}

const src = PNG.sync.read(fs.readFileSync(SRC));
fs.mkdirSync(AREA_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT, { recursive: true });

const remapped = {};
for (const room of ROOMS) {
  const crop = cropPng(src, { x: 0, y: room.y0, w: src.width, h: ROOM_H });
  writePng(path.join(AREA_DIR, room.file), crop);
  writePng(path.join(ARTIFACT, room.file), crop);
  remapped[room.id] = room.entities.map((e) => ({
    ...e,
    x: toLocalX(e.tileX),
    y: toLocalYInRoom(e.tileY, room.tile0),
  }));
  console.log(`  ${room.id}:`, remapped[room.id].map((e) => `${e.name}@(${e.x},${e.y})`).join(", "));
}

fs.writeFileSync(
  path.join(ARTIFACT, "remap.json"),
  JSON.stringify({ rooms: ROOMS.map((r) => ({ id: r.id, floor: r.floor, file: r.file, width: 144, height: 128 })), remapped }, null, 2),
);
console.log("done");
