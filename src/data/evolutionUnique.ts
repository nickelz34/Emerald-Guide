/** One edge in the Ch. 1 unique-evolution chart. */
export interface UniqueEvolutionEdge {
  fromName: string;
  fromDex: number;
  toName: string;
  toDex: number;
  methodLabel?: string;
  itemIconName?: string;
  iconPath?: string;
  alsoGets?: { name: string; dex: number }[];
}

export interface UniqueEvolutionGroup {
  name: string;
  headerIconName?: string;
  headerIconPath?: string;
  evolutions: UniqueEvolutionEdge[];
}

/** Ch. 1 Event 5 — branching and one-off Emerald evolution rules. */
export const UNIQUE_EVOLUTION_GROUPS: UniqueEvolutionGroup[] = [
  {
    name: "Wurmple branches (personality)",
    evolutions: [
      { fromName: "Wurmple", fromDex: 265, toName: "Silcoon", toDex: 266, methodLabel: "Lv 7" },
      { fromName: "Silcoon", fromDex: 266, toName: "Beautifly", toDex: 267, methodLabel: "Lv 10" },
      { fromName: "Wurmple", fromDex: 265, toName: "Cascoon", toDex: 268, methodLabel: "Lv 7" },
      { fromName: "Cascoon", fromDex: 268, toName: "Dustox", toDex: 269, methodLabel: "Lv 10" },
    ],
  },
  {
    name: "Tyrogue (Attack vs Defense at Lv 20)",
    evolutions: [
      { fromName: "Tyrogue", fromDex: 236, toName: "Hitmonlee", toDex: 106, methodLabel: "Atk > Def" },
      { fromName: "Tyrogue", fromDex: 236, toName: "Hitmonchan", toDex: 107, methodLabel: "Atk < Def" },
      { fromName: "Tyrogue", fromDex: 236, toName: "Hitmontop", toDex: 237, methodLabel: "Atk = Def" },
    ],
  },
  {
    name: "Nincada → Ninjask + Shedinja",
    headerIconName: "Poké Ball",
    headerIconPath: "sprites/items/icons/poke_ball.png",
    evolutions: [
      {
        fromName: "Nincada",
        fromDex: 290,
        toName: "Ninjask",
        toDex: 291,
        methodLabel: "Lv 20",
        itemIconName: "Poké Ball",
        iconPath: "sprites/items/icons/poke_ball.png",
        alsoGets: [{ name: "Shedinja", dex: 292 }],
      },
    ],
  },
  {
    name: "Feebas → Milotic (Beauty)",
    headerIconName: "Gorgeous Plant",
    headerIconPath: "sprites/items/icons/gorgeous_plant.png",
    evolutions: [
      {
        fromName: "Feebas",
        fromDex: 349,
        toName: "Milotic",
        toDex: 350,
        methodLabel: "Beauty 170+",
        itemIconName: "Gorgeous Plant",
        iconPath: "sprites/items/icons/gorgeous_plant.png",
      },
    ],
  },
  {
    name: "Kirlia → Gardevoir only",
    evolutions: [
      { fromName: "Ralts", fromDex: 280, toName: "Kirlia", toDex: 281, methodLabel: "Lv 20" },
      { fromName: "Kirlia", fromDex: 281, toName: "Gardevoir", toDex: 282, methodLabel: "Lv 30" },
    ],
  },
];
