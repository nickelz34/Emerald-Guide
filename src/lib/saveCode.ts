import { getFlatSteps } from "../data";
import type { WalkthroughPlayMode } from "../types";

export interface SaveCodeState {
  skipPregame: boolean;
  playMode: WalkthroughPlayMode;
  stepId: string;
}

export type DecodeSaveCodeResult =
  | { ok: true; state: SaveCodeState }
  | { ok: false; error: string };

const SAVE_CODE_VERSION = 1;
const SAVE_CODE_LENGTH = 6;
const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Bit layout (24 bits): version[4] | skip[1] | mode[1] | stepIndex[10] | checksum[8] */
const VERSION_SHIFT = 20;
const SKIP_SHIFT = 19;
const MODE_SHIFT = 18;
const STEP_SHIFT = 8;
const VERSION_MASK = 0xf;
const STEP_MASK = 0x3ff;
const CHECKSUM_MASK = 0xff;

function walkthroughStepIds(): string[] {
  return getFlatSteps("walkthrough").map((step) => step.id);
}

function computeChecksum(
  version: number,
  skipPregame: boolean,
  playModeBit: number,
  stepIndex: number,
): number {
  const raw =
    version * 31 + (skipPregame ? 17 : 0) + playModeBit * 13 + stepIndex * 7;
  return (raw ^ 0xa5) & CHECKSUM_MASK;
}

function toBase36(value: number): string {
  let n = value;
  if (n === 0) return "0".repeat(SAVE_CODE_LENGTH);
  let out = "";
  while (n > 0) {
    out = CHARSET[n % 36] + out;
    n = Math.floor(n / 36);
  }
  return out.padStart(SAVE_CODE_LENGTH, "0");
}

function fromBase36(code: string): number | null {
  let value = 0;
  for (const ch of code) {
    const idx = CHARSET.indexOf(ch);
    if (idx < 0) return null;
    value = value * 36 + idx;
  }
  return value;
}

/** Encode play prefs + current walkthrough step into a 6-character save code. */
export function encodeSaveCode(state: SaveCodeState): string | null {
  const ids = walkthroughStepIds();
  const stepIndex = ids.indexOf(state.stepId);
  if (stepIndex < 0 || stepIndex > STEP_MASK) return null;

  const playModeBit = state.playMode === "completionist" ? 1 : 0;
  const checksum = computeChecksum(
    SAVE_CODE_VERSION,
    state.skipPregame,
    playModeBit,
    stepIndex,
  );

  const packed =
    ((SAVE_CODE_VERSION & VERSION_MASK) << VERSION_SHIFT) |
    ((state.skipPregame ? 1 : 0) << SKIP_SHIFT) |
    (playModeBit << MODE_SHIFT) |
    ((stepIndex & STEP_MASK) << STEP_SHIFT) |
    (checksum & CHECKSUM_MASK);

  return toBase36(packed);
}

/** Decode a 6-character save code back into walkthrough progress. */
export function decodeSaveCode(raw: string): DecodeSaveCodeResult {
  const code = raw.trim().toUpperCase();
  if (code.length !== SAVE_CODE_LENGTH) {
    return { ok: false, error: "Save codes are exactly 6 characters." };
  }
  if (!/^[0-9A-Z]{6}$/.test(code)) {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }

  const packed = fromBase36(code);
  if (packed === null) {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }

  const version = (packed >> VERSION_SHIFT) & VERSION_MASK;
  const skipPregame = ((packed >> SKIP_SHIFT) & 1) === 1;
  const playModeBit = (packed >> MODE_SHIFT) & 1;
  const stepIndex = (packed >> STEP_SHIFT) & STEP_MASK;
  const checksum = packed & CHECKSUM_MASK;

  if (version !== SAVE_CODE_VERSION) {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }

  const expected = computeChecksum(version, skipPregame, playModeBit, stepIndex);
  if (checksum !== expected) {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }

  const ids = walkthroughStepIds();
  const stepId = ids[stepIndex];
  if (!stepId) {
    return { ok: false, error: "Invalid or unrecognized save code." };
  }

  return {
    ok: true,
    state: {
      skipPregame,
      playMode: playModeBit === 1 ? "completionist" : "storyline",
      stepId,
    },
  };
}
