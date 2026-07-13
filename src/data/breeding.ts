import { SPECIES_BY_SLUG } from "./speciesDataGenerated";
import type { SpeciesInfo } from "./species";
import { ALL_DEX } from "./dexGenerated";

export interface BreedingParentOption {
  slug: string;
  name: string;
  nationalNumber?: number;
}

export interface BreedingResult {
  compatible: boolean;
  summary: string;
  notes: string[];
  /** Likely offspring display names when known. */
  offspring: string[];
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
    return {
      compatible: false,
      summary: "Unknown species.",
      notes: [],
      offspring: [],
    };
  }

  const nameA = displayNameFromSlug(slugA);
  const nameB = displayNameFromSlug(slugB);

  if (isDitto(slugA) && isDitto(slugB)) {
    return {
      compatible: false,
      summary: "Two Ditto cannot breed.",
      notes: ["Leave one Ditto and any other breedable Pokémon at the Day Care."],
      offspring: [],
    };
  }

  if (isUndiscovered(a) || isUndiscovered(b)) {
    return {
      compatible: false,
      summary: "Undiscovered egg group — no Eggs.",
      notes: [
        `${isUndiscovered(a) ? nameA : nameB} is in the Undiscovered group and cannot breed in Emerald.`,
      ],
      offspring: [],
    };
  }

  const dittoA = isDitto(slugA);
  const dittoB = isDitto(slugB);

  if (dittoA || dittoB) {
    const otherSlug = dittoA ? slugB : slugA;
    const otherName = dittoA ? nameB : nameA;
    const other = dittoA ? b : a;
    if (isUndiscovered(other)) {
      return {
        compatible: false,
        summary: `${otherName} cannot breed (Undiscovered).`,
        notes: [],
        offspring: [],
      };
    }
    const offspring = offspringForSpecies(otherSlug, false);
    const incense = INCENSE_BABIES[otherSlug];
    const notes = [
      "Ditto can breed with any gender (or genderless) Pokémon that is not Undiscovered.",
      "Offspring follows the non-Ditto parent's family.",
    ];
    if (incense) {
      notes.push(
        `Hold ${incense.incense} on the non-Ditto parent for ${incense.baby}; otherwise you get ${incense.withoutIncense}.`,
      );
    }
    return {
      compatible: true,
      summary: `Compatible — ${otherName} + Ditto.`,
      notes,
      offspring,
    };
  }

  if (isGenderless(a) || isGenderless(b)) {
    return {
      compatible: false,
      summary: "Genderless Pokémon only breed with Ditto.",
      notes: [
        `${isGenderless(a) ? nameA : nameB} has no gender — pair it with Ditto instead.`,
      ],
      offspring: [],
    };
  }

  // Same species always share groups; opposite genders required in-game
  if (!sharesEggGroup(a, b) && slugA !== slugB) {
    return {
      compatible: false,
      summary: "No shared egg group.",
      notes: [
        `${nameA}: ${(a.eggGroups ?? []).join(", ") || "—"}.`,
        `${nameB}: ${(b.eggGroups ?? []).join(", ") || "—"}.`,
      ],
      offspring: [],
    };
  }

  const notes = [
    "Compatible if opposite genders (same egg group).",
    "The Egg hatches as the female parent's family (baby form when applicable).",
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

  return {
    compatible: true,
    summary: `Compatible if opposite genders (${nameA} × ${nameB}).`,
    notes,
    offspring,
  };
}
