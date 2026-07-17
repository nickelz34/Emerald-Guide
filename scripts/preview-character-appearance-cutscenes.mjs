/**
 * Batch-bake walkthrough cutscenes for Scott meetings + other missing character beats.
 * Usage: node scripts/preview-character-appearance-cutscenes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT = "/opt/cursor/artifacts/character-appearances";
const PREVIEW = path.join(ROOT, "public/screenshots/previews/character-appearances");

if (!fs.existsSync(path.join(REPO, "data/layouts/layouts.json"))) {
  console.error("Missing .calib/pokeemerald");
  process.exit(1);
}

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map(layoutsJson.layouts.filter((l) => l?.id).map((l) => [l.id, l]));

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
    ob[i] = 56;
    ob[i + 1] = 104;
    ob[i + 2] = 168;
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
        out.data[di] = 56;
        out.data[di + 1] = 104;
        out.data[di + 2] = 168;
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
  console.log("wrote", path.relative(ROOT, file), png.width, png.height);
}

const SPRITES = {
  brendan: loadIndexedSprite(
    "graphics/object_events/pics/people/brendan/walking.png",
    "graphics/object_events/palettes/brendan.pal",
  ),
  scott: loadIndexedSprite(
    "graphics/object_events/pics/people/scott.png",
    "graphics/object_events/palettes/npc_1.pal",
  ),
  steven: loadIndexedSprite(
    "graphics/object_events/pics/people/steven.png",
    "graphics/object_events/palettes/npc_4.pal",
  ),
  archie: loadIndexedSprite(
    "graphics/object_events/pics/people/team_aqua/archie.png",
    "graphics/object_events/palettes/npc_1.pal",
  ),
  maxie: loadIndexedSprite(
    "graphics/object_events/pics/people/team_magma/maxie.png",
    "graphics/object_events/palettes/npc_2.pal",
  ),
  lanette: loadIndexedSprite(
    "graphics/object_events/pics/people/woman_2.png",
    "graphics/object_events/palettes/npc_3.pal",
  ),
  briney: loadIndexedSprite(
    "graphics/object_events/pics/people/expert_m.png",
    "graphics/object_events/palettes/npc_4.pal",
  ),
};

/**
 * people: [{ spriteKey, x, y, facing }]
 * focus: tile center for 240×160 crop (defaults to first person)
 */
const SCENES = [
  {
    id: "rustborocity-pokemonschool-scott",
    map: "RustboroCity_PokemonSchool",
    floor: "Scott at the Trainer’s School",
    people: [
      { spriteKey: "brendan", x: 1, y: 10, facing: "west" },
      { spriteKey: "scott", x: 0, y: 10, facing: "east" },
    ],
  },
  {
    id: "slateportcity-scott-museum",
    map: "SlateportCity",
    floor: "Scott outside the Oceanic Museum",
    people: [
      { spriteKey: "brendan", x: 30, y: 26, facing: "west" },
      { spriteKey: "scott", x: 29, y: 27, facing: "east" },
    ],
    focus: { x: 29.5, y: 26.5 },
  },
  {
    id: "slateportcity-scott-battletent",
    map: "SlateportCity",
    floor: "Scott at the Battle Tent",
    people: [
      { spriteKey: "brendan", x: 10, y: 14, facing: "north" },
      { spriteKey: "scott", x: 10, y: 13, facing: "south" },
    ],
  },
  {
    id: "mauvillecity-scott",
    map: "MauvilleCity",
    floor: "Scott after Wally’s battle",
    people: [
      { spriteKey: "brendan", x: 8, y: 7, facing: "south" },
      { spriteKey: "scott", x: 8, y: 8, facing: "north" },
    ],
  },
  {
    id: "verdanturf-battletent-scott",
    map: "VerdanturfTown_BattleTentLobby",
    floor: "Scott in Verdanturf Battle Tent",
    people: [
      { spriteKey: "brendan", x: 11, y: 6, facing: "east" },
      { spriteKey: "scott", x: 12, y: 6, facing: "west" },
    ],
  },
  {
    id: "fallarbor-battletent-scott",
    map: "FallarborTown_BattleTentLobby",
    floor: "Scott in Fallarbor Battle Tent",
    people: [
      { spriteKey: "brendan", x: 1, y: 7, facing: "west" },
      { spriteKey: "scott", x: 0, y: 7, facing: "east" },
    ],
  },
  {
    id: "route119-scott",
    map: "Route119",
    floor: "Scott after Rival Battle #4",
    people: [
      { spriteKey: "brendan", x: 25, y: 31, facing: "north" },
      { spriteKey: "scott", x: 25, y: 30, facing: "south" },
    ],
  },
  {
    id: "fortreecity-scott-call",
    map: "FortreeCity",
    floor: "Scott’s PokéNav call",
    people: [{ spriteKey: "brendan", x: 13, y: 10, facing: "south" }],
    focus: { x: 13, y: 10 },
  },
  {
    id: "lilycove-motel-scott",
    map: "LilycoveCity_CoveLilyMotel_2F",
    floor: "Scott at Cove Lily Motel",
    people: [
      { spriteKey: "brendan", x: 2, y: 7, facing: "west" },
      { spriteKey: "scott", x: 1, y: 7, facing: "east" },
    ],
  },
  {
    id: "mossdeepcity-scott",
    map: "MossdeepCity",
    floor: "Scott outside the Space Center",
    people: [
      { spriteKey: "brendan", x: 61, y: 30, facing: "north" },
      { spriteKey: "scott", x: 61, y: 29, facing: "south" },
    ],
  },
  {
    id: "evergrandecity-pokemoncenter-scott",
    map: "EverGrandeCity_PokemonCenter_1F",
    floor: "Scott at the Pokémon Center",
    people: [
      { spriteKey: "brendan", x: 9, y: 5, facing: "north" },
      { spriteKey: "scott", x: 9, y: 4, facing: "south" },
    ],
  },
  {
    id: "meteorfalls-archie",
    map: "MeteorFalls_1F_1R",
    floor: "Archie after Magma flees",
    people: [
      { spriteKey: "brendan", x: 13, y: 18, facing: "east" },
      { spriteKey: "archie", x: 14, y: 18, facing: "west" },
    ],
  },
  {
    id: "mtchimney-archie",
    map: "MtChimney",
    floor: "Archie thanks you",
    people: [
      { spriteKey: "brendan", x: 12, y: 6, facing: "west" },
      { spriteKey: "archie", x: 11, y: 6, facing: "east" },
    ],
  },
  {
    id: "route118-steven",
    map: "Route118",
    floor: "Steven on Route 118",
    people: [
      { spriteKey: "brendan", x: 44, y: 11, facing: "north" },
      { spriteKey: "steven", x: 44, y: 10, facing: "south" },
    ],
  },
  {
    id: "granitecave-steven-letter",
    map: "GraniteCave_StevensRoom",
    floor: "Steven — Letter & PokéNav",
    people: [
      { spriteKey: "brendan", x: 7, y: 9, facing: "north" },
      { spriteKey: "steven", x: 7, y: 8, facing: "south" },
    ],
  },
  {
    id: "route128-aftermath",
    map: "Route128",
    floor: "Maxie, Archie & Steven after Kyogre",
    people: [
      { spriteKey: "archie", x: 37, y: 22, facing: "east" },
      { spriteKey: "maxie", x: 38, y: 21, facing: "south" },
      { spriteKey: "brendan", x: 38, y: 22, facing: "north" },
      { spriteKey: "steven", x: 39, y: 22, facing: "west" },
    ],
    focus: { x: 38, y: 21.5 },
  },
  {
    id: "fallarbor-pokemoncenter-lanette",
    map: "FallarborTown_PokemonCenter_1F",
    floor: "Lanette at the Pokémon Center",
    people: [
      { spriteKey: "brendan", x: 10, y: 3, facing: "north" },
      { spriteKey: "lanette", x: 10, y: 2, facing: "south" },
    ],
  },
  {
    id: "route104-briney-ferry",
    map: "Route104_MrBrineysHouse",
    floor: "Mr. Briney’s ferry",
    people: [
      { spriteKey: "brendan", x: 5, y: 4, facing: "north" },
      { spriteKey: "briney", x: 5, y: 3, facing: "south" },
    ],
  },
];

