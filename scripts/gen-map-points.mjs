/**
 * Generate item / berry / hidden / entrance pins from pokeemerald with the
 * true-scale composite transform (same as .calib/generate.mjs).
 *
 * Writes:
 *   .calib/points.json
 *   src/data/mapPointsGenerated.ts
 *
 * Usage: node scripts/gen-map-points.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MANIFEST = path.join(ROOT, ".calib/manifest.json");
const OUT_TS = path.join(ROOT, "src/data/mapPointsGenerated.ts");
const OUT_JSON = path.join(ROOT, ".calib/points.json");

if (!fs.existsSync(MANIFEST) || !fs.existsSync(REPO)) {
  console.error("Need .calib/manifest.json and .calib/pokeemerald");
  process.exit(1);
}

const MAPS_DIR = path.join(REPO, "data/maps");
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const { minX, minY, wTiles, hTiles } = manifest;

const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));
const maps = new Map();
for (const dir of fs.readdirSync(MAPS_DIR)) {
  const mj = path.join(MAPS_DIR, dir, "map.json");
  if (!fs.existsSync(mj)) continue;
  const m = JSON.parse(fs.readFileSync(mj, "utf8"));
  const l = layoutById.get(m.layout);
  maps.set(m.id, { ...m, w: l?.width || 0, h: l?.height || 0 });
}

const origin = new Map();
origin.set("MAP_LITTLEROOT_TOWN", { gx: 0, gy: 0 });
const q = ["MAP_LITTLEROOT_TOWN"];
while (q.length) {
  const id = q.shift();
  const cur = maps.get(id);
  const o = origin.get(id);
  if (!cur) continue;
  for (const c of cur.connections || []) {
    if (origin.has(c.map) || !maps.get(c.map)) continue;
    if (!["up", "down", "left", "right"].includes(c.direction)) continue;
    const nb = maps.get(c.map);
    const off = Number(c.offset) || 0;
    let gx;
    let gy;
    if (c.direction === "down") {
      gx = o.gx + off;
      gy = o.gy + cur.h;
    } else if (c.direction === "up") {
      gx = o.gx + off;
      gy = o.gy - nb.h;
    } else if (c.direction === "right") {
      gx = o.gx + cur.w;
      gy = o.gy + off;
    } else {
      gx = o.gx - nb.w;
      gy = o.gy + off;
    }
    origin.set(c.map, { gx, gy });
    q.push(c.map);
  }
}

const toX = (id, lx) => +(((origin.get(id).gx - minX + lx + 0.5) / wTiles) * 100).toFixed(2);
const toY = (id, ly) => +(((origin.get(id).gy - minY + ly + 0.5) / hTiles) * 100).toFixed(2);

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
for (const mt of itemsText.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g)) {
  const konst = mt[1];
  const body = mt[2];
  const nameM = body.match(/\.name\s*=\s*_\("([^"]*)"\)/);
  const descM = body.match(/\.description\s*=\s*(\w+)/);
  if (!nameM) continue;
  const rec = {
    const: konst,
    name: titleCase(nameM[1]),
    desc: descM ? descByVar.get(descM[1]) || "" : "",
  };
  byConst.set(konst, rec);
  items.push({ ...rec, norm: konst.replace(/[^A-Z0-9]/g, "") });
}

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

function itemFromFlag(flag) {
  const fnorm = (flag || "").replace(/^FLAG_(HIDDEN_)?ITEM_/, "").replace(/[^A-Z0-9]/g, "");
  let best = null;
  for (const it of items) {
    if (fnorm.endsWith(it.norm) && (!best || it.norm.length > best.norm.length)) best = it;
  }
  return best;
}

const berryConst = (word) => byConst.get(word.toUpperCase() + "_BERRY");
const areaName = (mapName) =>
  mapName.replace(/([a-z])([A-Z0-9])/g, "$1 $2").replace(/Route(\d)/, "Route $1");

function destLabel(dest, curId) {
  let s = dest || "";
  if (curId && s.startsWith(curId + "_")) s = "MAP_" + s.slice(curId.length + 1);
  s = s.replace(/^MAP_/, "").replace(/_1F$|_2F$|_3F$|_B1F$|_B2F$|_1R$/, "");
  return s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Pokemon/i, "Pokémon")
    .replace(/Poke Mart/i, "Poké Mart");
}

const points = [];
let idc = 0;
const nid = (p) => `${p}${idc++}`;
for (const [id] of origin) {
  const m = maps.get(id);
  if (!m) continue;
  const area = areaName(m.name);
  for (const oe of m.object_events || []) {
    if (oe.graphics_id === "OBJ_EVENT_GFX_ITEM_BALL") {
      const it = itemFromFlag(oe.flag);
      points.push({
        id: nid("it"),
        name: it?.name || "Item",
        category: "item",
        x: toX(id, oe.x),
        y: toY(id, oe.y),
        note: area,
        desc: it?.desc || "",
      });
    } else if (oe.graphics_id === "OBJ_EVENT_GFX_BERRY_TREE") {
      const bid = oe.trainer_sight_or_berry_tree_id || "";
      const wm = /_([A-Z]+)(?:_\d+)?$/.exec(bid);
      const word = wm ? wm[1] : "";
      if (word === "SOIL") {
        points.push({
          id: nid("be"),
          name: "Soft Soil",
          category: "berry",
          x: toX(id, oe.x),
          y: toY(id, oe.y),
          note: area,
          desc: "Loamy soil where a Berry can be planted.",
        });
      } else {
        const b = berryConst(word);
        points.push({
          id: nid("be"),
          name: b?.name || `${titleCase(word)} Berry`,
          category: "berry",
          x: toX(id, oe.x),
          y: toY(id, oe.y),
          note: area,
          desc: b?.desc || "",
        });
      }
    }
  }
  for (const bg of m.bg_events || []) {
    if (bg.type === "hidden_item") {
      const rec = byConst.get((bg.item || "").replace(/^ITEM_/, ""));
      points.push({
        id: nid("hi"),
        name: rec?.name || destLabel(bg.item),
        category: "hidden",
        x: toX(id, bg.x),
        y: toY(id, bg.y),
        note: `Hidden · ${area}`,
        desc: rec?.desc || "",
      });
    }
  }
  for (const w of m.warp_events || []) {
    points.push({
      id: nid("en"),
      name: destLabel(w.dest_map, id) || "Entrance",
      category: "entrance",
      x: toX(id, w.x),
      y: toY(id, w.y),
      note: area,
      desc: "",
    });
  }
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(points));

const lines = [];
lines.push("// AUTO-GENERATED by scripts/gen-map-points.mjs — do not edit by hand.");
lines.push("// Positions are tile-exact on the Hoenn composite (manifest wTiles x hTiles).");
lines.push('import type { MapPoint } from "./mapPoints";');
lines.push("");
lines.push("export const GENERATED_POINTS: MapPoint[] = [");
for (const p of points) {
  const desc = p.desc ? `, desc: ${JSON.stringify(p.desc)}` : "";
  lines.push(
    `  { id: ${JSON.stringify(p.id)}, name: ${JSON.stringify(p.name)}, category: ${JSON.stringify(p.category)}, x: ${p.x}, y: ${p.y}, note: ${JSON.stringify(p.note)}${desc} },`,
  );
}
lines.push("];");
lines.push("");
fs.writeFileSync(OUT_TS, lines.join("\n"));

const byCat = {};
for (const p of points) byCat[p.category] = (byCat[p.category] || 0) + 1;
console.log(`Wrote ${path.relative(ROOT, OUT_TS)} (${points.length} points)`, byCat);
