import { useState } from "react";
import { getStepById } from "../data";
import {
  getGymLeaderExtraSprites,
  gymJuniorTrainerPoint,
  gymLeaderTrainerPoint,
  type GymData,
  type GymJunior,
} from "../data/gymData";
import { getTrainerBattle } from "../data/trainerParties";
import type { GymTrainerSprite } from "../data/gymSpritesGenerated";
import { TYPE_COLORS } from "../data/species";
import { assetUrl } from "../lib/assetUrl";
import { owPortraitCssVars } from "../lib/owPortrait";
import { TrainerModalBody, TrainerDetailModal } from "./TrainerDetailPanel";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

function partyPreview(trainerId: string): string | undefined {
  const battle = getTrainerBattle(trainerId);
  if (!battle) return undefined;
  return battle.party.map((m) => `${m.species} Lv.${m.level}`).join(" · ");
}

export function GymTrainerSprite({
  sprite,
  className = "gym-modal__sprite",
  scale = 1,
}: {
  sprite: Pick<GymTrainerSprite, "spriteSheet" | "spriteWidth" | "spriteHeight" | "spriteFrame">;
  className?: string;
  scale?: number;
}) {
  if (!sprite.spriteSheet) return null;
  // Guide portraits always face forward; gym map pins keep world facing separately.
  return (
    <div
      className={className}
      style={owPortraitCssVars(sprite, scale)}
      aria-hidden
    >
      <img src={assetUrl(sprite.spriteSheet)} alt="" draggable={false} />
    </div>
  );
}

function JuniorTrainerRow({
  junior,
  gym,
  onSelect,
}: {
  junior: GymJunior;
  gym: GymData;
  onSelect: () => void;
}) {
  const preview = partyPreview(junior.trainerId);
  const trainerPoint = gymJuniorTrainerPoint(gym, junior);
  return (
    <li className="gym-modal__junior">
      <button type="button" className="gym-modal__junior-btn" onClick={onSelect}>
        {trainerPoint.spriteSheet ? (
          <GymTrainerSprite sprite={trainerPoint} className="gym-modal__junior-sprite" scale={2} />
        ) : null}
        <span className="gym-modal__junior-text">
          <span className="gym-modal__junior-name">
            {junior.trainerClass} {junior.name}
          </span>
          {junior.note && <span className="gym-modal__junior-note">{junior.note}</span>}
          {preview && <span className="gym-modal__junior-party">{preview}</span>}
        </span>
      </button>
    </li>
  );
}

interface GymGuidePanelProps {
  gym: GymData;
  /** When false, omits walkthrough story (already shown on the step card). */
  showWalkthroughText?: boolean;
  className?: string;
}

/** Shared gym leader / junior trainer guide content for map modal and walkthrough steps. */
export function GymGuidePanel({
  gym,
  showWalkthroughText = true,
  className = "",
}: GymGuidePanelProps) {
  const step = getStepById(gym.walkthroughStepId);
  const [nestedTrainer, setNestedTrainer] = useState<TrainerPoint | null>(null);
  const leaderPoint = gymLeaderTrainerPoint(gym);
  const leaderExtras = getGymLeaderExtraSprites(gym);

  return (
    <div className={`gym-guide ${className}`.trim()}>
      <section className="gym-modal__hero" aria-label="Gym overview">
        <div className="gym-modal__hero-main">
          {(leaderPoint.spriteSheet || leaderExtras.length > 0) && (
            <div className="gym-modal__leader-sprites">
              {leaderPoint.spriteSheet ? (
                <GymTrainerSprite sprite={leaderPoint} className="gym-modal__leader-sprite" scale={3} />
              ) : null}
              {leaderExtras.map((sprite) => (
                <GymTrainerSprite
                  key={sprite.graphicsId}
                  sprite={sprite}
                  className="gym-modal__leader-sprite"
                  scale={3}
                />
              ))}
            </div>
          )}
          <span className="gym-modal__badge-label">Gym {gym.gymNumber}</span>
          <h4 className="gym-modal__leader">{gym.leaderName}</h4>
          <p className="gym-guide__meta">
            {gym.gymName} · {gym.city}
          </p>
          <div className="gym-modal__chips">
            <span className="type-chip" style={{ background: TYPE_COLORS[gym.specialty] ?? "#666" }}>
              {gym.specialty}
            </span>
            <span className="gym-modal__badge-chip">{gym.badgeName}</span>
            {gym.doubleBattle && <span className="gym-modal__badge-chip">Double battle</span>}
          </div>
        </div>
        {showWalkthroughText && step && (
          <div className="gym-modal__walkthrough">
            <h5>{step.title}</h5>
            {step.summary && <p>{step.summary}</p>}
            {step.story?.[0] && <p className="gym-modal__story">{step.story[0]}</p>}
            {step.details.length > 0 && (
              <ul className="gym-modal__details">
                {step.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {step.tips && step.tips.length > 0 && (
              <p className="gym-modal__tips">
                <strong>Tip:</strong> {step.tips[0]}
              </p>
            )}
          </div>
        )}
      </section>

      {gym.puzzleNote && (
        <section className="gym-modal__section">
          <h5 className="gym-modal__section-title">Gym puzzle</h5>
          <p>{gym.puzzleNote}</p>
        </section>
      )}

      {gym.juniors.length > 0 && (
        <section className="gym-modal__section" aria-label="Gym trainers">
          <h5 className="gym-modal__section-title">Trainers inside ({gym.juniors.length})</h5>
          <p className="gym-modal__section-desc">
            Tap a trainer for full party details, moves, and battle tips. Tap sprites on the map above
            for the same info.
          </p>
          <ul className="gym-modal__junior-list">
            {gym.juniors.map((junior) => (
              <JuniorTrainerRow
                key={junior.trainerId}
                junior={junior}
                gym={gym}
                onSelect={() => setNestedTrainer(gymJuniorTrainerPoint(gym, junior))}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="gym-modal__section" aria-label="Gym Leader battle">
        <h5 className="gym-modal__section-title">Gym Leader — {gym.leaderName}</h5>
        <TrainerModalBody trainer={leaderPoint} />
      </section>

      <TrainerDetailModal trainer={nestedTrainer} onClose={() => setNestedTrainer(null)} />
    </div>
  );
}
