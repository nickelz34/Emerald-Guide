export type GuideCategory = "walkthrough" | "legendaries" | "encounters";

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
  /** Optional hidden items, easter eggs, and missable secrets for this event. */
  secrets?: string[];
  tags?: string[];
  mapRegion?: string;
}

export type ViewMode = "list" | "map" | "guided";

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
}

export interface GuideData {
  walkthrough: GuideSection[];
  legendaries: GuideSection[];
  encounters: GuideSection[];
}

export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  walkthrough: "Story Walkthrough",
  legendaries: "Legendaries",
  encounters: "Pokédex",
};

export const CATEGORY_DESCRIPTIONS: Record<GuideCategory, string> = {
  walkthrough: "Beat the game from Littleroot to the Hall of Fame.",
  legendaries: "Catch every legendary available in a normal Emerald cartridge.",
  encounters: "What to catch on each route — rates, methods, and time of day.",
};
