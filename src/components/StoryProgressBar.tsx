import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { assetUrl } from "../lib/assetUrl";
import {
  GYM_BADGE_HEIGHT,
  GYM_BADGE_WIDTH,
  getGymBadgeSprite,
} from "../data/gymBadgesGenerated";
import {
  LEAGUE_MILESTONE_HEIGHT,
  LEAGUE_MILESTONE_WIDTH,
  getLeagueMilestoneSprite,
} from "../data/leagueMilestonesGenerated";
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
  /**
   * Story/postgame step ids the user has marked Complete.
   * Milestone badges earn from these ids — not from the currently viewed step.
   */
  completedStepIds?: readonly string[];
  onSelectStep?: (stepId: string) => void;
}

interface PlacedMilestone {
  milestone: StoryMilestone;
  stepIndex: number;
  earned: boolean;
  isNext: boolean;
}

function isMilestoneEarned(
  kind: StoryMilestone["kind"],
  stepId: string,
  stepIndex: number,
  completed: ReadonlySet<string>,
  stepIds: readonly string[],
): boolean {
  if (kind === "hall-of-fame") {
    // Champ and HoF share league-3; HoF waits until a later event is marked complete.
    for (let i = stepIndex + 1; i < stepIds.length; i++) {
      if (completed.has(stepIds[i])) return true;
    }
    return false;
  }
  return completed.has(stepId);
}

/** Step index threshold used when the fill / “next” cursor reaches this milestone. */
function milestoneReachIndex(kind: StoryMilestone["kind"], stepIndex: number): number {
  if (kind === "hall-of-fame") return stepIndex + 1;
  return stepIndex;
}

/**
 * Fill width for equal-spaced markers: interpolate between milestone slots
 * using walkthrough step distance so the bar still shows “how far to next”.
 */
