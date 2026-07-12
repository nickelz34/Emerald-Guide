import type { GuideSection, GuideStep } from "../types";
import {
  getAreasForStep,
  getAreaData,
  getRouteHiddenItems,
  getRoutePickups,
  getSecretsExtrasForStep,
} from "./areaData";
import { getGymForWalkthroughStep } from "./gymData";

export type WalkthroughMatchField =
  | "title"
  | "location"
  | "summary"
  | "story"
  | "details"
  | "tips"
  | "secrets"
  | "tags"
  | "item"
  | "pokemon"
  | "section"
  | "gym";

export interface WalkthroughSearchHit {
  stepId: string;
  field: WalkthroughMatchField;
  /** Short excerpt showing why the step matched. */
  snippet: string;
  score: number;
}

const FIELD_SCORE: Record<WalkthroughMatchField, number> = {
  title: 100,
  location: 80,
  item: 75,
  details: 70,
  gym: 65,
  story: 60,
  tips: 55,
  secrets: 50,
  pokemon: 45,
  summary: 40,
  tags: 30,
  section: 20,
};

const FIELD_LABEL: Record<WalkthroughMatchField, string> = {
  title: "Title",
  location: "Location",
  summary: "Summary",
  story: "Story",
  details: "Objectives",
  tips: "Tips",
  secrets: "Secrets",
  tags: "Tags",
  item: "Item",
  pokemon: "Pokémon",
  section: "Chapter",
  gym: "Gym",
};

export function walkthroughMatchFieldLabel(field: WalkthroughMatchField): string {
  return FIELD_LABEL[field];
}

function tokenize(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function includesAll(haystack: string, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const h = haystack.toLowerCase();
  return tokens.every((t) => h.includes(t));
}

/** Pull a short readable excerpt around the first matching token. */
function makeSnippet(text: string, tokens: string[], maxLen = 96): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const lower = cleaned.toLowerCase();
  let idx = -1;
  let tokenLen = 0;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i >= 0 && (idx < 0 || i < idx)) {
      idx = i;
      tokenLen = t.length;
    }
  }
  if (idx < 0) {
    return cleaned.length <= maxLen ? cleaned : `${cleaned.slice(0, maxLen - 1)}…`;
  }
  const pad = Math.floor((maxLen - tokenLen) / 2);
  let start = Math.max(0, idx - pad);
  let end = Math.min(cleaned.length, idx + tokenLen + pad);
  if (end - start < maxLen) {
    end = Math.min(cleaned.length, start + maxLen);
    start = Math.max(0, end - maxLen);
  }
  let snippet = cleaned.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < cleaned.length) snippet = `${snippet}…`;
  return snippet;
}

interface SearchField {
  field: WalkthroughMatchField;
  text: string;
}

function stepSearchFields(step: GuideStep, sectionTitle: string): SearchField[] {
  const fields: SearchField[] = [
    { field: "title", text: step.title },
    { field: "section", text: sectionTitle },
    { field: "summary", text: step.summary },
  ];
  if (step.location) fields.push({ field: "location", text: step.location });
  for (const para of step.story ?? []) fields.push({ field: "story", text: para });
  for (const line of step.details) fields.push({ field: "details", text: line });
  for (const tip of step.tips ?? []) fields.push({ field: "tips", text: tip });
  for (const tag of step.tags ?? []) fields.push({ field: "tags", text: tag.replace(/-/g, " ") });

  for (const line of getSecretsExtrasForStep(step.id, step.secrets)) {
    fields.push({ field: "secrets", text: line });
  }

  for (const areaId of getAreasForStep(step.id)) {
    for (const pickup of [...getRoutePickups(areaId), ...getRouteHiddenItems(areaId)]) {
      fields.push({
        field: "item",
        text: pickup.desc ? `${pickup.name} ${pickup.desc}` : pickup.name,
      });
    }
    const area = getAreaData(areaId);
    for (const enc of area?.encounters ?? []) {
      fields.push({ field: "pokemon", text: enc.name });
    }
  }

  const gym = getGymForWalkthroughStep(step.id);
  if (gym) {
    fields.push({
      field: "gym",
      text: `${gym.gymName} ${gym.leaderName} ${gym.badgeName}`,
    });
  }

  return fields;
}

/**
 * Find the best matching field for a walkthrough step against a free-text query.
 * Returns null when the step does not match.
 */
export function matchWalkthroughStep(
  step: GuideStep,
  sectionTitle: string,
  query: string,
): WalkthroughSearchHit | null {
  const tokens = tokenize(query);
  if (tokens.length === 0) return null;

  let best: WalkthroughSearchHit | null = null;
  for (const { field, text } of stepSearchFields(step, sectionTitle)) {
    if (!text || !includesAll(text, tokens)) continue;
    const score = FIELD_SCORE[field];
    if (best && best.score >= score) continue;
    best = {
      stepId: step.id,
      field,
      snippet: makeSnippet(text, tokens),
      score,
    };
  }
  return best;
}

/** Rank matching steps within a section (highest score first, stable by original order). */
export function filterWalkthroughSteps(
  section: GuideSection,
  query: string,
): { step: GuideStep; hit: WalkthroughSearchHit | null }[] {
  const q = query.trim();
  if (!q) {
    return section.steps.map((step) => ({ step, hit: null }));
  }

  const ranked: { step: GuideStep; hit: WalkthroughSearchHit; index: number }[] = [];
  section.steps.forEach((step, index) => {
    const hit = matchWalkthroughStep(step, section.title, q);
    if (hit) ranked.push({ step, hit, index });
  });
  ranked.sort((a, b) => b.hit.score - a.hit.score || a.index - b.index);
  return ranked.map(({ step, hit }) => ({ step, hit }));
}
