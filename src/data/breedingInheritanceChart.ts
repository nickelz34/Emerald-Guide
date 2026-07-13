import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 4 — nature, IV, and ability inheritance. */
export const INHERITANCE_BREEDING_CHART: BreedingChartSpec = {
  title: "What passes to the Egg",
  lead: "Emerald copies nature (via Everstone), three IVs from the parents, egg moves from the father, and usually the mother's ability slot.",
  ariaLabel: "Breeding inheritance chart",
  groups: [
    {
      name: "Everstone — nature inheritance (Emerald)",
      type: "pairs",
      headerIconName: "Everstone",
      headerIconPath: "sprites/items/icons/everstone.png",
      pairs: [
        {
          parentA: { name: "Ditto", dex: 132, subtitle: "♂ · Adamant · Everstone" },
          parentB: { name: "Ralts", dex: 280, subtitle: "♀" },
          itemIconName: "Everstone",
          itemIconPath: "sprites/items/icons/everstone.png",
          methodLabel: "Egg",
          offspring: [{ name: "Ralts", dex: 280, subtitle: "chance: Adamant" }],
          note: "Hold Everstone on either parent — that parent's nature has a 50% chance to pass in Emerald (international release).",
        },
        {
          parentA: { name: "Mudkip", dex: 258, subtitle: "♀ · Modest · Everstone" },
          parentB: { name: "Mudkip", dex: 258, subtitle: "♂" },
          itemIconName: "Everstone",
          itemIconPath: "sprites/items/icons/everstone.png",
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "chance: Modest" }],
          note: "Match natures to contests: Modest leans Beauty, Adamant leans Cool, and so on.",
        },
      ],
    },
    {
      name: "IVs — three stats inherited, three random",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Swampert", dex: 260, subtitle: "♀ · high Attack IV" },
          parentB: { name: "Ditto", dex: 132, subtitle: "♂ · high Speed IV" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "3 IVs from parents" }],
          note: "Gen III picks three IVs from the combined parent pool; the other three are random. There is no Destiny Knot — plan for many Eggs.",
        },
      ],
    },
    {
      name: "Ability — usually follows the female",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Zigzagoon", dex: 263, subtitle: "♀ · Pickup" },
          parentB: { name: "Ditto", dex: 132 },
          methodLabel: "Egg",
          offspring: [{ name: "Zigzagoon", dex: 263, subtitle: "50% Pickup / Gluttony" }],
          note: "When a species has two abilities, Gen III typically rolls against the female parent's ability slot.",
        },
        {
          parentA: { name: "Ditto", dex: 132 },
          parentB: { name: "Voltorb", dex: 100, subtitle: "♂ · Soundproof" },
          methodLabel: "Egg",
          offspring: [{ name: "Voltorb", dex: 100, subtitle: "inherits from genderless parent" }],
          note: "With Ditto + genderless parent, the non-Ditto parent's ability rules apply.",
        },
      ],
    },
  ],
};
