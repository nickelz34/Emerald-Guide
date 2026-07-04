/**
 * Count hidden_item bg_events across ALL pokeemerald maps and report which
 * maps are part of the outdoor composite (from .calib/manifest.json).
 * Run: node scripts/count-hidden-items.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const ROOT = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, ".calib/manifest.json"), "utf8"));
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";

// manifest map name (e.g. "Route110") -> map id (MAP_ROUTE110)
const compositeNames = new Set(manifest.maps.map((m) => m.name));

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString()));
      })
      .on("error", reject);
  });
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return out;
}

async function main() {
  const groups = await fetchJson(`${RAW}/data/maps/map_groups.json`);
  const mapNames = [];
  for (const key of groups.group_order) {
    for (const name of groups[key]) mapNames.push(name);
  }
  console.log(`Discovered ${mapNames.length} maps in map_groups.json`);

  let total = 0;
  let onComposite = 0;
  const perMap = [];
  const failures = [];

  await pool(mapNames, 16, async (name) => {
    let m;
    try {
      m = await fetchJson(`${RAW}/data/maps/${name}/map.json`);
    } catch (e) {
      failures.push({ name, err: e.message });
      return;
    }
    const hidden = (m.bg_events ?? []).filter((b) => b.type === "hidden_item");
    if (hidden.length === 0) return;
    total += hidden.length;
    const inComposite = compositeNames.has(name);
    if (inComposite) onComposite += hidden.length;
    perMap.push({ name, count: hidden.length, inComposite });
  });

  perMap.sort((a, b) => b.count - a.count);
  console.log(`\nMaps with hidden items: ${perMap.length}`);
  console.log(`TOTAL hidden items: ${total}`);
  console.log(`  on outdoor composite maps: ${onComposite}`);
  console.log(`  on non-composite maps (caves/interiors/underwater): ${total - onComposite}`);

  console.log(`\n--- Non-composite maps with hidden items ---`);
  for (const p of perMap.filter((x) => !x.inComposite)) {
    console.log(`  ${p.count.toString().padStart(3)}  ${p.name}`);
  }
  console.log(`\n--- Composite maps with hidden items ---`);
  for (const p of perMap.filter((x) => x.inComposite)) {
    console.log(`  ${p.count.toString().padStart(3)}  ${p.name}`);
  }

  if (failures.length) {
    console.log(`\n${failures.length} fetch failures:`);
    for (const f of failures) console.log(`  ${f.name}: ${f.err}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
