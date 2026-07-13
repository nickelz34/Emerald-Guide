/** One Pokémon that evolves via friendship (taming) in Emerald. */
export interface FriendshipEvolutionEdge {
  fromName: string;
  fromDex: number;
  toName: string;
  toDex: number;
  /** Override group icon (Eevee day/night). */
  itemIconName?: string;
  iconPath?: string;
}

export interface FriendshipEvolutionGroup {
  name: string;
  itemIconName: string;
  iconPath: string;
  evolutions: FriendshipEvolutionEdge[];
}

/** Emerald friendship evolutions — Soothe Bell icon unless a row overrides (Eevee). */
export const FRIENDSHIP_EVOLUTION_GROUPS: FriendshipEvolutionGroup[] = [
  {
    name: "Baby Pokémon",
    itemIconName: "Soothe Bell",
    iconPath: "sprites/items/icons/soothe_bell.png",
    evolutions: [
      { fromName: "Pichu", fromDex: 172, toName: "Pikachu", toDex: 25 },
      { fromName: "Cleffa", fromDex: 173, toName: "Clefairy", toDex: 35 },
      { fromName: "Igglybuff", fromDex: 174, toName: "Jigglypuff", toDex: 39 },
      { fromName: "Togepi", fromDex: 175, toName: "Togetic", toDex: 176 },
      { fromName: "Azurill", fromDex: 298, toName: "Marill", toDex: 183 },
    ],
  },
  {
    name: "Other friendship evolutions",
    itemIconName: "Soothe Bell",
    iconPath: "sprites/items/icons/soothe_bell.png",
    evolutions: [
      { fromName: "Golbat", fromDex: 42, toName: "Crobat", toDex: 169 },
      { fromName: "Chansey", fromDex: 113, toName: "Blissey", toDex: 242 },
    ],
  },
  {
    name: "Eevee — day & night",
    itemIconName: "Soothe Bell",
    iconPath: "sprites/items/icons/soothe_bell.png",
    evolutions: [
      {
        fromName: "Eevee",
        fromDex: 133,
        toName: "Espeon",
        toDex: 196,
        itemIconName: "Sun Stone",
        iconPath: "sprites/items/icons/sun_stone.png",
      },
      {
        fromName: "Eevee",
        fromDex: 133,
        toName: "Umbreon",
        toDex: 197,
        itemIconName: "Moon Stone",
        iconPath: "sprites/items/icons/moon_stone.png",
      },
    ],
  },
];
