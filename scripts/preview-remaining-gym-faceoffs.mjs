/**
 * Gym battles #2–#8 — baked leader face-off cutscenes (same style as Roxanne).
 * Keeps full gym interiors linked separately via STEP_AREA_MAPS.
 *
 * Usage: node scripts/preview-remaining-gym-faceoffs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT_ROOT = "/opt/cursor/artifacts";
const SCREENSHOTS = path.join(ARTIFACT_ROOT, "screenshots");

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map(layoutsJson.layouts.filter((l) => l?.id).map((l) => [l.id, l]));

const PAL = {
  NPC_1: "graphics/object_events/palettes/npc_1.pal",
  NPC_2: "graphics/object_events/palettes/npc_2.pal",
  NPC_3: "graphics/object_events/palettes/npc_3.pal",
  NPC_4: "graphics/object_events/palettes/npc_4.pal",
};

const tilesetDir = (sym, kind) => {
  const name = sym.replace(/^gTileset_/, "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return `data/tilesets/${kind}/${name}`;
};

const tsCache = new Map();
function loadTileset(relDir) {
  if (tsCache.has(relDir)) return tsCache.get(relDir);
  const dir = path.join(REPO, relDir);
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, "tiles.png")));
  const { width: W, height: H, data } = png;
  const pal = png.palette || [];
  const rev = new Map();
  for (let i = 0; i < pal.length; i++) {
    const [r, g, b] = pal[i];
    rev.set((r << 16) | (g << 8) | b, i);
  }
  const tilesX = W >> 3;
  const nTiles = tilesX * (H >> 3);
  const tiles = new Array(nTiles);
  for (let t = 0; t < nTiles; t++) {
    const tc = t % tilesX;
    const tr = (t / tilesX) | 0;
    const arr = new Uint8Array(64);
    for (let py = 0; py < 8; py++) {
      for (let px = 0; px < 8; px++) {
        const o = ((tr * 8 + py) * W + (tc * 8 + px)) * 4;
        arr[py * 8 + px] = rev.get((data[o] << 16) | (data[o + 1] << 8) | data[o + 2]) ?? 0;
      }
    }
    tiles[t] = arr;
  }
  const pals = new Array(16);
  for (let p = 0; p < 16; p++) {
    const pf = path.join(dir, "palettes", String(p).padStart(2, "0") + ".pal");
    const cols = new Uint8Array(48);
    if (fs.existsSync(pf)) {
      const lines = fs.readFileSync(pf, "utf8").split(/\r?\n/);
      for (let c = 0; c < 16; c++) {
        const parts = (lines[3 + c] || "").trim().split(/\s+/);
        cols[c * 3] = +parts[0] || 0;
        cols[c * 3 + 1] = +parts[1] || 0;
        cols[c * 3 + 2] = +parts[2] || 0;
      }
    }
    pals[p] = cols;
  }
  const meta = fs.readFileSync(path.join(dir, "metatiles.bin"));
  const obj = { tiles, nTiles, pals, meta };
  tsCache.set(relDir, obj);
  return obj;
}

const metaCache = new Map();
function getMetatile(pdir, sdir, id) {
  const key = `${pdir}|${sdir}|${id}`;
  let m = metaCache.get(key);
  if (m) return m;
  const prim = loadTileset(pdir);
  const sec = loadTileset(sdir);
  const out = new Uint8Array(1024);
  const mSrc = id < 512 ? prim : sec;
  const mOff = (id < 512 ? id : id - 512) * 16;
  if (mOff + 16 <= mSrc.meta.length) {
    for (let layer = 0; layer < 2; layer++) {
      for (let s = 0; s < 4; s++) {
        const e = mOff + (layer * 4 + s) * 2;
        const val = mSrc.meta[e] | (mSrc.meta[e + 1] << 8);
        const tileId = val & 0x3ff;
        const xflip = (val >> 10) & 1;
        const yflip = (val >> 11) & 1;
        const pal = (val >> 12) & 0xf;
        const tsrc = tileId < 512 ? prim : sec;
        const tid = tileId < 512 ? tileId : tileId - 512;
        if (tid >= tsrc.nTiles) continue;
        const tile = tsrc.tiles[tid];
        const cols = pal < 6 ? prim.pals[pal] : sec.pals[pal];
        const sx = (s & 1) * 8;
        const sy = (s >> 1) * 8;
        for (let py = 0; py < 8; py++) {
          const ty = yflip ? 7 - py : py;
          for (let px = 0; px < 8; px++) {
            const tx = xflip ? 7 - px : px;
            const ci = tile[ty * 8 + tx];
            if (layer === 1 && ci === 0) continue;
            const o = ((sy + py) * 16 + (sx + px)) * 4;
            out[o] = cols[ci * 3];
            out[o + 1] = cols[ci * 3 + 1];
            out[o + 2] = cols[ci * 3 + 2];
            out[o + 3] = 255;
          }
        }
      }
    }
  }
  metaCache.set(key, out);
  return out;
}

function renderLayout(layout) {
  const W = layout.width;
  const H = layout.height;
  const pdir = tilesetDir(layout.primary_tileset, "primary");
  const sdir = tilesetDir(layout.secondary_tileset, "secondary");
  const bin = fs.readFileSync(path.join(REPO, layout.blockdata_filepath));
  const OW = W * 16;
  const OH = H * 16;
  const png = new PNG({ width: OW, height: OH, colorType: 6 });
  const ob = png.data;
  for (let i = 0; i < ob.length; i += 4) {
    ob[i] = 72;
    ob[i + 1] = 48;
    ob[i + 2] = 40;
    ob[i + 3] = 255;
  }
  for (let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      const ci = (row * W + col) * 2;
      if (ci + 1 >= bin.length) continue;
      const val = bin[ci] | (bin[ci + 1] << 8);
      const mt = getMetatile(pdir, sdir, val & 0x3ff);
      const px = col * 16;
      const py = row * 16;
      for (let ry = 0; ry < 16; ry++) {
        ob.set(mt.subarray(ry * 64, ry * 64 + 64), ((py + ry) * OW + px) * 4);
      }
    }
  }
  return png;
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
  }
  return { png, palette };
}

function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW = 16, frameH = 32 } = {}) {
  const { png, palette } = sprite;
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const si = (row * png.width + (frameX + col)) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
      if (palette) {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < palette.length; i++) {
          const d = (r - palette[i].r) ** 2 + (g - palette[i].g) ** 2 + (b - palette[i].b) ** 2;
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
      } else if (png.data[si + 3] === 0) continue;
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
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  blitSprite(dest, sprite, tileX * 16, tileY * 16 - 16, {
    flipX: facing === "east",
    frameX: frame * 16,
    frameW: 16,
    frameH: 32,
  });
}

function clonePng(src) {
  const out = new PNG({ width: src.width, height: src.height, colorType: 6 });
  out.data.set(src.data);
  return out;
}

function cropPng(src, { x, y, w, h }) {
  const out = new PNG({ width: w, height: h, colorType: 6 });
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const sx = x + col;
      const sy = y + row;
      const di = (row * w + col) * 4;
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) {
        out.data[di] = 72;
        out.data[di + 1] = 48;
        out.data[di + 2] = 40;
        out.data[di + 3] = 255;
        continue;
      }
      const si = (sy * src.width + sx) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function scaleNearest(src, scale) {
  const out = new PNG({ width: src.width * scale, height: src.height * scale, colorType: 6 });
  for (let y = 0; y < out.height; y++) {
    for (let x = 0; x < out.width; x++) {
      const si = (((y / scale) | 0) * src.width + ((x / scale) | 0)) * 4;
      const di = (y * out.width + x) * 4;
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

/**
 * @typedef {{
 *   gym: number,
 *   mapFolder: string,
 *   areaFile: string,
 *   previewDir: string,
 *   title: string,
 *   leaders: { sprite: string, pal: string, x: number, y: number, facing?: string }[],
 *   player: { x: number, y: number, facing?: string },
 *   cropY?: number,
 * }} GymScene
 */

