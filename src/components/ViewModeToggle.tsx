import type { LayoutViewMode } from "../hooks/useViewMode";

interface ViewModeToggleProps {
  mode: LayoutViewMode;
  onChange: (mode: LayoutViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="view-toggle sidebar__view-toggle" role="group" aria-label="Layout view">
      <button
        type="button"
        className={`view-toggle__btn ${mode === "mobile" ? "view-toggle__btn--active" : ""}`}
        onClick={() => onChange("mobile")}
        aria-pressed={mode === "mobile"}
        title="Mobile layout — stacked navigation and single-column content"
      >
        Mobile
      </button>
      <button
        type="button"
        className={`view-toggle__btn ${mode === "desktop" ? "view-toggle__btn--active" : ""}`}
        onClick={() => onChange("desktop")}
        aria-pressed={mode === "desktop"}
        title="Desktop layout — side-by-side panels in a compact frame"
      >
        Desktop
      </button>
    </div>
  );
}
