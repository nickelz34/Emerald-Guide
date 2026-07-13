import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 5 — egg moves from the male parent. */
export const EGG_MOVES_BREEDING_CHART: BreedingChartSpec = {
  title: "Egg move inheritance",
  lead: "If the father knows a move the child can learn as an egg move, the hatchling can be born with that move. The mother only needs to be compatible for an Egg.",
  ariaLabel: "Egg move breeding chart",
  groups: [
    {
      name: "Male passes egg moves to the same species",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Swampert", dex: 260, subtitle: "♀" },
          parentB: { name: "Mudkip", dex: 258, subtitle: "♂ · Ancient Power" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "born with Ancient Power" }],
          note: "Teach or level the father so it knows the egg move before you leave the pair at the Day Care.",
        },
        {
          parentA: { name: "Gardevoir", dex: 282, subtitle: "♀" },
          parentB: { name: "Ralts", dex: 280, subtitle: "♂ · Mean Look" },
          methodLabel: "Egg",
          offspring: [{ name: "Ralts", dex: 280, subtitle: "born with Mean Look" }],
        },
      ],
    },
    {
      name: "Cross-species egg moves need shared egg groups",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Marshtomp", dex: 259, subtitle: "♀" },
          parentB: { name: "Slaking", dex: 289, subtitle: "♂ · Body Slam" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "can inherit Body Slam" }],
          note: "Field-group fathers can pass compatible egg moves onto other Field babies when the move is on both egg lists.",
        },
        {
          parentA: { name: "Skarmory", dex: 227, subtitle: "♀" },
          parentB: { name: "Skarmory", dex: 227, subtitle: "♂ · Whirlwind" },
          methodLabel: "Egg",
          offspring: [{ name: "Skarmory", dex: 227, subtitle: "born with Whirlwind" }],
          note: "Classic Gen III example — Whirlwind is a common egg-move breeding target on Skarmory lines.",
        },
      ],
    },
    {
      name: "TM moves do not become egg moves",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Blaziken", dex: 257, subtitle: "♀" },
          parentB: { name: "Torchic", dex: 255, subtitle: "♂ · Brick Break (TM)" },
          methodLabel: "Egg",
          offspring: [{ name: "Torchic", dex: 255 }],
          note: "Only moves on the child's egg-move list count — TMs alone will not pass unless the move is also a natural or bred egg move.",
        },
      ],
    },
  ],
};
