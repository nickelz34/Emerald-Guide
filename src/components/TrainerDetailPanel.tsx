import { assetUrl } from "../lib/assetUrl";
import { getTrainerBattle } from "../data/trainerParties";
import type { TrainerPoint } from "../data/mapTrainersGenerated";
import { getTrainerBattleTips } from "../lib/trainerBattleTips";
import { emeraldSpriteUrl, TYPE_COLORS } from "../data/species";

interface TrainerDetailPanelProps {
  trainer: TrainerPoint;
  /** Tighter layout for map pin popups. */
  compact?: boolean;
  className?: string;
}

export function TrainerDetailPanel({ trainer, compact = false, className = "" }: TrainerDetailPanelProps) {
  const battle = getTrainerBattle(trainer.trainerId);
  const tips = getTrainerBattleTips(trainer, battle);

  return (
    <div className={`trainer-detail ${compact ? "trainer-detail--compact" : ""} ${className}`.trim()}>
      <div className="trainer-detail__header">
        <span
          className="trainer-detail__sprite"
          style={{
            ["--trainer-frame" as string]: trainer.spriteFrame,
            ["--trainer-fw" as string]: trainer.spriteWidth,
            ["--trainer-fh" as string]: trainer.spriteHeight,
          }}
        >
          <img src={assetUrl(trainer.spriteSheet)} alt="" draggable={false} />
        </span>
        <div className="trainer-detail__identity">
          <p className="trainer-detail__class">{trainer.trainerClass}</p>
          <h5 className="trainer-detail__name">{trainer.trainerName}</h5>
          {trainer.note && <p className="trainer-detail__location">{trainer.note}</p>}
        </div>
      </div>

      {battle ? (
        <>
          <div className="trainer-detail__meta">
            {battle.doubleBattle && <span className="trainer-detail__badge">Double battle</span>}
            {trainer.sightRange ? (
              <span className="trainer-detail__badge">Sight {trainer.sightRange}t</span>
            ) : null}
            {battle.items.length > 0 && (
              <span className="trainer-detail__badge">Uses items</span>
            )}
          </div>

          <div className="trainer-detail__party">
            <h6>Party</h6>
            <ul className="trainer-detail__party-list">
              {battle.party.map((mon, i) => {
                const sprite = emeraldSpriteUrl(mon.speciesId);
                return (
                  <li key={`${mon.species}-${i}`} className="trainer-detail__mon">
                    {sprite ? (
                      <img className="trainer-detail__mon-sprite" src={sprite} alt="" loading="lazy" />
                    ) : (
                      <span className="trainer-detail__mon-sprite trainer-detail__mon-sprite--empty" />
                    )}
                    <div className="trainer-detail__mon-body">
                      <div className="trainer-detail__mon-top">
                        <strong>{mon.species}</strong>
                        <span className="trainer-detail__level">Lv. {mon.level}</span>
                      </div>
                      <div className="trainer-detail__types">
                        {mon.types.map((t) => (
                          <span
                            key={t}
                            className="trainer-detail__type"
                            style={{ background: TYPE_COLORS[t] ?? "#666" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {mon.heldItem && (
                        <p className="trainer-detail__held">Held: {mon.heldItem}</p>
                      )}
                      {mon.moves && mon.moves.length > 0 && (
                        <p className="trainer-detail__moves">{mon.moves.join(" · ")}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <p className="trainer-detail__empty">
          {trainer.script === "BattlePyramid_TrainerBattle"
            ? "Random rental team in the Battle Pyramid."
            : "No party data linked to this map trainer."}
        </p>
      )}

      {tips.length > 0 && (
        <div className="trainer-detail__tips">
          <h6>Battle tips</h6>
          <ul>
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
