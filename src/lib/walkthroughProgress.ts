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
 * Walkthrough progress used for Complete markers.
 * Pregame steps are reference-only: viewing them must not move or clear progress.
 * Selecting a story/postgame step sets progress to that step (same as before for the main path).
 */
export function nextProgressStepId(
  sections: GuideSection[],
  activeStepId: string | undefined,
  previousProgressStepId: string | undefined,
): string | undefined {
  if (!activeStepId) return previousProgressStepId;
  if (isPregameStep(sections, activeStepId)) return previousProgressStepId;
  return activeStepId;
}

/**
 * Step id to store in a save code. Prefer story progress when the user is only
 * browsing a pregame tip so restores land back on the main path.
 */
export function stepIdForSave(
  sections: GuideSection[],
  currentStepId: string | undefined,
  progressStepId: string | undefined,
): string | undefined {
  if (!currentStepId) return progressStepId;
  if (isPregameStep(sections, currentStepId) && progressStepId) {
    return progressStepId;
  }
  return currentStepId;
}

/** Whether a rail step should show the Complete marker. */
export function isStepReached(options: {
  category: string;
  sectionBand: WalkthroughBand | undefined;
  stepFlatIndex: number;
  progressIndex: number;
}): boolean {
  const { category, sectionBand, stepFlatIndex, progressIndex } = options;
  if (category !== "walkthrough") return false;
  if (sectionBand === "pregame") return false;
  if (stepFlatIndex < 0 || progressIndex < 0) return false;
  return stepFlatIndex < progressIndex;
}
