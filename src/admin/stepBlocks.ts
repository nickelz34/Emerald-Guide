import { getStepImages } from "../data/stepImages";
import { PREGAME_BREEDING_CHARTS } from "../data/breedingCharts";
import { PREGAME_EVOLUTION_CHARTS } from "../data/evolutionCharts";
import type { GuideStep } from "../types";
import { getAvailablePanelsForStep } from "./availablePanels";

export type StepBlockId =
  | "summary"
  | "story"
  | "details"
  | "tips"
  | "secrets"
  | "media"
  | "sprites"
  | "encounters"
  | "tags"
  | "panel:breeding-lookup"
  | "panel:evolution-chart"
  | "panel:breeding-chart"
  | `media-item:${string}`
  | `sprite-item:${string}`
  | `panel:${string}`;

export interface StepBlockDescriptor {
  id: StepBlockId;
  label: string;
}

function panelLabel(panelId: string): string {
  const labels: Record<string, string> = {
    gym: "Gym guide",
    rival: "Rival battle",
    "story-trainer": "Story trainer",
    starter: "Starter choice",
    ralts: "Ralts spotlight",
    "flower-shop": "Flower shop",
    encounters: "Wild encounters",
    "battle-basics": "Battle basics",
    "hm-table": "HM unlock table",
    "key-items": "Key items table",
    "fishing-table": "Fishing table",
    "poke-balls": "Poké Ball table",
    "type-chart": "Type chart",
    "status-table": "Status table",
    "nature-table": "Nature table",
    "vitamins-table": "Vitamins table",
    "tm-hm-table": "TM/HM table",
    scott: "Scott sightings",
    "match-call": "Match Call",
    "breeding-lookup": "Breeding lookup",
    "evolution-chart": "Evolution chart",
    "breeding-chart": "Breeding chart",
  };
  return labels[panelId] ?? panelId;
}

/** Blocks that currently exist on this step (ignoring custom layout). */
export function getAvailableStepBlocks(step: GuideStep): StepBlockDescriptor[] {
  const blocks: StepBlockDescriptor[] = [];
  const hidden = new Set(step.hiddenPanels ?? []);

  if (step.summary?.trim()) blocks.push({ id: "summary", label: "Summary" });
  if (step.story?.length) blocks.push({ id: "story", label: "Story" });

  const cmsMedia = (step.media ?? []).filter((item) => item.url || item.areaMapId || item.crop);
  if (step.useCustomMedia) {
    if (cmsMedia.length === 0) {
      // empty custom gallery — still allow a media slot so order is preserved
      blocks.push({ id: "media", label: "Images & maps (empty)" });
    } else {
      for (const item of cmsMedia) {
        blocks.push({
          id: `media-item:${item.id}`,
          label: `Image: ${item.caption || item.type}`,
        });
      }
    }
  } else if (getStepImages(step.id).length > 0 || cmsMedia.length > 0) {
    if (cmsMedia.length > 0) {
      for (const item of cmsMedia) {
        blocks.push({
          id: `media-item:${item.id}`,
          label: `Image: ${item.caption || item.type}`,
        });
      }
    } else {
      blocks.push({ id: "media", label: "Images & maps" });
    }
  }

  for (const item of step.sprites ?? []) {
    blocks.push({
      id: `sprite-item:${item.id}`,
      label: `Sprite: ${item.caption || item.label}`,
    });
  }

  for (const panel of getAvailablePanelsForStep(step)) {
    if (panel.id === "encounters") continue; // handled as encounters block
    if (hidden.has(panel.id)) continue;
    blocks.push({ id: `panel:${panel.id}`, label: panel.label });
  }

  if (step.tags?.includes("breeding-lookup") && !hidden.has("breeding-lookup")) {
    if (!blocks.some((b) => b.id === "panel:breeding-lookup")) {
      blocks.push({ id: "panel:breeding-lookup", label: "Breeding lookup" });
    }
  }
  if (PREGAME_EVOLUTION_CHARTS[step.id] && !hidden.has("evolution-chart")) {
    if (!blocks.some((b) => b.id === "panel:evolution-chart")) {
      blocks.push({ id: "panel:evolution-chart", label: "Evolution chart" });
    }
  }
  if (PREGAME_BREEDING_CHARTS[step.id] && !hidden.has("breeding-chart")) {
    if (!blocks.some((b) => b.id === "panel:breeding-chart")) {
      blocks.push({ id: "panel:breeding-chart", label: "Breeding chart" });
    }
  }

  if (step.details.length) blocks.push({ id: "details", label: "Details / objectives" });
  if (step.tips?.length) blocks.push({ id: "tips", label: "Tips" });
  if (step.secrets?.length || step.specialty?.encounters?.secrets?.length) {
    blocks.push({ id: "secrets", label: "Secrets" });
  }

  const encountersAvailable = getAvailablePanelsForStep(step).some((p) => p.id === "encounters");
  if (encountersAvailable && !hidden.has("encounters")) {
    blocks.push({ id: "encounters", label: "Wild encounters" });
  }

  if (step.tags?.length) blocks.push({ id: "tags", label: "Tags" });

  return blocks;
}

