/**
 * Generate src/data/mapCrops.ts from the true-scale composite manifest.
 *
 * The Hoenn overworld map (public/maps/hoenn-map.png) was composited from
 * pokeemerald tile data at 16px per game tile. `.calib/manifest.json` records
 * every connected outdoor map's tile origin (gx, gy) and size (w, h) on that
 * composite (wTiles x hTiles). That lets us describe the exact rectangle of the
 * big map that shows any town or route as a percentage box, which the UI uses
 * to render a "window" into the shared map image for each walkthrough event.
 *
 * Interiors / caves / gyms are warp-connected and therefore not part of the
 * outdoor composite, so they are simply absent here and keep their per-event
 * renders.
 *
 * Run: node scripts/gen-map-crops.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, ".calib/manifest.json"), "utf8"));
const events = JSON.parse(fs.readFileSync(path.join(ROOT, ".calib/event-map.json"), "utf8"));
const markerTiles = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/marker-tiles.json"), "utf8"));

const W_TILES = manifest.wTiles;
const H_TILES = manifest.hTiles;
const MAP_W = W_TILES * 16;
const MAP_H = H_TILES * 16;

/** Tiles of surrounding context to include around each map. */
const PAD = 2;

/** Walkthrough chapter id → outdoor areaId (when chapter id ≠ area id). */
const CHAPTER_TO_AREA = {
  "petalburg-gym": "petalburg",
  "sootopolis-gym": "sootopolis",
  league: "ever-grande",
  "seafloor-cavern": "route-128",
  "magma-hideout": "route-112",
  "mt-pyre": "route-122",
  "sealed-chamber": "route-124",
  "victory-road": "ever-grande",
};

/** Landmarks / areas not in the outdoor composite — crop around map point %. */
const MANUAL_AREA_CROPS = {
  sootopolis: { x: 72.5, y: 42.5, w: 8, h: 14, caption: "Sootopolis City" },
  "sky-pillar": { x: 62.5, y: 62.5, w: 12, h: 18, caption: "Sky Pillar" },
  "mt-chimney": { x: 17.5, y: 0, w: 10, h: 18, caption: "Mt. Chimney" },
  "battle-frontier": { x: 86, y: 82, w: 14, h: 18, caption: "Battle Frontier" },
  "marine-cave": { x: 84, y: 56, w: 10, h: 14, caption: "Marine Cave" },
  "fiery-path": { x: 19, y: 10, w: 6, h: 10, caption: "Fiery Path" },
  "safari-zone": { x: 51, y: 18, w: 10, h: 12, caption: "Safari Zone" },
  "sealed-chamber": { x: 54, y: 52, w: 12, h: 14, caption: "Sealed Chamber approach" },
};

/** Convert pokeemerald MAP_* id to guide areaId slug. */
function mapIdToAreaId(mapId) {
  const raw = mapId.replace(/^MAP_/, "");
  if (raw.startsWith("ROUTE")) {
    return `route-${raw.slice(5).toLowerCase()}`;
  }
  if (raw.endsWith("_TOWN") || raw.endsWith("_CITY")) {
    return raw
      .replace(/_TOWN$/, "")
      .replace(/_CITY$/, "")
      .toLowerCase()
      .replace(/_/g, "-");
  }
  return raw.toLowerCase().replace(/_/g, "-");
}

const round = (n) => Math.round(n * 10000) / 10000;

/** Tile center on the composite → full-map percentage (matches mapPointsGenerated). */
function tileToMapPct(gx, gy, tx, ty) {
  return {
    x: round(((gx + tx + 0.5) / W_TILES) * 100),
    y: round(((gy + ty + 0.5) / H_TILES) * 100),
  };
}

/** mapId -> percentage crop box on the composite (with padding, clamped). */
const cropByMap = new Map();
for (const m of manifest.maps) {
  const gx = Math.max(0, m.gx - PAD);
  const gy = Math.max(0, m.gy - PAD);
  const gx2 = Math.min(W_TILES, m.gx + m.w + PAD);
  const gy2 = Math.min(H_TILES, m.gy + m.h + PAD);
  cropByMap.set(m.id, {
    x: round((gx / W_TILES) * 100),
    y: round((gy / H_TILES) * 100),
    w: round(((gx2 - gx) / W_TILES) * 100),
    h: round(((gy2 - gy) / H_TILES) * 100),
  });
}

