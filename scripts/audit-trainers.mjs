/**
 * Audit MAP_TRAINERS / AREA_TRAINERS against pokeemerald object_events tiles.
 *
 * Run: node scripts/audit-trainers.mjs
 */
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import {
  feetMapPct,
  loadManifest,
  mapIdToAreaId,
  mapIdToDir,
  parseAreaMapBounds,
  tileDistance,
} from "./map-origin-lib.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const manifest = loadManifest(ROOT);
const mapOrigin = new Map(manifest.maps.map((m) => [m.id, { gx: m.gx, gy: m.gy }]));

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

const trainersSrc = fs.readFileSync(path.join(ROOT, "src/data/mapTrainersGenerated.ts"), "utf8");
const trainers = [];
for (const m of trainersSrc.matchAll(
  /\{ id: "([^"]+)", name: "([^"]+)", category: "trainer"[\s\S]*?x: ([0-9.]+), y: ([0-9.]+)[\s\S]*?mapId: "([^"]+)" \}/g,
)) {
  trainers.push({ id: m[1], name: m[2], x: +m[3], y: +m[4], mapId: m[5] });
}

const layoutsJson = JSON.parse(await fetchText(`${RAW}/data/layouts/layouts.json`));
const layoutById = new Map(layoutsJson.layouts.map((l) => [l.id, l]));

const mapCache = new Map();
async function loadMap(mapId) {
  if (mapCache.has(mapId)) return mapCache.get(mapId);
  const dir = mapIdToDir(mapId);
  try {
    const m = JSON.parse(await fetchText(`${RAW}/data/maps/${dir}/map.json`));
    const l = layoutById.get(m.layout);
    if (!l) return null;
    const data = { ...m, w: l.width, h: l.height };
    mapCache.set(mapId, data);
    return data;
  } catch {
    mapCache.set(mapId, null);
    return null;
  }
}

let bad = 0;
for (const tr of trainers) {
  const map = await loadMap(tr.mapId);
  if (!map) continue;
  const origin = mapOrigin.get(tr.mapId);
  const isOverworld = Boolean(origin);
  const objectTrainers = (map.object_events ?? []).filter(
    (o) => o.trainer_type && o.trainer_type !== "TRAINER_TYPE_NONE",
  );

  let best = null;
  let bestDist = Infinity;
  for (const oe of objectTrainers) {
    const expected = isOverworld
      ? feetMapPct(origin.gx, origin.gy, oe.x, oe.y, manifest.wTiles, manifest.hTiles)
      : { x: +(((oe.x + 0.5) / map.w) * 100).toFixed(2), y: +(((oe.y + 1) / map.h) * 100).toFixed(2) };
    const dist = tileDistance(tr.x, tr.y, expected.x, expected.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = { oe, expected };
    }
  }

  if (!best || bestDist > 0.35) {
    bad++;
    console.log(
      `⚠ ${tr.name} (${tr.mapId}) stored ${tr.x},${tr.y} — nearest tile dist ${bestDist.toFixed(2)}`,
    );
  }
}

console.log(`\nAudited ${trainers.length} trainers — ${bad} mismatches (>0.35 tiles)`);
process.exit(bad > 0 ? 1 : 0);
