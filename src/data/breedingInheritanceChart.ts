import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 4 — nature, IV, and ability inheritance. */
export const INHERITANCE_BREEDING_CHART: BreedingChartSpec = {
  title: "What passes to the Egg",
  lead: "Emerald passes nature (via Everstone on the mother or Ditto), three IVs from the parents, egg moves from the father, and a random ability slot in Gen III.",
  ariaLabel: "Breeding inheritance chart",
  groups: [
    {
      name: "Everstone — nature inheritance (Emerald)",
      type: "pairs",
      headerIconName: "Everstone",
      headerIconPath: "sprites/items/icons/everstone.png",
      pairs: [
        {
          parentA: { name: "Ditto", dex: 132, subtitle: "Adamant · Everstone" },
          parentB: { name: "Ralts", dex: 280, gender: "female" },
          itemIconName: "Everstone",
          itemIconPath: "sprites/items/icons/everstone.png",
          methodLabel: "Egg",
          offspring: [{ name: "Ralts", dex: 280, subtitle: "50% Adamant" }],
          note: "In Emerald, hold Everstone on the mother (male–female pairs) or on Ditto — 50% chance that nature passes.",
        },
        {
          parentA: { name: "Mudkip", dex: 258, gender: "female", subtitle: "Modest · Everstone" },
          parentB: { name: "Mudkip", dex: 258, gender: "male" },
          itemIconName: "Everstone",
          itemIconPath: "sprites/items/icons/everstone.png",
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "50% Modest" }],
          note: "Match natures to contests: Modest leans Beauty, Adamant leans Cool, and so on.",
        },
      ],
    },
    {
      name: "IVs — three stats inherited, three random",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Swampert", dex: 260, gender: "female", subtitle: "high Attack IV" },
          parentB: { name: "Ditto", dex: 132, subtitle: "high Speed IV" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "3 IVs from parents" }],
          note: "Gen III copies three IVs from the combined parent pool (with HP and Defense harder to inherit on the 2nd and 3rd picks). The other three stats are random — no Destiny Knot.",
        },
      ],
    },
    {
      name: "Ability — random slot in Gen III",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Zigzagoon", dex: 263, gender: "female", subtitle: "Pickup" },
          parentB: { name: "Ditto", dex: 132 },
          methodLabel: "Egg",
          offspring: [{ name: "Zigzagoon", dex: 263, subtitle: "Pickup (only ability in Emerald)" }],
          note: "In Generations III and IV, ability is chosen randomly from the species' slots — parent ability does not bias the result.",
        },
        {
          parentA: { name: "Ditto", dex: 132 },
          parentB: { name: "Voltorb", dex: 100, subtitle: "Soundproof or Static" },
          methodLabel: "Egg",
          offspring: [{ name: "Voltorb", dex: 100, subtitle: "random ability slot" }],
        },
      ],
    },
  ],
};