function fillPercentForMilestones(
  placed: PlacedMilestone[],
  currentIndex: number,
): number {
  if (placed.length === 0) return 0;
  const last = placed.length - 1;
  const slot = (i: number) => (placed.length === 1 ? 100 : (i / last) * 100);

  if (currentIndex < placed[0].stepIndex) {
    const start = -1;
    const end = placed[0].stepIndex;
    const t = end <= 0 ? 1 : Math.min(1, Math.max(0, (currentIndex - start) / (end - start)));
    return slot(0) * t;
  }

  for (let i = 0; i < placed.length; i++) {
    const reach = milestoneReachIndex(placed[i].milestone.kind, placed[i].stepIndex);
    if (currentIndex < reach) {
      const prevReach =
        i === 0 ? placed[0].stepIndex : milestoneReachIndex(placed[i - 1].milestone.kind, placed[i - 1].stepIndex);
      const span = Math.max(reach - prevReach, 1);
      const t = Math.min(1, Math.max(0, (currentIndex - prevReach) / span));
      const from = i === 0 ? 0 : slot(i - 1);
      const to = slot(i);
      return from + (to - from) * t;
    }
  }

  return 100;
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
  if (
    milestone.kind !== "elite-four" &&
    milestone.kind !== "champion" &&
    milestone.kind !== "hall-of-fame"
  ) {
    return null;
  }

  const sprite = getLeagueMilestoneSprite(milestone.kind);
  return (
    <span
      className={[
        "story-progress__badge",
        "story-progress__badge--league",
        `story-progress__badge--${milestone.kind}`,
        earned ? "is-earned" : "is-locked",
        isNext ? "is-next" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ["--badge-frame"]: sprite.spriteFrame,
          ["--badge-fw"]: sprite.spriteWidth,
          ["--badge-fh"]: sprite.spriteHeight,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className="story-progress__badge-frame">
        <img
          src={assetUrl(sprite.spriteSheet)}
          alt=""
          className="story-progress__badge-sprite"
          width={LEAGUE_MILESTONE_WIDTH * 3}
          height={LEAGUE_MILESTONE_HEIGHT}
          draggable={false}
        />
      </span>
    </span>
  );
}

/**
 * Storyline progress rail: gym badges plus Elite Four → Champion → Hall of Fame.
 * Markers are equally spaced so icons never overlap; fill still tracks story distance.
 */
export function StoryProgressBar({
  stepIds,
  currentIndex,
  completedStepIds = [],
  onSelectStep,
}: StoryProgressBarProps) {
  const completed = useMemo(() => new Set(completedStepIds), [completedStepIds]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const placed = useMemo<PlacedMilestone[]>(() => {
    if (stepIds.length === 0) return [];

    const indexById = new Map(stepIds.map((id, index) => [id, index]));
    const raw: PlacedMilestone[] = [];

    for (const milestone of STORY_MILESTONES) {
      const stepIndex = indexById.get(milestone.stepId);
      if (stepIndex == null) continue;
      raw.push({
        milestone,
        stepIndex,
        earned: false,
        isNext: false,
      });
    }

    // Keep story order; Champ before HoF even though they share a step id.
    const kindOrder: Record<StoryMilestone["kind"], number> = {
      badge: 0,
      "elite-four": 1,
      champion: 2,
      "hall-of-fame": 3,
    };
    raw.sort(
      (a, b) =>
        a.stepIndex - b.stepIndex ||
        kindOrder[a.milestone.kind] - kindOrder[b.milestone.kind],
    );

    let nextAssigned = false;
    for (const entry of raw) {
      entry.earned = isMilestoneEarned(
        entry.milestone.kind,
        entry.milestone.stepId,
        entry.stepIndex,
        completed,
        stepIds,
      );
      if (!entry.earned && !nextAssigned) {
        entry.isNext = true;
        nextAssigned = true;
      }
    }

    return raw;
  }, [stepIds, completed]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const next = scroller.querySelector<HTMLElement>(".story-progress__marker.is-next");
    const target =
      next ?? scroller.querySelectorAll<HTMLElement>(".story-progress__marker.is-earned");
    const focus =
      next ??
      (target instanceof NodeList ? target[target.length - 1] : null);
    if (!focus) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const focusRect = focus.getBoundingClientRect();
    const delta =
      focusRect.left +
      focusRect.width / 2 -
      (scrollerRect.left + scrollerRect.width / 2);
    scroller.scrollBy({ left: delta, behavior: "smooth" });
  }, [placed, currentIndex]);

  const fillPercent = useMemo(
    () => fillPercentForMilestones(placed, currentIndex),
    [placed, currentIndex],
  );

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
        <div className="story-progress__scroller">
          <div className="story-progress__rail">
            <div className="story-progress__track">
              <div
                className="story-progress__fill"
                style={{ width: `${((currentIndex + 1) / Math.max(stepIds.length, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-progress">
      <div className="story-progress__scroller" ref={scrollerRef}>
          <div
            className="story-progress__rail"
            style={{ ["--story-marker-count"]: placed.length } as CSSProperties}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={stepIds.length}
            aria-valuenow={currentIndex + 1}
            aria-label="Walkthrough story progress"
          >
          <div className="story-progress__track" aria-hidden="true">
            <div className="story-progress__fill" style={{ width: `${fillPercent}%` }} />
          </div>

          <ol className="story-progress__markers">
            {placed.map((entry, index) => {
              const { milestone, earned, isNext } = entry;
              const number = index + 1;
              const title = milestoneTooltip(milestone);
              const label = earned
                ? `${number}. ${title} (reached)`
                : isNext
                  ? `${number}. ${title} (next)`
                  : `${number}. ${title}`;

              const icon =
                milestone.kind === "badge" && milestone.gym ? (
                  <GymBadgeMarker
                    mapPointId={milestone.gym.mapPointId}
                    earned={earned}
                    isNext={isNext}
                  />
                ) : (
                  <LeagueMarker milestone={milestone} earned={earned} isNext={isNext} />
                );

              const numberEl = (
                <span className="story-progress__num" aria-hidden="true">
                  {number}
                </span>
              );

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
                      {numberEl}
                      {icon}
                    </button>
                  ) : (
                    <span className="story-progress__hit" title={label} aria-label={label}>
                      {numberEl}
                      {icon}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {statusText ? (
        <p className="story-progress__status" aria-live="polite">
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
