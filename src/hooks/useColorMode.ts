import { useEffect, useState } from "react";

export type ColorMode = "dark" | "light";

const STORAGE_KEY = "emerald-guide-color-mode";

const THEME_COLORS: Record<ColorMode, string> = {
  dark: "#0a1628",
  light: "#f0f4fa",
};

function readStoredMode(): ColorMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "dark" || value === "light") return value;
  } catch {
    /* private browsing */
  }
  return null;
}

function ensureThemeColorMeta(): HTMLMetaElement {
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  return meta;
}

export function applyColorMode(mode: ColorMode): void {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  ensureThemeColorMeta().content = THEME_COLORS[mode];
}

export function useColorMode(): [ColorMode, (mode: ColorMode) => void] {
  const [mode, setMode] = useState<ColorMode>(() => readStoredMode() ?? "dark");

  useEffect(() => {
    applyColorMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return [mode, setMode];
}
