import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 3 — Gen 3 incense babies. */
export const INCENSE_BREEDING_CHART: BreedingChartSpec = {
  title: "Incense babies",
  lead: "Emerald has two incense lines. Hold the correct incense on a parent or the Day Care will hatch the ordinary middle stage instead of the baby.",
  ariaLabel: "Incense baby breeding chart",
  groups: [
    {
      name: "Sea Incense → Azurill",
      type: "pairs",
      headerIconName: "Sea Incense",
      headerIconPath: "sprites/items/icons/sea_incense.png",
      pairs: [
        {
          parentA: { name: "Marill", dex: 183, gender: "female", subtitle: "Sea Incense" },
          parentB: { name: "Ditto", dex: 132 },
          itemIconName: "Sea Incense",
          itemIconPath: "sprites/items/icons/sea_incense.png",
          methodLabel: "Egg",
          offspring: [{ name: "Azurill", dex: 298 }],
          note: "Sea Incense is sold in Slateport's market and held on either parent.",
        },
        {
          parentA: { name: "Marill", dex: 183, gender: "female", subtitle: "no incense" },
          parentB: { name: "Ditto", dex: 132 },
          methodLabel: "Egg",
          offspring: [{ name: "Marill", dex: 183 }],
          note: "Without Sea Incense you hatch Marill even from an Azumarill mother.",
        },
      ],
    },
    {
      name: "Lax Incense → Wynaut",
      type: "pairs",
      headerIconName: "Lax Incense",
      headerIconPath: "sprites/items/icons/lax_incense.png",
      pairs: [
        {
          parentA: { name: "Wobbuffet", dex: 202, gender: "female", subtitle: "Lax Incense" },
          parentB: { name: "Ditto", dex: 132 },
          itemIconName: "Lax Incense",
          itemIconPath: "sprites/items/icons/lax_incense.png",
          methodLabel: "Egg",
          offspring: [{ name: "Wynaut", dex: 360 }],
          note: "Lax Incense is sold in Slateport's market. Wynaut itself is Undiscovered — breed Wobbuffet instead.",
        },
        {
          parentA: { name: "Wobbuffet", dex: 202, gender: "female", subtitle: "no incense" },
          parentB: { name: "Ditto", dex: 132 },
          methodLabel: "Egg",
          offspring: [{ name: "Wobbuffet", dex: 202 }],
        },
      ],
    },
    {
      name: "Other babies hatch normally from their line",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Pikachu", dex: 25, gender: "female" },
          parentB: { name: "Ditto", dex: 132 },
          methodLabel: "Egg",
          offspring: [{ name: "Pichu", dex: 172 }],
          note: "Pichu, Cleffa, Igglybuff, Togepi, and Azurill (with incense) are the main baby forms in Emerald.",
        },
        {
          parentA: { name: "Clefairy", dex: 35, gender: "female" },
          parentB: { name: "Ditto", dex: 132 },
          methodLabel: "Egg",
          offspring: [{ name: "Cleffa", dex: 173 }],
        },
      ],
    },
  ],
};
