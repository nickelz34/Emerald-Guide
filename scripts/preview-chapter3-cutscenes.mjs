/**
 * Preview render: Chapter 3 (Littleroot, with pregame = Ch. 3) event cutscenes
 * from pret/pokeemerald map + tileset data.
 *
 *   Event 1 — InsideOfTruck (moving truck at new-game start)
 *   Event 2 — LittlerootTown_MaysHouse_2F (rival's room; guide maps May's 2F)
 *   Event 3 — LittlerootTown_ProfessorBirchsLab
 *
 * Writes native-scale + 4× upscaled PNGs under:
 *   - public/screenshots/previews/chapter3/
 *   - /opt/cursor/artifacts/chapter3-cutscenes/
 *
 * Requires .calib/pokeemerald (gitignored clone of pret/pokeemerald).
 *
 * Usage: node scripts/preview-chapter3-cutscenes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const OUT_DIRS = [
  path.join(ROOT, "public/screenshots/previews/chapter3"),
  "/opt/cursor/artifacts/chapter3-cutscenes",
];

if (!fs.existsSync(REPO)) {
  console.error("Missing .calib/pokeemerald — clone pret/pokeemerald first.");
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
  const key = pdir + "|" + sdir + "|" + id;
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

function renderLayout(layout, { patchMetatiles } = {}) {
  const W = layout.width;
  const H = layout.height;
  const pdir = tilesetDir(layout.primary_tileset, "primary");
  const sdir = tilesetDir(layout.secondary_tileset, "secondary");
  const bin = Buffer.from(fs.readFileSync(path.join(REPO, layout.blockdata_filepath)));
  if (patchMetatiles) {
    for (const { x, y, id } of patchMetatiles) {
      const ci = (y * W + x) * 2;
      const existing = bin[ci] | (bin[ci + 1] << 8);
      const next = (existing & ~0x3ff) | (id & 0x3ff);
      bin[ci] = next & 0xff;
      bin[ci + 1] = (next >> 8) & 0xff;
    }
  }
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

/** Blit a sprite; index 0 (and magenta 255,0,255) treated as transparent. */
function blitSprite(dest, sprite, dx, dy, { flipX = false, frameX = 0, frameW, frameH } = {}) {
  const { png, palette } = sprite;
  const fw = frameW ?? png.width;
  const fh = frameH ?? png.height;
  const key = palette?.[0] || { r: 115, g: 197, b: 164 };
  for (let row = 0; row < fh; row++) {
    for (let col = 0; col < fw; col++) {
      const sx = frameX + col;
      const sy = row;
      const si = (sy * png.width + sx) * 4;
      let r = png.data[si];
      let g = png.data[si + 1];
      let b = png.data[si + 2];
      // Re-key through palette when source is indexed RGB approximating JASC colours.
      if (palette) {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < palette.length; i++) {
          const pr = palette[i].r;
          const pg = palette[i].g;
          const pb = palette[i].b;
          const d =
            (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
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
      } else if (png.data[si + 3] === 0) {
        continue;
      }
      const tx = flipX ? dx + (fw - 1 - col) : dx + col;
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

function scaleNearest(src, scale) {
  const out = new PNG({
    width: src.width * scale,
    height: src.height * scale,
    colorType: 6,
  });
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

function writeAll(basename, png) {
  const buf = PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true });
  const big = scaleNearest(png, 4);
  const bigBuf = PNG.sync.write({ ...big, colorType: 6, inputHasAlpha: true });
  for (const dir of OUT_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${basename}.png`), buf);
    fs.writeFileSync(path.join(dir, `${basename}@4x.png`), bigBuf);
  }
  console.log(
    `Wrote ${basename}.png (${png.width}×${png.height}) and @4x (${big.width}×${big.height})`,
  );
}

function loadMap(dirName) {
  const mj = JSON.parse(
    fs.readFileSync(path.join(REPO, "data/maps", dirName, "map.json"), "utf8"),
  );
  const layout = layoutById.get(mj.layout);
  if (!layout) throw new Error(`Missing layout ${mj.layout}`);
  return { map: mj, layout };
}

// Metatile labels from include/constants/metatile_labels.h
const MT_EXIT_TOP = 0x208;
const MT_EXIT_MID = 0x210;
const MT_EXIT_BOT = 0x218;
const MT_CLOSED_TOP = 0x20D;
const MT_CLOSED_MID = 0x215;
const MT_CLOSED_BOT = 0x21D;

const PREVIEW_SCALE_NOTE = {
  note: "Native GBA scale is 16px/tile. @4x PNGs are nearest-neighbour upscales for review only.",
};

// ---- Event 1: Inside of Truck ----
{
  const { map, layout } = loadMap("InsideOfTruck");
  // Door open (OnLoad) — playable first frame after the driving cutscene.
  const open = renderLayout(layout, {
    patchMetatiles: [
      { x: 4, y: 1, id: MT_EXIT_TOP },
      { x: 4, y: 2, id: MT_EXIT_MID },
      { x: 4, y: 3, id: MT_EXIT_BOT },
    ],
  });
  // Door closed — matches field_special_scene truck-driving cutscene.
  const closed = renderLayout(layout, {
    patchMetatiles: [
      { x: 4, y: 1, id: MT_CLOSED_TOP },
      { x: 4, y: 2, id: MT_CLOSED_MID },
      { x: 4, y: 3, id: MT_CLOSED_BOT },
    ],
  });

  const box = loadIndexedSprite(
    "graphics/object_events/pics/misc/moving_box.png",
    "graphics/object_events/palettes/moving_box.pal",
  );
  const brendan = loadIndexedSprite(
    "graphics/object_events/pics/people/brendan/walking.png",
    "graphics/object_events/palettes/brendan.pal",
  );

  function decorateTruck(base) {
    const png = new PNG({ width: base.width, height: base.height, colorType: 6 });
    png.data.set(base.data);
    // Object-event moving boxes from map.json (bouncing crates during intro).
    for (const oe of map.object_events || []) {
      if (oe.graphics_id !== "OBJ_EVENT_GFX_MOVING_BOX") continue;
      // 16×16 sprite centred on tile.
      blitSprite(png, box, oe.x * 16, oe.y * 16);
    }
    // New-game spawn: WARP_ID_NONE → layout width/2, height/2 → (2, 2).
    // Emerald face anims: frame 0 south, 1 north, 2 west (east = frame 2 + hFlip).
    // Face east toward the rear door.
    const px = 2 * 16;
    const py = 2 * 16 - 16; // feet on tile; 16×32 sprite
    blitSprite(png, brendan, px, py, {
      flipX: true,
      frameX: 2 * 16,
      frameW: 16,
      frameH: 32,
    });
    return png;
  }

  writeAll("event-1-inside-of-truck-door-open", decorateTruck(open));
  writeAll("event-1-inside-of-truck-door-closed", decorateTruck(closed));
  // Bare map (tiles only) — what area-map tooling would emit without sprites.
  writeAll("event-1-inside-of-truck-tiles-only", open);
}

// ---- Event 2: Rival's bedroom (May's House 2F — stepAreaMaps mapping) ----
{
  const { layout } = loadMap("LittlerootTown_MaysHouse_2F");
  writeAll("event-2-rival-house-2f-mays", renderLayout(layout));
  // Brendan's 2F for comparison (player bedroom / also used for littleroot-1 today).
  const brendanHouse = loadMap("LittlerootTown_BrendansHouse_2F");
  writeAll("event-2-alt-brendans-house-2f", renderLayout(brendanHouse.layout));
}

// ---- Event 3: Professor Birch's Lab ----
{
  const { layout } = loadMap("LittlerootTown_ProfessorBirchsLab");
  writeAll("event-3-birchs-lab", renderLayout(layout));
}

fs.writeFileSync(
  path.join(OUT_DIRS[0], "README.md"),
  `# Chapter 3 cutscene previews (Littleroot Town)

Generated from pret/pokeemerald via \`scripts/preview-chapter3-cutscenes.mjs\`.

With pregame chapters enabled, Littleroot is **Ch. 3**. Events:

| Event | In-game map | Preview files |
| --- | --- | --- |
| 1 — Moving into Littleroot | \`MAP_INSIDE_OF_TRUCK\` | \`event-1-inside-of-truck-door-open\`, \`door-closed\`, \`tiles-only\` |
| 2 — Meet your rival | \`LittlerootTown_MaysHouse_2F\` (guide default) | \`event-2-rival-house-2f-mays\` (+ Brendan 2F alt) |
| 3 — Look for Professor Birch | \`LittlerootTown_ProfessorBirchsLab\` | \`event-3-birchs-lab\` |

${PREVIEW_SCALE_NOTE.note}

**Not wired into the walkthrough yet** — these are review assets only.
`,
);

console.log("Done. Preview folder:", OUT_DIRS[0]);
