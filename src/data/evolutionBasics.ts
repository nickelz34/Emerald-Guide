/** One Pokémon edge in a visual evolution chart group. */
export interface BasicsEvolutionEdge {
  fromName: string;
  fromDex: number;
  toName: string;
  toDex: number;
  /** Shown under the arrow when the group has no item icon (e.g. "Lv 16"). */
  methodLabel?: string;
}

export interface BasicsEvolutionGroup {
  name: string;
  itemIconName?: string;
  iconPath?: string;
  evolutions: BasicsEvolutionEdge[];
}

/** Ch. 1 Event 1 — level-up examples and Everstone block. */
export const BASICS_EVOLUTION_GROUPS: BasicsEvolutionGroup[] = [
  {
    name: "Hoenn starters (level-up)",
    evolutions: [
      { fromName: "Treecko", fromDex: 252, toName: "Grovyle", toDex: 253, methodLabel: "Lv 16" },
      { fromName: "Grovyle", fromDex: 253, toName: "Sceptile", toDex: 254, methodLabel: "Lv 36" },
      { fromName: "Torchic", fromDex: 255, toName: "Combusken", toDex: 256, methodLabel: "Lv 16" },
      { fromName: "Combusken", fromDex: 256, toName: "Blaziken", toDex: 257, methodLabel: "Lv 36" },
      { fromName: "Mudkip", fromDex: 258, toName: "Marshtomp", toDex: 259, methodLabel: "Lv 16" },
      { fromName: "Marshtomp", fromDex: 259, toName: "Swampert", toDex: 260, methodLabel: "Lv 36" },
    ],
  },
  {
    name: "Other common level-ups",
    evolutions: [
      { fromName: "Magikarp", fromDex: 129, toName: "Gyarados", toDex: 130, methodLabel: "Lv 20" },
      { fromName: "Wurmple", fromDex: 265, toName: "Silcoon", toDex: 266, methodLabel: "Lv 7" },
      { fromName: "Taillow", fromDex: 276, toName: "Swellow", toDex: 277, methodLabel: "Lv 22" },
      { fromName: "Ralts", fromDex: 280, toName: "Kirlia", toDex: 281, methodLabel: "Lv 20" },
    ],
  },
  {
    name: "Everstone blocks evolution",
    itemIconName: "Everstone",
    iconPath: "sprites/items/icons/everstone.png",
    evolutions: [
      {
        fromName: "Torchic",
        fromDex: 255,
        toName: "Torchic",
        toDex: 255,
        methodLabel: "Blocked",
      },
    ],
  },
];
