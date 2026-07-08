/**
 * Export in-game bag item icons (with correct palettes) for map selection callouts.
 * Writes one RGBA PNG per item display name under public/sprites/items/icons/.
 *
 * Usage:
 *   node scripts/sync-item-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PNG } from "pngjs";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const OUT_DIR = path.join(ROOT, "public/sprites/items/icons");
const OUT_TS = path.join(ROOT, "src/data/itemIconsGenerated.ts");

const MAP_SOURCES = [
  path.join(ROOT, "src/data/mapPointsGenerated.ts"),
  path.join(ROOT, "src/data/mapPoints.ts"),
  path.join(ROOT, "src/data/areaMaps.ts"),
];

function titleCase(s) {
  return s
    .replace(/POKé/gi, "Poké")
    .split(/\s+/)
    .map((w) => {
      if (/^(TM|HM)\d+$/i.test(w)) return w.toUpperCase();
      if (/^(PP|HP|SP|S\.S\.|X)$/i.test(w)) return w.toUpperCase();
      if (w === "Poké") return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchBuffer(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function loadFile(rel) {
  const local = path.join(REPO, rel);
  if (fs.existsSync(local)) return fs.readFileSync(local);
  return fetchBuffer(`${RAW}/${rel.replace(/\\/g, "/")}`);
}

function collectMapItemNames() {
  const names = new Set();
  for (const src of MAP_SOURCES) {
    if (!fs.existsSync(src)) continue;
    const text = fs.readFileSync(src, "utf8");
    for (const m of text.matchAll(
      /\{[^}]*category:\s*"(item|hidden)"[^}]*name:\s*"([^"]+)"/g,
    )) {
      names.add(m[2]);
    }
    for (const m of text.matchAll(
      /\{[^}]*name:\s*"([^"]+)"[^}]*category:\s*"(item|hidden)"/g,
    )) {
      names.add(m[1]);
    }
  }
  return names;
}

function parseAssetPaths(graphicsH) {
  const iconPaths = new Map();
  const palettePaths = new Map();
  for (const m of graphicsH.matchAll(
    /const u32 (gItemIcon(?:Palette)?_\w+)\[\] = INCGFX_U32\("graphics\/items\/(icons|icon_palettes)\/([^"]+)"/g,
  )) {
    const map = m[1].includes("Palette") ? palettePaths : iconPaths;
    map.set(m[1], `${m[3]}`);
  }
  return { iconPaths, palettePaths };
}

function parseItemNames(itemsH) {
  const itemNames = new Map();
  for (const m of itemsH.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g)) {
    const body = m[2];
    const nameM = body.match(/\.name\s*=\s*_\("([^"]*)"\)/);
    const idM = body.match(/\.itemId\s*=\s*(ITEM_\w+)/);
    if (!nameM) continue;
    itemNames.set(idM?.[1] ?? `ITEM_${m[1]}`, titleCase(nameM[1]));
  }
  return itemNames;
}

function parseItemIconTable(tableH) {
  const itemAssets = new Map();
  for (const m of tableH.matchAll(
    /\[ITEM_(\w+)\]\s*=\s*\{(gItemIcon_\w+),\s*(gItemIconPalette_\w+)/g,
  )) {
    itemAssets.set(`ITEM_${m[1]}`, { iconVar: m[2], paletteVar: m[3] });
  }
  return itemAssets;
}

function buildNameToAssets(itemNames, itemAssets, iconPaths, palettePaths) {
  const nameToAssets = new Map();
  for (const [itemConst, assets] of itemAssets) {
    const name = itemNames.get(itemConst);
    const iconRel = iconPaths.get(assets.iconVar);
    const paletteRel = palettePaths.get(assets.paletteVar);
    if (!name || !iconRel || !paletteRel) continue;
    if (!nameToAssets.has(name)) {
      nameToAssets.set(name, {
        iconRel: `graphics/items/icons/${iconRel}`,
        paletteRel: `graphics/items/icon_palettes/${paletteRel}`,
      });
    }
  }
  return nameToAssets;
}

function parseJascPal(text) {
  const lines = text.trim().split(/\r?\n/);
  const count = parseInt(lines[2], 10);
  const colors = [];
  for (let i = 0; i < count; i++) {
    const [r, g, b] = lines[3 + i].trim().split(/\s+/).map(Number);
    colors.push({ r, g, b });
  }
  return colors;
}

const TRANSPARENT_KEY = { r: 180, g: 180, b: 180 };

function indexForRgb(r, g, b, a, pal) {
  if (a === 0) return 0;
  if (r === TRANSPARENT_KEY.r && g === TRANSPARENT_KEY.g && b === TRANSPARENT_KEY.b) return 0;
  for (let p = 1; p < pal.length; p++) {
    const c = pal[p];
    if (r === c.r && g === c.g && b === c.b) return p;
  }
  return -1;
}

/** Pick the palette baked into pret's indexed PNG (fewest misses on pixel lookup). */
function detectSourcePaletteText(src, candidateTexts) {
  let best = candidateTexts[0];
  let bestMiss = Infinity;
  for (const text of candidateTexts) {
    const pal = parseJascPal(text);
    let miss = 0;
    for (let i = 0; i < src.width * src.height; i++) {
      const si = i * 4;
      if (
        indexForRgb(src.data[si], src.data[si + 1], src.data[si + 2], src.data[si + 3], pal) < 0
      ) {
        miss++;
      }
    }
    if (miss < bestMiss) {
      bestMiss = miss;
      best = text;
    }
  }
  return best;
}

