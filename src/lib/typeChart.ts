/** Gen 3 type chart — super-effective attacking types per defending type. */
const SUPER: Record<string, string[]> = {
  Normal: ["Fighting"],
  Fire: ["Water", "Ground", "Rock"],
  Water: ["Electric", "Grass"],
  Electric: ["Ground"],
  Grass: ["Fire", "Ice", "Poison", "Flying", "Bug"],
  Ice: ["Fire", "Fighting", "Rock", "Steel"],
  Fighting: ["Flying", "Psychic"],
  Poison: ["Ground", "Psychic"],
  Ground: ["Water", "Grass", "Ice"],
  Flying: ["Electric", "Ice", "Rock"],
  Psychic: ["Bug", "Ghost", "Dark"],
  Bug: ["Fire", "Flying", "Rock"],
  Rock: ["Water", "Grass", "Fighting", "Ground", "Steel"],
  Ghost: ["Ghost", "Dark"],
  Dragon: ["Ice", "Dragon"],
  Dark: ["Fighting", "Bug"],
  Steel: ["Fire", "Fighting", "Ground"],
};

/** Attacking type → defending types that resist it (½×). */
const RESIST: Record<string, string[]> = {
  Normal: ["Rock", "Steel"],
  Fire: ["Fire", "Water", "Rock", "Dragon"],
  Water: ["Water", "Grass", "Dragon"],
  Electric: ["Electric", "Grass", "Dragon"],
  Grass: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
  Ice: ["Fire", "Water", "Ice", "Steel"],
  Fighting: ["Poison", "Flying", "Psychic", "Bug"],
  Poison: ["Poison", "Ground", "Rock", "Ghost"],
  Ground: ["Grass", "Bug"],
  Flying: ["Electric", "Rock", "Steel"],
  Psychic: ["Psychic", "Steel"],
  Bug: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel"],
  Rock: ["Fighting", "Ground", "Steel"],
  Ghost: ["Dark"],
  Dragon: ["Steel"],
  Dark: ["Fighting", "Dark", "Steel"],
  Steel: ["Fire", "Water", "Electric", "Steel"],
};

/** Attacking type → defending types that are immune (0×). */
const IMMUNE: Record<string, string[]> = {
  Normal: ["Ghost"],
  Electric: ["Ground"],
  Fighting: ["Ghost"],
  Poison: ["Steel"],
  Ground: ["Flying"],
  Psychic: ["Dark"],
  Ghost: ["Normal"],
};

const ALL_TYPES = Object.keys(SUPER);

/** Multiplier when `atk` hits a Pokémon with the given defending type(s). */
export function typeEffectiveness(atk: string, defendingTypes: string[]): number {
  let mult = 1;
  for (const def of defendingTypes) {
    if (IMMUNE[atk]?.includes(def)) return 0;
    if (SUPER[def]?.includes(atk)) mult *= 2;
    else if (RESIST[atk]?.includes(def)) mult *= 0.5;
  }
  return mult;
}

export interface DefenseBucket {
  x4: string[];
  x2: string[];
  x05: string[];
  x025: string[];
  x0: string[];
}

/** Offense-facing defense profile for a species' type combination. */
export function defenseProfile(defendingTypes: string[]): DefenseBucket {
  const bucket: DefenseBucket = { x4: [], x2: [], x05: [], x025: [], x0: [] };
  for (const atk of ALL_TYPES) {
    const m = typeEffectiveness(atk, defendingTypes);
    if (m === 4) bucket.x4.push(atk);
    else if (m === 2) bucket.x2.push(atk);
    else if (m === 0.5) bucket.x05.push(atk);
    else if (m === 0.25) bucket.x025.push(atk);
    else if (m === 0) bucket.x0.push(atk);
  }
  return bucket;
}

export function teamWeaknesses(partyTypes: string[][]): string[] {
  const flat = [...new Set(partyTypes.flat())];
  const weak = new Set<string>();
  for (const def of flat) {
    for (const atk of SUPER[def] ?? []) weak.add(atk);
  }
  return [...weak].sort();
}

export function resistTypes(partyTypes: string[][]): string[] {
  const flat = [...new Set(partyTypes.flat())];
  return ALL_TYPES.filter(
    (atk) => flat.length > 0 && flat.every((def) => !SUPER[def]?.includes(atk)),
  );
}