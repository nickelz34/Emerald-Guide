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

const ALL_TYPES = Object.keys(SUPER);

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