/**
 * Reverse-engineer Emerald Dewford trend `.rand` (Feebas seed) from Trainer ID
 * + trendy phrase Easy Chat words.
 *
 * Mirrors the Emerald path used by community Feebas tile calculators (e.g. mucksw):
 * start from TID, skip early impossible advances, then scan the RNG stream for
 * InitDewfordTrend word rolls and SeedTrendRng’s `.rand` (with 6/7/8-advance
 * variants for vblank jitter).
 *
 * Only reliable when the Dewford phrase was never manually changed
 * (FLAG_SYS_CHANGED_DEWFORD_TREND). After a player-set phrase, use a raw seed dump.
 */

import {
  EC_CONDITIONS_EN,
  EC_HOBBIES_EN,
  EC_LIFESTYLE_EN,
  isEcCondition,
  isEcSecondWord,
  normalizeEasyChatWord,
} from "./easyChatDewford";

const LCG_MULT = 1103515245;
/** ISO_RANDOMIZE1 — main game Random(). */
const LCG_ADD = 24691;
const EMERALD_SKIP_ADVANCES = 700;
const EMERALD_CANDIDATE_COUNT = 5;

function nextRng(seed: number, n = 1): number {
  let rng = seed >>> 0;
  for (let i = 0; i < n; i++) {
    rng = (Math.imul(LCG_MULT, rng) + LCG_ADD) >>> 0;
  }
  return rng;
}

function high16(seed: number): number {
  return (seed >>> 16) & 0xffff;
}

export type DewfordPhraseIndexes = {
  firstWordIndex: number;
  secondFromLifestyle: boolean;
  secondWordIndex: number;
};

/** Map Easy Chat word strings to InitDewfordTrend Random() indices. */
export function phraseIndexesFromWords(
  word1: string,
  word2: string,
): DewfordPhraseIndexes | null {
  const w1 = normalizeEasyChatWord(word1);
  const w2 = normalizeEasyChatWord(word2);
  if (!isEcCondition(w1) || !isEcSecondWord(w2)) return null;

  const firstWordIndex = EC_CONDITIONS_EN.indexOf(w1 as (typeof EC_CONDITIONS_EN)[number]);
  const lifestyleIndex = (EC_LIFESTYLE_EN as readonly string[]).indexOf(w2);
  if (lifestyleIndex >= 0) {
    return {
      firstWordIndex,
      secondFromLifestyle: true,
      secondWordIndex: lifestyleIndex,
    };
  }
  const hobbyIndex = (EC_HOBBIES_EN as readonly string[]).indexOf(w2);
  if (hobbyIndex < 0) return null;
  return {
    firstWordIndex,
    secondFromLifestyle: false,
    secondWordIndex: hobbyIndex,
  };
}

/**
 * SeedTrendRng consumes 4–6 Random() calls after the two words + gaining flag.
 * Returns how many advances from the first-word RNG state reach `.rand`
 * (inclusive of that Random() call’s advance).
 */
function seedTrendRandAdvances(seedAtFirstWord: number): number {
  // After words[0], words[1] group bit, words[1] index, gainingTrendiness:
  // SeedTrendRng starts at advance 4 from first-word state.
  if (high16(nextRng(seedAtFirstWord, 4)) % 98 > 50) {
    if (high16(nextRng(seedAtFirstWord, 5)) % 98 > 80) return 8;
    return 7;
  }
  return 6;
}

/**
 * Emerald: candidate Feebas random values (u16) for Trainer ID + trendy phrase.
 * Returns up to 5 candidates (vblank / timing variants). Empty if words invalid.
 */
export function feebasSeedCandidatesFromTidAndPhrase(
  trainerId: number,
  word1: string,
  word2: string,
): number[] {
  const tid = trainerId & 0xffff;
  const phrase = phraseIndexesFromWords(word1, word2);
  if (!phrase) return [];

  const { firstWordIndex, secondFromLifestyle, secondWordIndex } = phrase;
  const secondGroupSize = secondFromLifestyle ? 45 : 54;

  let seed = nextRng(tid >>> 0, EMERALD_SKIP_ADVANCES);
  const candidates: number[] = [];

  // Scan the stream for InitDewfordTrend rolls that produce this phrase.
  // Cap iterations so a bad match cannot hang the UI.
  for (let i = 0; i < 2_000_000 && candidates.length < EMERALD_CANDIDATE_COUNT; i++) {
    seed = nextRng(seed);
    if (high16(seed) % 69 !== firstWordIndex) continue;
    if ((high16(nextRng(seed, 1)) & 1) !== (secondFromLifestyle ? 1 : 0)) continue;
    if (high16(nextRng(seed, 2)) % secondGroupSize !== secondWordIndex) continue;

    const advances = seedTrendRandAdvances(seed);
    candidates.push(high16(nextRng(seed, advances)));
  }

  return candidates;
}

export function parseTrainerId(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;
  if (!/^\d{1,5}$/.test(raw)) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0 || n > 65535) return null;
  return n;
}

export function formatPhraseWords(word1: string, word2: string): string {
  return `${normalizeEasyChatWord(word1)} / ${normalizeEasyChatWord(word2)}`;
}
