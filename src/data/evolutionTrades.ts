/** One Pokémon that evolves via trade in Emerald. */
export interface TradeEvolutionEdge {
  fromName: string;
  fromDex: number;
  toName: string;
  toDex: number;
}

export interface TradeEvolutionGroup {
  name: string;
  itemIconName: string;
  iconPath: string;
  evolutions: TradeEvolutionEdge[];
}

/**
 * Emerald trade evolutions — grouped by held item (or Poké Ball for plain trades).
 * Dex numbers are National Pokédex (#1–386) for emeraldSpriteUrl.
 */
export const TRADE_EVOLUTION_GROUPS: TradeEvolutionGroup[] = [
  {
    name: "Trade (no item)",
    itemIconName: "Poké Ball",
    iconPath: "sprites/items/icons/poke_ball.png",
    evolutions: [
      { fromName: "Kadabra", fromDex: 64, toName: "Alakazam", toDex: 65 },
      { fromName: "Machoke", fromDex: 67, toName: "Machamp", toDex: 68 },
      { fromName: "Graveler", fromDex: 75, toName: "Golem", toDex: 76 },
      { fromName: "Haunter", fromDex: 93, toName: "Gengar", toDex: 94 },
    ],
  },
  {
    name: "Trade + Metal Coat",
    itemIconName: "Metal Coat",
    iconPath: "sprites/items/icons/metal_coat.png",
    evolutions: [
      { fromName: "Onix", fromDex: 95, toName: "Steelix", toDex: 208 },
      { fromName: "Scyther", fromDex: 123, toName: "Scizor", toDex: 212 },
    ],
  },
  {
    name: "Trade + Dragon Scale",
    itemIconName: "Dragon Scale",
    iconPath: "sprites/items/icons/dragon_scale.png",
    evolutions: [{ fromName: "Seadra", fromDex: 117, toName: "Kingdra", toDex: 230 }],
  },
  {
    name: "Trade + King's Rock",
    itemIconName: "King's Rock",
    iconPath: "sprites/items/icons/king_s_rock.png",
    evolutions: [
      { fromName: "Poliwhirl", fromDex: 61, toName: "Politoed", toDex: 186 },
      { fromName: "Slowpoke", fromDex: 79, toName: "Slowking", toDex: 199 },
    ],
  },
  {
    name: "Trade + Up-Grade",
    itemIconName: "Up-Grade",
    iconPath: "sprites/items/icons/up_grade.png",
    evolutions: [{ fromName: "Porygon", fromDex: 137, toName: "Porygon2", toDex: 233 }],
  },
  {
    name: "Trade + Deep Sea Tooth",
    itemIconName: "Deep Sea Tooth",
    iconPath: "sprites/items/icons/deep_sea_tooth.png",
    evolutions: [{ fromName: "Clamperl", fromDex: 366, toName: "Huntail", toDex: 367 }],
  },
  {
    name: "Trade + Deep Sea Scale",
    itemIconName: "Deep Sea Scale",
    iconPath: "sprites/items/icons/deep_sea_scale.png",
    evolutions: [{ fromName: "Clamperl", fromDex: 366, toName: "Gorebyss", toDex: 368 }],
  },
];
