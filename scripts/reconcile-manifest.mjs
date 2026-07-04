/**
 * Recompute outdoor map positions from pokeemerald connections (BFS from
 * Littleroot) and patch .calib/manifest.json when gx/gy drift from the graph.
 *
 * Run: node scripts/reconcile-manifest.mjs [--write]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MAPS_DIR = path.join(REPO, "data/maps");
const manifestPath = path.join(ROOT, ".calib/manifest.json");
const WRITE = process.argv.includes("--write");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const layoutsJson = JSON.parse(fs.readFileSync(path.join(REPO, "data/layouts/layouts.json"), "utf8"));
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));

const maps = new Map();
for (const dir of fs.readdirSync(MAPS_DIR)) {
  const mj = path.join(MAPS_DIR, dir, "map.json");
  if (!fs.existsSync(mj)) continue;
  const m = JSON.parse(fs.readFileSync(mj, "utf8"));
  const l = layoutById.get(m.layout);
  if (!l) continue;
  maps.set(m.id, { ...m, w: l.width, h: l.height });
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
    let gx, gy;
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

let minX = Infinity,
  minY = Infinity,
  maxX = -Infinity,
  maxY = -Infinity;
for (const { gx, gy } of origin.values()) {
  minX = Math.min(minX, gx);
  minY = Math.min(minY, gy);
}
for (const [id, o] of origin) {
  const m = maps.get(id);
  maxX = Math.max(maxX, o.gx + m.w);
  maxY = Math.max(maxY, o.gy + m.h);
}

const toManifest = (id) => {
  const o = origin.get(id);
  const m = maps.get(id);
  if (!o || !m) return null;
  return { gx: o.gx - minX, gy: o.gy - minY, w: m.w, h: m.h };
};

const drifts = [];
for (const entry of manifest.maps) {
  const exp = toManifest(entry.id);
  if (!exp) continue;
  if (exp.gx !== entry.gx || exp.gy !== entry.gy || exp.w !== entry.w || exp.h !== entry.h) {
    drifts.push({
      id: entry.id,
      name: entry.name,
      was: { gx: entry.gx, gy: entry.gy, w: entry.w, h: entry.h },
      exp,
    });
  }
}

console.log(`BFS maps: ${origin.size}, manifest maps: ${manifest.maps.length}, drifts: ${drifts.length}`);
for (const d of drifts) {
  console.log(
    `  ${d.name}: manifest (${d.was.gx},${d.was.gy}) → expected (${d.exp.gx},${d.exp.gy})` +
      (d.was.w !== d.exp.w || d.was.h !== d.exp.h ? ` size ${d.was.w}x${d.was.h}→${d.exp.w}x${d.exp.h}` : ""),
  );
}

if (WRITE && drifts.length) {
  for (const entry of manifest.maps) {
    const exp = toManifest(entry.id);
    if (!exp) continue;
    entry.gx = exp.gx;
    entry.gy = exp.gy;
    entry.w = exp.w;
    entry.h = exp.h;
  }
  manifest.minX = minX;
  manifest.minY = minY;
  manifest.maxX = maxX;
  manifest.maxY = maxY;
  manifest.wTiles = maxX - minX;
  manifest.hTiles = maxY - minY;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
  console.log(`\nWrote ${manifestPath}`);
} else if (drifts.length) {
  console.log("\nRe-run with --write to patch manifest.");
}
