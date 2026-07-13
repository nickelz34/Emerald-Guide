import type { GuideSection } from "../types";
import type { WalkthroughPreferences } from "../hooks/useWalkthroughPreferences";

/** Filter walkthrough chapters/steps based on player preferences. */
export function filterWalkthroughSections(
  sections: GuideSection[],
  prefs: WalkthroughPreferences,
): GuideSection[] {
  let filtered = sections;

  if (prefs.skipPregame) {
    filtered = filtered.filter((section) => section.band !== "pregame");
  }

  if (prefs.playMode === "storyline") {
    filtered = filtered
      .map((section) => {
        if (section.band !== "story") return section;
        if (section.optional) return null;

        const steps = section.steps.filter((step) => !step.optional);
        if (steps.length === 0) return null;

        return { ...section, steps };
      })
      .filter((section): section is GuideSection => section !== null);
  }

  return filtered;
}

/** First visible step id after filtering, or undefined if empty. */
export function getFirstVisibleStepId(sections: GuideSection[]): string | undefined {
  return sections[0]?.steps[0]?.id;
}

/** Nearest visible step when the current step is hidden by filters. */
export function resolveVisibleStepId(
  sections: GuideSection[],
  stepId: string | undefined,
): string | undefined {
  const flat = sections.flatMap((section) => section.steps);
  if (flat.length === 0) return undefined;
  if (!stepId) return flat[0]?.id;

  const idx = flat.findIndex((step) => step.id === stepId);
  if (idx >= 0) return stepId;

  const all = sections.flatMap((section) =>
    section.steps.map((step) => step.id),
  );
  const originalIdx = all.indexOf(stepId);
  if (originalIdx < 0) return flat[0]?.id;

  for (let i = originalIdx + 1; i < all.length; i++) {
    const candidate = flat.find((step) => step.id === all[i]);
    if (candidate) return candidate.id;
  }
  for (let i = originalIdx - 1; i >= 0; i--) {
    const candidate = flat.find((step) => step.id === all[i]);
    if (candidate) return candidate.id;
  }

  return flat[0]?.id;
}
