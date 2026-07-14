import { useMemo, type CSSProperties } from "react";
import { assetUrl } from "../lib/assetUrl";
import {
  GYM_BADGE_HEIGHT,
  GYM_BADGE_WIDTH,
  getGymBadgeSprite,
} from "../data/gymBadgesGenerated";
import {
  STORY_MILESTONES,
  milestoneTooltip,
  type StoryMilestone,
} from "../data/storyMilestones";

interface StoryProgressBarProps {
  /** Ordered walkthrough step ids currently visible in the guide. */
  stepIds: string[];
  /** Index of the active step within `stepIds`. */
  currentIndex: number;
  onSelectStep?: (stepId: string) => void;
}

interface PlacedMilestone {
  milestone: StoryMilestone;
  stepIndex: number;
  /** 0–100 position along the track. */
  position: number;
  earned: boolean;
  isNext: boolean;
}

function isMilestoneEarned(kind: StoryMilestone["kind"], currentIndex: number, stepIndex: number): boolean {
  // Champion and Hall of Fame share league-3: Champ lights on arrival, HoF after you leave.
  if (kind === "champion") return currentIndex >= stepIndex;
  if (kind === "hall-of-fame") return currentIndex > stepIndex;
  // Gym badges / Elite Four: earned once you've moved past that step.
  return currentIndex > stepIndex;
}

function GymBadgeMarker({
  mapPointId,
  earned,
  isNext,
}: {
  mapPointId: string;
  earned: boolean;
  isNext: boolean;
}) {
  const badge = getGymBadgeSprite(mapPointId);
  if (!badge) return null;
  return (
    <span
      className={[
        "story-progress__badge",
        earned ? "is-earned" : "is-locked",
        isNext ? "is-next" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ["--badge-frame"]: badge.spriteFrame,
          ["--badge-fw"]: badge.spriteWidth,
          ["--badge-fh"]: badge.spriteHeight,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className="story-progress__badge-frame">
        <img
          src={assetUrl(badge.spriteSheet)}
          alt=""
          className="story-progress__badge-sprite"
          width={GYM_BADGE_WIDTH * 8}
          height={GYM_BADGE_HEIGHT}
          draggable={false}
        />
      </span>
    </span>
  );
}

function LeagueMarker({
  milestone,
  earned,
  isNext,
}: {
  milestone: StoryMilestone;
  earned: boolean;
  isNext: boolean;
}) {
  return (
    <span
      className={[
        "story-progress__league",
        `story-progress__league--${milestone.kind}`,
        earned ? "is-earned" : "is-locked",
        isNext ? "is-next" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span className="story-progress__league-label">{milestone.shortLabel}</span>
    </span>
  );
}

/**
 * Storyline progress rail: gym badges plus Elite Four → Champion → Hall of Fame.
 * Marker spacing follows each milestone's position in the visible walkthrough.
 */
export function StoryProgressBar({
  stepIds,
  currentIndex,
  onSelectStep,
}: StoryProgressBarProps) {
  const placed = useMemo<PlacedMilestone[]>(() => {
    if (stepIds.length === 0) return [];

    const indexById = new Map(stepIds.map((id, index) => [id, index]));
    const total = stepIds.length;
    const raw: PlacedMilestone[] = [];

    for (const milestone of STORY_MILESTONES) {
      const stepIndex = indexById.get(milestone.stepId);
      if (stepIndex == null) continue;

      // Hall of Fame shares Wallace's step; nudge Champ left and HoF right so
      // the finale reads as two distinct checkpoints.
      let position = ((stepIndex + 1) / total) * 100;
      if (milestone.kind === "hall-of-fame") {
        position = Math.min(100, position + (100 / total) * 0.35);
      } else if (milestone.kind === "champion") {
        position = Math.max(0, position - (100 / total) * 0.15);
      }

      raw.push({
        milestone,
        stepIndex,
        position,
        earned: false,
        isNext: false,
      });
    }

    raw.sort((a, b) => a.position - b.position || a.stepIndex - b.stepIndex);

    let nextAssigned = false;
    for (const entry of raw) {
      entry.earned = isMilestoneEarned(entry.milestone.kind, currentIndex, entry.stepIndex);
      if (!entry.earned && !nextAssigned) {
        entry.isNext = true;
        nextAssigned = true;
      }
    }

    return raw;
  }, [stepIds, currentIndex]);

  const fillPercent = useMemo(() => {
    if (stepIds.length === 0) return 0;
    return ((currentIndex + 1) / stepIds.length) * 100;
  }, [currentIndex, stepIds.length]);

  const nextGoal = placed.find((p) => p.isNext);
  const allDone = placed.length > 0 && placed.every((p) => p.earned);

  const statusText = allDone
    ? "Hall of Fame reached — main story complete"
    : nextGoal
      ? nextGoal.milestone.gym
        ? `Next badge: ${nextGoal.milestone.gym.badgeName} · ${nextGoal.milestone.gym.leaderName}`
        : `Next: ${nextGoal.milestone.label}`
      : null;

  if (placed.length === 0) {
    return (
      <div className="story-progress story-progress--plain" aria-hidden="true">
        <div className="story-progress__track">
          <div className="story-progress__fill" style={{ width: `${fillPercent}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="story-progress">
      <div
        className="story-progress__rail"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={stepIds.length}
        aria-valuenow={currentIndex + 1}
        aria-label="Walkthrough story progress"
      >
        <div className="story-progress__track">
          <div className="story-progress__fill" style={{ width: `${fillPercent}%` }} />
        </div>

        <ol className="story-progress__markers">
          {placed.map((entry) => {
            const { milestone, position, earned, isNext } = entry;
            const title = milestoneTooltip(milestone);
            const label = earned
              ? `${title} (reached)`
              : isNext
                ? `${title} (next)`
                : title;

            return (
              <li
                key={milestone.id}
                className={[
                  "story-progress__marker",
                  earned ? "is-earned" : "is-locked",
                  isNext ? "is-next" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ left: `${position}%` }}
              >
                {onSelectStep ? (
                  <button
                    type="button"
                    className="story-progress__hit"
                    title={label}
                    aria-label={label}
                    aria-current={isNext ? "step" : undefined}
                    onClick={() => onSelectStep(milestone.stepId)}
                  >
                    {milestone.kind === "badge" && milestone.gym ? (
                      <GymBadgeMarker
                        mapPointId={milestone.gym.mapPointId}
                        earned={earned}
                        isNext={isNext}
                      />
                    ) : (
                      <LeagueMarker milestone={milestone} earned={earned} isNext={isNext} />
                    )}
                  </button>
                ) : (
                  <span className="story-progress__hit" title={label} aria-label={label}>
                    {milestone.kind === "badge" && milestone.gym ? (
                      <GymBadgeMarker
                        mapPointId={milestone.gym.mapPointId}
                        earned={earned}
                        isNext={isNext}
                      />
                    ) : (
                      <LeagueMarker milestone={milestone} earned={earned} isNext={isNext} />
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {statusText ? (
        <p className="story-progress__status" aria-live="polite">
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
