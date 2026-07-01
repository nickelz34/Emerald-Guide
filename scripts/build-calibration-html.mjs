import fs from "fs";
import path from "path";

const ts = fs.readFileSync("src/data/mapAnnotations.ts", "utf8");
const shotDir = "public/screenshots";

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
    markers.push({ label: mm[2], x: +mm[3], y: +mm[4] });
  }
  areas[key] = { title: m[3], markers };
}

const fileForKey = {};
for (const file of fs.readdirSync(shotDir).filter((f) => f.endsWith(".png"))) {
  const stem = file.replace(/\.png$/i, "");
  const key = areas[stem] ? stem : aliases[stem];
  if (key && !fileForKey[key]) fileForKey[key] = file;
}

const cards = Object.entries(areas)
  .filter(([key]) => fileForKey[key] && areas[key].markers.length)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, area]) => {
    const dots = area.markers
      .map(
        (m) =>
          `<span class="dot" style="left:${m.x}%;top:${m.y}%" data-label="${m.label.replace(/"/g, "&quot;")}"></span>`,
      )
      .join("");
    return `<div class="card"><h2>${area.title} <small>(${key})</small></h2><div class="frame"><img src="/screenshots/${fileForKey[key]}" alt="${area.title}" />${dots}</div></div>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><title>Marker calibration</title>
<style>
body{background:#111;color:#eee;font-family:sans-serif;margin:0;padding:1rem}
h1{font-size:1.2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.25rem}
.card{background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:.75rem}
.card h2{margin:0 0 .5rem;font-size:.9rem}.card small{color:#888;font-weight:400}
.frame{position:relative;display:inline-block;max-width:100%}
.frame img{display:block;width:100%;height:auto;image-rendering:pixelated}
.dot{position:absolute;width:14px;height:14px;border-radius:50%;background:rgba(255,0,0,.85);border:2px solid #fff;transform:translate(-50%,-50%);box-shadow:0 0 0 2px rgba(0,0,0,.5)}
.dot::after{content:attr(data-label);position:absolute;left:16px;top:-5px;font-size:10px;color:#ff0;white-space:nowrap;text-shadow:0 1px 2px #000}
</style></head><body><h1>Marker calibration (${Object.keys(fileForKey).length} maps)</h1><div class="grid">${cards}</div></body></html>`;

fs.writeFileSync("public/marker-calibration.html", html);
console.log("Wrote public/marker-calibration.html");
