import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 1 — Day Care flow and offspring rules. */
export const DAY_CARE_BREEDING_CHART: BreedingChartSpec = {
  title: "Day Care breeding flow",
  lead: "Leave two compatible Pokémon at Route 117. After every 256 steps the game may roll for an Egg; the Day Care Man holds it outside until you pick it up.",
  ariaLabel: "Day Care breeding flow chart",
  groups: [
    {
      name: "Same species — offspring follows the female",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Mudkip", dex: 258, gender: "female" },
          parentB: { name: "Mudkip", dex: 258, gender: "male" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258 }],
          note: "Opposite genders in a shared egg group produce an Egg. The hatchling matches the female's evolutionary line (level 5 in Gen III).",
        },
        {
          parentA: { name: "Marill", dex: 183, gender: "female" },
          parentB: { name: "Azumarill", dex: 184, gender: "male" },
          methodLabel: "Egg",
          offspring: [{ name: "Marill", dex: 183 }],
          note: "Cross-species within the same line still hatches the female parent's base form unless incense applies (Event 3).",
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
          note: "Ditto copies the other parent's species. Genderless species (Voltorb, Magnemite, Beldum, etc.) also breed only with Ditto.",
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
          parentA: { name: "Marill", dex: 183, gender: "female", subtitle: "Water 1" },
          parentB: { name: "Psyduck", dex: 54, gender: "male", subtitle: "Water 1" },
          methodLabel: "Egg",
          offspring: [{ name: "Marill", dex: 183 }],
          note: "Marill (Water 1 + Fairy) and Psyduck (Water 1 + Field) share Water 1 — a valid cross-species pair.",
        },
        {
          parentA: { name: "Treecko", dex: 252, gender: "female", subtitle: "Grass" },
          parentB: { name: "Mudkip", dex: 258, gender: "male", subtitle: "Water 1" },
          methodLabel: "✕",
          offspring: [],
          note: "No shared egg group — the Day Care couple will not produce an Egg.",
        },
      ],
    },
  ],
};