/** @type {GymScene[]} */
const SCENES = [
  {
    gym: 2,
    mapFolder: "DewfordTown_Gym",
    areaFile: "dewfordtown-gym-brawly-battle.png",
    previewDir: "brawly-gym",
    title: "Dewford Gym — Brawly face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/brawly.png",
        pal: PAL.NPC_3,
        x: 4,
        y: 3,
      },
    ],
    player: { x: 4, y: 5 },
    cropY: 0,
  },
  {
    gym: 3,
    mapFolder: "MauvilleCity_Gym",
    areaFile: "mauvillecity-gym-wattson-battle.png",
    previewDir: "wattson-gym",
    title: "Mauville Gym — Wattson face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/wattson.png",
        pal: PAL.NPC_2,
        x: 5,
        y: 2,
      },
    ],
    player: { x: 5, y: 4 },
    cropY: 0,
  },
  {
    gym: 4,
    mapFolder: "LavaridgeTown_Gym_1F",
    areaFile: "lavaridgetown-gym-flannery-battle.png",
    previewDir: "flannery-gym",
    title: "Lavaridge Gym — Flannery face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/flannery.png",
        pal: PAL.NPC_1,
        x: 13,
        y: 9,
      },
    ],
    player: { x: 13, y: 11 },
  },
  {
    gym: 5,
    mapFolder: "PetalburgCity_Gym",
    areaFile: "petalburgcity-gym-norman-battle.png",
    previewDir: "norman-gym",
    title: "Petalburg Gym — Norman face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/norman.png",
        pal: PAL.NPC_4,
        x: 4,
        y: 2,
      },
    ],
    player: { x: 4, y: 4 },
    cropY: 0,
  },
  {
    gym: 6,
    mapFolder: "FortreeCity_Gym",
    areaFile: "fortreecity-gym-winona-battle.png",
    previewDir: "winona-gym",
    title: "Fortree Gym — Winona face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/winona.png",
        pal: PAL.NPC_4,
        x: 15,
        y: 2,
      },
    ],
    player: { x: 15, y: 4 },
    cropY: 0,
  },
  {
    gym: 7,
    mapFolder: "MossdeepCity_Gym",
    areaFile: "mossdeepcity-gym-tate-liza-battle.png",
    previewDir: "tate-liza-gym",
    title: "Mossdeep Gym — Tate & Liza face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/tate.png",
        pal: PAL.NPC_1,
        x: 23,
        y: 7,
      },
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/liza.png",
        pal: PAL.NPC_1,
        x: 24,
        y: 7,
      },
    ],
    // Centered under the twins for the double battle
    player: { x: 23, y: 9 },
  },
  {
    gym: 8,
    mapFolder: "SootopolisCity_Gym_1F",
    areaFile: "sootopoliscity-gym-juan-battle.png",
    previewDir: "juan-gym",
    title: "Sootopolis Gym — Juan face-off",
    leaders: [
      {
        sprite: "graphics/object_events/pics/people/gym_leaders/juan.png",
        pal: PAL.NPC_4,
        x: 8,
        y: 2,
      },
    ],
    player: { x: 8, y: 4 },
    cropY: 0,
  },
];

