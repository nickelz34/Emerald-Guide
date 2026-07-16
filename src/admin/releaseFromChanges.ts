import type { GuideSection } from "../types";
import type { ChangelogRelease, ChangelogSection } from "../data/changelog";
import type { GuideChangeItem, GuideChangeSummary } from "./guideChangeSummary";

export type VersionBump = "patch" | "minor";

export interface PlannedRelease {
  bump: VersionBump;
  version: string;
  previousVersion: string;
  date: string;
  summary: string;
  sections: ChangelogSection[];
  /** True when README feature prose (not just version strings) should be refreshed. */
  updateReadmeProse: boolean;
  commitTitle: string;
  commitBody: string;
}

const MAX_CHANGELOG_ITEMS = 12;

/** Parse `1.26.25` → parts; throws if invalid. */
export function parseSemver(version: string): [number, number, number] {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version.trim());
  if (!match) throw new Error(`Invalid semver “${version}”`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function bumpSemver(version: string, bump: VersionBump): string {
  const [major, minor, patch] = parseSemver(version);
  if (bump === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

export function todayIsoDate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Classify how large a guide CMS publish is — mirrors Cursor shipping judgment:
 * patch for ordinary content edits, minor for structural / large ships.
 */
export function classifyGuideBump(summary: GuideChangeSummary): VersionBump {
  const kinds = new Set(summary.items.map((item) => item.kind));
  if (
    kinds.has("chapter-added") ||
    kinds.has("chapter-removed") ||
    kinds.has("chapter-reordered")
  ) {
    return "minor";
  }

  const structuralSteps = summary.items.filter(
    (item) => item.kind === "step-added" || item.kind === "step-removed",
  ).length;
  if (structuralSteps >= 3) return "minor";
  if (summary.total >= 8) return "minor";
  return "patch";
}

function softenLabel(label: string): string {
  return label.replace(/\.$/, "");
}

function changelogLine(item: GuideChangeItem): string {
  const base = softenLabel(item.label);
  if (!item.detail) return `${base}.`;
  if (item.kind === "step-updated" || item.kind === "chapter-updated") {
    return `${base} (${item.detail}).`;
  }
  return `${base} — ${item.detail}.`;
}

function groupSections(items: GuideChangeItem[]): ChangelogSection[] {
  const structure: string[] = [];
  const content: string[] = [];

  for (const item of items.slice(0, MAX_CHANGELOG_ITEMS)) {
    const line = changelogLine(item);
    if (
      item.kind === "chapter-added" ||
      item.kind === "chapter-removed" ||
      item.kind === "chapter-reordered" ||
      item.kind === "step-added" ||
      item.kind === "step-removed" ||
      item.kind === "step-reordered"
    ) {
      structure.push(line);
    } else {
      content.push(line);
    }
  }

  const overflow = items.length - MAX_CHANGELOG_ITEMS;
  if (overflow > 0) {
    content.push(`Plus ${overflow} additional guide edit${overflow === 1 ? "" : "s"}.`);
  }

  const sections: ChangelogSection[] = [];
  if (structure.length) {
    sections.push({ heading: "Guide structure", items: structure });
  }
  if (content.length) {
    sections.push({ heading: "Walkthrough", items: content });
  }
  if (sections.length === 0) {
    sections.push({
      heading: "Walkthrough",
      items: ["Guide content updated from Admin Mode."],
    });
  }
  return sections;
}

function buildSummaryText(items: GuideChangeItem[], bump: VersionBump): string {
  if (items.length === 0) return "Guide content updated from Admin Mode.";
  if (items.length === 1) return `${softenLabel(items[0].label)}.`;

  const addedChapters = items.filter((i) => i.kind === "chapter-added").length;
  const removedChapters = items.filter((i) => i.kind === "chapter-removed").length;
  const addedSteps = items.filter((i) => i.kind === "step-added").length;
  const removedSteps = items.filter((i) => i.kind === "step-removed").length;
  const updatedSteps = items.filter((i) => i.kind === "step-updated").length;

  if (addedChapters || removedChapters) {
    const parts: string[] = [];
    if (addedChapters) parts.push(`added ${addedChapters} chapter${addedChapters === 1 ? "" : "s"}`);
    if (removedChapters) {
      parts.push(`removed ${removedChapters} chapter${removedChapters === 1 ? "" : "s"}`);
    }
    return `Walkthrough structure update from Admin Mode — ${parts.join(", ")}.`;
  }

  if (bump === "minor") {
    return `Larger walkthrough content update from Admin Mode (${items.length} changes).`;
  }

  const parts: string[] = [];
  if (updatedSteps) parts.push(`${updatedSteps} step${updatedSteps === 1 ? "" : "s"} edited`);
  if (addedSteps) parts.push(`${addedSteps} added`);
  if (removedSteps) parts.push(`${removedSteps} removed`);
  if (parts.length === 0) {
    return `Walkthrough content update from Admin Mode (${items.length} changes).`;
  }
  return `Walkthrough update from Admin Mode — ${parts.join(", ")}.`;
}

/**
 * Plan the package version + changelog entry for an Admin Mode publish,
 * matching the Cursor shipping ritual (changelog + semver bump).
 */
export function planReleaseFromGuideChanges(
  summary: GuideChangeSummary,
  previousVersion: string,
  now = new Date(),
): PlannedRelease {
  if (summary.total === 0) {
    throw new Error("No guide changes to publish");
  }

  const bump = classifyGuideBump(summary);
  const version = bumpSemver(previousVersion, bump);
  const date = todayIsoDate(now);
  const sections = groupSections(summary.items);
  const summaryText = buildSummaryText(summary.items, bump);
  const updateReadmeProse =
    bump === "minor" ||
    summary.items.some(
      (item) =>
        item.kind === "chapter-added" ||
        item.kind === "chapter-removed" ||
        item.kind === "chapter-reordered",
    );

  return {
    bump,
    version,
    previousVersion,
    date,
    summary: summaryText,
    sections,
    updateReadmeProse,
    commitTitle: `cms: guide update ${version}`,
    commitBody: [
      summaryText,
      "",
      `Bump: ${bump} (${previousVersion} → ${version})`,
      `Changes: ${summary.total}`,
      "",
      "Shipped from Admin Mode with changelog + version alignment.",
    ].join("\n"),
  };
}

export function toChangelogRelease(plan: PlannedRelease): ChangelogRelease {
  return {
    version: plan.version,
    date: plan.date,
    summary: plan.summary,
    sections: plan.sections,
  };
}

/** Pretty-print a changelog release as a TypeScript object literal for prepending. */
export function formatChangelogEntryTs(release: ChangelogRelease): string {
  const indent = (level: number) => "  ".repeat(level);
  const q = (value: string) => JSON.stringify(value);

  const sectionBlocks = release.sections
    .map((section) => {
      const items = section.items.map((item) => `${indent(5)}${q(item)},`).join("\n");
      return [
        `${indent(3)}{`,
        `${indent(4)}heading: ${q(section.heading)},`,
        `${indent(4)}items: [`,
        items,
        `${indent(4)}],`,
        `${indent(3)}},`,
      ].join("\n");
    })
    .join("\n");

  return [
    `${indent(1)}{`,
    `${indent(2)}version: ${q(release.version)},`,
    `${indent(2)}date: ${q(release.date)},`,
    `${indent(2)}summary:`,
    `${indent(3)}${q(release.summary)},`,
    `${indent(2)}sections: [`,
    sectionBlocks,
    `${indent(2)}],`,
    `${indent(1)}},`,
  ].join("\n");
}

/**
 * Prepend a release to changelog.ts source. Expects the standard
 * `export const CHANGELOG: ChangelogRelease[] = [` opener.
 */
export function prependChangelogEntry(source: string, release: ChangelogRelease): string {
  const marker = "export const CHANGELOG: ChangelogRelease[] = [";
  const index = source.indexOf(marker);
  if (index === -1) {
    throw new Error("changelog.ts is missing the CHANGELOG array declaration");
  }
  const insertAt = index + marker.length;
  const entry = `\n${formatChangelogEntryTs(release)}\n`;
  return `${source.slice(0, insertAt)}${entry}${source.slice(insertAt)}`;
}

export function bumpPackageJsonVersion(source: string, version: string): string {
  const parsed = JSON.parse(source) as { version?: string; [key: string]: unknown };
  parsed.version = version;
  return `${JSON.stringify(parsed, null, 2)}\n`;
}

export function bumpPackageLockVersion(source: string, version: string): string {
  const parsed = JSON.parse(source) as {
    version?: string;
    packages?: Record<string, { version?: string; [key: string]: unknown }>;
    [key: string]: unknown;
  };
  parsed.version = version;
  if (parsed.packages && parsed.packages[""]) {
    parsed.packages[""] = { ...parsed.packages[""], version };
  }
  return `${JSON.stringify(parsed, null, 2)}\n`;
}

/** Replace README version badge strings for the current app version. */
export function bumpReadmeVersion(source: string, previousVersion: string, nextVersion: string): string {
  let next = source;
  const currentLine = `Current app version: **${previousVersion}**`;
  const nextLine = `Current app version: **${nextVersion}**`;
  if (next.includes(currentLine)) {
    next = next.replace(currentLine, nextLine);
  } else {
    next = next.replace(
      /Current app version: \*\*\d+\.\d+\.\d+\*\*/,
      nextLine,
    );
  }

  const prevBadge = `\`v${previousVersion}\``;
  const nextBadge = `\`v${nextVersion}\``;
  if (next.includes(prevBadge)) {
    next = next.replaceAll(prevBadge, nextBadge);
  } else {
    next = next.replace(/`v\d+\.\d+\.\d+`/g, nextBadge);
  }
  return next;
}

function shortChapterTitle(title: string): string {
  return title
    .replace(/^Ch\.\s*\d+\s*—\s*/i, "")
    .replace(/^Pregame:\s*/i, "")
    .trim();
}

/**
 * Refresh the numbered Pregame bullet list in README from walkthrough data.
 * Only touches the block under `1. **Pregame**` before `2. **`.
 */
export function syncReadmePregameList(source: string, walkthrough: GuideSection[]): string {
  const pregame = walkthrough.filter((ch) => ch.band === "pregame");
  if (pregame.length === 0) return source;

  const start = source.indexOf("1. **Pregame**");
  if (start === -1) return source;
  const rest = source.slice(start);
  const endRelative = rest.search(/\n2\. \*\*/);
  if (endRelative === -1) return source;

  const bullets = pregame
    .map((ch) => {
      const name = shortChapterTitle(ch.title);
      const detail = ch.description?.trim();
      if (detail) {
        const clipped = detail.length > 160 ? `${detail.slice(0, 157).trimEnd()}…` : detail;
        return `   - ${name} — ${clipped}`;
      }
      const stepCount = ch.steps.length;
      return `   - ${name} (${stepCount} event${stepCount === 1 ? "" : "s"})`;
    })
    .join("\n");

  const replacement = `1. **Pregame**\n${bullets}\n`;
  return source.slice(0, start) + replacement + source.slice(start + endRelative + 1);
}

/** Keep Admin Mode docs accurate about publish side-effects. */
export function syncReadmeAdminPublishDocs(source: string): string {
  const outdated =
    /4\. Publish commits `src\/data\/guide_data\.json` on `main`; GitHub Pages rebuilds the hosted site\./;
  const updated =
    "4. Publish ships `src/data/guide_data.json` plus a version bump, changelog entry, and README version sync (via a short-lived PR when `main` is protected); GitHub Pages rebuilds the hosted site.";
  if (outdated.test(source)) {
    return source.replace(outdated, updated);
  }
  return source;
}

export function applyReadmeReleaseUpdates(
  source: string,
  plan: PlannedRelease,
  walkthrough: GuideSection[],
): string {
  let next = bumpReadmeVersion(source, plan.previousVersion, plan.version);
  next = syncReadmeAdminPublishDocs(next);
  if (plan.updateReadmeProse) {
    next = syncReadmePregameList(next, walkthrough);
  }
  return next;
}
