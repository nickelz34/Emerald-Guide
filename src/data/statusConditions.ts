/** Emerald status anomalies (persistent + volatile) and their cures. */

export interface StatusConditionRow {
  id: string;
  name: string;
  kind: "persistent" | "volatile";
  effect: string;
  cures: string;
  /** Non-volatile statuses cannot stack; a Pokémon holds only one at a time. */
  notes?: string;
}

export const STATUS_CONDITION_TABLE: StatusConditionRow[] = [
  {
    id: "burn",
    name: "Burn",
    kind: "persistent",
    effect:
      "Halves Attack; deals 1/8 max HP each turn (Gen III). Fire-types immune to being burned.",
    cures: "Burn Heal · Rawst Berry · Full Heal · Full Restore · Heal Bell / Aromatherapy · Rest · Pokémon Center",
  },
  {
    id: "freeze",
    name: "Freeze",
    kind: "persistent",
    effect:
      "Cannot move until thawed. Ice-types immune. Fire moves and sunny weather often thaw the target.",
    cures: "Ice Heal · Aspear Berry · Full Heal · Full Restore · thaw from a Fire hit / Sunny Day · Rest · Pokémon Center",
  },
  {
    id: "paralysis",
    name: "Paralysis",
    kind: "persistent",
    effect:
      "Speed is quartered; about 25% chance to be fully paralyzed and skip the turn. Electric-types immune in Gen III.",
    cures: "Parlyz Heal · Cheri Berry · Full Heal · Full Restore · Heal Bell / Aromatherapy · Rest · Pokémon Center",
  },
  {
    id: "poison",
    name: "Poison",
    kind: "persistent",
    effect:
      "Loses 1/8 max HP each turn. Poison- and Steel-types immune. Persists outside battle after the fight ends.",
    cures: "Antidote · Pecha Berry · Full Heal · Full Restore · Heal Bell / Aromatherapy · Rest · Pokémon Center",
  },
  {
    id: "badly-poison",
    name: "Badly poisoned",
    kind: "persistent",
    effect:
      "Toxic-style poison: damage ramps each turn (N/16 max HP). Outside battle it becomes regular poison in Gen III.",
    cures: "Antidote · Pecha Berry · Full Heal · Full Restore · Heal Bell / Aromatherapy · Rest · Pokémon Center",
    notes: "Only one non-volatile status at a time — Toxic replaces poison if already poisoned.",
  },
  {
    id: "sleep",
    name: "Sleep",
    kind: "persistent",
    effect:
      "Cannot move for 1–4 turns (Gen III). Self-induced Rest sleeps for exactly 2 turns and heals to full HP.",
    cures: "Awakening · Chesto Berry · Full Heal · Full Restore · Heal Bell / Aromatherapy · Blue Flute · Rest ends itself · Pokémon Center",
  },
  {
    id: "confusion",
    name: "Confusion",
    kind: "volatile",
    effect:
      "Chance to hurt itself instead of attacking for 2–5 turns. Cleared by switching out.",
    cures: "Persim Berry · Yellow Flute · Full Heal · Full Restore · switch out · wears off",
  },
  {
    id: "infatuation",
    name: "Infatuation",
    kind: "volatile",
    effect:
      "From Attract / Cute Charm vs opposite gender: ~50% chance to fail to attack each turn. Ends if the inducer leaves.",
    cures: "Red Flute · Mental Herb · switch out · foe faints or switches",
  },
  {
    id: "flinch",
    name: "Flinch",
    kind: "volatile",
    effect:
      "Cannot move that turn if hit by a flinching move before acting. Never carries between turns.",
    cures: "No item cure — act first or avoid flinch moves; Inner Focus prevents flinching",
  },
];
