import { getAreasForStep } from "../data/areaData";
import { PREGAME_BREEDING_CHARTS } from "../data/breedingCharts";
import { PREGAME_EVOLUTION_CHARTS } from "../data/evolutionCharts";
import { getGymForWalkthroughStep } from "../data/gymData";
import { getRivalForWalkthroughStep } from "../data/rivalData";
import { getStoryTrainerForWalkthroughStep } from "../data/storyTrainerBattles";
import type { GuideStep } from "../types";

export interface AvailablePanel {
  id: string;
  label: string;
}

/** Panels that can actually appear on this step (ignores hide toggles). */
export function getAvailablePanelsForStep(step: GuideStep): AvailablePanel[] {
  const panels: AvailablePanel[] = [];
  const id = step.id;

  if (getGymForWalkthroughStep(id)) panels.push({ id: "gym", label: "Gym guide" });
  if (getRivalForWalkthroughStep(id)) panels.push({ id: "rival", label: "Rival battle" });
  if (getStoryTrainerForWalkthroughStep(id)) {
    panels.push({ id: "story-trainer", label: "Story trainer" });
  }
  if (id === "route-101-2") panels.push({ id: "starter", label: "Starter choice" });
  if (id === "route-102-2") panels.push({ id: "ralts", label: "Ralts spotlight" });
  if (id === "route-104-2") panels.push({ id: "flower-shop", label: "Flower shop" });
  if (getAreasForStep(id).length > 0) {
    panels.push({ id: "encounters", label: "Wild encounters" });
  }
  if (id === "pregame-battles-1") panels.push({ id: "battle-basics", label: "Battle basics" });
  if (id === "rustboro-1") panels.push({ id: "hm-table", label: "HM unlock table" });
  if (id === "rusturf-tunnel-2") panels.push({ id: "key-items", label: "Key items table" });
  if (id === "pregame-field-3") {
    panels.push({ id: "feebas-tiles", label: "Feebas tiles" });
    panels.push({ id: "fishing-table", label: "Fishing table" });
  }
  if (id === "pregame-field-5") panels.push({ id: "poke-balls", label: "Poké Ball table" });
  if (id === "pregame-battles-3") panels.push({ id: "type-chart", label: "Type chart" });
  if (id === "pregame-battles-6") panels.push({ id: "status-table", label: "Status table" });
  if (id === "pregame-battles-7") panels.push({ id: "nature-table", label: "Nature table" });
  if (id === "pregame-battles-8") panels.push({ id: "vitamins-table", label: "Vitamins table" });
  if (id === "pregame-battles-9") panels.push({ id: "tm-hm-table", label: "TM/HM table" });
  if (id === "battle-frontier-2") panels.push({ id: "scott", label: "Scott sightings" });
  if (id === "postgame-hoenn-6") panels.push({ id: "match-call", label: "Match Call" });
  if (step.tags?.includes("breeding-lookup")) {
    panels.push({ id: "breeding-lookup", label: "Breeding lookup" });
  }
  if (PREGAME_EVOLUTION_CHARTS[id]) {
    panels.push({ id: "evolution-chart", label: "Evolution chart" });
  }
  if (PREGAME_BREEDING_CHARTS[id]) {
    panels.push({ id: "breeding-chart", label: "Breeding chart" });
  }

  return panels;
}
