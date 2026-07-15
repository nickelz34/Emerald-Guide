import type { TrainerPoint } from "./mapTrainersGenerated";

/**
 * Fixed story trainers shown as on-page battle guides (like rival panels),
 * keyed by walkthrough step id.
 */
export interface StoryTrainerBattle {
  walkthroughStepId: string;
  title: string;
  intro: string;
  note?: string;
  trainer: TrainerPoint;
}

export const STORY_TRAINER_BATTLES: StoryTrainerBattle[] = [
  {
    walkthroughStepId: "petalburg-woods-2",
    title: "Team Aqua Grunt — Petalburg Woods",
    intro:
      "Your first Team Aqua fight. Study the Grunt’s party below before you step in — Dark-type Poochyena hits hard for this early in the game if you aren’t ready.",
    note: "Scripted story battle (no sight range). After you win, the Grunt flees and the Devon researcher gives you a Great Ball.",
    trainer: {
      id: "story-pw-aqua-grunt",
      name: "Team Aqua Grunt",
      category: "trainer",
      x: 0,
      y: 0,
      trainerClass: "Team Aqua",
      trainerName: "Grunt",
      trainerId: "TRAINER_GRUNT_PETALBURG_WOODS",
      graphicsId: "OBJ_EVENT_GFX_AQUA_MEMBER_M",
      spriteSheet: "sprites/trainers/team_aqua_aqua_member_m.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: "Petalburg Woods",
      desc: "First Team Aqua encounter — corners a Devon researcher for the Devon Goods.",
      script: "PetalburgWoods_EventScript_DevonResearcherLeft",
      trainerType: "TRAINER_TYPE_NONE",
    },
  },
];

const BY_STEP = Object.fromEntries(
  STORY_TRAINER_BATTLES.map((b) => [b.walkthroughStepId, b]),
) as Record<string, StoryTrainerBattle>;

export function getStoryTrainerForWalkthroughStep(
  stepId: string,
): StoryTrainerBattle | undefined {
  return BY_STEP[stepId];
}
