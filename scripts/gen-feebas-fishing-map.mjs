/**
 * Render Route 119 fishing-spot maps for Feebas (pokeemerald wild_encounter.c).
 *
 * Spots are numbered 1–447 left→right, top→bottom among surfable-and-not-waterfall
 * metatiles. Exactly six of those IDs are active at a time, seeded from
 * dewfordTrends[0].rand — so this map shows every candidate tile, not one fixed set.
 *
 * Usage: node scripts/gen-feebas-fishing-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const OUT_DIR = path.join(ROOT, "public/maps/areas");
const ARTIFACT_DIR = "/opt/cursor/artifacts";
const DATA_OUT = path.join(ROOT, "src/data/feebasFishingSpots.ts");

const NUM_FISHING_SPOTS_1 = 131;
const NUM_FISHING_SPOTS_2 = 167;
const NUM_FISHING_SPOTS_3 = 149;
const SECTIONS = [
  { id: 0, ymin: 0, ymax: 45, expect: NUM_FISHING_SPOTS_1, label: "North (spots 1–131)" },
  { id: 1, ymin: 46, ymax: 91, expect: NUM_FISHING_SPOTS_2, label: "Middle (spots 132–298)" },
  {
    id: 2,
    ymin: 92,
    ymax: 139,
    expect: NUM_FISHING_SPOTS_3,
    label: "South (spots 299–447)",
  },
];

/**
 * Pixel scale — 4× (64px/tile). Spot IDs are chunky bitmap digits; the UI zooms
 * via nearest-neighbor resize so these source pixels stay sharp on screen.
 */
const SCALE = 4;
const TILE = 16 * SCALE;
/** Each glyph bit is drawn as a PIXEL×PIXEL block (independent of map SCALE). */
const PIXEL = 4;

/** Compact 3×5 digits drawn on a dark badge. */
const DIGITS = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "010", "010", "010"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
};

const SURFABLE_MB = new Set([
  16, // MB_POND_WATER
  17, // MB_INTERIOR_DEEP_WATER
  18, // MB_DEEP_WATER
  19, // MB_WATERFALL (excluded below)
  20, // MB_SOOTOPOLIS_DEEP_WATER
  21, // MB_OCEAN_WATER
  25, // MB_NO_SURFACING
  34, // MB_SEAWEED
  40, // MB_SEAWEED_NO_SURFACING
  71, // MB_EASTWARD_CURRENT
  72, // MB_WESTWARD_CURRENT
  73, // MB_NORTHWARD_CURRENT
  74, // MB_SOUTHWARD_CURRENT
  87, // MB_WATER_DOOR
  88, // MB_WATER_SOUTH_ARROW_WARP
  90, // MB_UNUSED_6F
]);
const MB_WATERFALL = 19;

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layout = layoutsJson.layouts.find((l) => l.id === "LAYOUT_ROUTE119");
if (!layout) throw new Error("LAYOUT_ROUTE119 not found");

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

function renderLayout(lay) {
  const W = lay.width;
  const H = lay.height;
  const pdir = tilesetDir(lay.primary_tileset, "primary");
  const sdir = tilesetDir(lay.secondary_tileset, "secondary");
  const bin = fs.readFileSync(path.join(REPO, lay.blockdata_filepath));
  const OW = W * TILE;
  const OH = H * TILE;
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
      const px = col * TILE;
      const py = row * TILE;
      for (let ry = 0; ry < 16; ry++) {
        for (let rx = 0; rx < 16; rx++) {
          const src = (ry * 16 + rx) * 4;
          const r = mt[src];
          const g = mt[src + 1];
          const b = mt[src + 2];
          for (let dy = 0; dy < SCALE; dy++) {
            for (let dx = 0; dx < SCALE; dx++) {
              const o = ((py + ry * SCALE + dy) * OW + (px + rx * SCALE + dx)) * 4;
              ob[o] = r;
              ob[o + 1] = g;
              ob[o + 2] = b;
              ob[o + 3] = 255;
            }
          }
        }
      }
    }
  }
  return { png, bin, W, H, pdir, sdir };
}

function behaviorAt(bin, W, x, y, primAttr, secAttr) {
  const mt = bin.readUInt16LE((y * W + x) * 2) & 0x3ff;
  const buf = mt < 512 ? primAttr : secAttr;
  const idx = mt < 512 ? mt : mt - 512;
  return buf.readUInt16LE(idx * 2) & 0xff;
}

function isSurfableNotWaterfall(b) {
  return SURFABLE_MB.has(b) && b !== MB_WATERFALL;
}

