import { DAY_CARE_BREEDING_CHART } from "./breedingDayCareChart";
import { EGG_GROUPS_BREEDING_CHART } from "./breedingEggGroupsChart";
import { INCENSE_BREEDING_CHART } from "./breedingIncenseChart";
import { INHERITANCE_BREEDING_CHART } from "./breedingInheritanceChart";
import { EGG_MOVES_BREEDING_CHART } from "./breedingEggMovesChart";
import { HATCHING_BREEDING_CHART } from "./breedingHatchingChart";
import type { BreedingChartSpec } from "./breedingChartTypes";

export type { BreedingChartSpec, BreedingChartGroup, BreedingPairEdge, BreedingMonRef } from "./breedingChartTypes";

export const PREGAME_BREEDING_CHARTS: Record<string, BreedingChartSpec> = {
  "pregame-breeding-1": DAY_CARE_BREEDING_CHART,
  "pregame-breeding-2": EGG_GROUPS_BREEDING_CHART,
  "pregame-breeding-3": INCENSE_BREEDING_CHART,
  "pregame-breeding-4": INHERITANCE_BREEDING_CHART,
  "pregame-breeding-5": EGG_MOVES_BREEDING_CHART,
  "pregame-breeding-6": HATCHING_BREEDING_CHART,
};
