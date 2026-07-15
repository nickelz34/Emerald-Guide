/**
 * Elite Four + Champion — room interiors and baked face-off cutscenes.
 * Also copies OW sprites into public/sprites/trainers/.
 *
 * Usage: node scripts/preview-elite-four-faceoffs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const SPRITE_DIR = path.join(ROOT, "public/sprites/trainers");
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
    ob[i] = 40;
    ob[i + 1] = 32;
    ob[i + 2] = 48;
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
        out.data[di] = 40;
        out.data[di + 1] = 32;
        out.data[di + 2] = 48;
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

/** Copy indexed pokeemerald sheets into the guide's public trainers folder. */
const SPRITE_COPIES = [
  ["graphics/object_events/pics/people/elite_four/sidney.png", "sidney.png"],
  ["graphics/object_events/pics/people/elite_four/phoebe.png", "phoebe.png"],
  ["graphics/object_events/pics/people/elite_four/glacia.png", "glacia.png"],
  ["graphics/object_events/pics/people/elite_four/drake.png", "drake.png"],
  ["graphics/object_events/pics/people/wallace.png", "wallace.png"],
];
fs.mkdirSync(SPRITE_DIR, { recursive: true });
for (const [src, name] of SPRITE_COPIES) {
  const out = path.join(SPRITE_DIR, name);
  fs.copyFileSync(path.join(REPO, src), out);
  console.log("sprite", name);
}

const brendan = loadIndexedSprite(
  "graphics/object_events/pics/people/brendan/walking.png",
  "graphics/object_events/palettes/brendan.pal",
);

/**
 * @typedef {{
 *   mapFolder: string,
 *   roomId: string,
 *   roomFile: string,
 *   battleId: string,
 *   battleFile: string,
 *   previewDir: string,
 *   title: string,
 *   floor: string,
 *   leader: { sprite: string, pal: string, x: number, y: number, name: string, publicSprite: string },
 *   player?: { x: number, y: number },
 * }} LeagueScene
 */

/** @type {LeagueScene[]} */
const SCENES = [
  {
    mapFolder: "EverGrandeCity_SidneysRoom",
    roomId: "evergrandecity-sidneysroom",
    roomFile: "evergrandecity-sidneysroom.png",
    battleId: "evergrandecity-sidneysroom-battle",
    battleFile: "evergrandecity-sidneysroom-battle.png",
    previewDir: "sidney-e4",
    title: "Elite Four — Sidney",
    floor: "Sidney's room",
    leader: {
      name: "Sidney",
      sprite: "graphics/object_events/pics/people/elite_four/sidney.png",
      pal: PAL.NPC_2,
      x: 6,
      y: 5,
      publicSprite: "sprites/trainers/sidney.png",
    },
  },
  {
    mapFolder: "EverGrandeCity_PhoebesRoom",
    roomId: "evergrandecity-phoebesroom",
    roomFile: "evergrandecity-phoebesroom.png",
    battleId: "evergrandecity-phoebesroom-battle",
    battleFile: "evergrandecity-phoebesroom-battle.png",
    previewDir: "phoebe-e4",
    title: "Elite Four — Phoebe",
    floor: "Phoebe's room",
    leader: {
      name: "Phoebe",
      sprite: "graphics/object_events/pics/people/elite_four/phoebe.png",
      pal: PAL.NPC_1,
      x: 6,
      y: 5,
      publicSprite: "sprites/trainers/phoebe.png",
    },
  },
  {
    mapFolder: "EverGrandeCity_GlaciasRoom",
    roomId: "evergrandecity-glaciasroom",
    roomFile: "evergrandecity-glaciasroom.png",
    battleId: "evergrandecity-glaciasroom-battle",
    battleFile: "evergrandecity-glaciasroom-battle.png",
    previewDir: "glacia-e4",
    title: "Elite Four — Glacia",
    floor: "Glacia's room",
    leader: {
      name: "Glacia",
      sprite: "graphics/object_events/pics/people/elite_four/glacia.png",
      pal: PAL.NPC_2,
      x: 6,
      y: 5,
      publicSprite: "sprites/trainers/glacia.png",
    },
  },
  {
    mapFolder: "EverGrandeCity_DrakesRoom",
    roomId: "evergrandecity-drakesroom",
    roomFile: "evergrandecity-drakesroom.png",
    battleId: "evergrandecity-drakesroom-battle",
    battleFile: "evergrandecity-drakesroom-battle.png",
    previewDir: "drake-e4",
    title: "Elite Four — Drake",
    floor: "Drake's room",
    leader: {
      name: "Drake",
      sprite: "graphics/object_events/pics/people/elite_four/drake.png",
      pal: PAL.NPC_3,
      x: 6,
      y: 5,
      publicSprite: "sprites/trainers/drake.png",
    },
  },
  {
    mapFolder: "EverGrandeCity_ChampionsRoom",
    roomId: "evergrandecity-championsroom",
    roomFile: "evergrandecity-championsroom.png",
    battleId: "evergrandecity-championsroom-battle",
    battleFile: "evergrandecity-championsroom-battle.png",
    previewDir: "wallace-champion",
    title: "Champion — Wallace",
    floor: "Champion's room",
    leader: {
      name: "Wallace",
      sprite: "graphics/object_events/pics/people/wallace.png",
      pal: PAL.NPC_4,
      x: 6,
      y: 5,
      publicSprite: "sprites/trainers/wallace.png",
    },
  },
];

