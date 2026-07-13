import type { BreedingChartSpec } from "./breedingChartTypes";

/** Ch. 2 Event 5 — egg moves, TMs, and HMs from the father. */
export const EGG_MOVES_BREEDING_CHART: BreedingChartSpec = {
  title: "Moves the father passes down",
  lead: "In Gen III the father passes egg moves plus any compatible TM or HM moves it knows. Level-up moves on the father's list also pass if they appear on the child's egg-move list.",
  ariaLabel: "Egg move and TM breeding chart",
  groups: [
    {
      name: "Egg moves — same species",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Mudkip", dex: 258, gender: "female" },
          parentB: { name: "Swampert", dex: 260, gender: "male", subtitle: "Ancient Power" },
          methodLabel: "Egg",
          offspring: [{ name: "Mudkip", dex: 258, subtitle: "born with Ancient Power" }],
          note: "The male parent must know the move before you leave the pair at the Day Care.",
        },
        {
          parentA: { name: "Kirlia", dex: 281, gender: "female" },
          parentB: { name: "Gardevoir", dex: 282, gender: "male", subtitle: "Mean Look" },
          methodLabel: "Egg",
          offspring: [{ name: "Ralts", dex: 280, subtitle: "born with Mean Look" }],
        },
      ],
    },
    {
      name: "Cross-species — shared egg group required",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Zigzagoon", dex: 263, gender: "female" },
          parentB: { name: "Linoone", dex: 264, gender: "male", subtitle: "Body Slam" },
          methodLabel: "Egg",
          offspring: [{ name: "Zigzagoon", dex: 263, subtitle: "born with Body Slam" }],
          note: "Both Field group — the move must be on the child's egg-move list.",
        },
        {
          parentA: { name: "Skarmory", dex: 227, gender: "female" },
          parentB: { name: "Skarmory", dex: 227, gender: "male", subtitle: "Whirlwind" },
          methodLabel: "Egg",
          offspring: [{ name: "Skarmory", dex: 227, subtitle: "born with Whirlwind" }],
        },
      ],
    },
    {
      name: "Compatible TMs & HMs pass from the father",
      type: "pairs",
      pairs: [
        {
          parentA: { name: "Pikachu", dex: 25, gender: "female" },
          parentB: { name: "Pikachu", dex: 25, gender: "male", subtitle: "Thunderbolt (TM)" },
          methodLabel: "Egg",
          offspring: [{ name: "Pichu", dex: 172, subtitle: "born with Thunderbolt" }],
          note: "Prior to Gen VI, fathers pass TM/HM moves the child can learn by machine in that game.",
        },
        {
          parentA: { name: "Pikachu", dex: 25, gender: "female" },
          parentB: { name: "Pikachu", dex: 25, gender: "male", subtitle: "Light Ball held" },
          itemIconName: "Item",
          itemIconPath: "sprites/items/icons/item.png",
          methodLabel: "Egg",
          offspring: [{ name: "Pichu", dex: 172, subtitle: "born with Volt Tackle" }],
          note: "Emerald-only: either parent holding a Light Ball can produce a Pichu that knows Volt Tackle.",
        },
      ],
    },
  ],
};
