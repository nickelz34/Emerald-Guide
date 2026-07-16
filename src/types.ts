export type GuideCategory = "walkthrough" | "pokedex";

export type TimeSlot = "morning" | "day" | "night" | "any";

export type EncounterMethod =
  | "grass"
  | "surf"
  | "old-rod"
  | "good-rod"
  | "super-rod"
  | "rock-smash"
  | "cave";

export interface PokemonEncounter {
  name: string;
  level: string;
  time: TimeSlot;
  method: EncounterMethod;
  rate?: string;
  notes?: string;
}

export const TIME_LABELS: Record<TimeSlot, string> = {
  morning: "Morning",
  day: "Day",
  night: "Night",
  any: "Any",
};

export const METHOD_LABELS: Record<EncounterMethod, string> = {
  grass: "Grass",
  surf: "Surf",
  "old-rod": "Old Rod",
  "good-rod": "Good Rod",
  "super-rod": "Super Rod",
  "rock-smash": "Rock Smash",
  cave: "Cave",
};

/** CMS-editable media attached to a walkthrough step (URL, area map, or Hoenn crop). */
export interface GuideMediaItem {
  id: string;
  type: "screenshot" | "map" | "area-map" | "hoenn-crop";
  /** Image URL or site-relative path (screenshot/map). Empty for area-map / hoenn-crop. */
  url: string;
  caption: string;
  /** Interactive interior/dungeon map id from AREA_MAPS. */
  areaMapId?: string;
  /** Area id for Hoenn crop markers. */
  areaId?: string;
  /** Window into the shared Hoenn overworld map. */
  crop?: { x: number; y: number; w: number; h: number };
}

/** Freeform CMS table rendered on a walkthrough step. */
export interface GuideTableRow {
  id: string;
  cells: string[];
}

export interface GuideCustomTable {
  id: string;
  title: string;
  headers: string[];
  rows: GuideTableRow[];
}

export interface GuideStep {
  id: string;
  title: string;
  location?: string;
  summary: string;
  /**
   * Narrative walkthrough prose (one entry per paragraph). When present it is
   * rendered as the main body of the event, Prima-guide style, with the
   * `details` list kept as a quick objectives checklist beneath it.
   */
  story?: string[];
  details: string[];
  tips?: string[];
  /** Optional secrets, extras, and hidden-item notes (merged with area data in the walkthrough UI). */
  secrets?: string[];
  /**
   * CMS media gallery. When `useCustomMedia` is true, this replaces derived maps
   * even if the array is empty (hidden gallery).
   */
  media?: GuideMediaItem[];
  /** When true, ScreenshotGallery uses `media` only (no derived fallback). */
  useCustomMedia?: boolean;
  /** Optional freeform tables (objectives grids, reference charts, etc.). */
  tables?: GuideCustomTable[];
  /**
   * Specialty panels to hide on this step (gym, rival, encounters, etc.).
   * Panel data still lives in code; this only suppresses rendering.
   */
  hiddenPanels?: string[];
  tags?: string[];
  mapRegion?: string;
  /** True when this event is not required to finish the main story. */
  optional?: boolean;
}

export type ViewMode = "list" | "map" | "guided";

export type WalkthroughBand = "pregame" | "story" | "postgame";

export type WalkthroughPlayMode = "storyline" | "completionist";

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  /** True when every event in this chapter is optional for the main story. */
  optional?: boolean;
  /** Which part of the guide this chapter belongs to. */
  band?: WalkthroughBand;
}

export interface GuideData {
  walkthrough: GuideSection[];
  pokedex: GuideSection[];
}

export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  walkthrough: "Story Walkthrough",
  pokedex: "Pokédex",
};

export const CATEGORY_DESCRIPTIONS: Record<GuideCategory, string> = {
  walkthrough: "Beat the game from Littleroot to the Hall of Fame — including legendary catches woven into the story.",
  pokedex: "Browse every Gen 3 species — stats, types, evolutions, and where to catch each one.",
};
