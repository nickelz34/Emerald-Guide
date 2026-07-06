import { TRAINER_BATTLES, type TrainerBattleData } from "./trainerPartiesGenerated";

export type { TrainerBattleData, TrainerPartyMon } from "./trainerPartiesGenerated";

export function getTrainerBattle(trainerId: string | undefined): TrainerBattleData | undefined {
  if (!trainerId) return undefined;
  return TRAINER_BATTLES[trainerId];
}