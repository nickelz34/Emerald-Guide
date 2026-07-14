import { GYMS, type GymData } from "./gymData";

export type StoryMilestoneKind = "badge" | "elite-four" | "champion" | "hall-of-fame";

export interface StoryMilestone {
  id: string;
  kind: StoryMilestoneKind;
  /** Full name shown in the "next goal" line and tooltips. */
  label: string;
  /** Compact label for the marker (badges use sprites instead). */
  shortLabel: string;
  /** Walkthrough step where this milestone is reached. */
  stepId: string;
  /** Present for gym badge milestones. */
  gym?: GymData;
}

/**
 * Main-story badges and league checkpoints, in Emerald order.
 * Positions on the progress rail are derived from each step's index in the
 * currently visible walkthrough (so spacing matches real story distance).
 */
export const STORY_MILESTONES: StoryMilestone[] = [
  ...GYMS.map((gym) => ({
    id: gym.mapPointId,
    kind: "badge" as const,
    label: gym.badgeName,
    shortLabel: `${gym.gymNumber}`,
    stepId: gym.walkthroughStepId,
    gym,
  })),
  {
    id: "elite-four",
    kind: "elite-four",
    label: "Elite Four",
    shortLabel: "E4",
    stepId: "league-1",
  },
  {
    id: "champion",
    kind: "champion",
    label: "Champion",
    shortLabel: "C",
    stepId: "league-3",
  },
  {
    id: "hall-of-fame",
    kind: "hall-of-fame",
    label: "Hall of Fame",
    shortLabel: "HoF",
    // Same chapter as Wallace; treated as the finale once you reach that step.
    stepId: "league-3",
  },
];

export function milestoneTooltip(milestone: StoryMilestone): string {
  if (milestone.gym) {
    return `${milestone.gym.badgeName} — ${milestone.gym.leaderName} (${milestone.gym.city})`;
  }
  return milestone.label;
}
