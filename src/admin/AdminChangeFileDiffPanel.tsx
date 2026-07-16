import { useEffect, useMemo } from "react";
import type { GuideSection } from "../types";
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
      <table className="admin-file-diff__table">
        <tbody>
          {hunk.lines.map((line, index) => (
            <tr
              key={`${hunk.header}-${index}`}
              className={`admin-file-diff__row admin-file-diff__row--${line.kind}`}
            >
              <td className="admin-file-diff__ln admin-file-diff__ln--old">
                {line.oldLine ?? ""}
              </td>
              <td className="admin-file-diff__ln admin-file-diff__ln--new">
                {line.newLine ?? ""}
              </td>
              <td className="admin-file-diff__gutter">
                {line.kind === "add" ? "+" : line.kind === "remove" ? "−" : " "}
              </td>
              <td className="admin-file-diff__code">
                <code>{line.text}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const changedLines = result.hunks.reduce(
    (n, hunk) => n + hunk.lines.filter((l) => l.kind !== "context").length,
    0,
  );

  return (
    <div className="admin-file-diff" role="dialog" aria-modal="true" aria-labelledby="admin-file-diff-title">
      <div className="admin-file-diff__backdrop" onClick={onClose} />
      <div className="admin-file-diff__panel">
        <div className="admin-file-diff__head">
          <div>
            <h3 id="admin-file-diff-title">In-depth file diff</h3>
            <p className="admin-file-diff__meta">
              <code>{result.file.path}</code>
              <span aria-hidden="true"> · </span>
              branch <code>{result.file.branch}</code>
            </p>
            <p className="admin-muted">
              {item.label}
              {result.scoped && result.scopeLabel
                ? ` — scoped to ${result.scopeLabel} in the publish file`
                : " — full publish file diff"}
              {changedLines > 0 ? ` · ${changedLines} changed line${changedLines === 1 ? "" : "s"}` : ""}
            </p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Close
          </button>
        </div>

        {result.hunks.length === 0 ? (
          <p className="admin-muted">No line differences found in the publish file for this change.</p>
        ) : (
          <div className="admin-file-diff__body">
            {result.hunks.map((hunk) => (
              <HunkView key={hunk.header + hunk.oldStart + hunk.newStart} hunk={hunk} />
            ))}
          </div>
        )}

        <p className="admin-file-diff__footnote">
          This is the JSON that Publish writes to GitHub ({result.file.path}). Line numbers match the
          pretty-printed file (2-space indent).
        </p>
      </div>
    </div>
  );
}
