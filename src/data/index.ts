import { walkthrough } from "./walkthrough";
import { encounters } from "./encounters";
import type { GuideData, GuideCategory, GuideSection, GuideStep } from "../types";

export const guideData: GuideData = {
  walkthrough,
  encounters,
};

export const CATEGORY_ORDER: GuideCategory[] = ["walkthrough", "encounters"];

export function getAllStepIds(): string[] {
  return Object.values(guideData).flatMap((sections) =>
    sections.flatMap((section: GuideSection) =>
      section.steps.map((step: GuideStep) => step.id),
    ),
  );
}

export function getFlatSteps(category?: GuideCategory): GuideStep[] {
  const categories = category ? [category] : CATEGORY_ORDER;
  return categories.flatMap((cat) => guideData[cat].flatMap((s) => s.steps));
}

export function getStepById(stepId: string): GuideStep | undefined {
  return getFlatSteps().find((s) => s.id === stepId);
}

export function getStepCategory(stepId: string): GuideCategory | undefined {
  for (const cat of CATEGORY_ORDER) {
    if (guideData[cat].some((sec) => sec.steps.some((s) => s.id === stepId))) {
      return cat;
    }
  }
  return undefined;
}

export function getTotalStepCount(): number {
  return getAllStepIds().length;
}