const markerMeta = [];

for (const scene of SCENES) {
  const mj = JSON.parse(fs.readFileSync(path.join(REPO, "data/maps", scene.map, "map.json"), "utf8"));
  const layout = layoutById.get(mj.layout);
  if (!layout) throw new Error(`No layout for ${scene.map}`);
  const base = renderLayout(layout);
  const canvas = clonePng(base);
  for (const p of scene.people) {
    placePerson(canvas, SPRITES[p.spriteKey], p.x, p.y, p.facing);
  }
  const fx = scene.focus?.x ?? scene.people[0].x;
  const fy = scene.focus?.y ?? scene.people[0].y;
  const crop = {
    x: Math.round((fx - 7) * 16),
    y: Math.round((fy - 4) * 16),
    w: 240,
    h: 160,
  };
  const focus = cropPng(canvas, crop);
  writePng(path.join(AREA_DIR, `${scene.id}.png`), focus);
  writePng(path.join(PREVIEW, `${scene.id}.png`), focus);
  writePng(path.join(PREVIEW, `${scene.id}@2x.png`), scaleNearest(focus, 2));
  writePng(path.join(ARTIFACT, `${scene.id}@2x.png`), scaleNearest(focus, 2));

  const markers = scene.people.map((p) => {
    const FACE = { south: 0, north: 1, west: 2, east: 2 };
    return {
      spriteKey: p.spriteKey,
      x: +((((p.x + 0.5) * 16 - crop.x) / crop.w) * 100).toFixed(2),
      y: +((((p.y + 0.5) * 16 - crop.y) / crop.h) * 100).toFixed(2),
      facing: p.facing,
      spriteFrame: FACE[p.facing] ?? 0,
      spriteFlipX: p.facing === "east",
    };
  });
  markerMeta.push({
    id: scene.id,
    mapId: mj.id,
    mapFolder: scene.map,
    floor: scene.floor,
    group: scene.map.split("_")[0].replace(/([a-z])([A-Z])/g, "$1 $2"),
    markers,
  });
  console.log(scene.id, "markers", markers);
}

fs.mkdirSync(ARTIFACT, { recursive: true });
fs.writeFileSync(path.join(ARTIFACT, "markers.json"), JSON.stringify(markerMeta, null, 2));
fs.writeFileSync(
  path.join(PREVIEW, "README.md"),
  `# Character appearance cutscenes\n\nBaked from pret/pokeemerald for Scott meetings and other story NPCs.\n`,
);
console.log("done", SCENES.length, "scenes");
