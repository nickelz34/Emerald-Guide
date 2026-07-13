import type { TrainerPoint } from "./mapTrainersGenerated";
import { GYM_TRAINER_SPRITES } from "./gymSpritesGenerated";

export type PlayerStarter = "MUDKIP" | "TORCHIC" | "TREECKO";
export type PlayerGender = "brendan" | "may";

export interface RivalBattleData {
  walkthroughStepId: string;
  battleNumber: number;
  /** Suffix on TRAINER_{MAY|BRENDAN}_{LOCATION}_{STARTER} */
  locationKey: string;
  note?: string;
}

export const RIVAL_BATTLES: RivalBattleData[] = [
  { walkthroughStepId: "route-103-2", battleNumber: 1, locationKey: "ROUTE_103" },
  { walkthroughStepId: "rustboro-3", battleNumber: 2, locationKey: "RUSTBORO" },
  { walkthroughStepId: "route-110-3", battleNumber: 3, locationKey: "ROUTE_110" },
  { walkthroughStepId: "route-119-3", battleNumber: 4, locationKey: "ROUTE_119" },
  {
    walkthroughStepId: "lilycove-1",
    battleNumber: 5,
    locationKey: "LILYCOVE",
    note: "Outside the Department Store — toughest rival team.",
  },
];

const RIVAL_BY_STEP = Object.fromEntries(RIVAL_BATTLES.map((r) => [r.walkthroughStepId, r])) as Record<
  string,
  RivalBattleData
>;

export function getRivalForWalkthroughStep(stepId: string): RivalBattleData | undefined {
  return RIVAL_BY_STEP[stepId];
}

/** Rival trainer id when the player chose `starter` (Brendan fights May, May fights Brendan). */
export function rivalTrainerId(
  gender: PlayerGender,
  locationKey: string,
  starter: PlayerStarter,
): string {
  const rival = gender === "brendan" ? "MAY" : "BRENDAN";
  return `TRAINER_${rival}_${locationKey}_${starter}`;
}

function withRivalSprite(point: TrainerPoint, trainerId: string): TrainerPoint {
  const sprite = GYM_TRAINER_SPRITES[trainerId];
  if (!sprite) return point;
  return {
    ...point,
    graphicsId: sprite.graphicsId,
    spriteSheet: sprite.spriteSheet,
    spriteWidth: sprite.spriteWidth,
    spriteHeight: sprite.spriteHeight,
    spriteFrame: sprite.spriteFrame,
  };
}

export function rivalTrainerPoint(
  rival: RivalBattleData,
  gender: PlayerGender,
  starter: PlayerStarter,
): TrainerPoint {
  const trainerId = rivalTrainerId(gender, rival.locationKey, starter);
  const rivalName = gender === "brendan" ? "May" : "Brendan";
  return withRivalSprite(
    {
      id: `rival-${rival.walkthroughStepId}`,
      name: rivalName,
      category: "trainer",
      x: 0,
      y: 0,
      trainerClass: "Rival",
      trainerName: rivalName,
      trainerId,
      graphicsId: "",
      spriteSheet: "",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: `Rival Battle #${rival.battleNumber}`,
      desc: rival.note,
    },
    trainerId,
  );
}
