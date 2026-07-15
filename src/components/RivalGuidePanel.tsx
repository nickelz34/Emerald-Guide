import { useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import { getTrainerBattle } from "../data/trainerParties";
import {
  getRivalForWalkthroughStep,
  rivalNameForPlayer,
  rivalTrainerPoint,
  rivalWalkingSprite,
  type PlayerGender,
  type PlayerStarter,
  type RivalBattleData,
} from "../data/rivalData";
import { TrainerModalBody, TrainerDetailModal } from "./TrainerDetailPanel";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

const STARTERS: { id: PlayerStarter; label: string }[] = [
  { id: "MUDKIP", label: "Mudkip" },
  { id: "TORCHIC", label: "Torchic" },
  { id: "TREECKO", label: "Treecko" },
];

const GENDER_OPTIONS: { id: PlayerGender; label: string }[] = [
  { id: "brendan", label: "Brendan (rival May)" },
  { id: "may", label: "May (rival Brendan)" },
];

interface RivalGuidePanelProps {
  rival: RivalBattleData;
  className?: string;
}

function RivalOwSprite({
  gender,
  label,
}: {
  gender: PlayerGender;
  label: string;
}) {
  const sprite = rivalWalkingSprite(gender);
  return (
    <div
      className="rival-guide__ow-sprite"
      style={{
        ["--trainer-frame" as string]: sprite.spriteFrame,
        ["--trainer-fw" as string]: sprite.spriteWidth,
        ["--trainer-fh" as string]: sprite.spriteHeight,
      }}
      aria-hidden="true"
      title={label}
    >
      <img src={assetUrl(sprite.spriteSheet)} alt="" draggable={false} />
    </div>
  );
}

/** Rival battle party preview — pick your starter to see May/Brendan's team from pokeemerald data. */
export function RivalGuidePanel({ rival, className = "" }: RivalGuidePanelProps) {
  const [gender, setGender] = useState<PlayerGender>("brendan");
  const [starter, setStarter] = useState<PlayerStarter>("MUDKIP");
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);

  const trainerPoint = rivalTrainerPoint(rival, gender, starter);
  const battle = getTrainerBattle(trainerPoint.trainerId);
  const rivalName = rivalNameForPlayer(gender);

  return (
    <div className={`rival-guide gym-guide ${className}`.trim()}>
      <section className="gym-modal__section" aria-label={`Rival Battle #${rival.battleNumber}`}>
        <h5 className="gym-modal__section-title">
          Rival Battle #{rival.battleNumber} — {rivalName}
        </h5>
        <p className="rival-guide__intro">
          Teams depend on which starter you chose at Route 101. Pick your character and starter below
          for accurate levels and species from the game data.
        </p>

        <div className="rival-guide__controls">
          <div className="rival-guide__field rival-guide__field--character">
            <label htmlFor={`rival-gender-${rival.walkthroughStepId}`}>
              <span>You play as</span>
            </label>
            <select
              id={`rival-gender-${rival.walkthroughStepId}`}
              value={gender}
              onChange={(e) => setGender(e.target.value as PlayerGender)}
              aria-label="Player character"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="rival-guide__character-preview" aria-live="polite">
              <RivalOwSprite gender={gender} label={rivalName} />
              <div className="rival-guide__character-meta">
                <span className="rival-guide__character-label">Your rival</span>
                <strong className="rival-guide__character-name">{rivalName}</strong>
              </div>
            </div>
          </div>
          <label className="rival-guide__field">
            <span>Your starter</span>
            <select
              value={starter}
              onChange={(e) => setStarter(e.target.value as PlayerStarter)}
              aria-label="Your starter Pokémon"
            >
              {STARTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {rival.note && <p className="rival-guide__note">{rival.note}</p>}

        {battle ? (
          <div className="rival-guide__party">
            <TrainerModalBody trainer={trainerPoint} />
            <button
              type="button"
              className="btn btn--ghost rival-guide__detail-btn"
              onClick={() => setModalTrainer(trainerPoint)}
            >
              Full battle details
            </button>
          </div>
        ) : (
          <p className="rival-guide__missing">No party data for {trainerPoint.trainerId}.</p>
        )}
      </section>

      <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
    </div>
  );
}

export function RivalGuidePanelForStep({
  stepId,
  className,
}: {
  stepId: string;
  className?: string;
}) {
  const rival = getRivalForWalkthroughStep(stepId);
  if (!rival) return null;
  return <RivalGuidePanel rival={rival} className={className} />;
}
