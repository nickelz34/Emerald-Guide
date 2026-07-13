/**
 * Export bag icons used by Ch. 1 evolution charts (trade items, Soothe Bell, etc.).
 * Fetches from pret/pokeemerald when local .calib/pokeemerald is absent.
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const ASSET_CACHE = path.join(ROOT, ".calib/asset-cache");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const OUT_DIR = path.join(ROOT, "public/sprites/items/icons");
const OUT_TS = path.join(ROOT, "src/data/itemIconsGenerated.ts");

/** Display name → pokeemerald ITEM_ const (for icon table lookup). */
const EVOLUTION_ITEMS = [
  { name: "Metal Coat", const: "ITEM_METAL_COAT", file: "metal_coat.png" },
  { name: "Dragon Scale", const: "ITEM_DRAGON_SCALE", file: "dragon_scale.png" },
  { name: "King's Rock", const: "ITEM_KINGS_ROCK", file: "king_s_rock.png" },
  { name: "Deep Sea Tooth", const: "ITEM_DEEP_SEA_TOOTH", file: "deep_sea_tooth.png" },
  { name: "Deep Sea Scale", const: "ITEM_DEEP_SEA_SCALE", file: "deep_sea_scale.png" },
  { name: "Soothe Bell", const: "ITEM_SOOTHE_BELL", file: "soothe_bell.png" },
];

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
  const normalized = rel.replace(/\\/g, "/");
  const local = path.join(REPO, normalized);
  if (fs.existsSync(local)) return fs.readFileSync(local);

  const cached = path.join(ASSET_CACHE, normalized);
  if (fs.existsSync(cached)) return fs.readFileSync(cached);

  const buf = await fetchBuffer(`${RAW}/${normalized}`);
  fs.mkdirSync(path.dirname(cached), { recursive: true });
  fs.writeFileSync(cached, buf);
  return buf;
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

function parseItemIconTable(tableH) {
  const itemAssets = new Map();
  for (const m of tableH.matchAll(
    /\[ITEM_(\w+)\]\s*=\s*\{(gItemIcon_\w+),\s*(gItemIconPalette_\w+)/g,
  )) {
    itemAssets.set(`ITEM_${m[1]}`, { iconVar: m[2], paletteVar: m[3] });
  }
  return itemAssets;
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

const [graphicsH, tableH] = await Promise.all([
  loadFile("src/data/graphics/items.h").then((b) => b.toString("utf8")),
  loadFile("src/data/item_icon_table.h").then((b) => b.toString("utf8")),
]);

const { iconPaths, palettePaths } = parseAssetPaths(graphicsH);
const itemAssets = parseItemIconTable(tableH);

fs.mkdirSync(OUT_DIR, { recursive: true });

const added = {};
for (const item of EVOLUTION_ITEMS) {
  const assets = itemAssets.get(item.const);
  if (!assets) {
    console.warn(`No icon table entry for ${item.const}`);
    continue;
  }
  const iconRel = `graphics/items/icons/${iconPaths.get(assets.iconVar)}`;
  const paletteRel = `graphics/items/icon_palettes/${palettePaths.get(assets.paletteVar)}`;
  const iconBuf = await loadFile(iconRel);
  const targetPaletteText = (await loadFile(paletteRel)).toString("utf8");
  const src = PNG.sync.read(iconBuf);
  const sourcePaletteText = detectSourcePaletteText(src, [targetPaletteText]);
  const pngBuf = renderItemIcon(iconBuf, sourcePaletteText, targetPaletteText);
  const outPath = path.join(OUT_DIR, item.file);
  fs.writeFileSync(outPath, pngBuf);
  added[item.name] = item.file;
  console.log(`Wrote ${outPath}`);
}

// Merge into existing itemIconsGenerated.ts without wiping map icons.
const existingText = fs.readFileSync(OUT_TS, "utf8");
const existingMatch = existingText.match(
  /export const ITEM_BAG_ICONS: Record<string, ItemBagIcon> = \{([\s\S]*?)\};/,
);
if (!existingMatch) throw new Error("Could not parse itemIconsGenerated.ts");

const entries = new Map();
for (const m of existingMatch[1].matchAll(
  /"([^"]+)":\s*\{\s*spriteSheet:\s*"([^"]+)",\s*spriteWidth:\s*(\d+),\s*spriteHeight:\s*(\d+)\s*\}/g,
)) {
  entries.set(m[1], { spriteSheet: m[2], spriteWidth: Number(m[3]), spriteHeight: Number(m[4]) });
}

for (const [name, file] of Object.entries(added)) {
  entries.set(name, {
    spriteSheet: `sprites/items/icons/${file}`,
    spriteWidth: 24,
    spriteHeight: 24,
  });
}

const ts = `/** Auto-generated by scripts/sync-item-icons.mjs — do not edit. */
export interface ItemBagIcon {
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
}

/** In-game bag icon (24×24 RGBA) keyed by the item display name on map pins. */
export const ITEM_BAG_ICONS: Record<string, ItemBagIcon> = {
${[...entries.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([name, icon]) =>
      `  ${JSON.stringify(name)}: { spriteSheet: ${JSON.stringify(icon.spriteSheet)}, spriteWidth: ${icon.spriteWidth}, spriteHeight: ${icon.spriteHeight} },`,
  )
  .join("\n")}
};

export function getItemBagIcon(name: string): ItemBagIcon | null {
  return ITEM_BAG_ICONS[name] ?? null;
}
`;

fs.writeFileSync(OUT_TS, ts);
console.log(`Updated ${OUT_TS} (+${Object.keys(added).length} evolution icons)`);
