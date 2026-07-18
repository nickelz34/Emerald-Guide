/**
 * Points of interest for the interactive Hoenn map.
 *
 * Coordinates are percentages (0–100) on public/maps/hoenn-map.png
 * (12800×6128 px = 800×383 tiles at 16px). Curated towns/gyms/landmarks and
 * outdoor POIs are generated — only approximate pins (not on the outdoor
 * composite) live in MAP_POINTS below.
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
export const DEFAULT_VISIBLE_CATEGORIES: PoiCategory[] = ["town", "route"];

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
  /** Shared A/B/C code for dungeon connectors paired across floors. */
  pinCode?: string;
  /**
   * Marker rendering mode. `"tile"` draws a map-tile-sized overlay (used for
   * Feebas fishing spots) instead of a category pin glyph.
   */
  markerStyle?: "pin" | "tile";
  /** Tile overlay width as a percent of the map image (markerStyle `"tile"`). */
  tileW?: number;
  /** Tile overlay height as a percent of the map image (markerStyle `"tile"`). */
  tileH?: number;
  /** Optional overworld / object-event sprite sheet (cutscene & NPC pins). */
  spriteSheet?: string;
  spriteWidth?: number;
  spriteHeight?: number;
  spriteFrame?: number;
  /** Horizontal flip when the sheet only stores west-facing frames. */
  spriteFlipX?: boolean;
}

/**
 * Hand-placed pins that cannot be derived from the outdoor composite
 * (Sootopolis / Battle Frontier / Mt. Chimney / League lobby are not on
 * the rendered Hoenn overworld atlas, or the shop is indoors).
 *
 * Everything else must come from:
 *   - mapLandmarksGenerated.ts (towns, gyms, landmarks)
 *   - mapPointsGenerated.ts (items, berries, hidden, entrances)
 *   - shopPinsGenerated.ts (outdoor non-entrance shops)
 *   - mapRoutesGenerated.ts (route centers)
 *   - mapTrainersGenerated.ts (trainers)
 */
export const MAP_POINTS: MapPoint[] = [
  { id: "sootopolis", name: "Sootopolis City", category: "town", x: 75, y: 47, note: "Hidden crater city, eighth gym.", stepId: "sootopolis-1" },
  { id: "gym-sootopolis", name: "Sootopolis Gym — Wallace (Water)", category: "gym", x: 75, y: 48.2, stepId: "sootopolis-gym-2" },
  { id: "mart-sootopolis", name: "Mart", category: "shop", x: 74.2, y: 45.8, note: "Sootopolis City" },
  { id: "mt-chimney", name: "Mt. Chimney", category: "landmark", x: 21, y: 12.5, note: "Volcano summit; cable car & meteorite showdown." },
  { id: "battle-frontier", name: "Battle Frontier", category: "landmark", x: 92, y: 90, note: "Post-game battle facilities island." },
  { id: "shop-battle-frontier-mart", name: "Mart", category: "shop", x: 91.2, y: 88.8, note: "Battle Frontier" },
  { id: "shop-pokemon-league-mart", name: "Mart", category: "shop", x: 96.4, y: 49.6, note: "Pokémon League" },
];

/** Every hand pin in MAP_POINTS must be listed here (enforced by verify:map-pins). */
export const APPROXIMATE_MAP_PIN_IDS = [
  "sootopolis",
  "gym-sootopolis",
  "mart-sootopolis",
  "mt-chimney",
  "battle-frontier",
  "shop-battle-frontier-mart",
  "shop-pokemon-league-mart",
] as const;

/**
 * Hand-placed shop pins that cannot be derived from the outdoor composite.
 * Subset of APPROXIMATE_MAP_PIN_IDS; verify:shop-pins also checks this list.
 */
export const APPROXIMATE_SHOP_PIN_IDS = [
  "mart-sootopolis",
  "shop-battle-frontier-mart",
  "shop-pokemon-league-mart",
] as const;

/** Walkthrough step links for generated entrance pins (from mapPointsGenerated). */
export const ENTRANCE_STEP_IDS: Record<string, string> = {
  en378: "shoal-cave-1",
};
