/**
 * Render standalone PNGs + marker data for every NON-composite pokeemerald map
 * that contains collectible items (item balls, hidden items, or berry trees).
 * These become selectable "area maps" in the Hoenn Map switcher.
 *
 * Item/berry/hidden names + descriptions come from the game's own data files
 * (same source as .calib/generate.mjs). Marker positions are local to each map
 * image (percent of that map's own width/height), pixel-exact at 16px/tile.
 *
 * Usage:
 *   node scripts/gen-area-maps.mjs --dry     # list scope only, no render
 *   node scripts/gen-area-maps.mjs           # render PNGs + write src/data/areaMaps.ts
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, ".calib/manifest.json"), "utf8"));
const OUT_IMG_DIR = path.join(ROOT, "public/maps/areas");
const DRY = process.argv.includes("--dry");

const compositeIds = new Set(manifest.maps.map((m) => m.id));

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map();
for (const l of layoutsJson.layouts) if (l && l.id) layoutById.set(l.id, l);

// ---- all maps ----
const maps = new Map();
for (const dir of fs.readdirSync(MAPS_DIR)) {
  const mj = path.join(MAPS_DIR, dir, "map.json");
  if (!fs.existsSync(mj)) continue;
  const m = JSON.parse(fs.readFileSync(mj, "utf8"));
  const l = layoutById.get(m.layout);
  if (!l) continue;
  maps.set(m.id, { ...m, layout: l, w: l.width, h: l.height });
}

// ---- item name + description index (authoritative game text) ----
const descText = fs.readFileSync(path.join(REPO, "src/data/text/item_descriptions.h"), "utf8");
const descByVar = new Map();
for (const mt of descText.matchAll(/static const u8 (\w+)\[\] =\s*_\(([\s\S]*?)\);/g)) {
  const parts = [...mt[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
  const text = parts.join(" ").replace(/\\[nlp]/g, " ").replace(/\s+/g, " ").trim();
  descByVar.set(mt[1], text);
}
const itemsText = fs.readFileSync(path.join(REPO, "src/data/items.h"), "utf8");
const byConst = new Map();
const items = [];
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
for (const mt of itemsText.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g)) {
  const konst = mt[1];
  const body = mt[2];
  const nameM = body.match(/\.name\s*=\s*_\("([^"]*)"\)/);
  const descM = body.match(/\.description\s*=\s*(\w+)/);
  if (!nameM) continue;
  const rec = { const: konst, name: titleCase(nameM[1]), desc: descM ? descByVar.get(descM[1]) || "" : "" };
  byConst.set(konst, rec);
  items.push({ ...rec, norm: konst.replace(/[^A-Z0-9]/g, "") });
}
function itemFromFlag(flag) {
  const fnorm = (flag || "").replace(/^FLAG_(HIDDEN_)?ITEM_/, "").replace(/[^A-Z0-9]/g, "");
  let best = null;
  for (const it of items) {
    if (fnorm.endsWith(it.norm) && (!best || it.norm.length > best.norm.length)) best = it;
  }
  return best;
}
const camel = (s) => s.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
function itemFromScript(script) {
  const m = /_Item(.+)$/.exec(script || "");
  return m ? camel(m[1]) : null;
}

/** Story / special item balls that don't use FLAG_HIDDEN_ITEM_* naming. */
const SPECIAL_ITEM_SCRIPTS = {
  BattlePyramid_FindItemBall: {
    name: "Random Item",
    desc: "Battle Pyramid pickup — the item is chosen at random from a pool of healing items, TMs, and hold items each run.",
  },
  LittlerootTown_ProfessorBirchsLab_EventScript_Cyndaquil: {
    name: "Cyndaquil",
    desc: "Post-game Johto starter gift (National Dex). Pick one of the three balls on this table.",
  },
  LittlerootTown_ProfessorBirchsLab_EventScript_Totodile: {
    name: "Totodile",
    desc: "Post-game Johto starter gift (National Dex). Pick one of the three balls on this table.",
  },
  LittlerootTown_ProfessorBirchsLab_EventScript_Chikorita: {
    name: "Chikorita",
    desc: "Post-game Johto starter gift (National Dex). Pick one of the three balls on this table.",
  },
  MossdeepCity_StevensHouse_EventScript_BeldumPokeball: {
    name: "Beldum",
    desc: "Gift Pokémon (Lv. 5) after becoming Champion — appears in the Poké Ball on Steven's desk.",
  },
  LittlerootTown_BrendansHouse_2F_EventScript_RivalsPokeBall: {
    name: "Rival's Poké Ball",
    desc: "Brendan's starter ball in his room. You can't take it.",
  },
  LittlerootTown_MaysHouse_2F_EventScript_RivalsPokeBall: {
    name: "Rival's Poké Ball",
    desc: "May's starter ball in her room. You can't take it.",
  },
};

