import { useCallback, useEffect, useState, type SetStateAction } from "react";
import type { WalkthroughPlayMode } from "../types";
import { normalizeCompletedStepIds } from "../lib/walkthroughProgress";

export interface WalkthroughPreferences {
  setupComplete: boolean;
  skipPregame: boolean;
  playMode: WalkthroughPlayMode;
  /** Last walkthrough step the user was viewing (persisted across reloads). */
  activeStepId?: string;
  /**
   * Story/postgame step ids the user has explicitly marked Complete.
   * Navigating the guide does not add or remove these.
   */
  completedStepIds?: string[];
}

const STORAGE_KEY = "emerald-guide-walkthrough-prefs";

export const DEFAULT_WALKTHROUGH_PREFERENCES: WalkthroughPreferences = {
  setupComplete: false,
  skipPregame: false,
  playMode: "completionist",
};

function readStoredPreferences(): WalkthroughPreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WalkthroughPreferences>;
    if (
      typeof parsed.setupComplete !== "boolean" ||
      typeof parsed.skipPregame !== "boolean" ||
      (parsed.playMode !== "storyline" && parsed.playMode !== "completionist")
    ) {
      return null;
    }
    return {
      setupComplete: parsed.setupComplete,
      skipPregame: parsed.skipPregame,
      playMode: parsed.playMode,
      activeStepId:
        typeof parsed.activeStepId === "string" ? parsed.activeStepId : undefined,
      completedStepIds: normalizeCompletedStepIds(parsed.completedStepIds),
    };
  } catch {
    return null;
  }
}

export function getWalkthroughStartStepId(prefs: WalkthroughPreferences): string {
  return prefs.skipPregame ? "littleroot-1" : "pregame-evolution-1";
}

export function useWalkthroughPreferences(): [
  WalkthroughPreferences,
  (next: SetStateAction<WalkthroughPreferences>) => void,
  () => void,
] {
  const [prefs, setPrefsState] = useState<WalkthroughPreferences>(
    () => readStoredPreferences() ?? DEFAULT_WALKTHROUGH_PREFERENCES,
  );

  const setPrefs = useCallback((next: SetStateAction<WalkthroughPreferences>) => {
    setPrefsState(next);
  }, []);

  const resetSetup = useCallback(() => {
    setPrefsState((current) => ({ ...current, setupComplete: false }));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* private browsing */
    }
  }, [prefs]);

  return [prefs, setPrefs, resetSetup];
}
