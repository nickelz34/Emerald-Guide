import type { ColorMode } from "../hooks/useColorMode";

interface ColorModeToggleProps {
  mode: ColorMode;
  onChange: (mode: ColorMode) => void;
}

export function ColorModeToggle({ mode, onChange }: ColorModeToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="Color theme">
      <button
        type="button"
        className={`view-toggle__btn ${mode === "light" ? "view-toggle__btn--active" : ""}`}
        onClick={() => onChange("light")}
        aria-pressed={mode === "light"}
        title="Light theme"
      >
        Light
      </button>
      <button
        type="button"
        className={`view-toggle__btn ${mode === "dark" ? "view-toggle__btn--active" : ""}`}
        onClick={() => onChange("dark")}
        aria-pressed={mode === "dark"}
        title="Dark theme"
      >
        Dark
      </button>
    </div>
  );
}
