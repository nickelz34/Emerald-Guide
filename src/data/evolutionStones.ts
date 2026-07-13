import { assetUrl } from "../lib/assetUrl";

/** One Pokémon that evolves when given a specific Evolution stone. */
export interface StoneEvolutionEdge {
  fromName: string;
  fromDex: number;
  toName: string;
  toDex: number;
}

export interface EvolutionStoneGroup {
  /** Display name shown in the guide. */
  name: string;
  /** Key into ITEM_BAG_ICONS / getItemBagIcon. */
  itemIconName: string;
  /** Path under public/ for the bag sprite (fallback if lookup fails). */
  iconPath: string;
  evolutions: StoneEvolutionEdge[];
}

/**
 * Emerald Evolution stones and the species they evolve.
 * Dex numbers are National Pokédex (#1–386) for emeraldSpriteUrl.
 */
export const EVOLUTION_STONE_GROUPS: EvolutionStoneGroup[] = [
  {
    name: "Fire Stone",
    itemIconName: "Fire Stone",
    iconPath: "sprites/items/icons/fire_stone.png",
    evolutions: [
      { fromName: "Growlithe", fromDex: 58, toName: "Arcanine", toDex: 59 },
      { fromName: "Vulpix", fromDex: 37, toName: "Ninetales", toDex: 38 },
      { fromName: "Eevee", fromDex: 133, toName: "Flareon", toDex: 136 },
    ],
  },
  {
    name: "Water Stone",
    itemIconName: "Water Stone",
    iconPath: "sprites/items/icons/water_stone.png",
    evolutions: [
      { fromName: "Poliwhirl", fromDex: 61, toName: "Poliwrath", toDex: 62 },
      { fromName: "Shellder", fromDex: 90, toName: "Cloyster", toDex: 91 },
      { fromName: "Staryu", fromDex: 120, toName: "Starmie", toDex: 121 },
      { fromName: "Lombre", fromDex: 271, toName: "Ludicolo", toDex: 272 },
      { fromName: "Eevee", fromDex: 133, toName: "Vaporeon", toDex: 134 },
    ],
  },
  {
    name: "Thunder Stone",
    itemIconName: "Thunderstone",
    iconPath: "sprites/items/icons/thunderstone.png",
    evolutions: [
      { fromName: "Pikachu", fromDex: 25, toName: "Raichu", toDex: 26 },
      { fromName: "Eevee", fromDex: 133, toName: "Jolteon", toDex: 135 },
    ],
  },
  {
    name: "Leaf Stone",
    itemIconName: "Leaf Stone",
    iconPath: "sprites/items/icons/leaf_stone.png",
    evolutions: [
      { fromName: "Gloom", fromDex: 44, toName: "Vileplume", toDex: 45 },
      { fromName: "Weepinbell", fromDex: 70, toName: "Victreebel", toDex: 71 },
      { fromName: "Exeggcute", fromDex: 102, toName: "Exeggutor", toDex: 103 },
      { fromName: "Nuzleaf", fromDex: 274, toName: "Shiftry", toDex: 275 },
    ],
  },
  {
    name: "Moon Stone",
    itemIconName: "Moon Stone",
    iconPath: "sprites/items/icons/moon_stone.png",
    evolutions: [
      { fromName: "Nidorina", fromDex: 30, toName: "Nidoqueen", toDex: 31 },
      { fromName: "Nidorino", fromDex: 33, toName: "Nidoking", toDex: 34 },
      { fromName: "Clefairy", fromDex: 35, toName: "Clefable", toDex: 36 },
      { fromName: "Jigglypuff", fromDex: 39, toName: "Wigglytuff", toDex: 40 },
      { fromName: "Skitty", fromDex: 300, toName: "Delcatty", toDex: 301 },
    ],
  },
  {
    name: "Sun Stone",
    itemIconName: "Sun Stone",
    iconPath: "sprites/items/icons/sun_stone.png",
    evolutions: [
      { fromName: "Gloom", fromDex: 44, toName: "Bellossom", toDex: 182 },
      { fromName: "Sunkern", fromDex: 191, toName: "Sunflora", toDex: 192 },
    ],
  },
];

export function stoneIconUrl(group: EvolutionStoneGroup): string {
  return assetUrl(group.iconPath);
}
