/**
 * Curated Emerald starter-choice guide content for Route 101.
 * Species stats / sprites come from speciesDataGenerated — this file is playstyle advice.
 */

export type StarterSlug = "treecko" | "torchic" | "mudkip";

export interface StarterGuideEntry {
  slug: StarterSlug;
  /** Short pick slogan shown under the name. */
  tagline: string;
  /** Why you might pick this line in Emerald. */
  bestFor: string;
  /** How the line fares vs early gyms (Roxanne → Flannery). */
  earlyGyms: string;
  /** What your Route 103 rival leads with if you pick this starter. */
  rivalFaces: string;
  /** Recommended natures for the final form in Emerald (no Hidden Abilities). */
  natures: string[];
  /** One-line difficulty for a first playthrough. */
  difficulty: "Easiest" | "Balanced" | "Technical";
  accent: string;
}

export const STARTER_GUIDE: StarterGuideEntry[] = [
  {
    slug: "treecko",
    tagline: "Fast Grass — outspeed and chip from range",
    bestFor:
      "Players who like special attackers and Speed. Sceptile hits hard with Leaf Blade / Giga Drain and usually moves first.",
    earlyGyms:
      "Strong into Roxanne (Rock). Fine into Brawly. Resists Wattson’s Electric. Weak into Flannery’s Fire — pack a Water or Rock partner before Lavaridge.",
    rivalFaces: "Torchic (Fire) on Route 103 — type disadvantage in the first rival battle.",
    natures: ["Modest (+Sp. Atk, −Atk)", "Timid (+Speed, −Atk)"],
    difficulty: "Technical",
    accent: "#63bb5b",
  },
  {
    slug: "torchic",
    tagline: "Fire → Fire/Fighting powerhouse",
    bestFor:
      "Players who want a mixed attacker with huge late-game punching power. Blaziken’s dual STAB (Fire + Fighting) covers a ton of the mid/late game.",
    earlyGyms:
      "Awkward into Roxanne (Rock) until you have coverage or a Water/Fighting friend. Becomes excellent once Combusken learns Fighting moves; great into Tate & Liza’s Psychic gym.",
    rivalFaces: "Mudkip (Water) on Route 103 — type disadvantage in the first rival battle.",
    natures: ["Adamant (+Atk, −Sp. Atk)", "Jolly (+Speed, −Sp. Atk)", "Naive (+Speed, −Sp. Def)"],
    difficulty: "Balanced",
    accent: "#ff9d55",
  },
  {
    slug: "mudkip",
    tagline: "Bulky Water → Water/Ground wall-breaker",
    bestFor:
      "First playthroughs and anyone who wants an easy path. Swampert’s only weakness is Grass, and Ground STAB shrugs off Electric gyms entirely.",
    earlyGyms:
      "Excellent into Roxanne and Flannery. Immune to Wattson’s Electric. Comfortable through most of the badge circuit with Surf + Earthquake later.",
    rivalFaces: "Treecko (Grass) on Route 103 — type disadvantage in the first rival battle.",
    natures: ["Adamant (+Atk, −Sp. Atk)", "Careful (+Sp. Def, −Sp. Atk)", "Impish (+Def, −Sp. Atk)"],
    difficulty: "Easiest",
    accent: "#4d90d5",
  },
];

export const STARTER_CHOICE_INTRO =
  "Whichever Poké Ball you open on Route 101 is yours for the whole adventure. Compare base stats, final evolutions, gym matchups, and natures below — then send one out against Birch’s Poochyena.";
