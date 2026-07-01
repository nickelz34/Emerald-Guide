import fs from "fs";
import path from "path";

const ts = fs.readFileSync("src/data/mapAnnotations.ts", "utf8");
const shotDir = "public/screenshots";
const outDir = ".marker-debug";
fs.mkdirSync(outDir, { recursive: true });

const aliases = {};
const aliasBlock = ts.match(/const IMAGE_ALIASES[^=]+=\s*\{([\s\S]*?)\};/);
if (aliasBlock) {
  for (const m of aliasBlock[1].matchAll(/([\w-]+):\s*"([^"]+)"/g)) aliases[m[1]] = m[2];
}

const areas = {};
const blockRe = /(?:"([\w-]+)"|([\w-]+)):\s*\{\s*title:\s*"([^"]+)"[\s\S]*?markers:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
for (const m of ts.matchAll(blockRe)) {
  const key = m[1] || m[2];
  const markers = [];
  for (const mm of m[4].matchAll(
    /\{\s*id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"[\s\S]*?x:\s*([\d.]+),\s*y:\s*([\d.]+)/g,
  )) {
    markers.push({ id: mm[1], label: mm[2], x: +mm[3], y: +mm[4] });
  }
  areas[key] = { title: m[3], markers };
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

for (const file of fs.readdirSync(shotDir).filter((f) => f.endsWith(".png"))) {
  const stem = file.replace(/\.png$/i, "");
  const key = areas[stem] ? stem : aliases[stem];
  if (!key || !areas[key]) continue;
  const { w, h } = pngSize(path.join(shotDir, file));
  const imgB64 = fs.readFileSync(path.join(shotDir, file)).toString("base64");
  const markers = areas[key].markers;
  const dots = markers
    .map((m) => {
      const cx = (m.x / 100) * w;
      const cy = (m.y / 100) * h;
      const label = m.label.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      return `<circle cx="${cx}" cy="${cy}" r="14" fill="rgba(255,0,0,0.75)" stroke="white" stroke-width="3"/><text x="${cx + 16}" y="${cy + 5}" fill="yellow" font-size="18" font-family="sans-serif">${label}</text>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><image href="data:image/png;base64,${imgB64}" width="${w}" height="${h}"/>${dots}</svg>`;
  fs.writeFileSync(path.join(outDir, `${key}.svg`), svg);
  console.log(`${key}: ${markers.length} markers (${w}x${h})`);
}
