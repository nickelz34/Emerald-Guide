/**
 * Points of interest for the interactive Hoenn map.
 *
 * Coordinates are percentages (0–100) measured against the overworld map image
 * at public/maps/hoenn-map.png (1024×539). Only locations that are visible on
 * the overworld are included — building interiors are intentionally omitted.
 */

export type PoiCategory =
  | "town"
  | "gym"
  | "cave"
  | "landmark"
  | "item"
  | "hidden"
  | "berry"
  | "entrance";

export interface PoiCategoryMeta {
  id: PoiCategory;
  label: string;
  /** Marker fill color. */
  color: string;
}

export const POI_CATEGORIES: PoiCategoryMeta[] = [
  { id: "town", label: "Towns & Cities", color: "#f5b942" },
  { id: "gym", label: "Gyms", color: "#e0553b" },
  { id: "cave", label: "Caves & Dungeons", color: "#9b6bd6" },
  { id: "landmark", label: "Landmarks", color: "#39c07a" },
  { id: "item", label: "Items", color: "#3b9dff" },
  { id: "hidden", label: "Hidden Items", color: "#c9d2df" },
  { id: "berry", label: "Berries", color: "#ff5fa8" },
  { id: "entrance", label: "Entrances", color: "#7d8aa0" },
];

/** Categories shown by default; only towns & cities start visible. */
export const DEFAULT_VISIBLE_CATEGORIES: PoiCategory[] = ["town"];

export interface MapPoint {
  id: string;
  name: string;
  category: PoiCategory;
  /** Percent position on the map image (0–100). */
  x: number;
  y: number;
  note?: string;
  /** What the item does / extra info (shown in marker popups and the list). */
  desc?: string;
  /** Walkthrough step to jump to when the marker is opened. */
  stepId?: string;
}