/** Remap a pret indexed item icon to RGBA using source → target JASC palettes. */
function renderItemIcon(iconBuf, sourcePaletteText, targetPaletteText) {
  const src = PNG.sync.read(iconBuf);
  const sourcePal = parseJascPal(sourcePaletteText);
  const targetPal = parseJascPal(targetPaletteText);
  const out = new PNG({ width: src.width, height: src.height, colorType: 6 });

  for (let i = 0; i < src.width * src.height; i++) {
    const si = i * 4;
    const idx = indexForRgb(
      src.data[si],
      src.data[si + 1],
      src.data[si + 2],
      src.data[si + 3],
      sourcePal,
    );
    const di = i * 4;
    if (idx <= 0) {
      out.data[di] = 0;
      out.data[di + 1] = 0;
      out.data[di + 2] = 0;
      out.data[di + 3] = 0;
      continue;
    }
    const c = targetPal[idx] ?? targetPal[0];
    out.data[di] = c.r;
    out.data[di + 1] = c.g;
    out.data[di + 2] = c.b;
    out.data[di + 3] = 255;
  }

  return PNG.sync.write({ ...out, colorType: 6, inputHasAlpha: true });
}

const FALLBACK_ASSETS = {
  Item: {
    iconRel: "graphics/items/icons/question_mark.png",
    paletteRel: "graphics/items/icon_palettes/question_mark.pal",
  },
  "Random Item": {
    iconRel: "graphics/items/icons/question_mark.png",
    paletteRel: "graphics/items/icon_palettes/question_mark.pal",
  },
  "Contest Poké Ball": {
    iconRel: "graphics/items/icons/poke_ball.png",
    paletteRel: "graphics/items/icon_palettes/poke_ball.pal",
  },
  "Rival's Poké Ball": {
    iconRel: "graphics/items/icons/poke_ball.png",
    paletteRel: "graphics/items/icon_palettes/poke_ball.pal",
  },
  Beldum: {
    iconRel: "graphics/items/icons/poke_ball.png",
    paletteRel: "graphics/items/icon_palettes/poke_ball.pal",
  },
  Chikorita: {
    iconRel: "graphics/items/icons/poke_ball.png",
    paletteRel: "graphics/items/icon_palettes/poke_ball.pal",
  },
  Cyndaquil: {
    iconRel: "graphics/items/icons/poke_ball.png",
    paletteRel: "graphics/items/icon_palettes/poke_ball.pal",
  },
  Totodile: {
    iconRel: "graphics/items/icons/poke_ball.png",
    paletteRel: "graphics/items/icon_palettes/poke_ball.pal",
  },
};