const brendan = loadIndexedSprite(
  "graphics/object_events/pics/people/brendan/walking.png",
  "graphics/object_events/palettes/brendan.pal",
);

fs.mkdirSync(AREA_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS, { recursive: true });

for (const scene of SCENES) {
  const mj = JSON.parse(fs.readFileSync(path.join(REPO, `data/maps/${scene.mapFolder}/map.json`), "utf8"));
  const layout = layoutById.get(mj.layout);
  if (!layout) throw new Error(`Missing layout for ${scene.mapFolder}`);
  const base = renderLayout(layout);
  const out = clonePng(base);

  for (const leader of scene.leaders) {
    const spr = loadIndexedSprite(leader.sprite, leader.pal);
    placePerson(out, spr, leader.x, leader.y, leader.facing ?? "south");
  }
  placePerson(out, brendan, scene.player.x, scene.player.y, scene.player.facing ?? "north");

  const midX = Math.round(
    (scene.leaders.reduce((s, l) => s + l.x, 0) / scene.leaders.length + scene.player.x) / 2,
  );
  const northY = Math.min(...scene.leaders.map((l) => l.y), scene.player.y);
  const crop = {
    x: (midX - 7) * 16,
    y: scene.cropY !== undefined ? scene.cropY : Math.max(0, (northY - 4) * 16),
    w: 240,
    h: 160,
  };
  const focus = cropPng(out, crop);

  writePng(path.join(AREA_DIR, scene.areaFile), focus);
  const preview = path.join(ROOT, "public/screenshots/previews", scene.previewDir);
  const artifact = path.join(ARTIFACT_ROOT, scene.previewDir);
  for (const dir of [preview, artifact]) {
    writePng(path.join(dir, "event-gym-faceoff.png"), focus);
    writePng(path.join(dir, "event-gym-faceoff@2x.png"), scaleNearest(focus, 2));
  }
  writePng(path.join(SCREENSHOTS, `${scene.previewDir}-faceoff@2x.png`), scaleNearest(focus, 2));
  fs.writeFileSync(path.join(preview, "README.md"), `# ${scene.title}\n\nBaked podium face-off cutscene.\n`);
  console.log(`✓ Gym #${scene.gym} → ${scene.areaFile}`);
}

console.log("done");
