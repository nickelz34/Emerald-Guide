/**
 * Emerald (Gen III) vitamin reference — EV gains, soft caps, and shop notes.
 */

export interface VitaminRow {
  id: string;
  name: string;
  /** Battle stat that receives the EVs. */
  stat: string;
  /** Effort Values added per use (plain language). */
  evGain: string;
  /** When the vitamin stops working on that Pokémon. */
  failsWhen: string;
  price: string;
  obtain: string;
  /** Short effect blurb for the card. */
  effect: string;
  /** Key in itemIconsGenerated / bag icon name. */
  iconName: string;
}

export const VITAMIN_TABLE: VitaminRow[] = [
  {
    id: "hp-up",
    name: "HP Up",
    stat: "HP",
    evGain: "+10 HP EVs",
    failsWhen: "That Pokémon already has 100+ HP EVs",
    price: "₽9,800",
    obtain: "Energy Guru (Slateport Market); Lilycove Dept Store 3F; Frontier marts",
    effect: "Feeds the HP Effort Value pool used when stats are calculated.",
    iconName: "HP Up",
  },
  {
    id: "protein",
    name: "Protein",
    stat: "Attack",
    evGain: "+10 Attack EVs",
    failsWhen: "That Pokémon already has 100+ Attack EVs",
    price: "₽9,800",
    obtain: "Energy Guru (Slateport Market); Lilycove Dept Store 3F; Frontier marts",
    effect: "Best early buy for physical attackers that want more Attack EVs.",
    iconName: "Protein",
  },
  {
    id: "iron",
    name: "Iron",
    stat: "Defense",
    evGain: "+10 Defense EVs",
    failsWhen: "That Pokémon already has 100+ Defense EVs",
    price: "₽9,800",
    obtain: "Energy Guru (Slateport Market); Lilycove Dept Store 3F; Frontier marts",
    effect: "Builds physical bulk before you finish the rest with battles.",
    iconName: "Iron",
  },
  {
    id: "calcium",
    name: "Calcium",
    stat: "Sp. Atk",
    evGain: "+10 Sp. Atk EVs",
    failsWhen: "That Pokémon already has 100+ Sp. Atk EVs",
    price: "₽9,800",
    obtain: "Energy Guru (Slateport Market); Lilycove Dept Store 3F; Frontier marts; route pickups",
    effect: "Special attackers want this — skip it on pure physical sets.",
    iconName: "Calcium",
  },
  {
    id: "zinc",
    name: "Zinc",
    stat: "Sp. Def",
    evGain: "+10 Sp. Def EVs",
    failsWhen: "That Pokémon already has 100+ Sp. Def EVs",
    price: "₽9,800",
    obtain: "Energy Guru (Slateport Market); Lilycove Dept Store 3F; Frontier marts",
    effect: "Raises special bulk for walls and mixed tanks.",
    iconName: "Zinc",
  },
  {
    id: "carbos",
    name: "Carbos",
    stat: "Speed",
    evGain: "+10 Speed EVs",
    failsWhen: "That Pokémon already has 100+ Speed EVs",
    price: "₽9,800",
    obtain: "Energy Guru (Slateport Market); Lilycove Dept Store 3F; Frontier marts; route pickups",
    effect: "Speed EVs decide who moves first — often as important as Attack.",
    iconName: "Carbos",
  },
];