fs.mkdirSync(AREA_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const metaOut = [];

for (const scene of SCENES) {
  const mj = JSON.parse(fs.readFileSync(path.join(REPO, `data/maps/${scene.mapFolder}/map.json`), "utf8"));
  const layout = layoutById.get(mj.layout);
  if (!layout) throw new Error(`Missing layout for ${scene.mapFolder}`);
  const base = renderLayout(layout);

  // Clean interior (no baked sprites — pin overlays handle that)
  writePng(path.join(AREA_DIR, scene.roomFile), base);

  // Face-off crop
  const leaderSpr = loadIndexedSprite(scene.leader.sprite, scene.leader.pal);
  const face = clonePng(base);
  const px = scene.player?.x ?? scene.leader.x;
  const py = scene.player?.y ?? scene.leader.y + 2;
  placePerson(face, leaderSpr, scene.leader.x, scene.leader.y, "south");
  placePerson(face, brendan, px, py, "north");
  const crop = {
    x: (scene.leader.x - 7) * 16,
    y: Math.max(0, (scene.leader.y - 3) * 16),
    w: 240,
    h: 160,
  };
  const focus = cropPng(face, crop);
  writePng(path.join(AREA_DIR, scene.battleFile), focus);

  const preview = path.join(ROOT, "public/screenshots/previews", scene.previewDir);
  const artifact = path.join(ARTIFACT_ROOT, scene.previewDir);
  for (const dir of [preview, artifact]) {
    writePng(path.join(dir, "event-faceoff.png"), focus);
    writePng(path.join(dir, "event-faceoff@2x.png"), scaleNearest(focus, 2));
    writePng(path.join(dir, "room.png"), base);
  }
  writePng(path.join(SCREENSHOTS, `${scene.previewDir}-faceoff@2x.png`), scaleNearest(focus, 2));
  fs.writeFileSync(path.join(preview, "README.md"), `# ${scene.title}\n\nFace-off cutscene + room interior.\n`);

  metaOut.push({
    roomId: scene.roomId,
    battleId: scene.battleId,
    roomFile: scene.roomFile,
    battleFile: scene.battleFile,
    floor: scene.floor,
    mapId: mj.layout.replace(/^LAYOUT_/, "MAP_").replace(/_/g, "_"), // fixed below
    gameMapId: `MAP_${scene.mapFolder.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").toUpperCase()}`,
    width: layout.width * 16,
    height: layout.height * 16,
    leader: {
      name: scene.leader.name,
      x: +(((scene.leader.x + 0.5) / layout.width) * 100).toFixed(2),
      y: +(((scene.leader.y + 1) / layout.height) * 100).toFixed(2),
      spriteSheet: scene.leader.publicSprite,
    },
  });
  console.log(`✓ ${scene.title}`);
}

// Hall of Fame interior (no face-off)
{
  const folder = "EverGrandeCity_HallOfFame";
  const mj = JSON.parse(fs.readFileSync(path.join(REPO, `data/maps/${folder}/map.json`), "utf8"));
  const layout = layoutById.get(mj.layout);
  const base = renderLayout(layout);
  writePng(path.join(AREA_DIR, "evergrandecity-halloffame.png"), base);
  metaOut.push({
    roomId: "evergrandecity-halloffame",
    roomFile: "evergrandecity-halloffame.png",
    floor: "Hall of Fame",
    width: layout.width * 16,
    height: layout.height * 16,
  });
  console.log("✓ Hall of Fame");
}

fs.writeFileSync(path.join(ARTIFACT_ROOT, "elite-four-meta.json"), JSON.stringify(metaOut, null, 2));
console.log("done");
