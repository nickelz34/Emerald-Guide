export type GuideCategory = "walkthrough" | "secrets" | "legendaries" | "tips" | "encounters";

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
  details: string[];
  tips?: string[];
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
  secrets: GuideSection[];
  legendaries: GuideSection[];
  tips: GuideSection[];
  encounters: GuideSection[];
}

export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  walkthrough: "Story Walkthrough",
  secrets: "Secrets & Hidden Items",
  legendaries: "Legendaries",
  tips: "Tips & Team Building",
  encounters: "Pokédex",
};

export const CATEGORY_DESCRIPTIONS: Record<GuideCategory, string> = {
  walkthrough: "Beat the game from Littleroot to the Hall of Fame.",
  secrets: "Hidden items, optional areas, and easy-to-miss rewards.",
  legendaries: "Catch every legendary available in a normal Emerald cartridge.",
  tips: "Type matchups, HM slaves, and general strategy.",
  encounters: "What to catch on each route — rates, methods, and time of day.",
};
