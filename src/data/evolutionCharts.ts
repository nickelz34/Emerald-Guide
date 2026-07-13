import { assetUrl } from "../lib/assetUrl";
import { EVOLUTION_STONE_GROUPS } from "./evolutionStones";

/** One evolution edge shown in a visual chart. */
export interface EvolutionChartEdge {
  fromName: string;
  fromDex: number;
  toName: string;
  toDex: number;
  /** Text under the arrow when there is no item icon (e.g. "Lv 16", "Trade"). */
  methodLabel?: string;
  itemIconName?: string;
  itemIconPath?: string;
  /** Extra Pokémon created by the evolution (Shedinja). */
  alsoGets?: { name: string; dex: number }[];
}

export interface EvolutionChartGroup {
  name: string;
  headerIconName?: string;
  headerIconPath?: string;
  evolutions: EvolutionChartEdge[];
}

export interface EvolutionChartSpec {
  title: string;
  lead: string;
  ariaLabel: string;
  groups: EvolutionChartGroup[];
}

export function itemIconUrl(path: string): string {
  return assetUrl(path);
}

/** Ch. 1 Event 1 — how evolution works. */
export const BASICS_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Evolution basics",
  lead: "Level-up is the most common trigger. Hold B to cancel once; hold an Everstone to block evolution entirely.",
  ariaLabel: "Evolution basics chart",
  groups: [
    {
      name: "Level-up examples",
      evolutions: [
        {
          fromName: "Magikarp",
          fromDex: 129,
          toName: "Gyarados",
          toDex: 130,
          methodLabel: "Lv 20",
        },
        {
          fromName: "Treecko",
          fromDex: 252,
          toName: "Grovyle",
          toDex: 253,
          methodLabel: "Lv 16",
        },
        {
          fromName: "Wurmple",
          fromDex: 265,
          toName: "Silcoon",
          toDex: 266,
          methodLabel: "Lv 7",
        },
      ],
    },
    {
      name: "Everstone blocks evolution",
      headerIconName: "Everstone",
      headerIconPath: "sprites/items/icons/everstone.png",
      evolutions: [
        {
          fromName: "Torchic",
          fromDex: 255,
          toName: "Torchic",
          toDex: 255,
          methodLabel: "Blocked",
          itemIconName: "Everstone",
          itemIconPath: "sprites/items/icons/everstone.png",
        },
      ],
    },
  ],
};

/** Ch. 1 Event 2 — stones (from evolutionStones data). */
export const STONE_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Stone evolution chart",
  lead: "Every Emerald stone evolution at a glance — Fire, Water, Thunder, Leaf, Moon, and Sun.",
  ariaLabel: "Evolution stone chart",
  groups: EVOLUTION_STONE_GROUPS.map((g) => ({
    name: g.name,
    headerIconName: g.itemIconName,
    headerIconPath: g.iconPath,
    evolutions: g.evolutions.map((e) => ({
      ...e,
      itemIconName: g.itemIconName,
      itemIconPath: g.iconPath,
    })),
  })),
};

