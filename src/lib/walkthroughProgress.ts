import type { GuideSection, WalkthroughBand } from "../types";

/** Band for the chapter that owns `stepId`, if present in the visible guide. */
export function bandForStep(
  sections: GuideSection[],
  stepId: string | undefined,
): WalkthroughBand | undefined {
  if (!stepId) return undefined;
  return sections.find((section) => section.steps.some((step) => step.id === stepId))?.band;
}

/** True when the step belongs to a pregame (reference) chapter. */
export function isPregameStep(sections: GuideSection[], stepId: string | undefined): boolean {
  return bandForStep(sections, stepId) === "pregame";
}

/**
 * Step id to store in a save code. Prefer a completed story/postgame step when the
 * user is only browsing a pregame tip so restores land back on the main path.
 */
export function stepIdForSave(
  sections: GuideSection[],
  currentStepId: string | undefined,
  completedStepIds: readonly string[] | undefined,
): string | undefined {
  if (!currentStepId) {
    return furthestCompletedStepId(sections, completedStepIds);
  }
  if (isPregameStep(sections, currentStepId)) {
    return furthestCompletedStepId(sections, completedStepIds) ?? currentStepId;
  }
  return currentStepId;
}

/** Whether a rail step should show the Complete marker (user-marked only). */
export function isStepCompleted(options: {
  category: string;
  sectionBand: WalkthroughBand | undefined;
  stepId: string;
  completedStepIds: ReadonlySet<string>;
}): boolean {
  const { category, sectionBand, stepId, completedStepIds } = options;
  if (category !== "walkthrough") return false;
  if (sectionBand === "pregame") return false;
  return completedStepIds.has(stepId);
}

/** Whether the active walkthrough event can be marked complete. */
export function canMarkStepComplete(
  category: string,
  sectionBand: WalkthroughBand | undefined,
): boolean {
  return category === "walkthrough" && sectionBand !== "pregame";
}

/** Furthest story/postgame completed step id in visible guide order. */
export function furthestCompletedStepId(
  sections: GuideSection[],
  completedStepIds: readonly string[] | undefined,
): string | undefined {
  if (!completedStepIds?.length) return undefined;
  const completed = new Set(completedStepIds);
  let furthest: string | undefined;
  for (const section of sections) {
    if (section.band === "pregame") continue;
    for (const step of section.steps) {
      if (completed.has(step.id)) furthest = step.id;
    }
  }
  return furthest;
}

/** Flat index of the furthest completed story/postgame step, or -1. */
export function furthestCompletedIndex(
  flatStepIds: readonly string[],
  sections: GuideSection[],
  completedStepIds: readonly string[] | undefined,
): number {
  const furthestId = furthestCompletedStepId(sections, completedStepIds);
  if (!furthestId) return -1;
  return flatStepIds.indexOf(furthestId);
}

/** Toggle a step id in the completed list (no duplicates). */
export function toggleCompletedStepId(
  completedStepIds: readonly string[] | undefined,
  stepId: string,
): string[] {
  const current = completedStepIds ?? [];
  if (current.includes(stepId)) {
    return current.filter((id) => id !== stepId);
  }
  return [...current, stepId];
}

/** Normalize stored completed ids to a unique string array. */
export function normalizeCompletedStepIds(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const ids = value.filter((id): id is string => typeof id === "string" && id.length > 0);
  if (ids.length === 0) return undefined;
  return [...new Set(ids)];
}
