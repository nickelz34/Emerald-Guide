import { useState } from "react";
import { getTrainerBattle } from "../data/trainerParties";
import {
  getStoryTrainerForWalkthroughStep,
  type StoryTrainerBattle,
} from "../data/storyTrainerBattles";
import { TrainerModalBody, TrainerDetailModal } from "./TrainerDetailPanel";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

interface StoryTrainerGuidePanelProps {
  battle: StoryTrainerBattle;
  className?: string;
}

/** Fixed story-trainer party preview (full sprite + Pokémon details). */
export function StoryTrainerGuidePanel({ battle, className = "" }: StoryTrainerGuidePanelProps) {
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);
  const trainerPoint = battle.trainer;
  const party = trainerPoint.trainerId ? getTrainerBattle(trainerPoint.trainerId) : undefined;

  return (
    <div className={`rival-guide gym-guide story-trainer-guide ${className}`.trim()}>
      <section className="gym-modal__section" aria-label={battle.title}>
        <h5 className="gym-modal__section-title">{battle.title}</h5>
        <p className="rival-guide__intro">{battle.intro}</p>
        {battle.note && <p className="rival-guide__note">{battle.note}</p>}

        {party ? (
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
          <p className="rival-guide__missing">
            No party data for {trainerPoint.trainerId ?? trainerPoint.name}.
          </p>
        )}
      </section>

      <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
    </div>
  );
}

export function StoryTrainerGuidePanelForStep({
  stepId,
  className,
  battle: battleOverride,
}: {
  stepId: string;
  className?: string;
  battle?: StoryTrainerBattle;
}) {
  const battle = battleOverride ?? getStoryTrainerForWalkthroughStep(stepId);
  if (!battle) return null;
  return <StoryTrainerGuidePanel battle={battle} className={className} />;
}
