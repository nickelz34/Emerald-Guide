import type { GuideSection } from "../types";
import type { GuideChangeItem } from "./guideChangeSummary";

export interface GuideFileRef {
  path: string;
  branch: string;
}

export type DiffLineKind = "context" | "remove" | "add";

export interface DiffLine {
  kind: DiffLineKind;
  text: string;
  oldLine?: number;
  newLine?: number;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  newStart: number;
  lines: DiffLine[];
}

export interface GuideFileDiffResult {
  file: GuideFileRef;
  beforeText: string;
  afterText: string;
  hunks: DiffHunk[];
  /** True when hunks were narrowed to the selected change's JSON region. */
  scoped: boolean;
  scopeLabel?: string;
}

/** Same serialization used when publishing to GitHub. */
export function serializeGuideFile(walkthrough: GuideSection[]): string {
  return `${JSON.stringify({ walkthrough }, null, 2)}\n`;
}

export function getGuideFileRef(): GuideFileRef {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return {
    path: env?.VITE_GUIDE_DATA_PATH || "src/data/guide_data.json",
    branch: env?.VITE_GITHUB_BRANCH || "main",
  };
}

/**
 * Find the pretty-printed JSON object that owns `"id": "<id>"`.
 * Returns 1-based inclusive line numbers in the full file text.
 */
export function findJsonObjectLineRange(
  text: string,
  id: string,
): { start: number; end: number } | null {
  const lines = text.split("\n");
  const needle = `"id": ${JSON.stringify(id)}`;
  const idLine = lines.findIndex((line) => line.includes(needle));
  if (idLine < 0) return null;

  let start = idLine;
  let depth = 0;
  let foundOpen = false;
  for (let i = idLine; i >= 0; i--) {
    const line = lines[i];
    for (let c = line.length - 1; c >= 0; c--) {
      const ch = line[c];
      if (ch === "}") depth++;
      else if (ch === "{") {
        if (depth === 0) {
          start = i;
          foundOpen = true;
          break;
        }
        depth--;
      }
    }
    if (foundOpen) break;
  }
  if (!foundOpen) return null;

  depth = 0;
  let end = start;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          end = i;
          return { start: start + 1, end: end + 1 };
        }
      }
    }
  }
  return null;
}

/** Myers O(ND) line diff — fast when the edit distance is small. */
export function diffLines(beforeLines: string[], afterLines: string[]): DiffLine[] {
  const n = beforeLines.length;
  const m = afterLines.length;
  if (n === 0 && m === 0) return [];
  if (n === 0) {
    return afterLines.map((text, i) => ({
      kind: "add" as const,
      text,
      newLine: i + 1,
    }));
  }
  if (m === 0) {
    return beforeLines.map((text, i) => ({
      kind: "remove" as const,
      text,
      oldLine: i + 1,
    }));
  }

  const max = n + m;
  const offset = max;
  const v = new Int32Array(2 * max + 1);
  v.fill(-1);
  v[offset + 1] = 0;
  const trace: Int32Array[] = [];

  outer: for (let d = 0; d <= max; d++) {
    const vCopy = new Int32Array(v);
    trace.push(vCopy);
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])) {
        x = v[offset + k + 1];
      } else {
        x = v[offset + k - 1] + 1;
      }
      let y = x - k;
      while (x < n && y < m && beforeLines[x] === afterLines[y]) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) break outer;
    }
  }

  const edits: Array<{ type: "eq" | "del" | "ins"; a?: string; b?: string }> = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
    const vSnap = trace[d];
    const k = x - y;
    let prevK: number;
    if (k === -d || (k !== d && vSnap[offset + k - 1] < vSnap[offset + k + 1])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = vSnap[offset + prevK];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      edits.push({ type: "eq", a: beforeLines[x - 1], b: afterLines[y - 1] });
      x--;
      y--;
    }
    if (d === 0) break;
    if (x === prevX) {
      edits.push({ type: "ins", b: afterLines[y - 1] });
      y--;
    } else {
      edits.push({ type: "del", a: beforeLines[x - 1] });
      x--;
    }
  }

  edits.reverse();
  const result: DiffLine[] = [];
  let oldLine = 1;
  let newLine = 1;
  for (const edit of edits) {
    if (edit.type === "eq") {
      result.push({
        kind: "context",
        text: edit.a ?? "",
        oldLine: oldLine++,
        newLine: newLine++,
      });
    } else if (edit.type === "del") {
      result.push({
        kind: "remove",
        text: edit.a ?? "",
        oldLine: oldLine++,
      });
    } else {
      result.push({
        kind: "add",
        text: edit.b ?? "",
        newLine: newLine++,
      });
    }
  }
  return result;
}

const CONTEXT = 3;

