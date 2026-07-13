import { useState } from "react";
import { getTrainerBattle } from "../data/trainerParties";
import {
  getRivalForWalkthroughStep,
  rivalTrainerPoint,
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

interface RivalGuidePanelProps {
  rival: RivalBattleData;
  className?: string;
}

/** Rival battle party preview — pick your starter to see May/Brendan's team from pokeemerald data. */
export function RivalGuidePanel({ rival, className = "" }: RivalGuidePanelProps) {
  const [gender, setGender] = useState<PlayerGender>("brendan");
  const [starter, setStarter] = useState<PlayerStarter>("MUDKIP");
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);

  const trainerId = rivalTrainerPoint(rival, gender, starter).trainerId;
  const battle = getTrainerBattle(trainerId);
  const trainerPoint = rivalTrainerPoint(rival, gender, starter);
  const rivalName = gender === "brendan" ? "May" : "Brendan";

  return (
    <div className={`rival-guide gym-guide ${className}`.trim()}>
      <section className="gym-modal__section" aria-label={`Rival Battle #${rival.battleNumber}`}>
        <h5 className="gym-modal__section-title">Rival Battle #{rival.battleNumber} — {rivalName}</h5>
        <p className="rival-guide__intro">
          Teams depend on which starter you chose at Route 101. Pick your character and starter below
          for accurate levels and species from the game data.
        </p>

        <div className="rival-guide__controls">
          <label className="rival-guide__field">
            <span>You play as</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as PlayerGender)}
              aria-label="Player character"
            >
              <option value="brendan">Brendan (rival May)</option>
              <option value="may">May (rival Brendan)</option>
            </select>
          </label>
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
          <p className="rival-guide__missing">No party data for {trainerId}.</p>
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
