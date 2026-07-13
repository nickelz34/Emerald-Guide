import { EvolutionChart } from "./EvolutionChart";
import { STONE_EVOLUTION_CHART } from "../data/evolutionCharts";

/** @deprecated Prefer EvolutionChart with PREGAME_EVOLUTION_CHARTS — kept for clarity. */
export function StoneEvolutionsPanel() {
  return <EvolutionChart chart={STONE_EVOLUTION_CHART} />;
}
