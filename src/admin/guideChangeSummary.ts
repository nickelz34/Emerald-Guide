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

export interface GuideFieldDiff {
  field: string;
  label: string;
  before: string;
  after: string;
}

export interface GuideChangeItem {
  id: string;
  kind: GuideChangeKind;
  label: string;
  detail?: string;
  chapterId?: string;
  stepId?: string;
  /** Exact before → after field values for this change. */
  diffs: GuideFieldDiff[];
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

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const MAX_VALUE_CHARS = 4000;

function truncate(text: string): string {
  if (text.length <= MAX_VALUE_CHARS) return text;
  return `${text.slice(0, MAX_VALUE_CHARS)}\n…(truncated)`;
}

/** Human-readable value for the pending-change inspector. */
export function formatChangeValue(value: unknown): string {
  if (value === undefined || value === null) return "(empty)";
  if (typeof value === "string") {
    const plain = stripHtml(value);
    return truncate(plain || "(empty)");
  }
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "(empty list)";
    if (value.every((item) => typeof item === "string")) {
      return truncate(
        value
          .map((item, index) => `${index + 1}. ${stripHtml(item) || "(empty)"}`)
          .join("\n"),
      );
    }
    if (
      value.every(
        (item) => isPlainObject(item) && typeof item.id === "string",
      )
    ) {
      return truncate(
        value
          .map((item, index) => {
            const obj = item as Record<string, unknown>;
            const name =
              (typeof obj.label === "string" && obj.label) ||
              (typeof obj.title === "string" && obj.title) ||
              (typeof obj.name === "string" && obj.name) ||
              (typeof obj.caption === "string" && obj.caption) ||
              String(obj.id);
            return `${index + 1}. ${name}`;
          })
          .join("\n"),
      );
    }
    return truncate(JSON.stringify(value, null, 2));
  }
  if (isPlainObject(value)) {
    return truncate(JSON.stringify(value, null, 2));
  }
  return truncate(String(value));
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function diffValues(
  before: unknown,
  after: unknown,
  field: string,
  label: string,
): GuideFieldDiff[] {
  if (stableStringify(before) === stableStringify(after)) return [];

  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const nested: GuideFieldDiff[] = [];
    for (const key of [...keys].sort()) {
      nested.push(
        ...diffValues(
          before[key],
          after[key],
          field ? `${field}.${key}` : key,
          `${label} › ${humanizeKey(key)}`,
        ),
      );
    }
    if (nested.length > 0) return nested;
  }

  if (
    Array.isArray(before) &&
    Array.isArray(after) &&
    before.length === after.length &&
    before.length > 0 &&
    before.every(isPlainObject) &&
    after.every(isPlainObject)
  ) {
    const nested: GuideFieldDiff[] = [];
    for (let i = 0; i < before.length; i++) {
      nested.push(
        ...diffValues(
          before[i],
          after[i],
          `${field}[${i}]`,
          `${label} › item ${i + 1}`,
        ),
      );
    }
    if (nested.length > 0) return nested;
  }

  return [
    {
      field,
      label,
      before: formatChangeValue(before),
      after: formatChangeValue(after),
    },
  ];
}

const STEP_FIELDS: Array<[keyof GuideStep, string]> = [
  ["title", "Title"],
  ["location", "Location"],
  ["summary", "Summary"],
  ["story", "Story"],
  ["details", "Details"],
  ["tips", "Tips"],
  ["secrets", "Secrets"],
  ["tags", "Tags"],
  ["optional", "Optional flag"],
  ["media", "Media"],
  ["useCustomMedia", "Custom media mode"],
  ["sprites", "Sprites"],
  ["hiddenPanels", "Hidden panels"],
  ["specialty", "Specialty panels"],
  ["blockOrder", "Page layout"],
  ["mapRegion", "Map region"],
];

function describeStepDiff(before: GuideStep, after: GuideStep): GuideFieldDiff[] {
  const diffs: GuideFieldDiff[] = [];
  for (const [key, label] of STEP_FIELDS) {
    diffs.push(...diffValues(before[key], after[key], String(key), label));
  }
  return diffs;
}

function describeChapterDiff(
  before: GuideSection,
  after: GuideSection,
): GuideFieldDiff[] {
  const diffs: GuideFieldDiff[] = [];
  diffs.push(...diffValues(before.title, after.title, "title", "Title"));
  diffs.push(
    ...diffValues(before.description, after.description, "description", "Description"),
  );
  diffs.push(
    ...diffValues(before.optional, after.optional, "optional", "Optional flag"),
  );
  diffs.push(...diffValues(before.band, after.band, "band", "Band"));
  return diffs;
}

function snapshotStep(step: GuideStep): GuideFieldDiff[] {
  return STEP_FIELDS.map(([key, label]) => ({
    field: String(key),
    label,
    before: "(not present)",
    after: formatChangeValue(step[key]),
  })).filter((d) => d.after !== "(empty)" && d.after !== "(empty list)");
}

