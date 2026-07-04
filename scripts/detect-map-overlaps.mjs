/** List tile-space overlaps between composite manifest maps. */
import fs from "node:fs";
import path from "node:path";

const manifest = JSON.parse(fs.readFileSync(path.join(path.resolve(import.meta.dirname, ".."), ".calib/manifest.json"), "utf8"));
const maps = manifest.maps;

function rect(m) {
  return { id: m.id, name: m.name, x1: m.gx, y1: m.gy, x2: m.gx + m.w, y2: m.gy + m.h };
}

const overlaps = [];
for (let i = 0; i < maps.length; i++) {
  const a = rect(maps[i]);
  for (let j = i + 1; j < maps.length; j++) {
    const b = rect(maps[j]);
    const ox = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
    const oy = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
    if (ox > 0 && oy > 0) {
      overlaps.push({ a: a.name, b: b.name, tiles: ox * oy, ox, oy });
    }
  }
}
overlaps.sort((x, y) => y.tiles - x.tiles);
console.log(`Overlaps among ${maps.length} maps: ${overlaps.length}`);
for (const o of overlaps.slice(0, 20)) {
  console.log(`  ${o.a} × ${o.b}: ${o.ox}×${o.oy} tiles (${o.tiles} total)`);
}