const DEFAULT_ORDER_PRIORITY: string[] = [
  "summary",
  "story",
  "media",
  "sprites",
  "panel:battle-basics",
  "panel:starter",
  "panel:ralts",
  "panel:flower-shop",
  "panel:gym",
  "panel:rival",
  "panel:story-trainer",
  "panel:hm-table",
  "panel:key-items",
  "panel:fishing-table",
  "panel:poke-balls",
  "panel:type-chart",
  "panel:status-table",
  "panel:nature-table",
  "panel:vitamins-table",
  "panel:tm-hm-table",
  "panel:scott",
  "panel:match-call",
  "panel:breeding-lookup",
  "panel:evolution-chart",
  "panel:breeding-chart",
  "details",
  "tips",
  "secrets",
  "encounters",
  "tags",
];

function defaultPriorityIndex(id: StepBlockId): number {
  if (id.startsWith("media-item:")) return DEFAULT_ORDER_PRIORITY.indexOf("media");
  if (id.startsWith("sprite-item:")) return DEFAULT_ORDER_PRIORITY.indexOf("sprites");
  return DEFAULT_ORDER_PRIORITY.indexOf(id);
}

function sortByDefaultPriority(ids: StepBlockId[]): StepBlockId[] {
  return ids.slice().sort((a, b) => {
    const aIdx = defaultPriorityIndex(a);
    const bIdx = defaultPriorityIndex(b);
    const aRank = aIdx === -1 ? 999 : aIdx;
    const bRank = bIdx === -1 ? 999 : bIdx;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b);
  });
}

/**
 * Merge saved blockOrder with currently available blocks.
 * Keeps relative order of known ids; appends new blocks in default positions.
 */
export function resolveStepBlockOrder(step: GuideStep): StepBlockDescriptor[] {
  const available = getAvailableStepBlocks(step);
  const availableIds = new Set(available.map((b) => b.id));
  const byId = new Map(available.map((b) => [b.id, b]));

  const saved = (step.blockOrder ?? []).filter((id): id is StepBlockId =>
    availableIds.has(id as StepBlockId),
  );

  const missing = available
    .map((b) => b.id)
    .filter((id) => !saved.includes(id));
  const orderedMissing = sortByDefaultPriority(missing);

  // Insert missing blocks by default priority relative to saved list.
  const result: StepBlockId[] = [...saved];
  for (const id of orderedMissing) {
    const priority = defaultPriorityIndex(id);
    let insertAt = result.length;
    for (let i = 0; i < result.length; i++) {
      const otherPriority = defaultPriorityIndex(result[i]);
      if ((priority === -1 ? 999 : priority) < (otherPriority === -1 ? 999 : otherPriority)) {
        insertAt = i;
        break;
      }
    }
    result.splice(insertAt, 0, id);
  }

  return result.map((id) => byId.get(id)!).filter(Boolean);
}

export function blockLabel(id: StepBlockId): string {
  if (id.startsWith("media-item:")) return `Image (${id.slice("media-item:".length)})`;
  if (id.startsWith("sprite-item:")) return `Sprite (${id.slice("sprite-item:".length)})`;
  if (id.startsWith("panel:")) return panelLabel(id.slice("panel:".length));
  const labels: Record<string, string> = {
    summary: "Summary",
    story: "Story",
    details: "Details / objectives",
    tips: "Tips",
    secrets: "Secrets",
    media: "Images & maps",
    sprites: "Sprites",
    encounters: "Wild encounters",
    tags: "Tags",
  };
  return labels[id] ?? id;
}
