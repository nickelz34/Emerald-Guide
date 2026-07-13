import { SPECIES_BY_SLUG } from "./speciesDataGenerated";
import type { SpeciesInfo } from "./species";
import { ALL_DEX } from "./dexGenerated";

export interface BreedingParentOption {
  slug: string;
  name: string;
  nationalNumber?: number;
}

export interface BreedingParentDetails {
  slug: string;
  name: string;
  nationalNumber?: number;
  eggGroups: string[];
  genderLabel: string;
  types: string[];
  isDitto: boolean;
  isUndiscovered: boolean;
  isGenderless: boolean;
}

export interface BreedingOffspringDetail {
  name: string;
  slug?: string;
  nationalNumber?: number;
  /** Parenthetical incense / variant note — no sprite. */
  isNote?: boolean;
}

export interface BreedingResult {
  compatible: boolean;
  summary: string;
  notes: string[];
  /** Likely offspring display names when known. */
  offspring: string[];
  offspringDetails: BreedingOffspringDetail[];
  sharedEggGroups: string[];
  parentA: BreedingParentDetails;
  parentB: BreedingParentDetails;
}

/** Gen 3 incense babies: parent family → baby when incense held. */
const INCENSE_BABIES: Record<
  string,
  { baby: string; babySlug: string; incense: string; withoutIncense: string }
> = {
  marill: {
    baby: "Azurill",
    babySlug: "azurill",
    incense: "Sea Incense",
    withoutIncense: "Marill",
  },
  azumarill: {
    baby: "Azurill",
    babySlug: "azurill",
    incense: "Sea Incense",
    withoutIncense: "Marill",
  },
  azurill: {
    baby: "Azurill",
    babySlug: "azurill",
    incense: "Sea Incense",
    withoutIncense: "Marill",
  },
  wobbuffet: {
    baby: "Wynaut",
    babySlug: "wynaut",
    incense: "Lax Incense",
    withoutIncense: "Wobbuffet",
  },
  wynaut: {
    baby: "Wynaut",
    babySlug: "wynaut",
    incense: "Lax Incense",
    withoutIncense: "Wobbuffet",
  },
};

