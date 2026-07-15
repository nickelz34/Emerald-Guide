/**
 * Bake trainer / NPC sprites into Petalburg Gym room-crop area maps.
 * Room crops are too small for full-map entity sync, so overlays land wrong —
 * paint sprites into the PNG and use AREA_MAP_CUTSCENE_ENTITIES (bakedInImage)
 * for the legend / hit targets.
 *
 * Usage: node scripts/bake-petalburg-gym-room-sprites.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT = "/opt/cursor/artifacts/petalburg-gym-rooms-baked";
const SRC = path.join(AREA_DIR, "petalburgcity-gym.png");

const ROOM_H = 128;
const ROOM_TILE_H = 8;
const MAP_W = 9;

/** Matches scripts/split-petalburg-gym-rooms.mjs */
const ROOMS = [
  {
    id: "petalburgcity-gym-norman",
    file: "petalburgcity-gym-norman.png",
    floor: "Norman's room",
    y0: 0,
    tile0: 0,
    entities: [
      {
        name: "Norman",
        tileX: 4,
        tileY: 2,
        facing: "south",
        gfx: "norman",
        trainerId: "TRAINER_NORMAN_1",
        class: "Gym Leader",
        desc: "Gym Leader Norman — Balance Badge.",
        script: "PetalburgCity_Gym_EventScript_Norman",
      },
    ],
  },
  {
    id: "petalburgcity-gym-jody",
    file: "petalburgcity-gym-jody.png",
    floor: "Challenge room — Jody",
    y0: 208,
    tile0: 13,
    entities: [
      {
        name: "Jody",
        tileX: 4,
        tileY: 16,
        facing: "south",
        gfx: "woman_5",
        trainerId: "TRAINER_JODY",
        class: "Cooltrainer",
        desc: "Cooltrainer Jody — challenge room.",
        script: "PetalburgCity_Gym_EventScript_Jody",
      },
    ],
  },
  {
    id: "petalburgcity-gym-berke",
    file: "petalburgcity-gym-berke.png",
    floor: "Challenge room — Berke",
    y0: 416,
    tile0: 26,
    entities: [
      {
        name: "Berke",
        tileX: 4,
        tileY: 29,
        facing: "south",
        gfx: "man_3",
        trainerId: "TRAINER_BERKE",
        class: "Cooltrainer",
        desc: "Cooltrainer Berke — challenge room.",
        script: "PetalburgCity_Gym_EventScript_Berke",
      },
    ],
  },
  {
    id: "petalburgcity-gym-parker",
    file: "petalburgcity-gym-parker.png",
    floor: "Challenge room — Parker",
    y0: 624,
    tile0: 39,
    entities: [
      {
        name: "Parker",
        tileX: 4,
        tileY: 42,
        facing: "south",
        gfx: "man_3",
        trainerId: "TRAINER_PARKER",
        class: "Cooltrainer",
        desc: "Cooltrainer Parker — challenge room.",
        script: "PetalburgCity_Gym_EventScript_Parker",
      },
    ],
  },
  {
    id: "petalburgcity-gym-alexia",
    file: "petalburgcity-gym-alexia.png",
    floor: "Challenge room — Alexia",
    y0: 832,
    tile0: 52,
    entities: [
      {
        name: "Alexia",
        tileX: 4,
        tileY: 55,
        facing: "south",
        gfx: "woman_5",
        trainerId: "TRAINER_ALEXIA",
        class: "Cooltrainer",
        desc: "Cooltrainer Alexia — challenge room.",
        script: "PetalburgCity_Gym_EventScript_Alexia",
      },
    ],
  },
  {
    id: "petalburgcity-gym-george",
    file: "petalburgcity-gym-george.png",
    floor: "Challenge room — George",
    y0: 1040,
    tile0: 65,
    entities: [
      {
        name: "George",
        tileX: 4,
        tileY: 68,
        facing: "south",
        gfx: "man_3",
        trainerId: "TRAINER_GEORGE",
        class: "Cooltrainer",
        desc: "Cooltrainer George — challenge room.",
        script: "PetalburgCity_Gym_EventScript_George",
      },
    ],
  },
  {
    id: "petalburgcity-gym-randall",
    file: "petalburgcity-gym-randall.png",
    floor: "Challenge room — Randall",
    y0: 1248,
    tile0: 78,
    entities: [
      {
        name: "Randall",
        tileX: 4,
        tileY: 81,
        facing: "south",
        gfx: "man_3",
        trainerId: "TRAINER_RANDALL",
        class: "Cooltrainer",
        desc: "Cooltrainer Randall — challenge room.",
        script: "PetalburgCity_Gym_EventScript_Randall",
      },
    ],
  },
  {
    id: "petalburgcity-gym-mary",
    file: "petalburgcity-gym-mary.png",
    floor: "Challenge room — Mary",
    y0: 1456,
    tile0: 91,
    entities: [
      {
        name: "Mary",
        tileX: 4,
        tileY: 94,
        facing: "south",
        gfx: "woman_5",
        trainerId: "TRAINER_MARY",
        class: "Cooltrainer",
        desc: "Cooltrainer Mary — challenge room.",
        script: "PetalburgCity_Gym_EventScript_Mary",
      },
    ],
  },
  {
    id: "petalburgcity-gym-entrance",
    file: "petalburgcity-gym-entrance.png",
    floor: "Entrance",
    y0: 1664,
    tile0: 104,
    entities: [
      {
        name: "Gym Guide",
        tileX: 3,
        tileY: 109,
        facing: "south",
        gfx: "man_2",
        trainerId: "",
        class: "Gym Guide",
        desc: "Gym Guide — tips for Norman's challenge rooms.",
        script: "PetalburgCity_Gym_EventScript_GymGuide",
      },
      {
        name: "Wally",
        tileX: 4,
        tileY: 111,
        facing: "north",
        gfx: "wally",
        trainerId: "",
        class: "Trainer",
        desc: "Wally waits at the entrance before Norman's challenge.",
        script: "PetalburgCity_Gym_EventScript_Wally",
      },
    ],
  },
];

