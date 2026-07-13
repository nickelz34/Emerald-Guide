/**
 * Verify every overworld (composite) hidden_item from pokeemerald is present
 * in src/data/mapPointsGenerated.ts, matched by composite coordinates.
 *
 * Uses .calib/manifest.json when present; otherwise rebuilds origins from
 * committed src/data/mapCrops.ts via scripts/map-origin-lib.mjs.
 *
 * Run: node scripts/verify-hidden-items.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { loadManifest } from "./map-origin-lib.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";

const manifest = loadManifest(ROOT);
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
    console.error("No composite map origins — cannot verify hidden items.");
    process.exit(1);
  }

  const usingCalib = fs.existsSync(path.join(ROOT, ".calib/manifest.json"));
  console.log(
    `Manifest: ${compositeMaps.length} maps from ${usingCalib ? ".calib/manifest.json" : "mapCrops.ts fallback"} (${W_TILES}×${H_TILES} tiles)`,
  );

  const expected = [];
  const fetchFailures = [];
  await pool(compositeMaps, 12, async (m) => {
    const folder = m.name ?? m.id?.replace(/^MAP_/, "").replace(/_/g, "");
    if (!folder) return;
    let map;
    try {
      map = await fetchJson(`${RAW}/data/maps/${folder}/map.json`);
    } catch (e) {
      fetchFailures.push({ map: folder, error: e.message });
      return;
    }
    const hidden = (map.bg_events ?? []).filter((b) => b.type === "hidden_item");
    for (const h of hidden) {
      const pos = tilePct(m.gx, m.gy, h.x, h.y);
      expected.push({ map: folder, item: h.item, tx: h.x, ty: h.y, ...pos });
    }
  });

  if (fetchFailures.length) {
    console.warn(`\nWarning: ${fetchFailures.length} map.json fetch failures (network or 404)`);
    for (const f of fetchFailures.slice(0, 5)) console.warn(`  ${f.map}: ${f.error}`);
    if (fetchFailures.length > 5) console.warn(`  … and ${fetchFailures.length - 5} more`);
  }

  console.log(`Composite hidden items in pokeemerald: ${expected.length}`);
  console.log(`Hidden entries in mapPointsGenerated.ts: ${genHidden.length}`);

  if (!expected.length) {
    console.error("\nNo expected hidden items resolved — check network or manifest map names.");
    process.exit(1);
  }

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
  } else {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
