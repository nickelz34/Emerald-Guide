/**
 * Bake Steven into Mossdeep City — Steven's House area map.
 * The 176×128 interior is too small for CSS OW overlay pins (they stay
 * screen-sized while the map scales up). Paint the NPC into the PNG and
 * register AREA_MAP_CUTSCENE_ENTITIES (bakedInImage) for legend / hit targets.
 *
 * Usage:
 *   node scripts/gen-area-maps.mjs --only=MossdeepCity_StevensHouse   # clean base
 *   node scripts/bake-stevens-house-sprites.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const OUT = path.join(AREA_DIR, "mossdeepcity-stevenshouse.png");
const ARTIFACT = "/opt/cursor/artifacts/stevens-house-baked";

const MAP_W = 11; // 176px
const MAP_H = 8; // 128px

/** In-game object_events from MossdeepCity_StevensHouse/map.json */
const ENTITIES = [
  {
    name: "Steven",
    tileX: 9,
    tileY: 6,
    facing: "east",
    gfx: "steven",
    class: "Champion",
    desc: "Steven Stone — gifts HM08 Dive after the Space Center raid (gone after Champion; Beldum ball appears on the desk).",
    script: "MossdeepCity_StevensHouse_EventScript_Steven",
    graphicsId: "OBJ_EVENT_GFX_STEVEN",
  },
];

const GFX = {
  steven: {
    public: "sprites/trainers/steven.png",
    repoPng: "graphics/object_events/pics/people/steven.png",
    repoPal: "graphics/object_events/palettes/npc_4.pal",
  },
};

function toLocalX(x, W = MAP_W) {
  return +(((x + 0.5) / W) * 100).toFixed(2);
}
function toLocalY(y, H = MAP_H) {
  // Feet sit one tile below the object event Y (same as sync-area-map-entities).
  return +(((y + 1) / H) * 100).toFixed(2);
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

function placePerson(dest, sprite, tileX, tileY, facing) {
  // Emerald standard OW sheet: face S/N/W at indices 0/1/2; east = west + hFlip.
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  blitSprite(dest, sprite, tileX * 16, tileY * 16 - 16, {
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

function clonePng(src) {
  const out = new PNG({ width: src.width, height: src.height, colorType: 6 });
  out.data.set(src.data);
  return out;
}

if (!fs.existsSync(OUT)) {
  console.error("Missing", OUT, "— run: node scripts/gen-area-maps.mjs --only=MossdeepCity_StevensHouse");
  process.exit(1);
}
if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald");
  process.exit(1);
}

const base = PNG.sync.read(fs.readFileSync(OUT));
if (base.width !== MAP_W * 16 || base.height !== MAP_H * 16) {
  console.error(`Unexpected map size ${base.width}×${base.height}; expected ${MAP_W * 16}×${MAP_H * 16}`);
  process.exit(1);
}

fs.mkdirSync(ARTIFACT, { recursive: true });
// Keep a clean snapshot so re-runs stay idempotent.
const cleanPath = path.join(ARTIFACT, "mossdeepcity-stevenshouse-clean.png");
if (!fs.existsSync(cleanPath)) {
  writePng(cleanPath, base);
  console.log("Saved clean base →", cleanPath);
}
const clean = PNG.sync.read(fs.readFileSync(cleanPath));
const scene = clonePng(clean);

const spriteCache = new Map();
function spriteFor(key) {
  if (spriteCache.has(key)) return spriteCache.get(key);
  const g = GFX[key];
  const s = loadIndexedSprite(g.repoPng, g.repoPal);
  spriteCache.set(key, s);
  return s;
}

for (const e of ENTITIES) {
  placePerson(scene, spriteFor(e.gfx), e.tileX, e.tileY, e.facing);
}

writePng(OUT, scene);
writePng(path.join(ARTIFACT, "mossdeepcity-stevenshouse.png"), scene);

const FACE = { south: 0, north: 1, west: 2, east: 2 };
const cutscene = ENTITIES.map((e) => ({
  id: "stevens-house-steven",
  name: e.name,
  category: "trainer",
  x: toLocalX(e.tileX),
  y: toLocalY(e.tileY),
  desc: e.desc,
  spriteSheet: GFX[e.gfx].public,
  spriteWidth: 16,
  spriteHeight: 32,
  spriteFrame: FACE[e.facing] ?? 0,
  spriteFlipX: e.facing === "east" || undefined,
  note: "Steven's House",
  bakedInImage: true,
  trainerClass: e.class,
  trainerName: e.name,
  graphicsId: e.graphicsId,
  script: e.script,
}));

fs.writeFileSync(path.join(ARTIFACT, "cutscene-entities.json"), JSON.stringify(cutscene, null, 2));
console.log(
  "Baked",
  OUT,
  cutscene.map((e) => `${e.name}@(${e.x},${e.y}) frame=${e.spriteFrame}${e.spriteFlipX ? " flipX" : ""}`).join(", "),
);
console.log("Cutscene meta →", path.join(ARTIFACT, "cutscene-entities.json"));
