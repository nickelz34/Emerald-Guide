import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 6 — hatching, Ditto anchor, and story eggs. */
export const HATCHING_BREEDING_CHART: BreedingChartSpec = {
  title: "Hatching & breeding resources",
  lead: "Eggs hatch from steps in your party at level 5. A party member with Flame Body or Magma Armor halves the remaining egg cycles.",
  ariaLabel: "Hatching and breeding resources chart",
  groups: [
    {
      name: "Steps in party — hatch at level 5",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Mudkip", dex: 258, gender: "female" },
          parentB: { name: "Mudkip", dex: 258, gender: "male" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "~5,120 steps" }],
          note: "Each species has a fixed egg-cycle count (×256 steps). Stack up to five Eggs in party + Bag while you grind routes.",
        },
      ],
    },
    {
      name: "Flame Body / Magma Armor halve hatch time",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Slugma", dex: 218, subtitle: "Flame Body in party" },
          parentB: { name: "Egg", kind: "egg", subtitle: "hatching" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "~2,560 steps" }],
          note: "From Emerald onward, Flame Body or Magma Armor in your party drops two egg cycles per 256 steps instead of one. Slugma is on Route 113/18; Camerupt works too.",
        },
      ],
    },
    {
      name: "Story & post-game breeding anchors",
      type: "grid",
      grid: [
        { name: "Wynaut", dex: 360 },
        { name: "Ditto", dex: 132 },
        { name: "Beldum", dex: 374 },
        { name: "Chikorita", dex: 152 },
        { name: "Cyndaquil", dex: 155 },
        { name: "Totodile", dex: 158 },
      ],
      gridNote:
        "Lavaridge: Wynaut Egg gift. Post-game Desert Underpass: wild Ditto. Steven's Mossdeep house: Beldum gift. Complete the Hoenn dex and Professor Birch in Littleroot offers one Johto starter.",
    },
    {
      name: "Useful held items while breeding",
      type: "pairs",
      headerIconName: "Everstone",
      headerIconPath: "sprites/items/icons/everstone.png",
      pairs: [
        {
          parentA: { name: "Ditto", dex: 132, subtitle: "Everstone" },
          parentB: { name: "Absol", dex: 359 },
          itemIconName: "Everstone",
          itemIconPath: "sprites/items/icons/everstone.png",
          methodLabel: "Egg",
          offspring: [{ name: "Absol", dex: 359 }],
        },
        {
          parentA: { name: "Marill", dex: 183, subtitle: "Sea Incense" },
          parentB: { name: "Ditto", dex: 132 },
          itemIconName: "Sea Incense",
          itemIconPath: "sprites/items/icons/sea_incense.png",
          methodLabel: "Egg",
          offspring: [{ name: "Azurill", dex: 298 }],
        },
      ],
    },
  ],
};
