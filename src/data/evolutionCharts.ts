import { BASICS_EVOLUTION_GROUPS } from "./evolutionBasics";
import { FRIENDSHIP_EVOLUTION_GROUPS } from "./evolutionFriendship";
import { EVOLUTION_STONE_GROUPS } from "./evolutionStones";
import { TRADE_EVOLUTION_GROUPS } from "./evolutionTrades";
import { UNIQUE_EVOLUTION_GROUPS } from "./evolutionUnique";
import { assetUrl } from "../lib/assetUrl";

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

function mapItemGroup<T extends { name: string; itemIconName: string; iconPath: string; evolutions: unknown[] }>(
  groups: T[],
  mapEvolution: (edge: T["evolutions"][number], group: T) => EvolutionChartEdge,
): EvolutionChartGroup[] {
  return groups.map((g) => ({
    name: g.name,
    headerIconName: g.itemIconName,
    headerIconPath: g.iconPath,
    evolutions: g.evolutions.map((e) => mapEvolution(e, g)),
  }));
}

/** Ch. 1 Event 1 — how evolution works. */
export const BASICS_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Evolution basics",
  lead: "Level-up is the most common trigger. Hold B to cancel once; hold an Everstone to block evolution entirely.",
  ariaLabel: "Evolution basics chart",
  groups: BASICS_EVOLUTION_GROUPS.map((g) => ({
    name: g.name,
    headerIconName: g.itemIconName,
    headerIconPath: g.iconPath,
    evolutions: g.evolutions.map((e) => ({
      ...e,
      itemIconName: g.itemIconName,
      itemIconPath: g.iconPath,
      // Everstone row: icon only (like stone chart); level-up rows keep Lv label.
      methodLabel: g.itemIconName && e.methodLabel === "Blocked" ? undefined : e.methodLabel,
    })),
  })),
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
  groups: mapItemGroup(TRADE_EVOLUTION_GROUPS, (e, g) => ({
    ...e,
    itemIconName: g.itemIconName,
    itemIconPath: g.iconPath,
  })),
};

/** Ch. 1 Event 4 — friendship / taming (Emerald / Gen 3 only). */
export const FRIENDSHIP_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Friendship (taming) chart",
  lead: "Raise friendship to 220+, then level up. A Soothe Bell (Route 113 Glass Workshop) or Luxury Ball speeds taming. Pichu becomes Pikachu this way — Pikachu itself needs a Thunder Stone for Raichu.",
  ariaLabel: "Friendship evolution chart",
  groups: FRIENDSHIP_EVOLUTION_GROUPS.map((g) => ({
    name: g.name,
    headerIconName: g.itemIconName,
    headerIconPath: g.iconPath,
    evolutions: g.evolutions.map((e) => ({
      fromName: e.fromName,
      fromDex: e.fromDex,
      toName: e.toName,
      toDex: e.toDex,
      itemIconName: e.itemIconName ?? g.itemIconName,
      itemIconPath: e.iconPath ?? g.iconPath,
    })),
  })),
};

/** Ch. 1 Event 5 — unique. */
export const UNIQUE_EVOLUTION_CHART: EvolutionChartSpec = {
  title: "Unique evolution chart",
  lead: "Branching lines, Shedinja's free copy, Beauty → Milotic, Tyrogue's Attack/Defense split, and Emerald's Gardevoir-only Kirlia.",
  ariaLabel: "Unique evolution chart",
  groups: UNIQUE_EVOLUTION_GROUPS.map((g) => ({
    name: g.name,
    headerIconName: g.headerIconName,
    headerIconPath: g.headerIconPath,
    evolutions: g.evolutions.map((e) => ({ ...e })),
  })),
};

export const PREGAME_EVOLUTION_CHARTS: Record<string, EvolutionChartSpec> = {
  "pregame-evolution-1": BASICS_EVOLUTION_CHART,
  "pregame-evolution-2": STONE_EVOLUTION_CHART,
  "pregame-evolution-3": TRADE_EVOLUTION_CHART,
  "pregame-evolution-4": FRIENDSHIP_EVOLUTION_CHART,
  "pregame-evolution-5": UNIQUE_EVOLUTION_CHART,
};