function blendTile(png, tx, ty, rgba, amount) {
  const { width: OW, data } = png;
  const x0 = tx * TILE;
  const y0 = ty * TILE;
  for (let py = 0; py < TILE; py++) {
    for (let px = 0; px < TILE; px++) {
      const o = ((y0 + py) * OW + (x0 + px)) * 4;
      data[o] = Math.round(data[o] * (1 - amount) + rgba[0] * amount);
      data[o + 1] = Math.round(data[o + 1] * (1 - amount) + rgba[1] * amount);
      data[o + 2] = Math.round(data[o + 2] * (1 - amount) + rgba[2] * amount);
    }
  }
  for (let i = 0; i < TILE; i++) {
    for (const [px, py] of [
      [i, 0],
      [i, TILE - 1],
      [0, i],
      [TILE - 1, i],
    ]) {
      const o = ((y0 + py) * OW + (x0 + px)) * 4;
      data[o] = rgba[0];
      data[o + 1] = rgba[1];
      data[o + 2] = rgba[2];
      data[o + 3] = 255;
    }
  }
}

function drawNumber(png, tx, ty, n, fill = [255, 255, 255], badge = [16, 22, 34]) {
  const text = String(n);
  const glyphCols = 3;
  const glyphRows = 5;
  const glyphW = glyphCols * PIXEL;
  const glyphH = glyphRows * PIXEL;
  const gap = PIXEL;
  const totalW = text.length * glyphW + (text.length - 1) * gap;
  const padX = Math.max(2, PIXEL);
  const padY = Math.max(2, PIXEL);
  const badgeW = Math.min(TILE - 2, totalW + padX * 2);
  const badgeH = Math.min(TILE - 2, glyphH + padY * 2);
  const x0 = tx * TILE + Math.max(1, Math.floor((TILE - badgeW) / 2));
  const y0 = ty * TILE + Math.max(1, Math.floor((TILE - badgeH) / 2));
  const { width: OW, data } = png;

  const plot = (x, y, rgb) => {
    if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
    const o = (y * OW + x) * 4;
    data[o] = rgb[0];
    data[o + 1] = rgb[1];
    data[o + 2] = rgb[2];
    data[o + 3] = 255;
  };

  // Opaque badge + 1px near-black outline so digits stay sharp on yellow water.
  for (let py = -1; py <= badgeH; py++) {
    for (let px = -1; px <= badgeW; px++) {
      const edge = px < 0 || py < 0 || px >= badgeW || py >= badgeH;
      plot(x0 + px, y0 + py, edge ? [0, 0, 0] : badge);
    }
  }

  let cx = x0 + Math.floor((badgeW - totalW) / 2);
  const cy = y0 + Math.floor((badgeH - glyphH) / 2);
  // Soft shadow under glyphs first, then solid fill — keeps digits crisp on yellow water.
  for (const pass of /** @type {const} */ (["shadow", "fill"])) {
    let penX = cx;
    for (const ch of text) {
      const g = DIGITS[ch];
      if (!g) continue;
      for (let gy = 0; gy < glyphRows; gy++) {
        for (let gx = 0; gx < glyphCols; gx++) {
          if (g[gy][gx] !== "1") continue;
          for (let dy = 0; dy < PIXEL; dy++) {
            for (let dx = 0; dx < PIXEL; dx++) {
              if (pass === "shadow") {
                plot(penX + gx * PIXEL + dx + 1, cy + gy * PIXEL + dy + 1, [0, 0, 0]);
              } else {
                plot(penX + gx * PIXEL + dx, cy + gy * PIXEL + dy, fill);
              }
            }
          }
        }
      }
      penX += glyphW + gap;
    }
  }
}

function cropSection(src, ymin, ymax) {
  const tileH = ymax - ymin + 1;
  const out = new PNG({ width: src.width, height: tileH * TILE, colorType: 6 });
  const srcY0 = ymin * TILE;
  for (let y = 0; y < out.height; y++) {
    const srcOff = (srcY0 + y) * src.width * 4;
    const dstOff = y * out.width * 4;
    out.data.set(src.data.subarray(srcOff, srcOff + out.width * 4), dstOff);
  }
  return out;
}

function enumerateSpots(bin, W, H, primAttr, secAttr) {
  const spots = [];
  let spotId = 0;
  for (const section of SECTIONS) {
    let count = 0;
    for (let y = section.ymin; y <= section.ymax; y++) {
      for (let x = 0; x < W; x++) {
        const b = behaviorAt(bin, W, x, y, primAttr, secAttr);
        if (!isSurfableNotWaterfall(b)) continue;
        spotId++;
        count++;
        spots.push({
          id: spotId,
          x,
          y,
          section: section.id,
          accessible: spotId >= 4,
        });
      }
    }
    if (count !== section.expect) {
      throw new Error(
        `Section ${section.id} count ${count} != expected ${section.expect} (Feebas spot table mismatch)`,
      );
    }
  }
  if (spots.length !== 447) throw new Error(`Total spots ${spots.length} != 447`);
  return spots;
}

