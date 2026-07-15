import type { BreedingChartSpec } from "./breedingChartTypes";

/** Breeding Event 6 — hatching once the Egg is in your party. */
export const HATCHING_BREEDING_CHART: BreedingChartSpec = {
  title: "How Eggs hatch in Emerald",
  lead: "Keep the Egg in your party and walk. Every 256 steps burns one egg cycle — two cycles if Flame Body or Magma Armor is also in the party. Hatchlings are always level 5.",
  ariaLabel: "How Eggs hatch reference chart",
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
          note: "Each species has a fixed egg-cycle count (×256 steps). Stack multiple Eggs in free party slots while you walk — the PC never hatches them.",
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
          note: "Flame Body or Magma Armor in your party drops two egg cycles per 256 steps. Slugma (Route 113 / Fiery Path) and Numel (Route 112 / 113; Magma Armor) are the usual carriers.",
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
