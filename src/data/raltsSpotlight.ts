/**
 * Curated Emerald guide content for the optional Route 102 Ralts hunt.
 * Species stats/sprites come from speciesDataGenerated — override types to
 * Psychic-only (Fairy does not exist in Gen III).
 */

export const RALTS_EMERALD_TYPES = ["Psychic"] as const;

export const RALTS_SPOTLIGHT_INTRO =
  "Route 102’s rarest grass encounter is one of Emerald’s best long-term team picks. Compare Ralts with its evolutions below — stats, matchups, natures, and hunt tips — then decide whether to spend the time for a 4% Psychic partner.";

export interface RaltsStageGuide {
  slug: "ralts" | "kirlia" | "gardevoir";
  tagline: string;
  role: string;
  note: string;
  accent: string;
}

export const RALTS_STAGES: RaltsStageGuide[] = [
  {
    slug: "ralts",
    tagline: "Rare Route 102 catch — fragile now, huge later",
    role: "Special attacker seed. Keep it safe early; it blooms once Kirlia and Gardevoir come online.",
    note: "4% grass on Route 102 (typically Lv 3–4). Bring spare Poké Balls and save before a long hunt.",
    accent: "#fa7179",
  },
  {
    slug: "kirlia",
    tagline: "Level 20 — the line starts hitting",
    role: "Midgame bridge form. Sp. Atk jumps, and Psychic coverage starts carrying gyms and Team Aqua/Magma fights.",
    note: "Evolves from Ralts at Lv 20. Still pure Psychic in Emerald — no Fairy typing yet.",
    accent: "#ec8fe6",
  },
  {
    slug: "gardevoir",
    tagline: "Level 30 — Elite Four–ready special wallbreaker",
    role: "Flagship special attacker. High Sp. Atk and Sp. Def with Calm Mind / Psychic sets that stay useful into Wallace.",
    note: "Evolves from Kirlia at Lv 30. Gallade does not exist in Emerald — every Ralts becomes Gardevoir.",
    accent: "#ab6ac8",
  },
];

export const RALTS_HUNT_TIPS = [
  "Save on Route 102 before grinding so you can soft-reset if you want a better nature.",
  "A Synchronize lead with your target nature gives wild Ralts a 50% chance to match it (Gen III).",
  "Repels with a lead around Lv 3–4 thin out higher-level noise so you see more slots worth checking.",
  "Wally later catches his own Ralts in the Petalburg story beat — yours is optional and separate.",
];

export const RALTS_NATURES = [
  "Modest (+Sp. Atk, −Atk) — classic special Gardevoir",
  "Timid (+Speed, −Atk) — outspeed more midgame threats",
  "Calm (+Sp. Def, −Atk) — bulkier special tank sets",
];

export const RALTS_ABILITIES_NOTE =
  "Emerald abilities are Synchronize or Trace (no Hidden Abilities). Synchronize is prized for nature hunting; Trace copies the foe’s ability in battle.";
