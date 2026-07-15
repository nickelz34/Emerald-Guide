/**
 * Emerald (Gen III) Poké Ball reference — catch multipliers and obtain notes.
 * Multipliers follow the Generation III catch formula used by pokeemerald.
 */

export interface PokeBallRow {
  id: string;
  name: string;
  /** Catch-rate multiplier description (plain language). */
  multiplier: string;
  /** When the ball’s bonus applies, if conditional. */
  bestUsed: string;
  obtain: string;
  /** Key in itemIconsGenerated / bag icon name; omit when no sprite ships. */
  iconName?: string;
}

export const POKE_BALL_TABLE: PokeBallRow[] = [
  {
    id: "poke-ball",
    name: "Poké Ball",
    multiplier: "×1",
    bestUsed: "Default ball for ordinary wilds",
    obtain: "Rival’s first five after Route 103 lab; Poké Marts afterward",
    iconName: "Poké Ball",
  },
  {
    id: "great-ball",
    name: "Great Ball",
    multiplier: "×1.5",
    bestUsed: "General upgrade over Poké Balls",
    obtain: "Marts (mid game); Petalburg Woods researcher gift; route items",
    iconName: "Great Ball",
  },
  {
    id: "ultra-ball",
    name: "Ultra Ball",
    multiplier: "×2",
    bestUsed: "Standard late-game catch ball",
    obtain: "Later marts and area items (e.g. New Mauville)",
    iconName: "Ultra Ball",
  },
  {
    id: "master-ball",
    name: "Master Ball",
    multiplier: "Always catches",
    bestUsed: "Legendaries or roamers you refuse to risk",
    obtain: "Unique pickup in Magma Hideout (one per save)",
    iconName: "Master Ball",
  },
  {
    id: "safari-ball",
    name: "Safari Ball",
    multiplier: "×1.5",
    bestUsed: "Safari Zone only (with Bait / Rocks)",
    obtain: "Issued on Safari Zone entry — not kept for overworld use",
  },
  {
    id: "net-ball",
    name: "Net Ball",
    multiplier: "×3 on Bug or Water; otherwise ×1",
    bestUsed: "Bug- and Water-type wilds",
    obtain: "Mossdeep Mart and selected shops / pickups",
    iconName: "Net Ball",
  },
  {
    id: "dive-ball",
    name: "Dive Ball",
    multiplier: "×3.5 while surfing, fishing, or underwater; otherwise ×1",
    bestUsed: "Ocean Surf / Dive / fishing encounters",
    obtain: "Mossdeep Mart; Abandoned Ship and coastal items",
    iconName: "Dive Ball",
  },
  {
    id: "nest-ball",
    name: "Nest Ball",
    multiplier: "(40 − level) ÷ 10, minimum ×1",
    bestUsed: "Low-level wild Pokémon",
    obtain: "Marts; Magma / Aqua Hideout pickups",
    iconName: "Nest Ball",
  },
  {
    id: "repeat-ball",
    name: "Repeat Ball",
    multiplier: "×3 if that species is already owned; otherwise ×1",
    bestUsed: "Catching extras of dex-registered species",
    obtain: "Later marts and specialty shops",
    iconName: "Repeat Ball",
  },
  {
    id: "timer-ball",
    name: "Timer Ball",
    multiplier: "(turns + 10) ÷ 10, maximum ×4",
    bestUsed: "Long battles (caps at turn 30)",
    obtain: "Trick House reward; later marts",
    iconName: "Timer Ball",
  },
  {
    id: "luxury-ball",
    name: "Luxury Ball",
    multiplier: "×1 (same as Poké Ball)",
    bestUsed: "Faster friendship gain after the catch",
    obtain: "Specialty marts and route items",
    iconName: "Luxury Ball",
  },
  {
    id: "premier-ball",
    name: "Premier Ball",
    multiplier: "×1 (same as Poké Ball)",
    bestUsed: "Cosmetic / free bonus ball",
    obtain: "Free when you buy ten Poké Balls in one mart purchase",
  },
];
