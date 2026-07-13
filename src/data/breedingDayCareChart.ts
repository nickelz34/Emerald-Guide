import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 1 — Day Care flow and offspring rules. */
export const DAY_CARE_BREEDING_CHART: BreedingChartSpec = {
  title: "Day Care breeding flow",
  lead: "Leave two compatible Pokémon at Route 117, walk until the Day Care Man has an Egg, then hatch it in your party.",
  ariaLabel: "Day Care breeding flow chart",
  groups: [
    {
      name: "Same species — offspring follows the female",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Mudkip", dex: 258, subtitle: "♀" },
          parentB: { name: "Mudkip", dex: 258, subtitle: "♂" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258 }],
          note: "Both parents share an egg group and opposite genders — the Egg hatches as the female's family.",
        },
        {
          parentA: { name: "Marill", dex: 183, subtitle: "♀" },
          parentB: { name: "Azumarill", dex: 184, subtitle: "♂" },
          methodLabel: "Egg",
          offspring: [{ name: "Marill", dex: 183 }],
          note: "Cross-species within the same line still hatches the female parent's base form unless incense applies.",
        },
      ],
    },
    {
      name: "Ditto pairs with almost anything breedable",
      type: "pairs",
      headerIconName: "Poké Ball",
      headerIconPath: "sprites/items/icons/poke_ball.png",
      pairs: [
        {
          parentA: { name: "Ditto", dex: 132 },
          parentB: { name: "Absol", dex: 359, subtitle: "any gender" },
          methodLabel: "Egg",
          offspring: [{ name: "Absol", dex: 359 }],
          note: "Ditto copies the other parent's species. Genderless Pokémon (e.g. Voltorb) also breed only with Ditto.",
        },
        {
          parentA: { name: "Ditto", dex: 132 },
          parentB: { name: "Voltorb", dex: 100 },
          methodLabel: "Egg",
          offspring: [{ name: "Voltorb", dex: 100 }],
        },
      ],
    },
    {
      name: "Cross-group pairs need a shared egg group",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Mudkip", dex: 258, subtitle: "♀ · Water 1" },
          parentB: { name: "Zigzagoon", dex: 263, subtitle: "♂ · Field" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258 }],
          note: "Mudkip (Water 1 + Monster) and Zigzagoon (Field) share Field — valid if genders differ.",
        },
        {
          parentA: { name: "Treecko", dex: 252, subtitle: "♀ · Grass" },
          parentB: { name: "Mudkip", dex: 258, subtitle: "♂ · Water 1" },
          methodLabel: "✕",
          offspring: [],
          note: "No shared egg group — the Day Care couple will not produce an Egg.",
        },
      ],
    },
  ],
};