/** Join events to crops; only events on the outdoor composite get one. */
const eventEntries = [];
const missing = [];
for (const ev of events) {
  const crop = cropByMap.get(ev.mapId);
  if (!crop) {
    missing.push(ev.id);
    continue;
  }
  eventEntries.push({ id: ev.id, caption: ev.caption, areaId: ev.areaId, crop });
}

/** areaId -> primary outdoor map id (from event-map). */
const areaMapId = {};
for (const ev of events) {
  if (ev.areaId && !areaMapId[ev.areaId]) areaMapId[ev.areaId] = ev.mapId;
}

/** areaId -> exact map bounds on the composite (no padding) for marker alignment. */
const areaBounds = {};
/** areaId -> note labels used in mapPointsGenerated for filtering POIs. */
const areaNoteLabels = {};
const mapById = new Map(manifest.maps.map((m) => [m.id, m]));

function mapNameToLabel(name) {
  return name.replace(/Route(\d+)/, "Route $1").replace(/([a-z])([A-Z])/g, "$1 $2");
}

for (const [areaId, mapId] of Object.entries(areaMapId)) {
  const m = mapById.get(mapId);
  if (!m) continue;
  areaBounds[areaId] = {
    x: round((m.gx / W_TILES) * 100),
    y: round((m.gy / H_TILES) * 100),
    w: round((m.w / W_TILES) * 100),
    h: round((m.h / H_TILES) * 100),
  };
  areaNoteLabels[areaId] = [mapNameToLabel(m.name)];
}

// Every connected outdoor map on the composite → areaId, bounds, and note labels.
for (const m of manifest.maps) {
  const areaId = mapIdToAreaId(m.id);
  if (!areaBounds[areaId]) {
    areaBounds[areaId] = {
      x: round((m.gx / W_TILES) * 100),
      y: round((m.gy / H_TILES) * 100),
      w: round((m.w / W_TILES) * 100),
      h: round((m.h / H_TILES) * 100),
    };
    areaNoteLabels[areaId] = [mapNameToLabel(m.name)];
  }
}

/** Padded crop for an area (walkthrough windows). */
function paddedCropForBounds(b) {
  const gx = Math.max(0, (b.x / 100) * W_TILES - PAD);
  const gy = Math.max(0, (b.y / 100) * H_TILES - PAD);
  const gx2 = Math.min(W_TILES, (b.x / 100) * W_TILES + (b.w / 100) * W_TILES + PAD);
  const gy2 = Math.min(H_TILES, (b.y / 100) * H_TILES + (b.h / 100) * H_TILES + PAD);
  return {
    x: round((gx / W_TILES) * 100),
    y: round((gy / H_TILES) * 100),
    w: round(((gx2 - gx) / W_TILES) * 100),
    h: round(((gy2 - gy) / H_TILES) * 100),
  };
}

/** areaId → padded crop + caption for any outdoor location. */
const areaMapCrop = {};
for (const [areaId, bounds] of Object.entries(areaBounds)) {
  const labels = areaNoteLabels[areaId];
  areaMapCrop[areaId] = {
    crop: paddedCropForBounds(bounds),
    caption: labels?.[0] ?? areaId.replace(/-/g, " "),
    areaId,
  };
}
for (const [areaId, manual] of Object.entries(MANUAL_AREA_CROPS)) {
  const { caption, ...crop } = manual;
  areaMapCrop[areaId] = { crop, caption, areaId };
  if (!areaBounds[areaId]) areaBounds[areaId] = crop;
  if (!areaNoteLabels[areaId]) areaNoteLabels[areaId] = [caption];
}

