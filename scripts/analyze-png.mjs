import fs from "fs";
import zlib from "zlib";

function readPng(file) {
  const buf = fs.readFileSync(file);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const raw = zlib.inflateSync(buf.subarray(33));
  const bytesPerPixel = raw.length / (h * (1 + w));
  const pixels = [];
  let o = 0;
  for (let y = 0; y < h; y++) {
    o++; // filter byte
    for (let x = 0; x < w; x++) {
      const i = o;
      if (bytesPerPixel === 4) {
        pixels.push({ x, y, r: raw[i], g: raw[i + 1], b: raw[i + 2] });
        o += 4;
      } else {
        pixels.push({ x, y, r: raw[i], g: raw[i + 1], b: raw[i + 2] });
        o += 3;
      }
    }
  }
  return { w, h, pixels };
}

function clusterCenter(pixels, pred) {
  const hits = pixels.filter(pred);
  if (!hits.length) return null;
  const x = hits.reduce((s, p) => s + p.x, 0) / hits.length;
  const y = hits.reduce((s, p) => s + p.y, 0) / hits.length;
  return { x: (x / pixels[pixels.length - 1].x) * 100, y: (y / pixels[pixels.length - 1].y) * 100, count: hits.length };
}

function pct(cx, cy, w, h) {
  return { x: +((cx / w) * 100).toFixed(1), y: +((cy / h) * 100).toFixed(1) };
}

function findRoofs(file) {
  const { w, h, pixels } = readPng(file);
  const red = pixels.filter((p) => p.r > 180 && p.g < 90 && p.b < 90);
  const blue = pixels.filter((p) => p.b > 150 && p.r < 120 && p.g < 150);
  const grass = pixels.filter((p) => p.g > 100 && p.r < 120 && p.b < 120 && p.g > p.r);
  const redC = red.length ? pct(red.reduce((s, p) => s + p.x, 0) / red.length, red.reduce((s, p) => s + p.y, 0) / red.length, w, h) : null;
  const blueC = blue.length ? pct(blue.reduce((s, p) => s + p.x, 0) / blue.length, blue.reduce((s, p) => s + p.y, 0) / blue.length, w, h) : null;
  return { file, w, h, redC, blueC, grassSamples: grass.length };
}

const dir = "public/screenshots";
for (const f of ["littleroot_town_e.png", "oldale.png", "petalburg_city_e.png", "rustboro_city_e.png", "dewford_town_e.png"]) {
  console.log(f, findRoofs(`${dir}/${f}`));
}
