import type { GuideSection, GuideStep, WalkthroughBand } from "../types";

const PREGAME_CHAPTER_IDS = new Set(["pregame-evolution", "pregame-breeding"]);

const POSTGAME_CHAPTER_IDS = new Set([
  "postgame-opening",
  "battle-frontier",
  "postgame-hoenn",
  "contests-postgame",
  "postgame-events",
]);

/** Entire chapter is optional side content in the main story band. */
const OPTIONAL_CHAPTER_IDS = new Set([
  "contest-prep",
  "contests-lilycove",
  "abandoned-ship",
  "shoal-cave",
  "sealed-chamber",
  "trick-house",
]);

/** Optional events embedded inside otherwise-required chapters. */
const OPTIONAL_STEP_IDS = new Set([
  "route-102-2",
  "mauville-3",
  "mauville-4",
  "verdanturf-3",
  "fallarbor-3",
  "slateport-4",
  "slateport-5",
  "fortree-3",
  "route-120-3",
  "safari-zone-1",
  "safari-zone-2",
  "safari-zone-3",
  "sky-pillar-3",
  "sootopolis-gym-3",
  "pacifidlog-2",
  "trick-1",
  "trick-2",
  "trick-3",
  "trick-4",
  "trick-5",
  "trick-6",
  "trick-7",
  "trick-8",
]);

/** Story-critical steps that must never be marked optional. */
const REQUIRED_STEP_IDS = new Set([
  "sky-pillar-1",
  "sky-pillar-2",
  "sootopolis-1",
  "sootopolis-2",
]);

export function chapterBand(chapterId: string): WalkthroughBand {
  if (PREGAME_CHAPTER_IDS.has(chapterId)) return "pregame";
  if (POSTGAME_CHAPTER_IDS.has(chapterId)) return "postgame";
  return "story";
}

export function isOptionalChapter(chapterId: string): boolean {
  return OPTIONAL_CHAPTER_IDS.has(chapterId);
}

export function isOptionalStep(stepId: string, chapterId: string): boolean {
  if (REQUIRED_STEP_IDS.has(stepId)) return false;
  if (OPTIONAL_CHAPTER_IDS.has(chapterId)) return true;
  return OPTIONAL_STEP_IDS.has(stepId);
}

function ensureOptionalTag(step: GuideStep): void {
  if (!step.optional) return;
  const tags = step.tags ?? [];
  if (!tags.includes("optional")) {
    step.tags = [...tags, "optional"];
  }
}

/** Apply band and optional flags after chapters are assembled and renumbered. */
export function applyWalkthroughMetadata(sections: GuideSection[]): void {
  for (const section of sections) {
    section.band = chapterBand(section.id);
    section.optional = isOptionalChapter(section.id) || undefined;

    for (const step of section.steps) {
      step.optional = isOptionalStep(step.id, section.id) || undefined;
      ensureOptionalTag(step);
    }
  }
}

export {
  OPTIONAL_CHAPTER_IDS,
  OPTIONAL_STEP_IDS,
  PREGAME_CHAPTER_IDS,
  POSTGAME_CHAPTER_IDS,
  REQUIRED_STEP_IDS,
};