/** Walkthrough chapter id → default outdoor crop when a step has no event-specific crop. */
const chapterMapCrop = {};
for (const [chapterId, areaId] of Object.entries(CHAPTER_TO_AREA)) {
  if (areaMapCrop[areaId]) chapterMapCrop[chapterId] = { ...areaMapCrop[areaId] };
}
for (const areaId of Object.keys(areaMapCrop)) {
  if (!chapterMapCrop[areaId] && areaMapCrop[areaId]) {
    chapterMapCrop[areaId] = { ...areaMapCrop[areaId] };
  }
}

/** areaId → markerId → full-map % position from pret tile coords (pixel-perfect on composite). */
const markerMapPos = {};
const areaToMapId = { ...areaMapId };
for (const m of manifest.maps) {
  const aid = mapIdToAreaId(m.id);
  if (!areaToMapId[aid]) areaToMapId[aid] = m.id;
}
for (const [areaId, markers] of Object.entries(markerTiles)) {
  if (areaId.startsWith("_")) continue;
  const mapId = areaToMapId[areaId];
  const m = mapById.get(mapId);
  if (!m) continue;
  markerMapPos[areaId] = {};
  for (const [markerId, tile] of Object.entries(markers)) {
    const [tx, ty] = tile;
    markerMapPos[areaId][markerId] = tileToMapPct(m.gx, m.gy, tx, ty);
  }
}

const fmtCrop = (c) => `{ x: ${c.x}, y: ${c.y}, w: ${c.w}, h: ${c.h} }`;

const lines = [];
lines.push("// AUTO-GENERATED by scripts/gen-map-crops.mjs — do not edit by hand.");
lines.push("// Rectangles of the true-scale Hoenn map (public/maps/hoenn-map.png) that");
lines.push("// frame each outdoor town/route, so the walkthrough can show a window into");
lines.push("// the shared big map instead of separate per-event images.");
lines.push("");
lines.push("export interface MapCrop {");
lines.push("  /** Left edge as a percentage (0–100) of the full map width. */");
lines.push("  x: number;");
lines.push("  /** Top edge as a percentage (0–100) of the full map height. */");
lines.push("  y: number;");
lines.push("  /** Width as a percentage (0–100) of the full map width. */");
lines.push("  w: number;");
lines.push("  /** Height as a percentage (0–100) of the full map height. */");
lines.push("  h: number;");
lines.push("}");
lines.push("");
lines.push(`export const HOENN_MAP_W = ${MAP_W};`);
lines.push(`export const HOENN_MAP_H = ${MAP_H};`);
lines.push("");
lines.push("export interface EventMapCrop {");
lines.push("  crop: MapCrop;");
lines.push("  caption: string;");
lines.push("  areaId?: string;");
lines.push("}");
lines.push("");
lines.push("/** Walkthrough event id -> its window into the big Hoenn map. */");
lines.push("export const EVENT_MAP_CROP: Record<string, EventMapCrop> = {");
for (const e of eventEntries) {
  const areaId = e.areaId ? `, areaId: ${JSON.stringify(e.areaId)}` : "";
  lines.push(`  ${JSON.stringify(e.id)}: { crop: ${fmtCrop(e.crop)}, caption: ${JSON.stringify(e.caption)}${areaId} },`);
}
lines.push("};");
lines.push("");
lines.push("/** Outdoor areaId → padded window into the Hoenn composite map. */");
lines.push("export const AREA_MAP_CROP: Record<string, EventMapCrop> = {");
for (const [areaId, entry] of Object.entries(areaMapCrop).sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(
    `  ${JSON.stringify(areaId)}: { crop: ${fmtCrop(entry.crop)}, caption: ${JSON.stringify(entry.caption)}, areaId: ${JSON.stringify(entry.areaId)} },`,
  );
}
lines.push("};");
lines.push("");
lines.push("/** Walkthrough chapter id → default outdoor crop for that chapter. */");
lines.push("export const CHAPTER_MAP_CROP: Record<string, EventMapCrop> = {");
for (const [chapterId, entry] of Object.entries(chapterMapCrop).sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(
    `  ${JSON.stringify(chapterId)}: { crop: ${fmtCrop(entry.crop)}, caption: ${JSON.stringify(entry.caption)}, areaId: ${JSON.stringify(entry.areaId)} },`,
  );
}
lines.push("};");
lines.push("");
lines.push("/** Exact composite bounds per areaId (no padding) — used to place markers. */");
lines.push("export const AREA_MAP_BOUNDS: Record<string, MapCrop> = {");
for (const [areaId, b] of Object.entries(areaBounds)) {
  lines.push(`  ${JSON.stringify(areaId)}: ${fmtCrop(b)},`);
}
lines.push("};");
lines.push("");
lines.push("/** Note labels in mapPointsGenerated that belong to each areaId. */");
lines.push("export const AREA_NOTE_LABELS: Record<string, string[]> = {");
for (const [areaId, labels] of Object.entries(areaNoteLabels)) {
  lines.push(`  ${JSON.stringify(areaId)}: ${JSON.stringify(labels)},`);
}
lines.push("};");
lines.push("");
lines.push("/** Marker id → position on the full Hoenn map (from pret tile coords). */");
lines.push("export const AREA_MARKER_MAP_POS: Record<string, Record<string, { x: number; y: number }>> = {");
for (const [areaId, markers] of Object.entries(markerMapPos)) {
  lines.push(`  ${JSON.stringify(areaId)}: {`);
  for (const [markerId, pos] of Object.entries(markers)) {
    lines.push(`    ${JSON.stringify(markerId)}: { x: ${pos.x}, y: ${pos.y} },`);
  }
  lines.push("  },");
}
lines.push("};");
lines.push("");

