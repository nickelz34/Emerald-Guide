/**
 * Emerald fishing reference — rods + Super Rod tables from pokeemerald
 * wild_encounters.json (aggregated slot rates per map).
 */

export interface FishingRodRow {
  id: "old-rod" | "good-rod" | "super-rod";
  name: string;
  obtain: string;
  prerequisite?: string;
  typicalLevels: string;
  commonCatches: string;
  note: string;
}

export interface FishingEncounterMon {
  name: string;
  dex: number;
  rate: string;
  level: string;
}

export interface FishingLocationRow {
  id: string;
  location: string;
  /** Super Rod slots aggregated from pokeemerald. */
  encounters: FishingEncounterMon[];
  note?: string;
}

/** Where each rod is earned and what it generally unlocks. */
export const FISHING_ROD_TABLE: FishingRodRow[] = [
  {
    id: "old-rod",
    name: "Old Rod",
    obtain: "Dewford Town — fisherman on the south shore by the Gym (free)",
    typicalLevels: "Lv. 5–10",
    commonCatches: "Magikarp, Tentacool / Goldeen",
    note: "Fastest reel prompts — good for Feebas tile hunting later.",
  },
  {
    id: "good-rod",
    name: "Good Rod",
    obtain: "Route 118 — fisherman on the east shore (free)",
    prerequisite: "Balance Badge (Surf) to reach the east bank",
    typicalLevels: "Lv. 10–30",
    commonCatches: "Magikarp plus Tentacool, Goldeen, Carvanha, Barboach, Wailmer…",
    note: "First rod that adds mid-game water species to most maps.",
  },
  {
    id: "super-rod",
    name: "Super Rod",
    obtain: "Mossdeep City — fisherman’s house east of the Gym (free; never sold)",
    typicalLevels: "Lv. 20–45",
    commonCatches: "Map-specific rares: Corphish, Sharpedo, Whiscash, Gyarados…",
    note: "Best tables for story and Pokédex fish — see Super Rod locations below.",
  },
];

/**
 * Highlight Super Rod tables players ask for most often.
 * Rates are summed slot % from pokeemerald fishing_mons groups.
 */
export const SUPER_ROD_LOCATION_TABLE: FishingLocationRow[] = [
  {
    id: "route-102",
    location: "Route 102 / Petalburg City",
    encounters: [{ name: "Corphish", dex: 341, rate: "100%", level: "20–45" }],
  },
  {
    id: "route-111",
    location: "Route 111 (desert oasis)",
    encounters: [{ name: "Barboach", dex: 339, rate: "100%", level: "20–45" }],
  },
  {
    id: "route-114",
    location: "Route 114",
    encounters: [{ name: "Barboach", dex: 339, rate: "100%", level: "20–45" }],
    note: "Whiscash is not on this Super Rod table — see Meteor Falls B1F / Victory Road B2F.",
  },
  {
    id: "route-118",
    location: "Route 118",
    encounters: [
      { name: "Carvanha", dex: 318, rate: "60%", level: "20–45" },
      { name: "Sharpedo", dex: 319, rate: "40%", level: "30–35" },
    ],
  },
  {
    id: "route-119",
    location: "Route 119 (standard tiles)",
    encounters: [{ name: "Carvanha", dex: 318, rate: "100%", level: "20–45" }],
    note: "Feebas is separate — only on 6 Dewford-trend tiles (any rod; ~50% there). Not Surf.",
  },
  {
    id: "ocean",
    location: "Routes 124–131 · Mossdeep / Dewford shores",
    encounters: [
      { name: "Wailmer", dex: 320, rate: "60%", level: "25–45" },
      { name: "Sharpedo", dex: 319, rate: "40%", level: "30–35" },
    ],
    note: "Dewford Super Rod is 100% Wailmer. Outer routes (e.g. 134) can add Horsea (15%).",
  },
  {
    id: "meteor-falls",
    location: "Meteor Falls 1F",
    encounters: [{ name: "Barboach", dex: 339, rate: "100%", level: "20–45" }],
  },
  {
    id: "meteor-falls-b1f",
    location: "Meteor Falls B1F · Victory Road B2F",
    encounters: [
      { name: "Barboach", dex: 339, rate: "80%", level: "25–35" },
      { name: "Whiscash", dex: 340, rate: "20%", level: "30–45" },
    ],
  },
  {
    id: "safari-sw",
    location: "Safari Zone — Southwest / Northwest",
    encounters: [
      { name: "Goldeen", dex: 118, rate: "80%", level: "25–35" },
      { name: "Seaking", dex: 119, rate: "20%", level: "25–40" },
    ],
  },
  {
    id: "safari-se",
    location: "Safari Zone — Southeast (Emerald expansion)",
    encounters: [
      { name: "Remoraid", dex: 223, rate: "59%", level: "25–35" },
      { name: "Goldeen", dex: 118, rate: "40%", level: "25–30" },
      { name: "Octillery", dex: 224, rate: "1%", level: "35–40" },
    ],
  },
  {
    id: "lilycove",
    location: "Lilycove City",
    encounters: [
      { name: "Wailmer", dex: 320, rate: "85%", level: "25–45" },
      { name: "Staryu", dex: 120, rate: "15%", level: "25–30" },
    ],
  },
  {
    id: "ever-grande",
    location: "Ever Grande City",
    encounters: [
      { name: "Wailmer", dex: 320, rate: "45%", level: "30–45" },
      { name: "Luvdisc", dex: 370, rate: "40%", level: "30–35" },
      { name: "Corsola", dex: 222, rate: "15%", level: "30–35" },
    ],
  },
  {
    id: "sootopolis",
    location: "Sootopolis City",
    encounters: [
      { name: "Magikarp", dex: 129, rate: "80%", level: "30–35" },
      { name: "Gyarados", dex: 130, rate: "20%", level: "5–45" },
    ],
  },
];

export const FISHING_SPECIAL_NOTES = [
  {
    id: "feebas",
    title: "Feebas (Route 119)",
    body: "Exactly six water tiles can yield Feebas; which six follow Dewford’s trendy phrase. Fish any rod on every tile (Old Rod is fastest). On a correct tile, Feebas is about 50%. Surf never catches Feebas.",
  },
  {
    id: "relicanth",
    title: "Relicanth (Regi puzzle)",
    body: "Relicanth is not a Super Rod catch in Emerald — it appears while diving on Underwater Routes 124 and 126 (water encounters). Pair with a Wailord for the Sealed Chamber.",
  },
];
