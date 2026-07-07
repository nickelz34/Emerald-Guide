import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getStepById } from "../data";
import {
  getGymForMapPoint,
  gymJuniorTrainerPoint,
  gymLeaderTrainerPoint,
  type GymJunior,
} from "../data/gymData";
import { getTrainerBattle } from "../data/trainerParties";
import type { MapPoint } from "../data/mapPoints";
import { TYPE_COLORS } from "../data/species";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { TrainerModalBody, TrainerDetailModal } from "./TrainerDetailPanel";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

interface GymDetailModalProps {
  gymPoint: MapPoint | null;
  onClose: () => void;
  onJumpToGuide: (point: MapPoint) => void;
}

function partyPreview(trainerId: string): string | undefined {
  const battle = getTrainerBattle(trainerId);
  if (!battle) return undefined;
  return battle.party.map((m) => `${m.species} Lv.${m.level}`).join(" · ");
}

function JuniorTrainerRow({
  junior,
  onSelect,
}: {
  junior: GymJunior;
  onSelect: () => void;
}) {
  const preview = partyPreview(junior.trainerId);
  return (
    <li className="gym-modal__junior">
      <button type="button" className="gym-modal__junior-btn" onClick={onSelect}>
        <span className="gym-modal__junior-name">
          {junior.trainerClass} {junior.name}
        </span>
        {junior.note && <span className="gym-modal__junior-note">{junior.note}</span>}
        {preview && <span className="gym-modal__junior-party">{preview}</span>}
      </button>
    </li>
  );
}

export function GymDetailModal({ gymPoint, onClose, onJumpToGuide }: GymDetailModalProps) {
  const gym = gymPoint ? getGymForMapPoint(gymPoint.id) : undefined;
  const step = gym ? getStepById(gym.walkthroughStepId) : undefined;
  const [nestedTrainer, setNestedTrainer] = useState<TrainerPoint | null>(null);

  useEffect(() => {
    if (!gymPoint) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (nestedTrainer) setNestedTrainer(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [gymPoint, nestedTrainer, onClose]);

  useEffect(() => {
    if (!gymPoint) setNestedTrainer(null);
  }, [gymPoint]);

  if (!gymPoint || !gym) return null;

  const leaderPoint = gymLeaderTrainerPoint(gym);

  return createPortal(
    <>
      <ModalBackdrop className="gym-modal" onClose={onClose} aria-labelledby="gym-modal-title">
        <div className="gym-modal__panel" onClick={(e) => e.stopPropagation()}>
          <div className="gym-modal__head">
            <div>
              <h3 id="gym-modal-title">{gym.gymName}</h3>
              <p className="gym-modal__subtitle">
                Gym {gym.gymNumber} · {gym.city}
              </p>
            </div>
            <ModalCloseButton className="gym-modal__close" onClose={onClose} />
          </div>

          <div className="gym-modal__body">
            <section className="gym-modal__hero" aria-label="Gym overview">
              <div className="gym-modal__hero-main">
                <span className="gym-modal__badge-label">Gym Leader</span>
                <h4 className="gym-modal__leader">{gym.leaderName}</h4>
                <div className="gym-modal__chips">
                  <span className="type-chip" style={{ background: TYPE_COLORS[gym.specialty] ?? "#666" }}>
                    {gym.specialty}
                  </span>
                  <span className="gym-modal__badge-chip">{gym.badgeName}</span>
                  {gym.doubleBattle && <span className="gym-modal__badge-chip">Double battle</span>}
                </div>
              </div>
              {step && (
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
                <h5 className="gym-modal__section-title">
                  Trainers inside ({gym.juniors.length})
                </h5>
                <p className="gym-modal__section-desc">
                  Tap a trainer for full party details, moves, and battle tips.
                </p>
                <ul className="gym-modal__junior-list">
                  {gym.juniors.map((junior) => (
                    <JuniorTrainerRow
                      key={junior.trainerId}
                      junior={junior}
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
          </div>

          <div className="gym-modal__foot">
            {gymPoint.stepId && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onJumpToGuide({ ...gymPoint, stepId: gym.walkthroughStepId })}
              >
                Open walkthrough step
              </button>
            )}
          </div>
        </div>
      </ModalBackdrop>

      <TrainerDetailModal trainer={nestedTrainer} onClose={() => setNestedTrainer(null)} />
    </>,
    document.body,
  );
}