const { png, bin, W, H } = renderLayout(layout);
const primAttr = fs.readFileSync(
  path.join(REPO, tilesetDir(layout.primary_tileset, "primary"), "metatile_attributes.bin"),
);
const secAttr = fs.readFileSync(
  path.join(REPO, tilesetDir(layout.secondary_tileset, "secondary"), "metatile_attributes.bin"),
);
const spots = enumerateSpots(bin, W, H, primAttr, secAttr);

for (const spot of spots) {
  const rgba = spot.accessible ? [255, 214, 64] : [140, 140, 150];
  blendTile(png, spot.x, spot.y, rgba, spot.accessible ? 0.45 : 0.35);
  drawNumber(png, spot.x, spot.y, spot.id, spot.accessible ? [255, 255, 255] : [210, 210, 220]);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const sharp = (await import("sharp")).default;

async function writeOptimized(fileBase, pngImg) {
  const raw = PNG.sync.write(pngImg);
  const outPath = path.join(OUT_DIR, `${fileBase}.png`);
  // Lossless (no palette) — palette quantization softens the baked spot numbers.
  const buf = await sharp(raw).png({ compressionLevel: 9, effort: 9 }).toBuffer();
  fs.writeFileSync(outPath, buf);
  fs.writeFileSync(path.join(ARTIFACT_DIR, `${fileBase}.png`), buf);
  console.log(`Wrote ${outPath} (${pngImg.width}×${pngImg.height}, ${(buf.length / 1024).toFixed(1)} KB)`);
  return { width: pngImg.width, height: pngImg.height, image: `maps/areas/${fileBase}.png` };
}

const full = await writeOptimized("route119-feebas-fishing", png);
const sectionMeta = [];
for (const section of SECTIONS) {
  const cropped = cropSection(png, section.ymin, section.ymax);
  const meta = await writeOptimized(`route119-feebas-fishing-s${section.id}`, cropped);
  sectionMeta.push({
    ...meta,
    section: section.id,
    ymin: section.ymin,
    ymax: section.ymax,
    label: section.label,
    spotStart: spots.find((s) => s.section === section.id).id,
    spotEnd: [...spots].reverse().find((s) => s.section === section.id).id,
  });
}

// Emit TS spot index + area-map hints (hand-merged into areaMaps / step wiring).
const lines = [];
lines.push("/**");
lines.push(" * Route 119 Feebas fishing spots — generated by scripts/gen-feebas-fishing-map.mjs");
lines.push(" * from pokeemerald LAYOUT_ROUTE119 + wild_encounter.c numbering.");
lines.push(" * Six of these IDs are active at a time (Dewford trendy-phrase seed).");
lines.push(" */");
lines.push("");
lines.push("export interface FeebasFishingSpot {");
lines.push("  id: number;");
lines.push("  x: number;");
lines.push("  y: number;");
lines.push("  section: 0 | 1 | 2;");
lines.push("  /** Spots 1–3 are inaccessible water at the top of the map. */");
lines.push("  accessible: boolean;");
lines.push("}");
lines.push("");
lines.push("export const FEEBAS_FISHING_SPOT_COUNT = 447;");
lines.push("export const FEEBAS_ACTIVE_SPOT_COUNT = 6;");
lines.push("");
lines.push("/** Area-map ids for the three Route 119 Feebas section images. */");
lines.push("export const FEEBAS_FISHING_AREA_MAP_IDS = [");
lines.push('  "route119-feebas-fishing-s0",');
lines.push('  "route119-feebas-fishing-s1",');
lines.push('  "route119-feebas-fishing-s2",');
lines.push("] as const;");
lines.push("");
lines.push("export const FEEBAS_FISHING_SECTIONS = [");
for (const s of sectionMeta) {
  lines.push(
    `  { id: ${s.section}, label: ${JSON.stringify(s.label)}, ymin: ${s.ymin}, ymax: ${s.ymax}, spotStart: ${s.spotStart}, spotEnd: ${s.spotEnd}, image: ${JSON.stringify(s.image)}, width: ${s.width}, height: ${s.height} },`,
  );
}
lines.push("] as const;");
lines.push("");
lines.push("export const FEEBAS_FISHING_SPOTS: FeebasFishingSpot[] = [");
for (const s of spots) {
  lines.push(
    `  { id: ${s.id}, x: ${s.x}, y: ${s.y}, section: ${s.section}, accessible: ${s.accessible} },`,
  );
}
lines.push("];");
lines.push("");

fs.writeFileSync(DATA_OUT, lines.join("\n"));
console.log(`Wrote ${DATA_OUT} (${spots.length} spots)`);
console.log("Full map:", full.image);
