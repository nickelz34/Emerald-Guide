/**
 * Points of interest for the interactive Hoenn map.
 *
 * Coordinates are percentages (0–100) measured against the overworld map image
 * at public/maps/hoenn-map.png (1024×539). Only locations that are visible on
 * the overworld are included — building interiors are intentionally omitted.
 */

export type PoiCategory =
  | "town"
  | "route"
  | "gym"
  | "landmark"
  | "item"
  | "hidden"
  | "berry"
  | "entrance"
  | "shop"
  | "trainer"
  | "npc"
  | "wild";

export interface PoiCategoryMeta {
  id: PoiCategory;
  label: string;
  /** Marker fill color. */
  color: string;
}

export const POI_CATEGORIES: PoiCategoryMeta[] = [
  { id: "town", label: "Towns & Cities", color: "#f5b942" },
  { id: "route", label: "Routes", color: "#5ec4e8" },
  { id: "gym", label: "Gyms", color: "#e0553b" },
  { id: "landmark", label: "Landmarks", color: "#39c07a" },
  { id: "item", label: "Items", color: "#3b9dff" },
  { id: "hidden", label: "Hidden Items", color: "#c9d2df" },
  { id: "berry", label: "Berries", color: "#ff5fa8" },
  { id: "entrance", label: "Entrances", color: "#7d8aa0" },
  { id: "shop", label: "Shops", color: "#4fd1c5" },
  { id: "trainer", label: "Trainers", color: "#f56565" },
  { id: "npc", label: "NPCs", color: "#63b3ed" },
  { id: "wild", label: "Wild encounters", color: "#48bb78" },
];

/** Categories shown by default on the main Hoenn map. */
export const DEFAULT_VISIBLE_CATEGORIES: PoiCategory[] = ["town", "route", "shop"];

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
  { id: "mart-sootopolis", name: "Mart", category: "shop", x: 74.2, y: 45.8, note: "Sootopolis City" },
  { id: "shop-slateport-market", name: "Market", category: "shop", x: 27.1, y: 77.4, note: "Slateport City" },
  { id: "shop-battle-frontier-mart", name: "Mart", category: "shop", x: 91.2, y: 88.8, note: "Battle Frontier" },
  { id: "shop-pokemon-league-mart", name: "Mart", category: "shop", x: 96.4, y: 49.6, note: "Pokémon League" },
  { id: "pacifidlog", name: "Pacifidlog Town", category: "town", x: 61.25, y: 73.11, note: "Floating town on the open sea.", stepId: "pacifidlog-1" },
  { id: "ever-grande", name: "Ever Grande City", category: "town", x: 97.5, y: 57.44, note: "The Pokémon League plateau.", stepId: "victory-road-1" },

  // ── Gyms (offset slightly from their city so both layers stay visible) ──
  { id: "gym-rustboro", name: "Rustboro Gym — Roxanne (Rock)", category: "gym", x: 3.44, y: 36.95, stepId: "rustboro-2" },
  { id: "gym-dewford", name: "Dewford Gym — Brawly (Fighting)", category: "gym", x: 8.56, y: 99.09, stepId: "dewford-2" },
  { id: "gym-mauville", name: "Mauville Gym — Wattson (Electric)", category: "gym", x: 26.06, y: 37.99, stepId: "mauville-2" },
  { id: "gym-lavaridge", name: "Lavaridge Gym — Flannery (Fire)", category: "gym", x: 18.19, y: 19.71, stepId: "lavaridge-2" },
  { id: "gym-petalburg", name: "Petalburg Gym — Norman (Normal)", category: "gym", x: 6.94, y: 62.79, stepId: "petalburg-gym-1" },
  { id: "gym-fortree", name: "Fortree Gym — Winona (Flying)", category: "gym", x: 42.81, y: 3, stepId: "fortree-2" },
  { id: "gym-mossdeep", name: "Mossdeep Gym — Tate & Liza (Psychic)", category: "gym", x: 84.81, y: 28.59, stepId: "mossdeep-1" },
  { id: "gym-sootopolis", name: "Sootopolis Gym — Wallace (Water)", category: "gym", x: 75, y: 48.2, stepId: "sootopolis-gym-2" },

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

/** Walkthrough step links for generated entrance pins (from mapPointsGenerated). */
export const ENTRANCE_STEP_IDS: Record<string, string> = {
  en378: "shoal-cave-1",
};