/** Ch. 1 Event 3 — trade. */
export const TRADE_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Trade evolution chart",
  lead: "These Pokémon evolve when the trade finishes — some must hold a specific item during the trade.",
  ariaLabel: "Trade evolution chart",
  groups: [
    {
      name: "Trade (no item)",
      evolutions: [
        { fromName: "Kadabra", fromDex: 64, toName: "Alakazam", toDex: 65, methodLabel: "Trade" },
        { fromName: "Machoke", fromDex: 67, toName: "Machamp", toDex: 68, methodLabel: "Trade" },
        { fromName: "Graveler", fromDex: 75, toName: "Golem", toDex: 76, methodLabel: "Trade" },
        { fromName: "Haunter", fromDex: 93, toName: "Gengar", toDex: 94, methodLabel: "Trade" },
      ],
    },
    {
      name: "Trade + Metal Coat",
      headerIconName: "Metal Coat",
      headerIconPath: "sprites/items/icons/metal_coat.png",
      evolutions: [
        {
          fromName: "Onix",
          fromDex: 95,
          toName: "Steelix",
          toDex: 208,
          itemIconName: "Metal Coat",
          itemIconPath: "sprites/items/icons/metal_coat.png",
          methodLabel: "Trade",
        },
        {
          fromName: "Scyther",
          fromDex: 123,
          toName: "Scizor",
          toDex: 212,
          itemIconName: "Metal Coat",
          itemIconPath: "sprites/items/icons/metal_coat.png",
          methodLabel: "Trade",
        },
      ],
    },
    {
      name: "Trade + Dragon Scale",
      headerIconName: "Dragon Scale",
      headerIconPath: "sprites/items/icons/dragon_scale.png",
      evolutions: [
        {
          fromName: "Seadra",
          fromDex: 117,
          toName: "Kingdra",
          toDex: 230,
          itemIconName: "Dragon Scale",
          itemIconPath: "sprites/items/icons/dragon_scale.png",
          methodLabel: "Trade",
        },
      ],
    },
    {
      name: "Trade + King’s Rock",
      headerIconName: "King’s Rock",
      headerIconPath: "sprites/items/icons/king_s_rock.png",
      evolutions: [
        {
          fromName: "Poliwhirl",
          fromDex: 61,
          toName: "Politoed",
          toDex: 186,
          itemIconName: "King’s Rock",
          itemIconPath: "sprites/items/icons/king_s_rock.png",
          methodLabel: "Trade",
        },
        {
          fromName: "Slowpoke",
          fromDex: 79,
          toName: "Slowking",
          toDex: 199,
          itemIconName: "King’s Rock",
          itemIconPath: "sprites/items/icons/king_s_rock.png",
          methodLabel: "Trade",
        },
      ],
    },
    {
      name: "Trade + Up-Grade",
      headerIconName: "Up-Grade",
      headerIconPath: "sprites/items/icons/up_grade.png",
      evolutions: [
        {
          fromName: "Porygon",
          fromDex: 137,
          toName: "Porygon2",
          toDex: 233,
          itemIconName: "Up-Grade",
          itemIconPath: "sprites/items/icons/up_grade.png",
          methodLabel: "Trade",
        },
      ],
    },
    {
      name: "Trade + Deep Sea items",
      evolutions: [
        {
          fromName: "Clamperl",
          fromDex: 366,
          toName: "Huntail",
          toDex: 367,
          itemIconName: "Deep Sea Tooth",
          itemIconPath: "sprites/items/icons/deep_sea_tooth.png",
          methodLabel: "Trade",
        },
        {
          fromName: "Clamperl",
          fromDex: 366,
          toName: "Gorebyss",
          toDex: 368,
          itemIconName: "Deep Sea Scale",
          itemIconPath: "sprites/items/icons/deep_sea_scale.png",
          methodLabel: "Trade",
        },
      ],
    },
  ],
};