export const MAP_POINTS: MapPoint[] = [
  // ── Towns & Cities ──
  { id: "littleroot", name: "Littleroot Town", category: "town", x: 16.25, y: 76.24, note: "Your home town and Prof. Birch's lab.", stepId: "littleroot-1" },
  { id: "oldale", name: "Oldale Town", category: "town", x: 16.25, y: 65.8, note: "First town north of home.", stepId: "oldale-1" },
  { id: "petalburg", name: "Petalburg City", category: "town", x: 6.88, y: 64.49, note: "Your father Norman's gym city.", stepId: "petalburg-1" },
  { id: "rustboro", name: "Rustboro City", category: "town", x: 2.5, y: 39.69, note: "Devon Corporation & first gym.", stepId: "rustboro-1" },
  { id: "dewford", name: "Dewford Town", category: "town", x: 8.75, y: 97.13, note: "Small island town, second gym.", stepId: "dewford-1" },
  { id: "slateport", name: "Slateport City", category: "town", x: 27.5, y: 75.72, note: "Beachside market & shipyard.", stepId: "slateport-1" },
  { id: "mauville", name: "Mauville City", category: "town", x: 27.5, y: 39.16, note: "Central hub city, third gym.", stepId: "mauville-1" },
  { id: "verdanturf", name: "Verdanturf Town", category: "town", x: 16.25, y: 39.16, note: "Clean-air resort west of Mauville.", stepId: "route-117-1" },
  { id: "fallarbor", name: "Fallarbor Town", category: "town", x: 11.25, y: 2.61, note: "Northern farming town by the ash fields.", stepId: "fallarbor-1" },
  { id: "lavaridge", name: "Lavaridge Town", category: "town", x: 18.75, y: 18.28, note: "Hot-spring town, fourth gym.", stepId: "lavaridge-1" },
  { id: "fortree", name: "Fortree City", category: "town", x: 42.5, y: 2.61, note: "Treetop city, fifth gym.", stepId: "fortree-1" },
  { id: "lilycove", name: "Lilycove City", category: "town", x: 65, y: 23.5, note: "Department store & Contest Hall.", stepId: "lilycove-1" },
  { id: "mossdeep", name: "Mossdeep City", category: "town", x: 85, y: 31.33, note: "Island city with the Space Center.", stepId: "mossdeep-1" },
  { id: "sootopolis", name: "Sootopolis City", category: "town", x: 75, y: 47, note: "Hidden crater city, eighth gym.", stepId: "sootopolis-1" },
  { id: "pacifidlog", name: "Pacifidlog Town", category: "town", x: 61.25, y: 73.11, note: "Floating town on the open sea.", stepId: "pacifidlog-1" },
  { id: "ever-grande", name: "Ever Grande City", category: "town", x: 97.5, y: 57.44, note: "The Pokémon League plateau.", stepId: "victory-road-1" },

  // ── Gyms (offset slightly from their city so both layers stay visible) ──
  { id: "gym-rustboro", name: "Rustboro Gym — Roxanne (Rock)", category: "gym", x: 3.44, y: 36.95, stepId: "rustboro-1" },
  { id: "gym-dewford", name: "Dewford Gym — Brawly (Fighting)", category: "gym", x: 8.56, y: 99.09, stepId: "dewford-1" },
  { id: "gym-mauville", name: "Mauville Gym — Wattson (Electric)", category: "gym", x: 26.06, y: 37.99, stepId: "mauville-1" },
  { id: "gym-lavaridge", name: "Lavaridge Gym — Flannery (Fire)", category: "gym", x: 18.19, y: 19.71, stepId: "lavaridge-1" },
  { id: "gym-petalburg", name: "Petalburg Gym — Norman (Normal)", category: "gym", x: 6.94, y: 62.79, stepId: "petalburg-1" },
  { id: "gym-fortree", name: "Fortree Gym — Winona (Flying)", category: "gym", x: 42.81, y: 3, stepId: "fortree-1" },
  { id: "gym-mossdeep", name: "Mossdeep Gym — Tate & Liza (Psychic)", category: "gym", x: 84.81, y: 28.59, stepId: "mossdeep-1" },
  { id: "gym-sootopolis", name: "Sootopolis Gym — Juan (Water)", category: "gym", x: 75, y: 48.2, stepId: "sootopolis-1" },

  // ── Caves & Dungeons ──
  { id: "meteor-falls", name: "Meteor Falls", category: "cave", x: 3.44, y: 20.76, note: "Waterfall cave; Bagon & TM lie deep inside." },
  { id: "rusturf-tunnel", name: "Rusturf Tunnel", category: "cave", x: 16.06, y: 36.95, note: "Short tunnel linking Route 116 to Verdanturf." },
  { id: "granite-cave", name: "Granite Cave", category: "cave", x: 6.06, y: 93.6, note: "Steven's letter, TM Rock Tomb & HM Flash." },
  { id: "jagged-pass", name: "Jagged Pass", category: "cave", x: 20.81, y: 17.36, note: "Rocky slope down from Mt. Chimney." },
  { id: "fiery-path", name: "Fiery Path", category: "cave", x: 21.44, y: 14.75, note: "Volcanic cave with Fire-types & TM Toxic." },
  { id: "scorched-slab", name: "Scorched Slab", category: "cave", x: 47.44, y: 6.14, note: "Route 120 cave holding TM Sunny Day." },
  { id: "cave-of-origin", name: "Cave of Origin", category: "cave", x: 75, y: 45.2, note: "Where the awakened legendary is confronted." },
  { id: "new-mauville", name: "New Mauville", category: "cave", x: 29.44, y: 48.17, note: "Underground generator beneath Route 110." },
  { id: "seafloor-cavern", name: "Seafloor Cavern", category: "cave", x: 87.5, y: 62.66, note: "Team hideout deep under Route 128." },
  { id: "shoal-cave", name: "Shoal Cave", category: "cave", x: 82.81, y: 20.76, note: "Tide-changing cave; Shell Bell ingredients.", stepId: "shoal-cave-1" },
  { id: "victory-road", name: "Victory Road", category: "cave", x: 97.31, y: 57.83, note: "Final gauntlet before the League." },

  // ── Landmarks ──
  { id: "mt-chimney", name: "Mt. Chimney", category: "landmark", x: 21, y: 12.5, note: "Volcano summit; cable car & meteorite showdown." },
  { id: "petalburg-woods", name: "Petalburg Woods", category: "landmark", x: 1.31, y: 55.48, note: "Forest on Route 104; first Team encounter." },
  { id: "weather-institute", name: "Weather Institute", category: "landmark", x: 35.81, y: 8.49, note: "Route 119 lab; receive Castform here." },
  { id: "safari-zone", name: "Safari Zone", category: "landmark", x: 54.69, y: 22.32, note: "Route 121 preserve of rare Pokémon.", stepId: "safari-zone-1" },
  { id: "mt-pyre", name: "Mt. Pyre", category: "landmark", x: 55.31, y: 33.81, note: "Memorial mountain; the orbs are stolen here." },
  { id: "trick-house", name: "Trick House", category: "landmark", x: 26.44, y: 59.14, note: "Puzzle house on Route 110." },
  { id: "abandoned-ship", name: "Abandoned Ship", category: "landmark", x: 21.19, y: 95.69, note: "Wreck on Route 108; Dive & Scanner.", stepId: "abandoned-ship-1" },
  { id: "sky-pillar", name: "Sky Pillar", category: "landmark", x: 67.06, y: 69.58, note: "Ancient tower where Rayquaza rests." },
  { id: "pokemon-league", name: "Pokémon League", category: "landmark", x: 97.31, y: 48.43, note: "Elite Four & Champion await at the top." },
  { id: "battle-frontier", name: "Battle Frontier", category: "landmark", x: 92, y: 90, note: "Post-game battle facilities island." },
];
