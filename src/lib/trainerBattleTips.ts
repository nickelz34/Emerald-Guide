import type { TrainerPoint } from "../data/mapTrainersGenerated";
import type { TrainerBattleData } from "../data/trainerPartiesGenerated";
import { resistTypes, teamWeaknesses } from "./typeChart";

export function getTrainerBattleTips(
  trainer: TrainerPoint,
  battle: TrainerBattleData | undefined,
): string[] {
  const tips: string[] = [];

  if (trainer.script === "BattlePyramid_TrainerBattle") {
    tips.push("Battle Pyramid — party is randomly rented; scout during the battle.");
    return tips;
  }

  if (trainer.trainerType === "TRAINER_TYPE_BURIED") {
    tips.push("Hidden trainer (tree or rock disguise) — interact to reveal before battling.");
  } else if (trainer.sightRange) {
    tips.push(
      `Line-of-sight ${trainer.sightRange} tile${trainer.sightRange === 1 ? "" : "s"} — stay outside their vision cone or use a Repel to chain other battles first.`,
    );
  }

  if (!battle) {
    tips.push("Party data unavailable for this trainer — likely a special battle script.");
    return tips;
  }

  if (battle.doubleBattle) {
    tips.push("Double battle — lead with two healthy Pokémon.");
  }

  const levels = battle.party.map((m) => m.level);
  const maxLv = Math.max(...levels);
  const minLv = Math.min(...levels);
  if (levels.length === 1) {
    tips.push(`Single Pokémon at Lv. ${maxLv}.`);
  } else {
    tips.push(`Party levels Lv. ${minLv}–${maxLv} (${battle.party.length} Pokémon).`);
  }

  const partyTypes = battle.party.map((m) => m.types);
  const weak = teamWeaknesses(partyTypes);
  if (weak.length) {
    tips.push(`Strong picks: ${weak.slice(0, 6).join(", ")}${weak.length > 6 ? "…" : ""} — super-effective coverage.`);
  }
  const resist = resistTypes(partyTypes);
  if (resist.length && resist.length <= 8) {
    tips.push(`Avoid relying on: ${resist.join(", ")} — little or no super-effective damage.`);
  }

  const held = battle.party.filter((m) => m.heldItem);
  if (held.length) {
    tips.push(`Held items: ${held.map((m) => `${m.species} (${m.heldItem})`).join(", ")}.`);
  }

  const customMoves = battle.party.filter((m) => m.moves?.length);
  if (customMoves.length) {
    tips.push("Uses custom movesets — check the move list; surprises like status or self-destruct are common.");
  }

  if (battle.items.length) {
    tips.push(`Trainer may use items in battle: ${battle.items.join(", ")}.`);
  }

  if (battle.party.some((m) => (m.iv ?? 0) >= 30)) {
    tips.push("High IVs — expect boosted stats versus a typical wild Pokémon.");
  }

  return tips;
}