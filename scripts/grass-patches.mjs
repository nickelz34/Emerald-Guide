/**
 * Find representative tall-grass tile centers per map from pokeemerald map.bin.
 */
import https from "https";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAPS = {
  "route-101": "PetalburgWoods", // wrong - fix below
};

const ROUTES = [
  ["route-101", "Route101", "gTileset_Petalburg"],
  ["route-102", "Route102", "gTileset_Petalburg"],
  ["route-104", "Route104", "gTileset_Petalburg"],
  ["route-116", "Route116", "gTileset_Rustboro"],
  ["route-110", "Route110", "gTileset_Mauville"],
  ["route-117", "Route117", "gTileset_Mauville"],
  ["route-118", "Route118", "gTileset_Mauville"],
  ["route-113", "Route113", "gTileset_Fallarbor"],
  ["route-119", "Route119", "gTileset_Fortree"],
  ["route-120", "Route120", "gTileset_Fortree"],
  ["petalburg-woods", "PetalburgWoods", "gTileset_Rustboro"],
];

const TILESET_PATH = {
  gTileset_General: "general",
  gTileset_Petalburg: "petalburg",
  gTileset_Rustboro: "rustboro",
  gTileset_Mauville: "mauville",
  gTileset_Fallarbor: "fallarbor",
  gTileset_Fortree: "fortree",
};

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, (r) => {
      const c = [];
      r.on("data", (d) => c.push(d));
      r.on("end", () => res(Buffer.concat(c)));
    }).on("error", rej);
  });
}

async function grassPatches(layoutName, secondary) {
  const layouts = JSON.parse((await get("https://raw.githubusercontent.com/pret/pokeemerald/master/data/layouts/layouts.json")).toString());
  const lay = layouts.layouts.find((l) => l.name === layoutName + "_Layout" || l.id === `LAYOUT_${layoutName.toUpperCase()}`);
  const layout = lay ?? layouts.layouts.find((l) => l.name.includes(layoutName));
  const mapBin = await get(`https://raw.githubusercontent.com/pret/pokeemerald/master/data/layouts/${layoutName}/map.bin`);
  const primary = await get("https://raw.githubusercontent.com/pret/pokeemerald/master/data/tilesets/primary/general/metatile_attributes.bin");
  const secName = TILESET_PATH[secondary] ?? secondary.replace("gTileset_", "").toLowerCase();
  const secondaryBuf = await get(`https://raw.githubusercontent.com/pret/pokeemerald/master/data/tilesets/secondary/${secName}/metatile_attributes.bin`);
  const W = layout.width, H = layout.height, PRIMARY = 512;
  function behavior(idx) {
    const attr = idx < PRIMARY ? primary.readUInt16LE(idx * 2) : secondaryBuf.readUInt16LE((idx - PRIMARY) * 2);
    return attr & 0x1f;
  }
  const grass = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const idx = mapBin.readUInt16LE((y * W + x) * 2) & 0x3ff;
      if (behavior(idx) === 2) grass.push([x, y]);
    }
  const patches = {};
  for (const [x, y] of grass) {
    const k = `${Math.floor(x / 8)},${Math.floor(y / 8)}`;
    patches[k] = (patches[k] || 0) + 1;
  }
  const top = Object.entries(patches)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, c]) => {
      const [bx, by] = k.split(",").map(Number);
      const inP = grass.filter(([x, y]) => Math.floor(x / 8) === bx && Math.floor(y / 8) === by);
      const cx = Math.round(inP.reduce((s, t) => s + t[0], 0) / inP.length);
      const cy = Math.round(inP.reduce((s, t) => s + t[1], 0) / inP.length);
      return { k, c, cx, cy };
    });
  return { count: grass.length, top };
}

for (const [areaId, layoutName, sec] of ROUTES) {
  const { count, top } = await grassPatches(layoutName, sec);
  console.log(`\n${areaId} (${count} grass tiles):`);
  for (const p of top) console.log(`  patch ${p.k} n=${p.c} center [${p.cx}, ${p.cy}]`);
}
