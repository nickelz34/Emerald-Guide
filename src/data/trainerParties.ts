import { TRAINER_BATTLES, type TrainerBattleData } from "./trainerPartiesGenerated";
import { nationalDexNumberForSpecies } from "./species";

export type { TrainerBattleData, TrainerPartyMon } from "./trainerPartiesGenerated";

function withNationalDexIds(battle: TrainerBattleData): TrainerBattleData {
  let changed = false;
  const party = battle.party.map((mon) => {
    const national = nationalDexNumberForSpecies(mon.species);
    if (!national || national === mon.speciesId) return mon;
    changed = true;
    return { ...mon, speciesId: national };
  });
  return changed ? { ...battle, party } : battle;
}

export function getTrainerBattle(trainerId: string | undefined): TrainerBattleData | undefined {
  if (!trainerId) return undefined;
  const battle = TRAINER_BATTLES[trainerId];
  if (!battle) return undefined;
  return withNationalDexIds(battle);
}
