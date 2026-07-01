import { useEffect, useState } from "react";

export type LayoutViewMode = "mobile" | "desktop";

const STORAGE_KEY = "emerald-guide-view-mode";

function readStoredMode(): LayoutViewMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "mobile" || value === "desktop") return value;
  } catch {
    /* private browsing */
  }
  return null;
}

function defaultMode(): LayoutViewMode {
  if (typeof window === "undefined") return "mobile";
  return window.matchMedia("(max-width: 900px)").matches ? "mobile" : "desktop";
}

export function useViewMode(): [LayoutViewMode, (mode: LayoutViewMode) => void] {
  const [mode, setMode] = useState<LayoutViewMode>(() => readStoredMode() ?? defaultMode());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return [mode, setMode];
}