/** Ch. 1 Event 4 — friendship / taming (Emerald / Gen 3 only). */
export const FRIENDSHIP_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Friendship (taming) chart",
  lead: "Raise friendship to 220+, then level up. A Soothe Bell (Route 113 Glass Workshop) or Luxury Ball speeds taming. Pichu becomes Pikachu this way — Pikachu itself needs a Thunder Stone for Raichu.",
  ariaLabel: "Friendship evolution chart",
  groups: [
    {
      name: "Baby Pokémon",
      headerIconName: "Soothe Bell",
      headerIconPath: "sprites/items/icons/soothe_bell.png",
      evolutions: [
        {
          fromName: "Pichu",
          fromDex: 172,
          toName: "Pikachu",
          toDex: 25,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
        {
          fromName: "Cleffa",
          fromDex: 173,
          toName: "Clefairy",
          toDex: 35,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
        {
          fromName: "Igglybuff",
          fromDex: 174,
          toName: "Jigglypuff",
          toDex: 39,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
        {
          fromName: "Togepi",
          fromDex: 175,
          toName: "Togetic",
          toDex: 176,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
        {
          fromName: "Azurill",
          fromDex: 298,
          toName: "Marill",
          toDex: 183,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
      ],
    },
    {
      name: "Other friendship evolutions",
      evolutions: [
        {
          fromName: "Golbat",
          fromDex: 42,
          toName: "Crobat",
          toDex: 169,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
        {
          fromName: "Chansey",
          fromDex: 113,
          toName: "Blissey",
          toDex: 242,
          methodLabel: "Friendship",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
      ],
    },
    {
      name: "Eevee — day & night",
      evolutions: [
        {
          fromName: "Eevee",
          fromDex: 133,
          toName: "Espeon",
          toDex: 196,
          methodLabel: "Day",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
        {
          fromName: "Eevee",
          fromDex: 133,
          toName: "Umbreon",
          toDex: 197,
          methodLabel: "Night",
          itemIconName: "Soothe Bell",
          itemIconPath: "sprites/items/icons/soothe_bell.png",
        },
      ],
    },
  ],
};

/** Ch. 1 Event 5 — unique. */
export const UNIQUE_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Unique evolution chart",
  lead: "Branching lines, Shedinja’s free copy, Beauty → Milotic, Tyrogue’s Attack/Defense split, and Emerald’s Gardevoir-only Kirlia.",
  ariaLabel: "Unique evolution chart",
  groups: [
    {
      name: "Wurmple branches (personality)",
      evolutions: [
        {
          fromName: "Wurmple",
          fromDex: 265,
          toName: "Silcoon",
          toDex: 266,
          methodLabel: "Lv 7",
        },
        {
          fromName: "Silcoon",
          fromDex: 266,
          toName: "Beautifly",
          toDex: 267,
          methodLabel: "Lv 10",
        },
        {
          fromName: "Wurmple",
          fromDex: 265,
          toName: "Cascoon",
          toDex: 268,
          methodLabel: "Lv 7",
        },
        {
          fromName: "Cascoon",
          fromDex: 268,
          toName: "Dustox",
          toDex: 269,
          methodLabel: "Lv 10",
        },
      ],
    },
    {
      name: "Tyrogue (Attack vs Defense at Lv 20)",
      evolutions: [
        {
          fromName: "Tyrogue",
          fromDex: 236,
          toName: "Hitmonlee",
          toDex: 106,
          methodLabel: "Atk > Def",
        },
        {
          fromName: "Tyrogue",
          fromDex: 236,
          toName: "Hitmonchan",
          toDex: 107,
          methodLabel: "Atk < Def",
        },
        {
          fromName: "Tyrogue",
          fromDex: 236,
          toName: "Hitmontop",
          toDex: 237,
          methodLabel: "Atk = Def",
        },
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
          itemIconPath: "sprites/items/icons/poke_ball.png",
          alsoGets: [{ name: "Shedinja", dex: 292 }],
        },
      ],
    },
    {
      name: "Feebas → Milotic (Beauty)",
      evolutions: [
        {
          fromName: "Feebas",
          fromDex: 349,
          toName: "Milotic",
          toDex: 350,
          methodLabel: "Beauty 170+",
        },
      ],
    },
    {
      name: "Kirlia → Gardevoir only",
      evolutions: [
        {
          fromName: "Ralts",
          fromDex: 280,
          toName: "Kirlia",
          toDex: 281,
          methodLabel: "Lv 20",
        },
        {
          fromName: "Kirlia",
          fromDex: 281,
          toName: "Gardevoir",
          toDex: 282,
          methodLabel: "Lv 30",
        },
      ],
    },
  ],
};

export const PREGAME_EVOLUTION_CHARTS: Record<string, EvolutionChartSpec> = {
  "pregame-evolution-1": BASICS_EVOLUTION_CHART,
  "pregame-evolution-2": STONE_EVOLUTION_CHART,
  "pregame-evolution-3": TRADE_EVOLUTION_CHART,
  "pregame-evolution-4": FRIENDSHIP_EVOLUTION_CHART,
  "pregame-evolution-5": UNIQUE_EVOLUTION_CHART,
};