const [graphicsH, itemsH, tableH] = await Promise.all([
  loadFile("src/data/graphics/items.h").then((b) => b.toString("utf8")),
  loadFile("src/data/items.h").then((b) => b.toString("utf8")),
  loadFile("src/data/item_icon_table.h").then((b) => b.toString("utf8")),
]);

const { iconPaths, palettePaths } = parseAssetPaths(graphicsH);
const itemNames = parseItemNames(itemsH);
const itemAssets = parseItemIconTable(tableH);
const nameToAssets = buildNameToAssets(itemNames, itemAssets, iconPaths, palettePaths);

const neededNames = collectMapItemNames();
for (const [alias, assets] of Object.entries(FALLBACK_ASSETS)) {
  if (neededNames.has(alias)) nameToAssets.set(alias, assets);
}

const assetCache = new Map();
async function loadAsset(rel) {
  if (!assetCache.has(rel)) assetCache.set(rel, await loadFile(rel));
  return assetCache.get(rel);
}

/** iconRel → palette .pal texts used with that graphic (for source-palette detection). */
const palettesByIcon = new Map();
for (const assets of nameToAssets.values()) {
  if (!palettesByIcon.has(assets.iconRel)) palettesByIcon.set(assets.iconRel, new Set());
  palettesByIcon.get(assets.iconRel).add(assets.paletteRel);
}

const sourcePaletteByIcon = new Map();
for (const [iconRel, paletteRels] of palettesByIcon) {
  const iconBuf = await loadAsset(iconRel);
  const src = PNG.sync.read(iconBuf);
  const texts = await Promise.all(
    [...paletteRels].map(async (rel) => (await loadAsset(rel)).toString("utf8")),
  );
  sourcePaletteByIcon.set(iconRel, detectSourcePaletteText(src, texts));
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const resolved = {};
const missing = [];

for (const name of [...neededNames].sort()) {
  const assets = nameToAssets.get(name);
  if (!assets) {
    missing.push(name);
    continue;
  }

  const iconBuf = await loadAsset(assets.iconRel);
  const targetPaletteText = (await loadAsset(assets.paletteRel)).toString("utf8");
  const sourcePaletteText = [...sourcePaletteByIcon.entries()].find(([rel]) => rel === assets.iconRel)?.[1];
  const outName = `${slugify(name)}.png`;
  const outPath = path.join(OUT_DIR, outName);

  let pngBuf;
  try {
    const sourcePaletteText = sourcePaletteByIcon.get(assets.iconRel) ?? targetPaletteText;
    pngBuf = renderItemIcon(iconBuf, sourcePaletteText, targetPaletteText);
  } catch {
    pngBuf = await sharp(iconBuf).ensureAlpha().png().toBuffer();
  }

  fs.writeFileSync(outPath, pngBuf);
  resolved[name] = outName;
  console.log(`Wrote ${outPath}`);
}

if (missing.length) {
  console.warn("No icon mapping for:", missing.join(", "));
}

// Remove stale per-name exports that are no longer referenced.
const keep = new Set(Object.values(resolved));
for (const file of fs.readdirSync(OUT_DIR)) {
  if (!file.endsWith(".png")) continue;
  if (!keep.has(file)) {
    fs.unlinkSync(path.join(OUT_DIR, file));
    console.log(`Removed stale ${file}`);
  }
}

const ts = `/** Auto-generated by scripts/sync-item-icons.mjs — do not edit. */
export interface ItemBagIcon {
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
}

/** In-game bag icon (24×24 RGBA) keyed by the item display name on map pins. */
export const ITEM_BAG_ICONS: Record<string, ItemBagIcon> = {
${Object.entries(resolved)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([name, file]) =>
      `  ${JSON.stringify(name)}: { spriteSheet: "sprites/items/icons/${file}", spriteWidth: 24, spriteHeight: 24 },`,
  )
  .join("\n")}
};

export function getItemBagIcon(name: string): ItemBagIcon | null {
  return ITEM_BAG_ICONS[name] ?? null;
}
`;

fs.writeFileSync(OUT_TS, ts);
console.log(`Wrote ${OUT_TS} (${Object.keys(resolved).length} icons)`);