export function buildHunks(diff: DiffLine[]): DiffHunk[] {
  const changeIndexes: number[] = [];
  for (let i = 0; i < diff.length; i++) {
    if (diff[i].kind !== "context") changeIndexes.push(i);
  }
  if (changeIndexes.length === 0) return [];

  const ranges: Array<{ start: number; end: number }> = [];
  let start = Math.max(0, changeIndexes[0] - CONTEXT);
  let end = Math.min(diff.length, changeIndexes[0] + CONTEXT + 1);
  for (let i = 1; i < changeIndexes.length; i++) {
    const nextStart = Math.max(0, changeIndexes[i] - CONTEXT);
    const nextEnd = Math.min(diff.length, changeIndexes[i] + CONTEXT + 1);
    if (nextStart <= end) {
      end = nextEnd;
    } else {
      ranges.push({ start, end });
      start = nextStart;
      end = nextEnd;
    }
  }
  ranges.push({ start, end });

  return ranges.map(({ start: s, end: e }) => {
    const lines = diff.slice(s, e);
    const oldLines = lines.filter((l) => l.kind !== "add");
    const newLines = lines.filter((l) => l.kind !== "remove");
    const oldStart = oldLines[0]?.oldLine ?? 0;
    const newStart = newLines[0]?.newLine ?? 0;
    const oldCount = oldLines.length;
    const newCount = newLines.length;
    return {
      header: `@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`,
      oldStart,
      newStart,
      lines,
    };
  });
}

function extractRange(text: string, start: number, end: number): string {
  return text.split("\n").slice(start - 1, end).join("\n");
}

function scopeForChange(
  beforeText: string,
  afterText: string,
  item: GuideChangeItem,
): { before: string; after: string; oldOffset: number; newOffset: number; label: string } | null {
  const targetId = item.stepId ?? item.chapterId;
  if (!targetId) return null;

  const beforeRange = findJsonObjectLineRange(beforeText, targetId);
  const afterRange = findJsonObjectLineRange(afterText, targetId);

  // Added step/chapter — only exists in after
  if (!beforeRange && afterRange) {
    return {
      before: "",
      after: extractRange(afterText, afterRange.start, afterRange.end),
      oldOffset: afterRange.start,
      newOffset: afterRange.start,
      label: item.stepId ? `step “${targetId}”` : `chapter “${targetId}”`,
    };
  }
  // Removed — only in before
  if (beforeRange && !afterRange) {
    return {
      before: extractRange(beforeText, beforeRange.start, beforeRange.end),
      after: "",
      oldOffset: beforeRange.start,
      newOffset: beforeRange.start,
      label: item.stepId ? `step “${targetId}”` : `chapter “${targetId}”`,
    };
  }
  if (beforeRange && afterRange) {
    return {
      before: extractRange(beforeText, beforeRange.start, beforeRange.end),
      after: extractRange(afterText, afterRange.start, afterRange.end),
      oldOffset: beforeRange.start,
      newOffset: afterRange.start,
      label: item.stepId ? `step “${targetId}”` : `chapter “${targetId}”`,
    };
  }
  return null;
}

function offsetHunkLines(
  hunks: DiffHunk[],
  oldOffset: number,
  newOffset: number,
): DiffHunk[] {
  // When scoping to an excerpt, recompute absolute file line numbers.
  // Excerpt line 1 maps to oldOffset / newOffset in the full file.
  return hunks.map((hunk) => {
    const lines = hunk.lines.map((line) => ({
      ...line,
      oldLine:
        line.oldLine != null ? line.oldLine + oldOffset - 1 : undefined,
      newLine:
        line.newLine != null ? line.newLine + newOffset - 1 : undefined,
    }));
    const oldLines = lines.filter((l) => l.kind !== "add");
    const newLines = lines.filter((l) => l.kind !== "remove");
    const oldStart = oldLines[0]?.oldLine ?? oldOffset;
    const newStart = newLines[0]?.newLine ?? newOffset;
    return {
      header: `@@ -${oldStart},${oldLines.length} +${newStart},${newLines.length} @@`,
      oldStart,
      newStart,
      lines,
    };
  });
}

/**
 * Build a publish-accurate file diff for the whole guide, optionally scoped
 * to the JSON object for a pending change item.
 */
export function buildGuideFileDiff(
  baseline: GuideSection[],
  draft: GuideSection[],
  item?: GuideChangeItem | null,
): GuideFileDiffResult {
  const file = getGuideFileRef();
  const beforeText = serializeGuideFile(baseline);
  const afterText = serializeGuideFile(draft);

  if (item) {
    const scoped = scopeForChange(beforeText, afterText, item);
    if (scoped) {
      const beforeLines = scoped.before === "" ? [] : scoped.before.split("\n");
      const afterLines = scoped.after === "" ? [] : scoped.after.split("\n");
      const diff = diffLines(beforeLines, afterLines);
      const hunks = offsetHunkLines(buildHunks(diff), scoped.oldOffset, scoped.newOffset);
      return {
        file,
        beforeText,
        afterText,
        hunks,
        scoped: true,
        scopeLabel: scoped.label,
      };
    }
  }

  const diff = diffLines(beforeText.split("\n"), afterText.split("\n"));
  return {
    file,
    beforeText,
    afterText,
    hunks: buildHunks(diff),
    scoped: false,
  };
}