function resolveItemBall(oe, mapName) {
  const script = oe.script || "";
  if (SPECIAL_ITEM_SCRIPTS[script]) return SPECIAL_ITEM_SCRIPTS[script];
  if (mapName === "ContestHall" && script === "0x0") {
    return {
      name: "Contest Poké Ball",
      desc: "Decorative ball on stage during Pokémon Contests.",
    };
  }
  const fromFlag = itemFromFlag(oe.flag);
  if (fromFlag?.name) return { name: fromFlag.name, desc: fromFlag.desc || "" };
  const fromScript = itemFromScript(script);
  if (fromScript) return { name: fromScript, desc: "" };
  const tail = (script.split("_").pop() || "").replace(/Pokeball/i, " Poké Ball");
  if (/Pokeball/i.test(script)) return { name: titleCase(camel(tail)), desc: "" };
  return { name: "Item", desc: "" };
}

/** Spread markers that share a tile so stacked balls (e.g. Birch's Lab starters) stay clickable. */
function itemBallXY(oe, allBalls, W, H) {
  const atTile = allBalls.filter((b) => b.x === oe.x && b.y === oe.y);
  const i = atTile.indexOf(oe);
  const baseX = toLocalX(oe.x, W);
  const baseY = toLocalY(oe.y, H);
  if (atTile.length <= 1) return { x: baseX, y: baseY };
  const spread = 3;
  return { x: +(baseX + (i - (atTile.length - 1) / 2) * spread).toFixed(2), y: baseY };
}
const berryConst = (word) => byConst.get(word.toUpperCase() + "_BERRY");

