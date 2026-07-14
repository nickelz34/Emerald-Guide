/** League milestone icons for the walkthrough progress rail (Gen 3 style). */
export interface LeagueMilestoneSprite {
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
  spriteFrame: number;
}

export const LEAGUE_MILESTONE_SHEET = "sprites/gym/league-milestones.png";
export const LEAGUE_MILESTONE_WIDTH = 16;
export const LEAGUE_MILESTONE_HEIGHT = 16;

/** Milestone kind → frame index on the league milestone sheet. */
export const LEAGUE_MILESTONE_FRAME_BY_KIND: Record<
  "elite-four" | "champion" | "hall-of-fame",
  number
> = {
  "elite-four": 0,
  champion: 1,
  "hall-of-fame": 2,
};

export function getLeagueMilestoneSprite(
  kind: "elite-four" | "champion" | "hall-of-fame",
): LeagueMilestoneSprite {
  return {
    spriteSheet: LEAGUE_MILESTONE_SHEET,
    spriteWidth: LEAGUE_MILESTONE_WIDTH,
    spriteHeight: LEAGUE_MILESTONE_HEIGHT,
    spriteFrame: LEAGUE_MILESTONE_FRAME_BY_KIND[kind],
  };
}
