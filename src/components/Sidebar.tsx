import { Fragment, useState } from "react";
import type { NavKey } from "../App";
import type { ColorMode } from "../hooks/useColorMode";
import type { LayoutViewMode } from "../hooks/useViewMode";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "../types";
import { ChangelogModal } from "./ChangelogModal";
import { ColorModeToggle } from "./ColorModeToggle";
import { EmeraldGemIcon } from "./EmeraldGemIcon";
import { ViewModeToggle } from "./ViewModeToggle";

const APP_VERSION = __APP_VERSION__;

interface SidebarProps {
  active: NavKey;
  onSelect: (key: NavKey) => void;
  viewMode: LayoutViewMode;
  onViewModeChange: (mode: LayoutViewMode) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

const NAV_META: Record<NavKey, { label: string; hint: string }> = {
  walkthrough: { label: CATEGORY_LABELS.walkthrough, hint: "Step-by-step story guide" },
  pokedex: { label: CATEGORY_LABELS.pokedex, hint: "Hoenn, National & all 387" },
  map: { label: "Hoenn Map", hint: "Jump to any region" },
};

const SHORT_LABELS: Record<NavKey, string> = {
  walkthrough: "Story",
  pokedex: "Pokédex",
  map: "Map",
};

/** Concise labels for the desktop top bar so every link fits on one row. */
const NAV_LABELS: Record<NavKey, string> = {
  walkthrough: "Walkthrough",
  pokedex: "Pokédex",
  map: "Hoenn Map",
};

const GROUPS: { title: string; keys: NavKey[] }[] = [
  { title: "Playthrough", keys: ["walkthrough", "pokedex"] },
  { title: "Reference", keys: ["map"] },
];

export function Sidebar({
  active,
  onSelect,
  viewMode,
  onViewModeChange,
  colorMode,
  onColorModeChange,
}: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);

  const handleSelect = (key: NavKey) => {
    onSelect(key);
    setMenuOpen(false);
  };

  return (
    <header className={`sidebar ${menuOpen ? "sidebar--menu-open" : ""}`}>
      <div className="sidebar__brand">
        <span className="sidebar__icon" title="Emerald Guide">
          <EmeraldGemIcon />
        </span>
        <div className="sidebar__brand-text">
          <h1>Emerald Guide</h1>
          <button
            type="button"
            className="sidebar__version"
            onClick={() => setChangelogOpen(true)}
            aria-label={`Version ${APP_VERSION}. Open changelog.`}
            title="View changelog"
          >
            v{APP_VERSION}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="sidebar__menu-btn"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="sidebar__menu-icon" aria-hidden="true">
          {menuOpen ? "✕" : "☰"}
        </span>
        <span className="sidebar__menu-text">Menu</span>
      </button>

      <nav id="main-nav" className="sidebar__nav" aria-label="Main navigation">
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
                    onClick={() => handleSelect(key)}
                    title={NAV_META[key].hint}
                  >
                    <span className="sidebar__link-label">
                      {viewMode === "mobile" ? SHORT_LABELS[key] : NAV_LABELS[key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </nav>

      <div className="sidebar__prefs">
        <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        <ColorModeToggle mode={colorMode} onChange={onColorModeChange} />
      </div>

      <ChangelogModal open={changelogOpen} onClose={() => setChangelogOpen(false)} />
    </header>
  );
}

const HEADER_COPY: Record<NavKey, { title: string; desc: string }> = {
  walkthrough: { title: CATEGORY_LABELS.walkthrough, desc: CATEGORY_DESCRIPTIONS.walkthrough },
  pokedex: { title: CATEGORY_LABELS.pokedex, desc: CATEGORY_DESCRIPTIONS.pokedex },
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
