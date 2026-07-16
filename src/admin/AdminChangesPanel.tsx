import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "./AdminContext";
import { AdminChangeFileDiffPanel } from "./AdminChangeFileDiffPanel";
import type { GuideChangeItem, GuideFieldDiff } from "./guideChangeSummary";

const PREVIEW_LIMIT = 40;

function DiffBlock({ diff }: { diff: GuideFieldDiff }) {
  const unchanged = diff.before === diff.after;
  return (
    <div className="admin-change-diff">
      <div className="admin-change-diff__field">{diff.label}</div>
      <div className="admin-change-diff__cols">
        <div className="admin-change-diff__side admin-change-diff__side--before">
          <span className="admin-change-diff__side-label">Before</span>
          <pre className="admin-change-diff__value">{diff.before}</pre>
        </div>
        <div
          className={`admin-change-diff__side admin-change-diff__side--after${
            unchanged ? "" : " admin-change-diff__side--changed"
          }`}
        >
          <span className="admin-change-diff__side-label">After</span>
          <pre className="admin-change-diff__value">{diff.after}</pre>
        </div>
      </div>
    </div>
  );
}

function ChangeItem({
  item,
  open,
  onToggle,
  onOpenFileDiff,
}: {
  item: GuideChangeItem;
  open: boolean;
  onToggle: () => void;
  onOpenFileDiff: () => void;
}) {
  return (
    <li className={`admin-changes__item admin-changes__item--${item.kind}`}>
      <button
        type="button"
        className={`admin-changes__trigger${open ? " admin-changes__trigger--open" : ""}`}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="admin-changes__label">{item.label}</span>
        {item.detail ? <span className="admin-changes__detail">{item.detail}</span> : null}
        <span className="admin-changes__chevron" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open ? (
        <div className="admin-changes__inspect" role="region" aria-label={`Exact changes for ${item.label}`}>
          {item.diffs.length === 0 ? (
            <p className="admin-muted">No field-level details available for this change.</p>
          ) : (
            item.diffs.map((diff) => <DiffBlock key={diff.field} diff={diff} />)
          )}
          <div className="admin-changes__inspect-actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={onOpenFileDiff}>
              View in-depth file diff
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function AdminChangesPanel() {
  const {
    isAdmin,
    isDirty,
    changeSummary,
    pendingRelease,
    baselineWalkthrough,
    draftWalkthrough,
  } = useAdmin();
  const [expanded, setExpanded] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [fileDiffId, setFileDiffId] = useState<string | null>(null);

  const visibleItems = useMemo(
    () => changeSummary.items.slice(0, PREVIEW_LIMIT),
    [changeSummary.items],
  );
  const overflow = Math.max(0, changeSummary.total - visibleItems.length);

  const fileDiffItem = useMemo(
    () => changeSummary.items.find((item) => item.id === fileDiffId) ?? null,
    [changeSummary.items, fileDiffId],
  );

  useEffect(() => {
    if (!openId) return;
    if (!changeSummary.items.some((item) => item.id === openId)) {
      setOpenId(null);
    }
  }, [changeSummary.items, openId]);

  useEffect(() => {
    if (!fileDiffId) return;
    if (!changeSummary.items.some((item) => item.id === fileDiffId)) {
      setFileDiffId(null);
    }
  }, [changeSummary.items, fileDiffId]);

  if (!isAdmin || !isDirty || changeSummary.total === 0) return null;

  return (
    <section className="admin-changes" aria-label="Pending publish changes">
      <div className="admin-changes__head">
        <div>
          <strong>Pending publish</strong>
          <p className="admin-changes__count">
            {changeSummary.total} change{changeSummary.total === 1 ? "" : "s"} ready to publish
            {pendingRelease
              ? ` · ships as v${pendingRelease.version} (${pendingRelease.bump})`
              : ""}
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
          {visibleItems.map((item) => (
            <ChangeItem
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              onOpenFileDiff={() => setFileDiffId(item.id)}
            />
          ))}
        </ol>
      ) : null}
      {expanded && overflow > 0 ? (
        <p className="admin-muted">…and {overflow} more change{overflow === 1 ? "" : "s"}</p>
      ) : null}
      <p className="admin-changes__hint">
        Click a change for field details, then <strong>View in-depth file diff</strong> for the exact{" "}
        <code>guide_data.json</code> lines Publish will write. Publish also bumps the app version,
        prepends the in-app changelog, and syncs README version strings
        {pendingRelease?.updateReadmeProse ? " (plus README pregame list for larger edits)" : ""}.
      </p>
      {pendingRelease ? (
        <p className="admin-changes__release-preview" role="note">
          <strong>Changelog preview:</strong> {pendingRelease.summary}
        </p>
      ) : null}

      {fileDiffItem ? (
        <AdminChangeFileDiffPanel
          item={fileDiffItem}
          baseline={baselineWalkthrough}
          draft={draftWalkthrough}
          onClose={() => setFileDiffId(null)}
        />
      ) : null}
    </section>
  );
}
