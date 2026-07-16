import type { GuideSection, GuideStep } from "../types";

export type GuideChangeKind =
  | "chapter-added"
  | "chapter-removed"
  | "chapter-reordered"
  | "chapter-updated"
  | "step-added"
  | "step-removed"
  | "step-reordered"
  | "step-updated";

export interface GuideChangeItem {
  kind: GuideChangeKind;
  label: string;
  detail?: string;
}

export interface GuideChangeSummary {
  total: number;
  items: GuideChangeItem[];
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

function stepLabel(step: GuideStep): string {
  return step.title?.trim() || step.id;
}

function chapterLabel(chapter: GuideSection): string {
  return chapter.title?.trim() || chapter.id;
}

function describeStepDiff(before: GuideStep, after: GuideStep): string[] {
  const parts: string[] = [];
  const check = <K extends keyof GuideStep>(key: K, label: string) => {
    if (stableStringify(before[key]) !== stableStringify(after[key])) {
      parts.push(label);
    }
  };
  check("title", "title");
  check("location", "location");
  check("summary", "summary");
  check("story", "story");
  check("details", "details");
  check("tips", "tips");
  check("secrets", "secrets");
  check("tags", "tags");
  check("optional", "optional flag");
  check("media", "media");
  check("useCustomMedia", "custom media mode");
  check("tables", "tables");
  check("hiddenPanels", "hidden panels");
  check("mapRegion", "map region");
  return parts;
}

function describeChapterDiff(before: GuideSection, after: GuideSection): string[] {
  const parts: string[] = [];
  if (before.title !== after.title) parts.push("title");
  if (before.description !== after.description) parts.push("description");
  if (before.optional !== after.optional) parts.push("optional flag");
  if (before.band !== after.band) parts.push("band");
  return parts;
}

/**
 * Compare the last loaded/published walkthrough with the current draft.
 */
export function summarizeGuideChanges(
  baseline: GuideSection[],
  draft: GuideSection[],
): GuideChangeSummary {
  const items: GuideChangeItem[] = [];
  const baselineChapters = new Map(baseline.map((ch) => [ch.id, ch]));
  const draftChapters = new Map(draft.map((ch) => [ch.id, ch]));

  for (const chapter of draft) {
    if (!baselineChapters.has(chapter.id)) {
      items.push({
        kind: "chapter-added",
        label: `Added chapter “${chapterLabel(chapter)}”`,
        detail: `${chapter.steps.length} step${chapter.steps.length === 1 ? "" : "s"}`,
      });
    }
  }

  for (const chapter of baseline) {
    if (!draftChapters.has(chapter.id)) {
      items.push({
        kind: "chapter-removed",
        label: `Removed chapter “${chapterLabel(chapter)}”`,
        detail: `${chapter.steps.length} step${chapter.steps.length === 1 ? "" : "s"} removed`,
      });
    }
  }

  const sharedChapterIds = draft
    .map((ch) => ch.id)
    .filter((id) => baselineChapters.has(id));

  const baselineOrder = sharedChapterIds
    .slice()
    .sort(
      (a, b) =>
        baseline.findIndex((ch) => ch.id === a) - baseline.findIndex((ch) => ch.id === b),
    );
  if (stableStringify(sharedChapterIds) !== stableStringify(baselineOrder)) {
    items.push({
      kind: "chapter-reordered",
      label: "Reordered chapters",
      detail: `${sharedChapterIds.length} existing chapters in a new order`,
    });
  }

  for (const chapterId of sharedChapterIds) {
    const beforeChapter = baselineChapters.get(chapterId)!;
    const afterChapter = draftChapters.get(chapterId)!;
    const chapterFields = describeChapterDiff(beforeChapter, afterChapter);
    if (chapterFields.length) {
      items.push({
        kind: "chapter-updated",
        label: `Updated chapter “${chapterLabel(afterChapter)}”`,
        detail: chapterFields.join(", "),
      });
    }

    const beforeSteps = new Map(beforeChapter.steps.map((s) => [s.id, s]));
    const afterSteps = new Map(afterChapter.steps.map((s) => [s.id, s]));

    for (const step of afterChapter.steps) {
      if (!beforeSteps.has(step.id)) {
        items.push({
          kind: "step-added",
          label: `Added step “${stepLabel(step)}”`,
          detail: `in ${chapterLabel(afterChapter)}`,
        });
      }
    }

    for (const step of beforeChapter.steps) {
      if (!afterSteps.has(step.id)) {
        items.push({
          kind: "step-removed",
          label: `Removed step “${stepLabel(step)}”`,
          detail: `from ${chapterLabel(beforeChapter)}`,
        });
      }
    }

    const sharedStepIds = afterChapter.steps
      .map((s) => s.id)
      .filter((id) => beforeSteps.has(id));
    const baselineStepOrder = sharedStepIds
      .slice()
      .sort(
        (a, b) =>
          beforeChapter.steps.findIndex((s) => s.id === a) -
          beforeChapter.steps.findIndex((s) => s.id === b),
      );
    if (stableStringify(sharedStepIds) !== stableStringify(baselineStepOrder)) {
      items.push({
        kind: "step-reordered",
        label: `Reordered steps in “${chapterLabel(afterChapter)}”`,
        detail: `${sharedStepIds.length} existing steps moved`,
      });
    }

    for (const stepId of sharedStepIds) {
      const beforeStep = beforeSteps.get(stepId)!;
      const afterStep = afterSteps.get(stepId)!;
      const fields = describeStepDiff(beforeStep, afterStep);
      if (fields.length) {
        items.push({
          kind: "step-updated",
          label: `Updated step “${stepLabel(afterStep)}”`,
          detail: `${chapterLabel(afterChapter)} · ${fields.join(", ")}`,
        });
      }
    }
  }

  return { total: items.length, items };
}
