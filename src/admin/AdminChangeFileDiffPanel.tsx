import { useMemo } from "react";
import type { GuideSection } from "../types";
import { AdminMobileSheet } from "./AdminMobileSheet";
import type { GuideChangeItem } from "./guideChangeSummary";
import { buildGuideFileDiff, type DiffHunk } from "./guideFileDiff";

interface AdminChangeFileDiffPanelProps {
  item: GuideChangeItem;
  baseline: GuideSection[];
  draft: GuideSection[];
  onClose: () => void;
}

function HunkView({ hunk }: { hunk: DiffHunk }) {
  return (
    <div className="admin-file-diff__hunk">
      <div className="admin-file-diff__hunk-header">{hunk.header}</div>
      <pre className="admin-file-diff__pre">
        {hunk.lines.map((line, index) => {
          const mark = line.kind === "add" ? "+" : line.kind === "remove" ? "−" : " ";
          const ln = String(line.newLine ?? line.oldLine ?? "").padStart(4, " ");
          return (
            <div
              key={`${hunk.header}-${index}`}
              className={`admin-file-diff__line admin-file-diff__line--${line.kind}`}
            >
              <span className="admin-file-diff__ln">{ln}</span>
              <span className="admin-file-diff__mark">{mark}</span>
              <span className="admin-file-diff__text">{line.text}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

export function AdminChangeFileDiffPanel({
  item,
  baseline,
  draft,
  onClose,
}: AdminChangeFileDiffPanelProps) {
  const result = useMemo(
    () => buildGuideFileDiff(baseline, draft, item),
    [baseline, draft, item],
  );

  const changedLines = result.hunks.reduce(
    (n, hunk) => n + hunk.lines.filter((l) => l.kind !== "context").length,
    0,
  );

  return (
    <AdminMobileSheet
      className="admin-sheet--file-diff"
      titleId="admin-file-diff-title"
      title="In-depth file diff"
      onClose={onClose}
      subtitle={
        <>
          <p className="admin-sheet__meta">
            <code>{result.file.path}</code>
            <span aria-hidden="true"> · </span>
            branch <code>{result.file.branch}</code>
          </p>
          <p>
            {item.label}
            {result.scoped && result.scopeLabel
              ? ` — scoped to ${result.scopeLabel}`
              : " — full publish file diff"}
            {changedLines > 0
              ? ` · ${changedLines} changed line${changedLines === 1 ? "" : "s"}`
              : ""}
          </p>
        </>
      }
      footnote={`This is the JSON Publish writes to GitHub (${result.file.path}). Line numbers match the pretty-printed file.`}
    >
      {result.hunks.length === 0 ? (
        <p className="admin-muted">
          No line differences found in the publish file for this change.
        </p>
      ) : (
        <div className="admin-file-diff__stack">
          {result.hunks.map((hunk: DiffHunk) => (
            <HunkView key={hunk.header + hunk.oldStart + hunk.newStart} hunk={hunk} />
          ))}
        </div>
      )}
    </AdminMobileSheet>
  );
}
