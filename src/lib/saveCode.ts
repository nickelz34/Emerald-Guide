import type { WalkthroughPlayMode } from "../types";

export interface SaveCodeState {
  skipPregame: boolean;
  playMode: WalkthroughPlayMode;
  stepId: string;
}

export type LoadSaveCodeResult =
  | { ok: true; state: SaveCodeState }
  | { ok: false; error: string };

export const SAVE_CODE_LENGTH = 4;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STORAGE_PREFIX = "emerald-guide-save:";
const INDEX_KEY = "emerald-guide-save-codes";

function storageKey(code: string): string {
  return `${STORAGE_PREFIX}${code}`;
}

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

function isValidCodeFormat(code: string): boolean {
  return new RegExp(`^[A-Z]{${SAVE_CODE_LENGTH}}$`).test(code);
}

function readCodeIndex(): string[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === "string" && isValidCodeFormat(entry));
  } catch {
    return [];
  }
}

function writeCodeIndex(codes: string[]): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(codes));
  } catch {
    /* private browsing / quota */
  }
}

function rememberCode(code: string): void {
  const codes = readCodeIndex();
  if (!codes.includes(code)) {
    writeCodeIndex([...codes, code]);
  }
}

function randomCode(): string {
  const bytes = new Uint8Array(SAVE_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) {
    out += CHARSET[byte % CHARSET.length];
  }
  return out;
}

/** Generate a random unique 4-letter code not already used in localStorage. */
export function generateUniqueSaveCode(): string | null {
  const existing = new Set(readCodeIndex());
  for (let attempt = 0; attempt < 64; attempt++) {
    const code = randomCode();
    if (existing.has(code)) continue;
    try {
      if (localStorage.getItem(storageKey(code)) !== null) continue;
    } catch {
      return null;
    }
    return code;
  }
  return null;
}

function isValidState(value: unknown): value is SaveCodeState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<SaveCodeState>;
  return (
    typeof state.skipPregame === "boolean" &&
    (state.playMode === "storyline" || state.playMode === "completionist") &&
    typeof state.stepId === "string" &&
    state.stepId.length > 0
  );
}

/**
 * Create a new 4-letter save code and store guide progress under it in localStorage.
 */
export function createSaveCode(state: SaveCodeState): string | null {
  const code = generateUniqueSaveCode();
  if (!code) return null;

  try {
    localStorage.setItem(
      storageKey(code),
      JSON.stringify({
        skipPregame: state.skipPregame,
        playMode: state.playMode,
        stepId: state.stepId,
        savedAt: new Date().toISOString(),
      }),
    );
    rememberCode(code);
    return code;
  } catch {
    return null;
  }
}

/** Load guide progress previously stored under a 4-letter save code. */
export function loadSaveCode(raw: string): LoadSaveCodeResult {
  const code = normalizeCode(raw);
  if (code.length !== SAVE_CODE_LENGTH) {
    return { ok: false, error: "Save codes are exactly 4 letters." };
  }
  if (!isValidCodeFormat(code)) {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }

  try {
    const rawValue = localStorage.getItem(storageKey(code));
    if (!rawValue) {
      return { ok: false, error: "No save found for that code on this device." };
    }
    const parsed = JSON.parse(rawValue) as unknown;
    if (!isValidState(parsed)) {
      return { ok: false, error: "Invalid or unrecognized save code." };
    }
    return {
      ok: true,
      state: {
        skipPregame: parsed.skipPregame,
        playMode: parsed.playMode,
        stepId: parsed.stepId,
      },
    };
  } catch {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }
}
