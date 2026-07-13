/**
 * Verify every overworld (composite) hidden_item from pokeemerald is present
 * in src/data/mapPointsGenerated.ts, matched by composite coordinates.
 * Run: node scripts/verify-hidden-items.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST_PATH = path.join(ROOT, ".calib/manifest.json");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  }
  // Hoenn composite dimensions from mapCrops.ts — enough to verify hidden items offline.
  return {
    wTiles: 400,
    hTiles: 191,
    maps: [],
  };
}

const manifest = loadManifest();
const W_TILES = manifest.wTiles;
const H_TILES = manifest.hTiles;

const compositeMaps = manifest.maps ?? [];
const round = (n) => Math.round(n * 100) / 100;
const tilePct = (gx, gy, tx, ty) => ({
  x: round(((gx + tx + 0.5) / W_TILES) * 100),
  y: round(((gy + ty + 0.5) / H_TILES) * 100),
});

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function pool(items, size, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        await fn(items[idx]);
      }
    }),
  );
}

// Parse existing generated hidden points (id, x, y, name, note).
const genSrc = fs.readFileSync(path.join(ROOT, "src/data/mapPointsGenerated.ts"), "utf8");
const genHidden = [];
const re = /\{ id: "(hi\d+)", name: "([^"]*)", category: "hidden", x: ([\d.]+), y: ([\d.]+), note: "([^"]*)"/g;
let mt;
while ((mt = re.exec(genSrc))) {
  genHidden.push({ id: mt[1], name: mt[2], x: parseFloat(mt[3]), y: parseFloat(mt[4]), note: mt[5] });
}

function findMatch(x, y) {
  return genHidden.find((g) => Math.abs(g.x - x) < 0.2 && Math.abs(g.y - y) < 0.2);
}

async function main() {
  if (!compositeMaps.length) {
    console.log(
      "No .calib/manifest.json map list — skipping hidden-item coordinate verification (run locally with .calib).",
    );
    console.log(`Hidden entries in mapPointsGenerated.ts: ${genHidden.length}`);
    return;
  }

  const expected = [];
  await pool(compositeMaps, 12, async (m) => {
    let map;
    try {
      map = await fetchJson(`${RAW}/data/maps/${m.name}/map.json`);
    } catch {
      return;
    }
    const hidden = (map.bg_events ?? []).filter((b) => b.type === "hidden_item");
    for (const h of hidden) {
      const pos = tilePct(m.gx, m.gy, h.x, h.y);
      expected.push({ map: m.name, item: h.item, tx: h.x, ty: h.y, ...pos });
    }
  });

  console.log(`Composite hidden items in pokeemerald: ${expected.length}`);
  console.log(`Hidden entries in mapPointsGenerated.ts: ${genHidden.length}`);

  const missing = [];
  const matchedIds = new Set();
  for (const e of expected) {
    const m = findMatch(e.x, e.y);
    if (!m) missing.push(e);
    else matchedIds.add(m.id);
  }

  const orphans = genHidden.filter((g) => !matchedIds.has(g.id));

  console.log(`\nMatched: ${expected.length - missing.length}/${expected.length}`);
  if (missing.length) {
    console.log(`\n--- MISSING from our data (${missing.length}) ---`);
    for (const e of missing) {
      console.log(`  ${e.map} ${e.item} tile(${e.tx},${e.ty}) -> ${e.x}%,${e.y}%`);
    }
  }
  if (orphans.length) {
    console.log(`\n--- Orphan entries in our data (no pokeemerald match) (${orphans.length}) ---`);
    for (const g of orphans) console.log(`  ${g.id} ${g.name} @${g.x},${g.y} (${g.note})`);
  }
  if (!missing.length && !orphans.length) {
    console.log(`\nAll overworld hidden items are present and aligned.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
