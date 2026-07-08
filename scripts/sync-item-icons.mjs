/**
 * Copy in-game bag item icons from pokeemerald and emit a name → sprite lookup
 * for map selection callouts (visible items + hidden items).
 *
 * Usage:
 *   node scripts/sync-item-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

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

function parseIconPaths(graphicsH) {
  const iconPaths = new Map();
  for (const m of graphicsH.matchAll(
    /const u32 (gItemIcon_\w+)\[\] = INCGFX_U32\("graphics\/items\/icons\/([^"]+)\.png"/g,
  )) {
    iconPaths.set(m[1], `${m[2]}.png`);
  }
  return iconPaths;
}

function parseItemNames(itemsH) {
  const itemNames = new Map();
  for (const m of itemsH.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g)) {
    const body = m[2];
    const nameM = body.match(/\.name\s*=\s*_\("([^"]*)"\)/);
    const idM = body.match(/\.itemId\s*=\s*(ITEM_\w+)/);
    if (!nameM) continue;
    const displayName = titleCase(nameM[1]);
    const itemConst = idM?.[1] ?? `ITEM_${m[1]}`;
    itemNames.set(itemConst, displayName);
  }
  return itemNames;
}

function parseItemIconTable(tableH) {
  const itemToIcon = new Map();
  for (const m of tableH.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{(gItemIcon_\w+)/g)) {
    itemToIcon.set(`ITEM_${m[1]}`, m[2]);
  }
  return itemToIcon;
}

function buildNameToIcon(itemNames, itemToIcon, iconPaths) {
  const nameToIcon = new Map();
  for (const [itemConst, iconVar] of itemToIcon) {
    const name = itemNames.get(itemConst);
    const iconFile = iconPaths.get(iconVar);
    if (!name || !iconFile) continue;
    if (!nameToIcon.has(name)) nameToIcon.set(name, iconFile);
  }
  return nameToIcon;
}

const FALLBACK_ICONS = {
  Item: "question_mark.png",
  "Random Item": "question_mark.png",
  "Contest Poké Ball": "poke_ball.png",
  "Rival's Poké Ball": "poke_ball.png",
  Beldum: "poke_ball.png",
  Chikorita: "poke_ball.png",
  Cyndaquil: "poke_ball.png",
  Totodile: "poke_ball.png",
};

const [graphicsH, itemsH, tableH] = await Promise.all([
  loadFile("src/data/graphics/items.h").then((b) => b.toString("utf8")),
  loadFile("src/data/items.h").then((b) => b.toString("utf8")),
  loadFile("src/data/item_icon_table.h").then((b) => b.toString("utf8")),
]);

const iconPaths = parseIconPaths(graphicsH);
const itemNames = parseItemNames(itemsH);
const itemToIcon = parseItemIconTable(tableH);
const nameToIcon = buildNameToIcon(itemNames, itemToIcon, iconPaths);

const neededNames = collectMapItemNames();
for (const [alias, file] of Object.entries(FALLBACK_ICONS)) {
  if (neededNames.has(alias)) nameToIcon.set(alias, file);
}

const filesToCopy = new Set();
const resolved = {};
const missing = [];

for (const name of [...neededNames].sort()) {
  const file = nameToIcon.get(name);
  if (!file) {
    missing.push(name);
    continue;
  }
  filesToCopy.add(file);
  resolved[name] = file;
}

if (missing.length) {
  console.warn("No icon mapping for:", missing.join(", "));
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const file of [...filesToCopy].sort()) {
  const rel = `graphics/items/icons/${file}`;
  const buf = await loadFile(rel);
  const outPath = path.join(OUT_DIR, file);
  fs.writeFileSync(outPath, buf);
  console.log(`Wrote ${outPath}`);
}

const ts = `/** Auto-generated by scripts/sync-item-icons.mjs — do not edit. */
export interface ItemBagIcon {
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
}

/** In-game bag icon (24×24 source) keyed by the item display name on map pins. */
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