function displayNameFromSlug(slug: string): string {
  return (
    ALL_DEX.find((d) => d.slug === slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

function getInfo(slug: string): SpeciesInfo | undefined {
  return SPECIES_BY_SLUG[slug];
}

function isUndiscovered(info: SpeciesInfo): boolean {
  return (info.eggGroups ?? []).includes("Undiscovered");
}

function isDitto(slug: string): boolean {
  return slug === "ditto";
}

function isGenderless(info: SpeciesInfo): boolean {
  return info.genderRate === -1;
}

function sharesEggGroup(a: SpeciesInfo, b: SpeciesInfo): boolean {
  const ag = a.eggGroups ?? [];
  const bg = b.eggGroups ?? [];
  return ag.some((g) => g !== "Ditto" && g !== "Undiscovered" && bg.includes(g));
}

export function formatGenderLabel(genderRate?: number): string {
  if (genderRate === undefined) return "Unknown gender ratio";
  if (genderRate === -1) return "Genderless — breeds only with Ditto";
  if (genderRate === 0) return "100% male";
  if (genderRate === 8) return "100% female";
  const femalePct = Math.round((genderRate / 8) * 100);
  const malePct = 100 - femalePct;
  return `${femalePct}% ♀ · ${malePct}% ♂`;
}

function getSharedEggGroups(a: SpeciesInfo, b: SpeciesInfo): string[] {
  const ag = (a.eggGroups ?? []).filter((g) => g !== "Ditto" && g !== "Undiscovered");
  const bg = (b.eggGroups ?? []).filter((g) => g !== "Ditto" && g !== "Undiscovered");
  return ag.filter((g) => bg.includes(g));
}

function buildParentDetails(slug: string, info: SpeciesInfo): BreedingParentDetails {
  const dexEntry = ALL_DEX.find((d) => d.slug === slug);
  return {
    slug,
    name: displayNameFromSlug(slug),
    nationalNumber: dexEntry?.nationalNumber,
    eggGroups: (info.eggGroups ?? []).filter((g) => g !== "Ditto"),
    genderLabel: formatGenderLabel(info.genderRate),
    types: info.types ?? [],
    isDitto: isDitto(slug),
    isUndiscovered: isUndiscovered(info),
    isGenderless: isGenderless(info),
  };
}

function emptyParent(slug: string): BreedingParentDetails {
  const info = getInfo(slug);
  if (info) return buildParentDetails(slug, info);
  return {
    slug,
    name: displayNameFromSlug(slug),
    eggGroups: [],
    genderLabel: "—",
    types: [],
    isDitto: isDitto(slug),
    isUndiscovered: false,
    isGenderless: false,
  };
}

function parseOffspringDetails(lines: string[]): BreedingOffspringDetail[] {
  return lines.map((line) => {
    if (line.startsWith("(")) {
      return { name: line, isNote: true };
    }
    const dexEntry = ALL_DEX.find((d) => d.name === line);
    return {
      name: line,
      slug: dexEntry?.slug,
      nationalNumber: dexEntry?.nationalNumber,
    };
  });
}

function finalizeResult(
  slugA: string,
  slugB: string,
  partial: {
    compatible: boolean;
    summary: string;
    notes: string[];
    offspring: string[];
  },
): BreedingResult {
  const a = getInfo(slugA);
  const b = getInfo(slugB);
  return {
    ...partial,
    offspringDetails: parseOffspringDetails(partial.offspring),
    sharedEggGroups: a && b ? getSharedEggGroups(a, b) : [],
    parentA: a ? buildParentDetails(slugA, a) : emptyParent(slugA),
    parentB: b ? buildParentDetails(slugB, b) : emptyParent(slugB),
  };
}

/** Resolve the usual hatchling name for a non-Ditto parent species. */
export function offspringForSpecies(slug: string, withIncense: boolean): string[] {
  const incense = INCENSE_BABIES[slug];
  if (incense) {
    return withIncense
      ? [incense.baby, `(without ${incense.incense}: ${incense.withoutIncense})`]
      : [
          incense.withoutIncense,
          `(hold ${incense.incense} on a parent for ${incense.baby})`,
        ];
  }

  const info = getInfo(slug);
  if (!info) return [displayNameFromSlug(slug)];

  // Prefer lowest form in evolutionMethods / evolution list
  const methods = info.evolutionMethods ?? [];
  const names = info.evolution ?? [];
  if (names.length > 0) {
    // First name in chain is usually the baby / base
    return [names[0]];
  }

  // Walk "to → from" reverse once
  const targets = new Set(methods.map((m) => m.to));
  const bases = methods.map((m) => m.from).filter((f) => !targets.has(f));
  if (bases.length) return [bases[0]];

  return [displayNameFromSlug(slug)];
}

export function listBreedingOptions(): BreedingParentOption[] {
  return ALL_DEX.filter((d) => !d.isGlitch && d.slug && SPECIES_BY_SLUG[d.slug])
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      nationalNumber: d.nationalNumber,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function checkBreeding(slugA: string, slugB: string): BreedingResult {
  const a = getInfo(slugA);
  const b = getInfo(slugB);
  if (!a || !b) {
    return finalizeResult(slugA, slugB, {
      compatible: false,
      summary: "Unknown species.",
      notes: [],
      offspring: [],
    });
  }

  const nameA = displayNameFromSlug(slugA);
  const nameB = displayNameFromSlug(slugB);

  if (isDitto(slugA) && isDitto(slugB)) {
    return finalizeResult(slugA, slugB, {
      compatible: false,
      summary: "Two Ditto cannot breed.",
      notes: ["Leave one Ditto and any other breedable Pokémon at the Day Care."],
      offspring: [],
    });
  }

  if (isUndiscovered(a) || isUndiscovered(b)) {
    return finalizeResult(slugA, slugB, {
      compatible: false,
      summary: "Undiscovered egg group — no Eggs.",
      notes: [
        `${isUndiscovered(a) ? nameA : nameB} is in the Undiscovered group and cannot breed in Emerald.`,
        "Breed the evolved line instead (e.g. Pikachu, not Pichu). Nidorina and Nidoqueen are a special case — they cannot breed even though Nidoran♀ can.",
      ],
      offspring: [],
    });
  }

  const dittoA = isDitto(slugA);
  const dittoB = isDitto(slugB);

  if (dittoA || dittoB) {
    const otherSlug = dittoA ? slugB : slugA;
    const otherName = dittoA ? nameB : nameA;
    const other = dittoA ? b : a;
    if (isUndiscovered(other)) {
      return finalizeResult(slugA, slugB, {
        compatible: false,
        summary: `${otherName} cannot breed (Undiscovered).`,
        notes: [],
        offspring: [],
      });
    }
    const offspring = offspringForSpecies(otherSlug, false);
    const incense = INCENSE_BABIES[otherSlug];
    const notes = [
      "Ditto can breed with any gender (or genderless) Pokémon that is not Undiscovered.",
      "Offspring follows the non-Ditto parent's family at level 5.",
      "The game checks for an Egg every 256 steps while the pair is compatible.",
    ];
    if (incense) {
      notes.push(
        `Hold ${incense.incense} on the non-Ditto parent for ${incense.baby}; otherwise you get ${incense.withoutIncense}.`,
      );
    }
    return finalizeResult(slugA, slugB, {
      compatible: true,
      summary: `Compatible — ${otherName} + Ditto.`,
      notes,
      offspring,
    });
  }

  if (isGenderless(a) || isGenderless(b)) {
    return finalizeResult(slugA, slugB, {
      compatible: false,
      summary: "Genderless Pokémon only breed with Ditto.",
      notes: [
        `${isGenderless(a) ? nameA : nameB} has no gender — pair it with Ditto instead.`,
        "Common genderless lines in Hoenn: Voltorb, Magnemite, Staryu, Beldum, Lunatone, Solrock.",
      ],
      offspring: [],
    });
  }

  // Same species always share groups; opposite genders required in-game
  if (!sharesEggGroup(a, b) && slugA !== slugB) {
    const shared = getSharedEggGroups(a, b);
    return finalizeResult(slugA, slugB, {
      compatible: false,
      summary: "No shared egg group.",
      notes: [
        `${nameA}: ${(a.eggGroups ?? []).join(", ") || "—"}.`,
        `${nameB}: ${(b.eggGroups ?? []).join(", ") || "—"}.`,
        shared.length === 0
          ? "Parents need at least one egg group in common (besides Ditto / Undiscovered), or one parent must be Ditto."
          : "",
      ].filter(Boolean),
      offspring: [],
    });
  }

  const notes = [
    "Compatible if opposite genders in a shared egg group.",
    "The Egg hatches as the female parent's family (baby form when applicable) at level 5.",
    "Everstone on the mother or Ditto passes nature 50% of the time in Emerald.",
    "The father passes egg moves and compatible TM/HM moves in Generation III.",
  ];
  if (INCENSE_BABIES[slugA] || INCENSE_BABIES[slugB]) {
    const inc = INCENSE_BABIES[slugA] ?? INCENSE_BABIES[slugB]!;
    notes.push(
      `${inc.incense}: hold on a parent to hatch ${inc.baby}; otherwise ${inc.withoutIncense}.`,
    );
  }

  // Offspring possibilities depend on which is female
  const offspring = Array.from(
    new Set([
      ...offspringForSpecies(slugA, false).filter((s) => !s.startsWith("(")),
      ...offspringForSpecies(slugB, false).filter((s) => !s.startsWith("(")),
    ]),
  );

  // Re-attach incense note lines when relevant
  const incenseA = INCENSE_BABIES[slugA];
  const incenseB = INCENSE_BABIES[slugB];
  const offspringWithNotes = [...offspring];
  if (incenseA) {
    offspringWithNotes.push(`(hold ${incenseA.incense} on a parent for ${incenseA.baby})`);
  } else if (incenseB) {
    offspringWithNotes.push(`(hold ${incenseB.incense} on a parent for ${incenseB.baby})`);
  }

  return finalizeResult(slugA, slugB, {
    compatible: true,
    summary: `Compatible if opposite genders (${nameA} × ${nameB}).`,
    notes,
    offspring: offspringWithNotes,
  });
}