function snapshotRemovedStep(step: GuideStep): GuideFieldDiff[] {
  return STEP_FIELDS.map(([key, label]) => ({
    field: String(key),
    label,
    before: formatChangeValue(step[key]),
    after: "(removed)",
  })).filter((d) => d.before !== "(empty)" && d.before !== "(empty list)");
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
        id: `chapter-added:${chapter.id}`,
        kind: "chapter-added",
        label: `Added chapter “${chapterLabel(chapter)}”`,
        detail: `${chapter.steps.length} step${chapter.steps.length === 1 ? "" : "s"}`,
        chapterId: chapter.id,
        diffs: [
          {
            field: "title",
            label: "Title",
            before: "(not present)",
            after: chapterLabel(chapter),
          },
          {
            field: "description",
            label: "Description",
            before: "(not present)",
            after: formatChangeValue(chapter.description),
          },
          {
            field: "steps",
            label: "Steps",
            before: "(not present)",
            after: chapter.steps.map((s, i) => `${i + 1}. ${stepLabel(s)}`).join("\n") || "(empty)",
          },
        ],
      });
    }
  }

  for (const chapter of baseline) {
    if (!draftChapters.has(chapter.id)) {
      items.push({
        id: `chapter-removed:${chapter.id}`,
        kind: "chapter-removed",
        label: `Removed chapter “${chapterLabel(chapter)}”`,
        detail: `${chapter.steps.length} step${chapter.steps.length === 1 ? "" : "s"} removed`,
        chapterId: chapter.id,
        diffs: [
          {
            field: "title",
            label: "Title",
            before: chapterLabel(chapter),
            after: "(removed)",
          },
          {
            field: "steps",
            label: "Steps",
            before: chapter.steps.map((s, i) => `${i + 1}. ${stepLabel(s)}`).join("\n"),
            after: "(removed)",
          },
        ],
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
      id: "chapter-reordered",
      kind: "chapter-reordered",
      label: "Reordered chapters",
      detail: `${sharedChapterIds.length} existing chapters in a new order`,
      diffs: [
        {
          field: "chapterOrder",
          label: "Chapter order",
          before: baselineOrder
            .map((id, i) => `${i + 1}. ${chapterLabel(baselineChapters.get(id)!)}`)
            .join("\n"),
          after: sharedChapterIds
            .map((id, i) => `${i + 1}. ${chapterLabel(draftChapters.get(id)!)}`)
            .join("\n"),
        },
      ],
    });
  }

  for (const chapterId of sharedChapterIds) {
    const beforeChapter = baselineChapters.get(chapterId)!;
    const afterChapter = draftChapters.get(chapterId)!;
    const chapterDiffs = describeChapterDiff(beforeChapter, afterChapter);
    if (chapterDiffs.length) {
      items.push({
        id: `chapter-updated:${chapterId}`,
        kind: "chapter-updated",
        label: `Updated chapter “${chapterLabel(afterChapter)}”`,
        detail: chapterDiffs.map((d) => d.label).join(", "),
        chapterId,
        diffs: chapterDiffs,
      });
    }

    const beforeSteps = new Map(beforeChapter.steps.map((s) => [s.id, s]));
    const afterSteps = new Map(afterChapter.steps.map((s) => [s.id, s]));

    for (const step of afterChapter.steps) {
      if (!beforeSteps.has(step.id)) {
        items.push({
          id: `step-added:${chapterId}:${step.id}`,
          kind: "step-added",
          label: `Added step “${stepLabel(step)}”`,
          detail: `in ${chapterLabel(afterChapter)}`,
          chapterId,
          stepId: step.id,
          diffs: snapshotStep(step),
        });
      }
    }

    for (const step of beforeChapter.steps) {
      if (!afterSteps.has(step.id)) {
        items.push({
          id: `step-removed:${chapterId}:${step.id}`,
          kind: "step-removed",
          label: `Removed step “${stepLabel(step)}”`,
          detail: `from ${chapterLabel(beforeChapter)}`,
          chapterId,
          stepId: step.id,
          diffs: snapshotRemovedStep(step),
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
        id: `step-reordered:${chapterId}`,
        kind: "step-reordered",
        label: `Reordered steps in “${chapterLabel(afterChapter)}”`,
        detail: `${sharedStepIds.length} existing steps moved`,
        chapterId,
        diffs: [
          {
            field: "stepOrder",
            label: "Step order",
            before: baselineStepOrder
              .map((id, i) => `${i + 1}. ${stepLabel(beforeSteps.get(id)!)}`)
              .join("\n"),
            after: sharedStepIds
              .map((id, i) => `${i + 1}. ${stepLabel(afterSteps.get(id)!)}`)
              .join("\n"),
          },
        ],
      });
    }

    for (const stepId of sharedStepIds) {
      const beforeStep = beforeSteps.get(stepId)!;
      const afterStep = afterSteps.get(stepId)!;
      const diffs = describeStepDiff(beforeStep, afterStep);
      if (diffs.length) {
        items.push({
          id: `step-updated:${chapterId}:${stepId}`,
          kind: "step-updated",
          label: `Updated step “${stepLabel(afterStep)}”`,
          detail: `${chapterLabel(afterChapter)} · ${diffs.map((d) => d.label).join(", ")}`,
          chapterId,
          stepId,
          diffs,
        });
      }
    }
  }

  return { total: items.length, items };
}
