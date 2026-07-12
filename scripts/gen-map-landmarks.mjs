/**
 * Generate curated town / gym / landmark pins for the main Hoenn map from
 * pokeemerald + the composite manifest (same tile→% formula as other gens).
 *
 * - Towns: center of each outdoor city/town bbox on the composite
 * - Gyms: outdoor "Gym" warp entrance tiles
 * - Landmarks: known outdoor entrance warps (first matching name)
 *
 * Locations not on the outdoor composite stay hand-placed in mapPoints.ts
 * under APPROXIMATE_MAP_PIN_IDS.
 *
 * Usage: node scripts/gen-map-landmarks.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const MANIFEST = path.join(ROOT, ".calib/manifest.json");
const OUT = path.join(ROOT, "src/data/mapLandmarksGenerated.ts");

const TOWN_DEFS = [
  { id: "littleroot", mapName: "LittlerootTown", name: "Littleroot Town", note: "Your home town and Prof. Birch's lab.", stepId: "littleroot-1" },
  { id: "oldale", mapName: "OldaleTown", name: "Oldale Town", note: "First town north of home.", stepId: "oldale-1" },
  { id: "petalburg", mapName: "PetalburgCity", name: "Petalburg City", note: "Your father Norman's gym city.", stepId: "petalburg-1" },
  { id: "rustboro", mapName: "RustboroCity", name: "Rustboro City", note: "Devon Corporation & first gym.", stepId: "rustboro-1" },
  { id: "dewford", mapName: "DewfordTown", name: "Dewford Town", note: "Small island town, second gym.", stepId: "dewford-1" },
  { id: "slateport", mapName: "SlateportCity", name: "Slateport City", note: "Beachside market & shipyard.", stepId: "slateport-1" },
  { id: "mauville", mapName: "MauvilleCity", name: "Mauville City", note: "Central hub city, third gym.", stepId: "mauville-1" },
  { id: "verdanturf", mapName: "VerdanturfTown", name: "Verdanturf Town", note: "Clean-air resort west of Mauville.", stepId: "route-117-1" },
  { id: "fallarbor", mapName: "FallarborTown", name: "Fallarbor Town", note: "Northern farming town by the ash fields.", stepId: "fallarbor-1" },
  { id: "lavaridge", mapName: "LavaridgeTown", name: "Lavaridge Town", note: "Hot-spring town, fourth gym.", stepId: "lavaridge-1" },
  { id: "fortree", mapName: "FortreeCity", name: "Fortree City", note: "Treetop city, fifth gym.", stepId: "fortree-1" },
  { id: "lilycove", mapName: "LilycoveCity", name: "Lilycove City", note: "Department store & Contest Hall.", stepId: "lilycove-1" },
  { id: "mossdeep", mapName: "MossdeepCity", name: "Mossdeep City", note: "Island city with the Space Center.", stepId: "mossdeep-1" },
  { id: "pacifidlog", mapName: "PacifidlogTown", name: "Pacifidlog Town", note: "Floating town on the open sea.", stepId: "pacifidlog-1" },
  { id: "ever-grande", mapName: "EverGrandeCity", name: "Ever Grande City", note: "The Pokémon League plateau.", stepId: "victory-road-1" },
];

/** Gym pins keyed by the outdoor map's area label (destLabel note). */
const GYM_DEFS = [
  { id: "gym-rustboro", area: "Rustboro City", name: "Rustboro Gym — Roxanne (Rock)", stepId: "rustboro-2" },
  { id: "gym-dewford", area: "Dewford Town", name: "Dewford Gym — Brawly (Fighting)", stepId: "dewford-2" },
  { id: "gym-mauville", area: "Mauville City", name: "Mauville Gym — Wattson (Electric)", stepId: "mauville-2" },
  { id: "gym-lavaridge", area: "Lavaridge Town", name: "Lavaridge Gym — Flannery (Fire)", stepId: "lavaridge-2" },
  { id: "gym-petalburg", area: "Petalburg City", name: "Petalburg Gym — Norman (Normal)", stepId: "petalburg-gym-1" },
  { id: "gym-fortree", area: "Fortree City", name: "Fortree Gym — Winona (Flying)", stepId: "fortree-2" },
  { id: "gym-mossdeep", area: "Mossdeep City", name: "Mossdeep Gym — Tate & Liza (Psychic)", stepId: "mossdeep-1" },
];

/**
 * Landmark pins from outdoor entrance warps. `entranceName` must match
 * destLabel() output from gen-map-points (first match wins unless pick is set).
 */
const LANDMARK_DEFS = [
  {
    id: "petalburg-woods",
    entranceName: "Petalburg Woods",
    area: "Route 104",
    name: "Petalburg Woods",
    note: "Forest on Route 104; first Team encounter.",
    // Prefer the NW entrance used by the guide (lowest y, then lowest x).
    pick: (cands) => cands.sort((a, b) => a.y - b.y || a.x - b.x)[0],
  },
  {
    id: "weather-institute",
    entranceName: "Weather Institute",
    area: "Route 119",
    name: "Weather Institute",
    note: "Route 119 lab; receive Castform here.",
  },
  {
    id: "safari-zone",
    entranceName: "Safari Zone Entrance",
    area: "Route 121",
    name: "Safari Zone",
    note: "Route 121 preserve of rare Pokémon.",
    stepId: "safari-zone-1",
  },
  {
    id: "mt-pyre",
    entranceName: "Mt Pyre",
    area: "Route 122",
    name: "Mt. Pyre",
    note: "Memorial mountain; the orbs are stolen here.",
  },
  {
    id: "trick-house",
    entranceName: "Trick House Entrance",
    area: "Route 110",
    name: "Trick House",
    note: "Puzzle house on Route 110.",
  },
  {
    id: "abandoned-ship",
    entranceName: "Abandoned Ship Deck",
    area: "Route 108",
    name: "Abandoned Ship",
    note: "Wreck on Route 108; Dive & Scanner.",
    stepId: "abandoned-ship-1",
  },
  {
    id: "sky-pillar",
    entranceName: "Sky Pillar Entrance",
    area: "Route 131",
    name: "Sky Pillar",
    note: "Ancient tower where Rayquaza rests.",
  },
  {
    id: "pokemon-league",
    entranceName: "Pokémon League",
    area: "Ever Grande City",
    name: "Pokémon League",
    note: "Elite Four & Champion await at the top.",
  },
];

