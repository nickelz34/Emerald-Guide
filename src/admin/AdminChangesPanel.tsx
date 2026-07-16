import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "./AdminContext";
import { AdminChangeFileDiffPanel } from "./AdminChangeFileDiffPanel";
import { AdminMobileSheet } from "./AdminMobileSheet";
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

function InspectDiffList({ item }: { item: GuideChangeItem }) {
  if (item.diffs.length === 0) {
    return <p className="admin-muted">No field-level details available for this change.</p>;
  }
  return (
    <>
      {item.diffs.map((diff) => (
        <DiffBlock key={diff.field} diff={diff} />
      ))}
    </>
  );
}

function ChangeInspectSheet({
  item,
  onClose,
  onOpenFileDiff,
}: {
  item: GuideChangeItem;
  onClose: () => void;
  onOpenFileDiff: () => void;
}) {
  return (
    <AdminMobileSheet
      className="admin-sheet--change-inspect"
      titleId="admin-change-inspect-title"
      title="Pending change"
      onClose={onClose}
      subtitle={
        <>
          <p className="admin-sheet__emphasis">{item.label}</p>
          {item.detail ? <p>{item.detail}</p> : null}
        </>
      }
      actions={
        <button type="button" className="btn btn--primary" onClick={onOpenFileDiff}>
          View in-depth file diff
        </button>
      }
    >
      <InspectDiffList item={item} />
    </AdminMobileSheet>
  );
}

function ChangeItem({
  item,
  selected,
  onOpen,
}: {
  item: GuideChangeItem;
  selected: boolean;
  onOpen: () => void;
}) {
  return (
    <li className={`admin-changes__item admin-changes__item--${item.kind}`}>
      <button
        type="button"
        className={`admin-changes__trigger${selected ? " admin-changes__trigger--open" : ""}`}
        onClick={onOpen}
        aria-haspopup="dialog"
      >
        <span className="admin-changes__label">{item.label}</span>
        {item.detail ? <span className="admin-changes__detail">{item.detail}</span> : null}
        <span className="admin-changes__chevron" aria-hidden="true">
          ▸
        </span>
      </button>
    </li>
  );
}

function ChangelogEditor() {
  const {
    pendingRelease,
    changelogDraft,
    isPublishing,
    setChangelogSummary,
    setChangelogSectionHeading,
    setChangelogItem,
    addChangelogItem,
    removeChangelogItem,
    addChangelogSection,
    removeChangelogSection,
    resetChangelogDraft,
  } = useAdmin();

  if (!pendingRelease || !changelogDraft) return null;

  return (
    <div className="admin-changelog-editor" aria-label="Editable changelog for this publish">
      <div className="admin-changelog-editor__head">
        <div>
          <strong>Changelog for v{pendingRelease.version}</strong>
          <p className="admin-muted">
            Edit the summary and bullets before Publish. This is what the version badge changelog
            will show.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={resetChangelogDraft}
          disabled={isPublishing}
        >
          Reset to auto
        </button>
      </div>

      <label className="admin-field">
        <span className="admin-field__label">Summary</span>
        <textarea
          className="admin-field__textarea"
          rows={3}
          value={changelogDraft.summary}
          disabled={isPublishing}
          onChange={(e) => setChangelogSummary(e.target.value)}
        />
      </label>

      {changelogDraft.sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="admin-changelog-editor__section">
          <div className="admin-changelog-editor__section-head">
            <label className="admin-field admin-changelog-editor__heading-field">
              <span className="admin-field__label">Section heading</span>
              <input
                className="admin-field__input"
                value={section.heading}
                disabled={isPublishing}
                onChange={(e) => setChangelogSectionHeading(sectionIndex, e.target.value)}
              />
            </label>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={isPublishing || changelogDraft.sections.length <= 1}
              onClick={() => removeChangelogSection(sectionIndex)}
            >
              Remove section
            </button>
          </div>

          <ul className="admin-changelog-editor__items">
            {section.items.map((entry, itemIndex) => (
              <li key={`item-${sectionIndex}-${itemIndex}`} className="admin-changelog-editor__item">
                <textarea
                  className="admin-field__textarea"
                  rows={2}
                  value={entry}
                  disabled={isPublishing}
                  aria-label={`${section.heading || "Section"} item ${itemIndex + 1}`}
                  onChange={(e) => setChangelogItem(sectionIndex, itemIndex, e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  disabled={isPublishing}
                  aria-label={`Remove item ${itemIndex + 1}`}
                  onClick={() => removeChangelogItem(sectionIndex, itemIndex)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={isPublishing}
            onClick={() => addChangelogItem(sectionIndex)}
          >
            + Bullet
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn--ghost btn--sm"
        disabled={isPublishing}
        onClick={addChangelogSection}
      >
        + Section
      </button>
    </div>
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

  const openItem = useMemo(
    () => changeSummary.items.find((item) => item.id === openId) ?? null,
    [changeSummary.items, openId],
  );

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
              selected={openId === item.id}
              onOpen={() => setOpenId(item.id)}
            />
          ))}
        </ol>
      ) : null}
      {expanded && overflow > 0 ? (
        <p className="admin-muted">…and {overflow} more change{overflow === 1 ? "" : "s"}</p>
      ) : null}
      <p className="admin-changes__hint">
        Tap a change for field details, then <strong>View in-depth file diff</strong> for the exact{" "}
        <code>guide_data.json</code> lines Publish will write. Publish also bumps the app version,
        prepends the in-app changelog, and syncs README version strings
        {pendingRelease?.updateReadmeProse ? " (plus README pregame list for larger edits)" : ""}.
      </p>

      <ChangelogEditor />

      {openItem ? (
        <ChangeInspectSheet
          item={openItem}
          onClose={() => setOpenId(null)}
          onOpenFileDiff={() => setFileDiffId(openItem.id)}
        />
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
