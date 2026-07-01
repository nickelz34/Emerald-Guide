import { Fragment } from "react";
import type { NavKey } from "../App";
import type { LayoutViewMode } from "../hooks/useViewMode";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "../types";
import { ViewModeToggle } from "./ViewModeToggle";

interface SidebarProps {
  active: NavKey;
  onSelect: (key: NavKey) => void;
  viewMode: LayoutViewMode;
  onViewModeChange: (mode: LayoutViewMode) => void;
}

const NAV_META: Record<NavKey, { label: string; hint: string }> = {
  walkthrough: { label: CATEGORY_LABELS.walkthrough, hint: "Step-by-step story guide" },
  encounters: { label: CATEGORY_LABELS.encounters, hint: "Hoenn, National & all 387" },
  secrets: { label: CATEGORY_LABELS.secrets, hint: "Hidden items & rewards" },
  legendaries: { label: CATEGORY_LABELS.legendaries, hint: "Catch every legendary" },
  tips: { label: CATEGORY_LABELS.tips, hint: "Teams & strategy" },
  map: { label: "Hoenn Map", hint: "Jump to any region" },
};

const SHORT_LABELS: Record<NavKey, string> = {
  walkthrough: "Story",
  encounters: "Pokédex",
  secrets: "Secrets",
  legendaries: "Legends",
  tips: "Tips",
  map: "Map",
};

const GROUPS: { title: string; keys: NavKey[] }[] = [
  { title: "Playthrough", keys: ["walkthrough", "encounters"] },
  { title: "Reference", keys: ["secrets", "legendaries", "tips", "map"] },
];

export function Sidebar({ active, onSelect, viewMode, onViewModeChange }: SidebarProps) {
  return (
    <header className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__icon">◆</span>
        <div>
          <h1>Emerald Guide</h1>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {GROUPS.map((group, groupIndex) => (
          <Fragment key={group.title}>
            {groupIndex > 0 && <span className="sidebar__divider" aria-hidden="true" />}
            <div className="sidebar__group">
              <p className="sidebar__group-title">{group.title}</p>
              <div className="sidebar__group-links">
                {group.keys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`sidebar__link ${active === key ? "sidebar__link--active" : ""}`}
                    onClick={() => onSelect(key)}
                    title={NAV_META[key].hint}
                  >
                    <span className="sidebar__link-label">
                      {viewMode === "mobile" ? SHORT_LABELS[key] : NAV_META[key].label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </nav>

      <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
    </header>
  );
}

const HEADER_COPY: Record<NavKey, { title: string; desc: string }> = {
  walkthrough: { title: CATEGORY_LABELS.walkthrough, desc: CATEGORY_DESCRIPTIONS.walkthrough },
  encounters: { title: CATEGORY_LABELS.encounters, desc: "Browse the Hoenn dex (202), the National dex (185), or all 387 — with stats, types, evolutions, and where to catch each one." },
  secrets: { title: CATEGORY_LABELS.secrets, desc: CATEGORY_DESCRIPTIONS.secrets },
  legendaries: { title: CATEGORY_LABELS.legendaries, desc: CATEGORY_DESCRIPTIONS.legendaries },
  tips: { title: CATEGORY_LABELS.tips, desc: CATEGORY_DESCRIPTIONS.tips },
  map: { title: "Hoenn Map", desc: "Click any region marker to jump straight to its walkthrough steps." },
};

export function CategoryHeader({ nav }: { nav: NavKey }) {
  const copy = HEADER_COPY[nav];
  return (
    <header className="category-header">
      <h2>{copy.title}</h2>
      <p>{copy.desc}</p>
    </header>
  );
}