// ---- tileset rendering (from .calib/render-locations.mjs) ----
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
  const tilesX = W >> 3, tilesY = H >> 3, nTiles = tilesX * tilesY;
  const tiles = new Array(nTiles);
  for (let t = 0; t < nTiles; t++) {
    const tc = t % tilesX, tr = (t / tilesX) | 0;
    const arr = new Uint8Array(64);
    for (let py = 0; py < 8; py++) {
      for (let px = 0; px < 8; px++) {
        const x = tc * 8 + px, y = tr * 8 + py;
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
  const prim = loadTileset(pdir), sec = loadTileset(sdir);
  const out = new Uint8Array(1024);
  const mSrc = id < 512 ? prim : sec;
  const mOff = (id < 512 ? id : id - 512) * 16;
  if (mOff + 16 <= mSrc.meta.length) {
    for (let layer = 0; layer < 2; layer++) {
      for (let s = 0; s < 4; s++) {
        const e = mOff + (layer * 4 + s) * 2;
        const val = mSrc.meta[e] | (mSrc.meta[e + 1] << 8);
        const tileId = val & 0x3ff;
        const xflip = (val >> 10) & 1, yflip = (val >> 11) & 1, pal = (val >> 12) & 0xf;
        const tsrc = tileId < 512 ? prim : sec;
        const tid = tileId < 512 ? tileId : tileId - 512;
        if (tid >= tsrc.nTiles) continue;
        const tile = tsrc.tiles[tid];
        const cols = pal < 6 ? prim.pals[pal] : sec.pals[pal];
        const sx = (s & 1) * 8, sy = (s >> 1) * 8;
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
function renderMap(m) {
  const l = m.layout;
  const W = l.width, H = l.height;
  const pdir = tilesetDir(l.primary_tileset, "primary");
  const sdir = tilesetDir(l.secondary_tileset, "secondary");
  const bin = fs.readFileSync(path.join(REPO, l.blockdata_filepath));
  const OW = W * 16, OH = H * 16;
  const png = new PNG({ width: OW, height: OH });
  const ob = png.data;
  for (let i = 0; i < ob.length; i += 4) {
    ob[i] = 56; ob[i + 1] = 104; ob[i + 2] = 168; ob[i + 3] = 255;
  }
  for (let row = 0; row < H; row++) {
    for (let col = 0; col < W; col++) {
      const ci = (row * W + col) * 2;
      if (ci + 1 >= bin.length) continue;
      const val = bin[ci] | (bin[ci + 1] << 8);
      const mt = getMetatile(pdir, sdir, val & 0x3ff);
      const px = col * 16, py = row * 16;
      for (let ry = 0; ry < 16; ry++) {
        const dst = ((py + ry) * OW + px) * 4;
        ob.set(mt.subarray(ry * 64, ry * 64 + 64), dst);
      }
    }
  }
  return png;
}

// ---- naming / grouping ----
const displayName = (mapName) =>
  mapName
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/Route(\d)/, "Route $1")
    .replace(/_/g, " ")
    .replace(/\bB(\d)F\b/, "B$1F")
    .trim();

const FLOOR_RE = /_(B?\d+F|1R|Top|Entrance|Inside|Outside|Lower|Upper|Bottom)?$/;
function groupAndFloor(mapName) {
  const py = mapName.match(/^BattlePyramidSquare(\d+)$/);
  if (py) return { group: "Battle Pyramid", floor: `Square ${+py[1]}` };
  if (mapName === "BattleFrontier_BattlePyramidLobby") {
    return { group: "Battle Pyramid", floor: "Lobby" };
  }
  if (mapName === "BattleFrontier_BattlePyramidFloor") {
    return { group: "Battle Pyramid", floor: "Floor" };
  }
  if (mapName === "BattleFrontier_BattlePyramidTop") {
    return { group: "Battle Pyramid", floor: "Top (Brandon)" };
  }
  if (mapName === "ContestHall") return { group: "Contest Hall", floor: "" };
  if (mapName === "LittlerootTown_ProfessorBirchsLab") {
    return { group: "Littleroot Town", floor: "Professor Birch's Lab" };
  }
  if (mapName === "LittlerootTown_BrendansHouse_2F") {
    return { group: "Littleroot Town", floor: "Brendan's House 2F" };
  }
  if (mapName === "LittlerootTown_MaysHouse_2F") {
    return { group: "Littleroot Town", floor: "May's House 2F" };
  }
  if (mapName === "MossdeepCity_StevensHouse") {
    return { group: "Mossdeep City", floor: "Steven's House" };
  }
  // e.g. GraniteCave_B1F -> {group:"Granite Cave", floor:"B1F"}
  const parts = mapName.split("_");
  const floorTokens = [];
  while (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (/^(B?\d+F|\d+R|Top|Bottom|Inside|Outside|Entrance|Room\d*|Lower|Upper|Deck|HiddenFloorRooms|LowerDeck|UpperDeck)$/.test(last)) {
      floorTokens.unshift(parts.pop());
    } else break;
  }
  const group = displayName(parts.join("_"));
  const floor = floorTokens.length ? displayName(floorTokens.join("_")) : "";
  return { group, floor };
}
const toLocalX = (x, W) => +(((x + 0.5) / W) * 100).toFixed(2);
const toLocalY = (y, H) => +(((y + 0.5) / H) * 100).toFixed(2);

/** Non-composite maps rendered even without field pickups (walkthrough navigation). */
const ALWAYS_INCLUDE = new Set([
  "BattleFrontier_BattlePyramidLobby",
  "BattleFrontier_BattlePyramidFloor",
  "BattleFrontier_BattlePyramidTop",
]);

// ---- collect candidate maps ----
const candidates = [];
for (const [id, m] of maps) {
  if (compositeIds.has(id)) continue; // already on the main overworld composite
  const objs = m.object_events || [];
  const bgs = m.bg_events || [];
  const itemBalls = objs.filter((o) => o.graphics_id === "OBJ_EVENT_GFX_ITEM_BALL");
  const berryTrees = objs.filter((o) => o.graphics_id === "OBJ_EVENT_GFX_BERRY_TREE");
  const hidden = bgs.filter((b) => b.type === "hidden_item");
  const hasCollectibles = itemBalls.length || berryTrees.length || hidden.length;
  if (!hasCollectibles && !ALWAYS_INCLUDE.has(m.name)) continue;
  candidates.push({ id, m, itemBalls, berryTrees, hidden });
}

candidates.sort((a, b) => a.m.name.localeCompare(b.m.name));

let tItems = 0, tHidden = 0, tBerries = 0;
for (const c of candidates) {
  tItems += c.itemBalls.length;
  tHidden += c.hidden.length;
  tBerries += c.berryTrees.length;
}
console.log(`Non-composite maps with collectibles: ${candidates.length}`);
console.log(`  item balls: ${tItems}  hidden: ${tHidden}  berries: ${tBerries}`);
if (DRY) {
  for (const c of candidates) {
    const { group, floor } = groupAndFloor(c.m.name);
    console.log(
      `  ${c.m.name.padEnd(34)} ${(`${c.m.w}x${c.m.h}`).padEnd(8)} it:${c.itemBalls.length} hi:${c.hidden.length} be:${c.berryTrees.length}  [${group}${floor ? " / " + floor : ""}]`,
    );
  }
  process.exit(0);
}

// ---- render + build data ----
fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
const fileFor = (name) => name.toLowerCase().replace(/_/g, "-").replace(/[^a-z0-9-]/g, "") + ".png";

const areaEntries = [];
let idc = 0;
const nid = (p) => `a${p}${idc++}`;
let done = 0;
for (const c of candidates) {
  const { m } = c;
  const W = m.w, H = m.h;
  const { group, floor } = groupAndFloor(m.name);
  const file = fileFor(m.name);
  let png;
  try {
    png = renderMap(m);
  } catch (e) {
    console.log("SKIP", m.name, e.message);
    continue;
  }
  fs.writeFileSync(path.join(OUT_IMG_DIR, file), PNG.sync.write(png));

  const markers = [];
  for (const oe of c.itemBalls) {
    const it = resolveItemBall(oe, m.name);
    const { x, y } = itemBallXY(oe, c.itemBalls, W, H);
    markers.push({ id: nid("it"), name: it.name, category: "item", x, y, desc: it.desc || "" });
  }
  for (const oe of c.berryTrees) {
    const bid = oe.trainer_sight_or_berry_tree_id || "";
    const wm = /_([A-Z]+)(?:_\d+)?$/.exec(bid);
    const word = wm ? wm[1] : "";
    if (word === "SOIL") {
      markers.push({ id: nid("be"), name: "Soft Soil", category: "berry", x: toLocalX(oe.x, W), y: toLocalY(oe.y, H), desc: "Loamy soil where a Berry can be planted." });
    } else {
      const b = berryConst(word);
      markers.push({ id: nid("be"), name: b?.name || `${titleCase(word)} Berry`, category: "berry", x: toLocalX(oe.x, W), y: toLocalY(oe.y, H), desc: b?.desc || "" });
    }
  }
  for (const bg of c.hidden) {
    const rec = byConst.get((bg.item || "").replace(/^ITEM_/, ""));
    markers.push({ id: nid("hi"), name: rec?.name || camel((bg.item || "").replace(/^ITEM_/, "")), category: "hidden", x: toLocalX(bg.x, W), y: toLocalY(bg.y, H), desc: rec?.desc || "" });
  }

  areaEntries.push({
    id: m.name.toLowerCase().replace(/_/g, "-"),
    mapId: m.id,
    name: displayName(m.name),
    group,
    floor,
    image: `maps/areas/${file}`,
    width: W * 16,
    height: H * 16,
    markers,
  });
  done++;
  if (done % 15 === 0 || done === candidates.length) console.log(`  rendered ${done}/${candidates.length}`);
}

// ---- emit src/data/areaMaps.ts ----
const lines = [];
lines.push("// AUTO-GENERATED by scripts/gen-area-maps.mjs — do not edit by hand.");
lines.push("// Standalone pokeemerald area maps (caves, underwater, Safari Zone, etc.) that");
lines.push("// aren't part of the stitched overworld composite, each with its collectibles.");
lines.push('import type { PoiCategory } from "./mapPoints";');
lines.push("");
lines.push("export interface AreaMapMarker {");
lines.push("  id: string;");
lines.push("  name: string;");
lines.push("  category: PoiCategory;");
lines.push("  /** Percent (0–100) of the area image width/height. */");
lines.push("  x: number;");
lines.push("  y: number;");
lines.push("  desc?: string;");
lines.push("}");
lines.push("");
lines.push("export interface AreaMap {");
lines.push("  id: string;");
lines.push("  mapId: string;");
lines.push("  name: string;");
lines.push("  group: string;");
lines.push("  floor: string;");
lines.push("  image: string;");
lines.push("  width: number;");
lines.push("  height: number;");
lines.push("  markers: AreaMapMarker[];");
lines.push("}");
lines.push("");
lines.push("export const AREA_MAPS: AreaMap[] = [");
for (const a of areaEntries) {
  lines.push("  {");
  lines.push(`    id: ${JSON.stringify(a.id)},`);
  lines.push(`    mapId: ${JSON.stringify(a.mapId)},`);
  lines.push(`    name: ${JSON.stringify(a.name)},`);
  lines.push(`    group: ${JSON.stringify(a.group)},`);
  lines.push(`    floor: ${JSON.stringify(a.floor)},`);
  lines.push(`    image: ${JSON.stringify(a.image)},`);
  lines.push(`    width: ${a.width},`);
  lines.push(`    height: ${a.height},`);
  lines.push(`    markers: [`);
  for (const mk of a.markers) {
    const desc = mk.desc ? `, desc: ${JSON.stringify(mk.desc)}` : "";
    lines.push(`      { id: ${JSON.stringify(mk.id)}, name: ${JSON.stringify(mk.name)}, category: ${JSON.stringify(mk.category)}, x: ${mk.x}, y: ${mk.y}${desc} },`);
  }
  lines.push(`    ],`);
  lines.push("  },");
}
lines.push("];");
lines.push("");
fs.writeFileSync(path.join(ROOT, "src/data/areaMaps.ts"), lines.join("\n"));

console.log(`\nWrote ${areaEntries.length} area maps to src/data/areaMaps.ts`);

// ---- palette-quantize the PNGs in place (near-lossless, much smaller) ----
const sharp = (await import("sharp")).default;
const pngFiles = fs.readdirSync(OUT_IMG_DIR).filter((f) => f.endsWith(".png"));
let before = 0, after = 0;
for (const f of pngFiles) {
  const p = path.join(OUT_IMG_DIR, f);
  before += fs.statSync(p).size;
  const buf = await sharp(p).png({ palette: true, colors: 256, effort: 9, compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(p, buf);
  after += fs.statSync(p).size;
}
console.log(`Images in public/maps/areas/ — optimized ${pngFiles.length} files: ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB`);