const GFX = {
  norman: {
    public: "sprites/trainers/norman.png",
    repoPng: "graphics/object_events/pics/people/gym_leaders/norman.png",
    repoPal: "graphics/object_events/palettes/npc_4.pal",
  },
  woman_5: {
    public: "sprites/trainers/woman_5.png",
    repoPng: "graphics/object_events/pics/people/woman_5.png",
    repoPal: "graphics/object_events/palettes/npc_2.pal",
  },
  man_3: {
    public: "sprites/trainers/man_3.png",
    repoPng: "graphics/object_events/pics/people/man_3.png",
    repoPal: "graphics/object_events/palettes/npc_2.pal",
  },
  man_2: {
    public: "sprites/trainers/man_2.png",
    repoPng: "graphics/object_events/pics/people/man_2.png",
    repoPal: "graphics/object_events/palettes/npc_3.pal",
  },
  wally: {
    public: "sprites/trainers/wally.png",
    repoPng: "graphics/object_events/pics/people/wally.png",
    repoPal: "graphics/object_events/palettes/npc_1.pal",
  },
};

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

function loadIndexedSprite(relPng, relPal) {
  const png = PNG.sync.read(fs.readFileSync(path.join(REPO, relPng)));
  let palette = null;
  if (relPal) {
    const lines = fs.readFileSync(path.join(REPO, relPal), "utf8").split(/\r?\n/);
    palette = [];
    for (let c = 0; c < 16; c++) {
      const parts = (lines[3 + c] || "").trim().split(/\s+/).map(Number);
      palette.push({ r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0 });
    }
  } else if (png.palette) {
    palette = png.palette.map(([r, g, b]) => ({ r, g, b }));
  }
  return { png, palette };
}

function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW = 16, frameH = 32 } = {}) {
  const { png, palette } = sprite;
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const sx = frameX + col;
      const sy = row;
      if (sx >= png.width || sy >= png.height) continue;
      const si = (sy * png.width + sx) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
      let a = png.data[si + 3];
      if (palette) {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < palette.length; i++) {
          const pr = palette[i].r;
          const pg = palette[i].g;
          const pb = palette[i].b;
          const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best === 0) continue;
        r = palette[best].r;
        g = palette[best].g;
        b = palette[best].b;
        if (r === 255 && g === 0 && b === 255) continue;
        a = 255;
      } else if (a === 0 || (r === 255 && g === 0 && b === 255)) {
        continue;
      }
      const tx = flipX ? dx + (frameW - 1 - col) : dx + col;
      const ty = dy + row;
      if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
      const di = (ty * dest.width + tx) * 4;
      dest.data[di] = r;
      dest.data[di + 1] = g;
      dest.data[di + 2] = b;
      dest.data[di + 3] = 255;
    }
  }
}

function placePerson(dest, sprite, tileX, localTileY, facing) {
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  blitSprite(dest, sprite, tileX * 16, localTileY * 16 - 16, {
    flipX: facing === "east",
    frameX: frame * 16,
    frameW: 16,
    frameH: 32,
  });
}

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
}

if (!fs.existsSync(SRC)) {
  console.error("Missing", SRC, "— render the full gym first.");
  process.exit(1);
}
if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald");
  process.exit(1);
}

const src = PNG.sync.read(fs.readFileSync(SRC));
fs.mkdirSync(ARTIFACT, { recursive: true });

const spriteCache = new Map();
function spriteFor(key) {
  if (spriteCache.has(key)) return spriteCache.get(key);
  const g = GFX[key];
  const s = loadIndexedSprite(g.repoPng, g.repoPal);
  spriteCache.set(key, s);
  return s;
}

const cutsceneBlocks = [];

for (const room of ROOMS) {
  const crop = cropPng(src, { x: 0, y: room.y0, w: src.width, h: ROOM_H });
  for (const e of room.entities) {
    const localY = e.tileY - room.tile0;
    placePerson(crop, spriteFor(e.gfx), e.tileX, localY, e.facing);
  }
  writePng(path.join(AREA_DIR, room.file), crop);
  writePng(path.join(ARTIFACT, room.file), crop);

  const ents = room.entities.map((e) => {
    const x = toLocalX(e.tileX);
    const y = toLocalYInRoom(e.tileY, room.tile0);
    const sheet = GFX[e.gfx].public;
    const FACE = { south: 0, north: 1, west: 2, east: 2 };
    return { ...e, x, y, sheet, frame: FACE[e.facing] ?? 0 };
  });
  cutsceneBlocks.push({ id: room.id, floor: room.floor, ents });
  console.log(
    room.id,
    ents.map((e) => `${e.name}@(${e.x},${e.y})`).join(", "),
  );
}

const metaPath = path.join(ARTIFACT, "cutscene-entities.json");
fs.writeFileSync(metaPath, JSON.stringify(cutsceneBlocks, null, 2));
console.log("Wrote", metaPath);
console.log("Done — room PNGs baked under", AREA_DIR);
