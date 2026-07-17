/**
 * Bake remaining Ch. 1–10 area-map NPCs into their PNGs (same pattern as
 * Oldale / Steven’s house): paint OW sprites into the art and register
 * AREA_MAP_CUTSCENE_ENTITIES with bakedInImage for legend / hit targets.
 *
 * Targets (overlay pins or empty interiors still used by early chapters):
 *   - littleroottown-professorbirchslab (Aide, Birch, Rival)
 *   - littleroottown-mayshouse-2f (Rival May)
 *   - granitecave-1f (Hiker — HM05 Flash)
 *   - granitecave-stevensroom (Steven)
 *
 * Usage: node scripts/bake-ch1-10-area-npcs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const AREA_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT = "/opt/cursor/artifacts/ch1-10-area-npcs-baked";

if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald");
  process.exit(1);
}

const layoutsJson = JSON.parse(
  fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"),
);
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l?.id) layoutById.set(l.id, l);

const tilesetDir = (sym, kind) => {
  const name = sym
    .replace(/^gTileset_/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
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
  const tilesY = H >> 3;
  const nTiles = tilesX * tilesY;
  const tiles = new Array(nTiles);
  for (let t = 0; t < nTiles; t++) {
    const tc = t % tilesX;
    const tr = (t / tilesX) | 0;
    const arr = new Uint8Array(64);
    for (let py = 0; py < 8; py++) {
      for (let px = 0; px < 8; px++) {
        const x = tc * 8 + px;
        const y = tr * 8 + py;
        const o = (y * W + x) * 4;
        const key = (data[o] << 16) | (data[o + 1] << 8) | data[o + 2];
        arr[py * 8 + px] = rev.get(key) ?? 0;
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
        const dst = ((py + ry) * OW + px) * 4;
        ob.set(mt.subarray(ry * 64, ry * 64 + 64), dst);
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
  const FACE = { south: 0, north: 1, west: 2, east: 2 };
  const frame = FACE[facing] ?? 0;
  blitSprite(dest, sprite, tileX * 16, tileY * 16 - 16, {
    flipX: facing === "east",
    frameX: frame * 16,
    frameW: 16,
    frameH: 32,
  });
}

function facingFromMovement(mt) {
  switch (mt) {
    case "MOVEMENT_TYPE_FACE_UP":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_UP":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_UP":
      return "north";
    case "MOVEMENT_TYPE_FACE_LEFT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_LEFT":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_LEFT":
      return "west";
    case "MOVEMENT_TYPE_FACE_RIGHT":
    case "MOVEMENT_TYPE_WALK_IN_PLACE_RIGHT":
    case "MOVEMENT_TYPE_JOG_IN_PLACE_RIGHT":
      return "east";
    default:
      return "south";
  }
}

function toLocalX(x, W) {
  return +(((x + 0.5) / W) * 100).toFixed(2);
}
function toLocalY(y, H) {
  return +(((y + 1) / H) * 100).toFixed(2);
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

const GFX = {
  scientist_1: {
    public: "sprites/trainers/scientist_1.png",
    repoPng: "graphics/object_events/pics/people/scientist_1.png",
    repoPal: "graphics/object_events/palettes/npc_3.pal",
  },
  prof_birch: {
    public: "sprites/trainers/prof_birch.png",
    repoPng: "graphics/object_events/pics/people/prof_birch.png",
    repoPal: "graphics/object_events/palettes/npc_3.pal",
  },
  brendan: {
    public: "sprites/trainers/brendan_walking.png",
    repoPng: "graphics/object_events/pics/people/brendan/walking.png",
    repoPal: "graphics/object_events/palettes/brendan.pal",
  },
  may: {
    public: "sprites/trainers/may_walking.png",
    repoPng: "graphics/object_events/pics/people/may/walking.png",
    repoPal: "graphics/object_events/palettes/may.pal",
  },
  hiker: {
    public: "sprites/trainers/hiker.png",
    repoPng: "graphics/object_events/pics/people/hiker.png",
    repoPal: "graphics/object_events/palettes/npc_1.pal",
  },
  steven: {
    public: "sprites/trainers/steven.png",
    repoPng: "graphics/object_events/pics/people/steven.png",
    repoPal: "graphics/object_events/palettes/npc_4.pal",
  },
};

const spriteCache = new Map();
function spriteFor(key) {
  if (spriteCache.has(key)) return spriteCache.get(key);
  const g = GFX[key];
  const s = loadIndexedSprite(g.repoPng, g.repoPal);
  spriteCache.set(key, s);
  return s;
}

const MAPS = [
  {
    areaId: "littleroottown-professorbirchslab",
    mapDir: "LittlerootTown_ProfessorBirchsLab",
    file: "littleroottown-professorbirchslab-npcs.png",
    alsoWrite: ["littleroottown-professorbirchslab.png"],
    entities: [
      {
        id: "birch-lab-aide",
        name: "Aide",
        gfx: "scientist_1",
        graphicsId: "OBJ_EVENT_GFX_SCIENTIST_1",
        script: "LittlerootTown_ProfessorBirchsLab_EventScript_Aide",
        class: "Aide",
        desc: "Birch’s lab aide — wanders the lab floor.",
        match: (oe) => oe.graphics_id === "OBJ_EVENT_GFX_SCIENTIST_1",
      },
      {
        id: "birch-lab-birch",
        name: "Professor Birch",
        gfx: "prof_birch",
        graphicsId: "OBJ_EVENT_GFX_PROF_BIRCH",
        script: "LittlerootTown_ProfessorBirchsLab_EventScript_Birch",
        class: "Professor",
        desc: "Professor Birch — Pokédex, research, and post-game Johto starters.",
        match: (oe) => oe.graphics_id === "OBJ_EVENT_GFX_PROF_BIRCH",
      },
      {
        id: "birch-lab-rival",
        name: "Rival",
        gfx: "brendan",
        graphicsId: "OBJ_EVENT_GFX_BRENDAN_NORMAL",
        script: "LittlerootTown_ProfessorBirchsLab_EventScript_Rival",
        class: "Rival",
        desc: "Your rival — hands you Poké Balls after Rival Battle #1.",
        match: (oe) => /Rival/i.test(oe.script || ""),
      },
    ],
  },
  {
    areaId: "littleroottown-mayshouse-2f",
    mapDir: "LittlerootTown_MaysHouse_2F",
    file: "littleroottown-mayshouse-2f-npcs.png",
    alsoWrite: ["littleroottown-mayshouse-2f.png"],
    entities: [
      {
        id: "mays-house-rival",
        name: "May",
        gfx: "may",
        graphicsId: "OBJ_EVENT_GFX_RIVAL_MAY_NORMAL",
        script: "RivalsHouse_2F_EventScript_Rival",
        class: "Rival",
        desc: "Your rival in her bedroom — meet her before heading to Birch’s lab.",
        match: (oe) => oe.graphics_id === "OBJ_EVENT_GFX_RIVAL_MAY_NORMAL",
      },
    ],
  },
  {
    areaId: "granitecave-1f",
    mapDir: "GraniteCave_1F",
    file: "granitecave-1f-npcs.png",
    alsoWrite: ["granitecave-1f.png"],
    entities: [
      {
        id: "granite-1f-hiker",
        name: "Hiker",
        gfx: "hiker",
        graphicsId: "OBJ_EVENT_GFX_HIKER",
        script: "GraniteCave_1F_EventScript_Hiker",
        class: "Hiker",
        desc: "Gives HM05 Flash at the cave entrance (field use needs Brawly’s Knuckle Badge).",
        match: (oe) => oe.graphics_id === "OBJ_EVENT_GFX_HIKER",
      },
    ],
  },
  {
    areaId: "granitecave-stevensroom",
    mapDir: "GraniteCave_StevensRoom",
    file: "granitecave-stevensroom-npcs.png",
    alsoWrite: ["granitecave-stevensroom.png"],
    entities: [
      {
        id: "granite-steven",
        name: "Steven",
        gfx: "steven",
        graphicsId: "OBJ_EVENT_GFX_STEVEN",
        script: "GraniteCave_StevensRoom_EventScript_Steven",
        class: "Champion",
        desc: "Steven Stone — deliver Mr. Stone’s Letter here for TM47 Steel Wing + PokéNav Match Call.",
        match: (oe) => oe.graphics_id === "OBJ_EVENT_GFX_STEVEN",
      },
    ],
  },
];

fs.mkdirSync(ARTIFACT, { recursive: true });
const cutsceneByArea = {};
const FACE = { south: 0, north: 1, west: 2, east: 2 };

for (const mapSpec of MAPS) {
  const mapJson = JSON.parse(
    fs.readFileSync(path.join(REPO, "data/maps", mapSpec.mapDir, "map.json"), "utf8"),
  );
  const layout = layoutById.get(mapJson.layout);
  if (!layout) {
    console.error("Missing layout", mapJson.layout);
    process.exit(1);
  }
  const W = layout.width;
  const H = layout.height;
  const base = renderLayout(layout);
  const scene = clonePng(base);
  writePng(path.join(ARTIFACT, mapSpec.file.replace(".png", "-clean.png")), base);

  const baked = [];
  for (const ent of mapSpec.entities) {
    const oe = (mapJson.object_events || []).find(ent.match);
    if (!oe) {
      console.warn("  missing", ent.id, "on", mapSpec.areaId);
      continue;
    }
    const facing = facingFromMovement(oe.movement_type);
    placePerson(scene, spriteFor(ent.gfx), oe.x, oe.y, facing);
    baked.push({
      id: ent.id,
      name: ent.name,
      category: "trainer",
      x: toLocalX(oe.x, W),
      y: toLocalY(oe.y, H),
      desc: ent.desc,
      spriteSheet: GFX[ent.gfx].public,
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: FACE[facing] ?? 0,
      ...(facing === "east" ? { spriteFlipX: true } : {}),
      note: mapSpec.areaId,
      bakedInImage: true,
      trainerClass: ent.class,
      trainerName: ent.name,
      graphicsId: ent.graphicsId,
      script: ent.script,
    });
    console.log(`  ${mapSpec.areaId}: ${ent.name} @(${oe.x},${oe.y}) ${facing}`);
  }

  for (const file of [mapSpec.file, ...(mapSpec.alsoWrite || [])]) {
    writePng(path.join(AREA_DIR, file), scene);
    writePng(path.join(ARTIFACT, file), scene);
  }
  cutsceneByArea[mapSpec.areaId] = baked;
}

fs.writeFileSync(
  path.join(ARTIFACT, "cutscene-entities.json"),
  JSON.stringify(cutsceneByArea, null, 2),
);
console.log("Wrote", path.join(ARTIFACT, "cutscene-entities.json"));
