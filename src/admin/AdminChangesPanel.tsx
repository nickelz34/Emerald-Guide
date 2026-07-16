import { useMemo, useState } from "react";
import { useAdmin } from "./AdminContext";

const PREVIEW_LIMIT = 40;

export function AdminChangesPanel() {
  const { isAdmin, isDirty, changeSummary } = useAdmin();
  const [expanded, setExpanded] = useState(true);

  const visibleItems = useMemo(
    () => changeSummary.items.slice(0, PREVIEW_LIMIT),
    [changeSummary.items],
  );
  const overflow = Math.max(0, changeSummary.total - visibleItems.length);

  if (!isAdmin || !isDirty || changeSummary.total === 0) return null;

  return (
    <section className="admin-changes" aria-label="Pending publish changes">
      <div className="admin-changes__head">
        <div>
          <strong>Pending publish</strong>
          <p className="admin-changes__count">
            {changeSummary.total} change{changeSummary.total === 1 ? "" : "s"} ready to publish
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "Show details"}
        </button>
      </div>
      {expanded ? (
        <ol className="admin-changes__list">
          {visibleItems.map((item, index) => (
            <li key={`${item.kind}-${index}`} className={`admin-changes__item admin-changes__item--${item.kind}`}>
              <span className="admin-changes__label">{item.label}</span>
              {item.detail ? <span className="admin-changes__detail">{item.detail}</span> : null}
            </li>
          ))}
        </ol>
      ) : null}
      {expanded && overflow > 0 ? (
        <p className="admin-muted">…and {overflow} more change{overflow === 1 ? "" : "s"}</p>
      ) : null}
      <p className="admin-changes__hint">
        Review this list before clicking <strong>Publish Changes to Live Guide</strong>.
      </p>
    </section>
  );
}