// ── Route labels for the main Hoenn overworld map ──
const walkthroughSrc = fs.readFileSync(path.join(ROOT, "src/data/walkthrough.ts"), "utf8");
const walkthroughRoutes = new Set(
  [...walkthroughSrc.matchAll(/^\s+id: "(route-\d+)"/gm)].map((m) => m[1]),
);

/** One labeled pin per outdoor route map on the composite (Routes 101–134). */
const routePoints = [];
for (const m of manifest.maps) {
  if (!m.id.startsWith("MAP_ROUTE")) continue;
  const areaId = mapIdToAreaId(m.id);
  const bounds = areaBounds[areaId];
  if (!bounds) continue;
  const label = mapNameToLabel(m.name);
  const entry = {
    id: areaId,
    name: label,
    category: "route",
    x: round(bounds.x + bounds.w / 2),
    y: round(bounds.y + bounds.h / 2),
    ...(walkthroughRoutes.has(areaId) ? { stepId: `${areaId}-1` } : {}),
  };
  routePoints.push(entry);
}
routePoints.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const routeLines = [];
routeLines.push("// AUTO-GENERATED by scripts/gen-map-crops.mjs — do not edit by hand.");
routeLines.push("// Labeled route pins for the main Hoenn overworld map (center of each route's tile bounds).");
routeLines.push("");
routeLines.push('import type { MapPoint } from "./mapPoints";');
routeLines.push("");
routeLines.push("export const ROUTE_POINTS: MapPoint[] = [");
for (const p of routePoints) {
  const step = p.stepId ? `, stepId: ${JSON.stringify(p.stepId)}` : "";
  routeLines.push(
    `  { id: ${JSON.stringify(p.id)}, name: ${JSON.stringify(p.name)}, category: "route", x: ${p.x}, y: ${p.y}${step} },`,
  );
}
routeLines.push("];");
routeLines.push("");

fs.writeFileSync(path.join(ROOT, "src/data/mapRoutesGenerated.ts"), routeLines.join("\n"));

fs.writeFileSync(path.join(ROOT, "src/data/mapCrops.ts"), lines.join("\n"));

console.log(`Wrote src/data/mapCrops.ts`);
console.log(`Wrote src/data/mapRoutesGenerated.ts (${routePoints.length} routes)`);
console.log(`  composite: ${MAP_W}x${MAP_H}px (${W_TILES}x${H_TILES} tiles)`);
console.log(`  outdoor crops: ${eventEntries.length} events`);
console.log(`  area crops: ${Object.keys(areaMapCrop).length}`);
console.log(`  chapter crops: ${Object.keys(chapterMapCrop).length}`);
console.log(`  interior/other (area maps): ${missing.length} events -> ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""}`);