const round2 = (n) => Math.round(n * 100) / 100;

function areaName(mapName) {
  return mapName.replace(/([a-z])([A-Z0-9])/g, "$1 $2").replace(/Route(\d)/, "Route $1");
}

function destLabel(dest, curId) {
  let s = dest || "";
  if (curId && s.startsWith(curId + "_")) s = "MAP_" + s.slice(curId.length + 1);
  s = s.replace(/^MAP_/, "").replace(/_1F$|_2F$|_3F$|_B1F$|_B2F$|_1R$/, "");
  return s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Pokemon/i, "Pokémon")
    .replace(/Poke Mart/i, "Poké Mart");
}

function tileToMapPct(gx, gy, tx, ty, wTiles, hTiles) {
  return {
    x: round2(((gx + tx + 0.5) / wTiles) * 100),
    y: round2(((gy + ty + 0.5) / hTiles) * 100),
  };
}

function formatPoint(p) {
  const note = p.note != null ? `, note: ${JSON.stringify(p.note)}` : "";
  const step = p.stepId ? `, stepId: ${JSON.stringify(p.stepId)}` : "";
  return `  { id: ${JSON.stringify(p.id)}, name: ${JSON.stringify(p.name)}, category: ${JSON.stringify(p.category)}, x: ${p.x}, y: ${p.y}${note}${step} },`;
}

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error("Missing .calib/manifest.json");
    process.exit(1);
  }
  if (!fs.existsSync(REPO)) {
    console.error("Missing .calib/pokeemerald");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const { wTiles, hTiles } = manifest;
  const byName = new Map(manifest.maps.map((m) => [m.name, m]));

  const points = [];

  for (const def of TOWN_DEFS) {
    const meta = byName.get(def.mapName);
    if (!meta) {
      console.error(`Town map ${def.mapName} missing from outdoor composite`);
      process.exit(1);
    }
    const x = round2(((meta.gx + meta.w / 2) / wTiles) * 100);
    const y = round2(((meta.gy + meta.h / 2) / hTiles) * 100);
    points.push({
      id: def.id,
      name: def.name,
      category: "town",
      x,
      y,
      note: def.note,
      stepId: def.stepId,
    });
    console.log(`town ${def.id}: ${x}, ${y}`);
  }

  // Collect outdoor Gym + landmark entrance candidates from maps on the composite.
  const gymCands = [];
  const landmarkCands = new Map(); // entranceName -> [{x,y,area}]
  for (const meta of manifest.maps) {
    const mapPath = path.join(REPO, "data/maps", meta.name, "map.json");
    if (!fs.existsSync(mapPath)) continue;
    const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
    const area = areaName(meta.name);
    for (const w of map.warp_events || []) {
      const label = destLabel(w.dest_map, meta.id) || "Entrance";
      const pct = tileToMapPct(meta.gx, meta.gy, w.x, w.y, wTiles, hTiles);
      if (label === "Gym") {
        gymCands.push({ ...pct, area });
      }
      if (!landmarkCands.has(label)) landmarkCands.set(label, []);
      landmarkCands.get(label).push({ ...pct, area });
    }
  }

  for (const def of GYM_DEFS) {
    const hit = gymCands.find((g) => g.area === def.area);
    if (!hit) {
      console.error(`No Gym entrance found for ${def.area}`);
      process.exit(1);
    }
    points.push({
      id: def.id,
      name: def.name,
      category: "gym",
      x: hit.x,
      y: hit.y,
      stepId: def.stepId,
    });
    console.log(`gym ${def.id}: ${hit.x}, ${hit.y}`);
  }

  for (const def of LANDMARK_DEFS) {
    let cands = landmarkCands.get(def.entranceName) || [];
    if (def.area) cands = cands.filter((c) => c.area === def.area);
    if (!cands.length) {
      console.error(`No entrance "${def.entranceName}" found${def.area ? ` on ${def.area}` : ""}`);
      process.exit(1);
    }
    const hit = def.pick ? def.pick(cands) : cands[0];
    points.push({
      id: def.id,
      name: def.name,
      category: "landmark",
      x: hit.x,
      y: hit.y,
      note: def.note,
      stepId: def.stepId,
    });
    console.log(`landmark ${def.id}: ${hit.x}, ${hit.y}`);
  }

  const lines = [];
  lines.push("// AUTO-GENERATED by scripts/gen-map-landmarks.mjs — do not edit by hand.");
  lines.push("// Towns = composite bbox centers; gyms/landmarks = outdoor entrance warps.");
  lines.push('import type { MapPoint } from "./mapPoints";');
  lines.push("");
  lines.push("export const LANDMARK_PINS_GENERATED: MapPoint[] = [");
  for (const p of points) lines.push(formatPoint(p));
  lines.push("];");
  lines.push("");
  fs.writeFileSync(OUT, lines.join("\n"));
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${points.length} pins)`);
}

main();
