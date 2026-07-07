import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { assetUrl } from "../lib/assetUrl";
import { getTrainerBattle, type TrainerBattleData, type TrainerPartyMon } from "../data/trainerParties";
import { TRAINER_BATTLES } from "../data/trainerPartiesGenerated";
import type { TrainerPoint } from "../data/mapTrainersGenerated";
import { getTrainerBattleTips } from "../lib/trainerBattleTips";
import { resistTypes, teamWeaknesses } from "../lib/typeChart";
import { emeraldSpriteUrl, loadSpeciesInfo, TYPE_COLORS, type SpeciesInfo } from "../data/species";
const FACING_LABELS = ["south", "north", "west", "east"] as const;

function formatMapId(mapId?: string): string | null {
  if (!mapId) return null;
  const raw = mapId.replace(/^MAP_/, "").replace(/_/g, " ").toLowerCase();
  const route = raw.match(/^route (\d+)$/);
  if (route) return `Route ${route[1]}`;
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatEncounterType(trainer: TrainerPoint): string {
  switch (trainer.trainerType) {
    case "TRAINER_TYPE_BURIED":
      return "Hidden — tree or rock disguise";
    case "TRAINER_TYPE_TRAINER":
      return "Spot battle — walks into you";
    case "TRAINER_TYPE_NORMAL":
    default:
      return trainer.sightRange
        ? `Line-of-sight — ${trainer.sightRange} tile${trainer.sightRange === 1 ? "" : "s"}`
        : "Line-of-sight trainer";
  }
}

function partyLevelRange(party: TrainerPartyMon[]): string {
  const levels = party.map((m) => m.level);
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  return min === max ? `Lv. ${min}` : `Lv. ${min}–${max}`;
}

function ivLabel(iv?: number): string | null {
  if (!iv) return null;
  if (iv >= 100) return "Max IVs (31 in all stats)";
  if (iv >= 30) return "High IVs — noticeably boosted";
  if (iv >= 10) return "Raised IVs — slightly stronger";
  return `IV spread ${iv}`;
}

function cleanTrainerItems(items: string[]): string[] {
  return items.filter((item) => item && !item.includes("?"));
}

function uniquePartyTypes(party: TrainerPartyMon[]): string[] {
  return [...new Set(party.flatMap((m) => m.types))];
}

/** Emerald R/S/E base prize per trainer class (× last party member's level). */
const CLASS_PRIZE_BASE: Record<string, number> = {
  Youngster: 16,
  "Bug Catcher": 16,
  Lass: 16,
  "School Kid": 16,
  Camper: 16,
  Picnicker: 16,
  Tuber: 4,
  "Ninja Boy": 8,
  "Sis And Bro": 16,
  Twins: 24,
  Sailor: 32,
  Fisherman: 32,
  Hiker: 32,
  "Black Belt": 24,
  "Battle Girl": 24,
  Guitarist: 24,
  Kindler: 32,
  "Aroma Lady": 32,
  Beauty: 56,
  Lady: 72,
  "Rich Boy": 64,
  Gentleman: 72,
  Pokefan: 48,
  "Pokéfan": 48,
  "Pokemon Breeder": 48,
  "Pokémon Breeder": 48,
  Psychic: 24,
  "Hex Maniac": 48,
  "Ruin Maniac": 48,
  Collector: 48,
  Pokemaniac: 48,
  "Pokémaniac": 48,
  "Bird Keeper": 32,
  Expert: 24,
  Cooltrainer: 60,
  Triathlete: 32,
  "Swimmer M": 16,
  "Swimmer F": 16,
  "Dragon Tamer": 32,
  "Parasol Lady": 16,
  Interviewer: 48,
  "Young Couple": 64,
  "Old Couple": 72,
  "Pokemon Ranger": 48,
  "Pokémon Ranger": 48,
  "Bug Maniac": 32,
  "Team Aqua": 20,
  "Team Magma": 20,
  "Aqua Admin": 40,
  "Magma Admin": 40,
  "Aqua Leader": 100,
  "Magma Leader": 100,
  Leader: 100,
  "Elite Four": 100,
  Champion: 200,
  "Cool Trainer": 60,
};

function prizeMoney(trainerClass: string, party: TrainerPartyMon[]): number | null {
  const base = CLASS_PRIZE_BASE[trainerClass];
  if (!base || party.length === 0) return null;
  const lastLevel = party[party.length - 1].level;
  return base * lastLevel;
}

function formatMoney(n: number): string {
  return `₽${n.toLocaleString()}`;
}

function trainerExpYield(baseExp: number, level: number): number {
  return Math.max(1, Math.floor((baseExp * level) / 7));
}

function partyFlagsLabel(flags?: string): string | null {
  switch (flags) {
    case "NO_ITEM_DEFAULT_MOVES":
      return "Default level-up movesets";
    case "NO_ITEM_CUSTOM_MOVES":
      return "Fixed move sets (from game data)";
    case "ITEM_DEFAULT_MOVES":
      return "May use items in battle · default moves";
    case "ITEM_CUSTOM_MOVES":
      return "Uses items in battle · fixed move sets";
    default:
      return flags ?? null;
  }
}

function speciesSlug(name: string): string {
  return name.toLowerCase().replace(/['.]/g, "").replace(/\s+/g, "-");
}

function findRematchVariants(trainerId?: string): { id: string; data: TrainerBattleData }[] {
  if (!trainerId) return [];
  const base = trainerId.replace(/_\d+$/, "");
  return Object.entries(TRAINER_BATTLES)
    .filter(([id]) => id === trainerId || (id.startsWith(`${base}_`) && /_\d+$/.test(id)))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, data]) => ({ id, data }));
}

function filterMoves(moves?: string[]): string[] {
  return (moves ?? []).filter((m) => m && m !== "-");
}
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

/** Pokémon card with async species lookup (abilities, base stats, EXP). */
function TrainerMonCard({ mon, index }: { mon: TrainerPartyMon; index: number }) {
  const [species, setSpecies] = useState<SpeciesInfo | null>(null);
  const sprite = emeraldSpriteUrl(mon.speciesId);
  const ivNote = ivLabel(mon.iv);
  const moves = filterMoves(mon.moves);

  useEffect(() => {
    let cancelled = false;
    loadSpeciesInfo(speciesSlug(mon.species))
      .then((info) => {
        if (!cancelled) setSpecies(info);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mon.species]);

  return (
    <li className="trainer-modal__mon-card">
      <div className="trainer-modal__mon-sprite-wrap">
        {sprite ? (
          <img className="trainer-modal__mon-sprite" src={sprite} alt="" loading="lazy" />
        ) : (
          <span className="trainer-modal__mon-sprite trainer-modal__mon-sprite--empty" />
        )}
      </div>
      <div className="trainer-modal__mon-info">
        <div className="trainer-modal__mon-head">
          <div>
            <strong>{mon.species}</strong>
            {mon.speciesId > 0 && <span className="trainer-modal__dex">#{mon.speciesId}</span>}
          </div>
          <span className="trainer-detail__level">Lv. {mon.level}</span>
        </div>
        {species?.genus && <p className="trainer-modal__mon-genus">{species.genus}</p>}
        <div className="trainer-modal__type-row">
          {mon.types.map((t) => (
            <span key={t} className="trainer-detail__type" style={{ background: TYPE_COLORS[t] ?? "#666" }}>
              {t}
            </span>
          ))}
        </div>
        {species && (
          <div className="trainer-modal__mon-abilities">
            <span className="trainer-modal__mon-label">Abilities</span>
            {species.abilities.join(", ")}
            {species.hiddenAbility ? ` (hidden: ${species.hiddenAbility})` : ""}
          </div>
        )}
        {species?.baseExp != null && (
          <p className="trainer-modal__mon-detail">
            <span className="trainer-modal__mon-label">EXP</span> ~
            {trainerExpYield(species.baseExp, mon.level)} per defeat (Gen III formula)
          </p>
        )}
        {mon.heldItem && !mon.heldItem.includes("?") && (
          <p className="trainer-modal__mon-detail">
            <span className="trainer-modal__mon-label">Held</span> {mon.heldItem}
          </p>
        )}
        {ivNote && (
          <p className="trainer-modal__mon-detail">
            <span className="trainer-modal__mon-label">IVs</span> {ivNote}
          </p>
        )}
        {species && species.stats.length > 0 && (
          <div className="trainer-modal__base-stats">
            <span className="trainer-modal__mon-label">Base stats</span>
            <ul className="trainer-modal__stat-bars">
              {species.stats.map((s) => (
                <li key={s.label}>
                  <span>{s.label}</span>
                  <span className="trainer-modal__stat-bar" style={{ width: `${Math.min(100, (s.value / 255) * 100)}%` }} />
                  <span className="trainer-modal__stat-val">{s.value}</span>
                </li>
              ))}
            </ul>
            <p className="trainer-modal__stat-total">BST {species.total}</p>
          </div>
        )}
        {moves.length > 0 ? (
          <div className="trainer-modal__moves">
            <span className="trainer-modal__mon-label">Moves</span>
            <ul className="trainer-modal__move-list">
              {moves.map((move) => (
                <li key={move}>{move}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="trainer-modal__mon-detail trainer-modal__mon-detail--muted">
            Level-up moveset (species default for Lv. {mon.level})
          </p>
        )}
        <p className="trainer-modal__mon-slot">Party slot {index + 1}</p>
      </div>
    </li>
  );
}

/** Rich trainer breakdown for the click-to-open modal. */
export function TrainerModalBody({ trainer }: { trainer: TrainerPoint }) {
  const battle = getTrainerBattle(trainer.trainerId);
  const tips = getTrainerBattleTips(trainer, battle);
  const mapLabel = formatMapId(trainer.mapId);
  const facing = FACING_LABELS[trainer.spriteFrame] ?? "south";
  const partyTypes = battle?.party.map((m) => m.types) ?? [];
  const weaknesses = teamWeaknesses(partyTypes);
  const resistances = resistTypes(partyTypes);
  const trainerItems = battle ? cleanTrainerItems(battle.items) : [];
  const partyTypeList = battle ? uniquePartyTypes(battle.party) : [];
  const payout = battle ? prizeMoney(trainer.trainerClass, battle.party) : null;
  const flagsLabel = battle ? partyFlagsLabel(battle.partyFlags) : null;
  const rematches = findRematchVariants(trainer.trainerId);
  const avgLevel = battle
    ? Math.round(battle.party.reduce((s, m) => s + m.level, 0) / battle.party.length)
    : null;

  return (
    <div className="trainer-modal__content">
      <section className="trainer-modal__hero" aria-label="Trainer overview">
        <div
          className="trainer-modal__trainer-sprite"
          style={{
            ["--trainer-frame" as string]: trainer.spriteFrame,
            ["--trainer-fw" as string]: trainer.spriteWidth,
            ["--trainer-fh" as string]: trainer.spriteHeight,
          }}
        >
          <img src={assetUrl(trainer.spriteSheet)} alt="" draggable={false} />
        </div>
        <div className="trainer-modal__hero-text">
          <p className="trainer-modal__class">{trainer.trainerClass}</p>
          <h4 className="trainer-modal__name">{trainer.trainerName}</h4>
          {mapLabel && <p className="trainer-modal__location">{mapLabel}</p>}
          <div className="trainer-modal__hero-badges">
            <span className="trainer-detail__badge">{formatEncounterType(trainer)}</span>
            <span className="trainer-detail__badge">Facing {facing}</span>
            {battle?.doubleBattle && <span className="trainer-detail__badge">Double battle</span>}
            {payout != null && (
              <span className="trainer-detail__badge trainer-detail__badge--money">
                Prize {formatMoney(payout)}
              </span>
            )}
          </div>
        </div>
      </section>

      {battle ? (
        <>
          <section className="trainer-modal__section" aria-label="Battle summary">
            <h5 className="trainer-modal__section-title">Battle summary</h5>
            <dl className="trainer-modal__stats">
              <div className="trainer-modal__stat">
                <dt>Party size</dt>
                <dd>{battle.party.length} Pokémon</dd>
              </div>
              <div className="trainer-modal__stat">
                <dt>Levels</dt>
                <dd>
                  {partyLevelRange(battle.party)}
                  {avgLevel != null ? ` (avg ${avgLevel})` : ""}
                </dd>
              </div>
              {payout != null && (
                <div className="trainer-modal__stat">
                  <dt>Prize money</dt>
                  <dd>
                    {formatMoney(payout)}
                    <span className="trainer-modal__stat-note">
                      {" "}
                      · last mon Lv.{battle.party[battle.party.length - 1].level} × class base
                    </span>
                  </dd>
                </div>
              )}
              {flagsLabel && (
                <div className="trainer-modal__stat trainer-modal__stat--wide">
                  <dt>Party data</dt>
                  <dd>{flagsLabel}</dd>
                </div>
              )}
              <div className="trainer-modal__stat">
                <dt>Party types</dt>
                <dd>
                  <span className="trainer-modal__type-row">
                    {partyTypeList.map((t) => (
                      <span
                        key={t}
                        className="trainer-detail__type"
                        style={{ background: TYPE_COLORS[t] ?? "#666" }}
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </dd>
              </div>
              {weaknesses.length > 0 && (
                <div className="trainer-modal__stat">
                  <dt>Weak to</dt>
                  <dd>
                    <span className="trainer-modal__type-row">
                      {weaknesses.map((t) => (
                        <span
                          key={t}
                          className="trainer-detail__type trainer-detail__type--weak"
                          style={{ background: TYPE_COLORS[t] ?? "#666" }}
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </dd>
                </div>
              )}
              {resistances.length > 0 && (
                <div className="trainer-modal__stat">
                  <dt>Resists</dt>
                  <dd>
                    <span className="trainer-modal__type-row">
                      {resistances.slice(0, 8).map((t) => (
                        <span
                          key={t}
                          className="trainer-detail__type trainer-detail__type--resist"
                          style={{ background: TYPE_COLORS[t] ?? "#666" }}
                        >
                          {t}
                        </span>
                      ))}
                      {resistances.length > 8 ? ` +${resistances.length - 8}` : null}
                    </span>
                  </dd>
                </div>
              )}
              {trainerItems.length > 0 && (
                <div className="trainer-modal__stat trainer-modal__stat--wide">
                  <dt>Trainer items</dt>
                  <dd>{trainerItems.join(", ")}</dd>
                </div>
              )}
            </dl>
            {payout != null && (
              <p className="trainer-modal__footnote">
                Amulet Coin doubles prize money when the holder participates. Pay Day adds extra
                cash on top of the trainer payout.
              </p>
            )}
          </section>

          {rematches.length > 1 && (
            <section className="trainer-modal__section" aria-label="Rematches">
              <h5 className="trainer-modal__section-title">Rematch versions</h5>
              <p className="trainer-modal__section-desc">
                This trainer has {rematches.length} party definitions in the game data (e.g. post-game
                rematches with higher levels).
              </p>
              <ul className="trainer-modal__rematch-list">
                {rematches.map(({ id, data }) => (
                  <li key={id} className={id === trainer.trainerId ? "is-current" : ""}>
                    <code>{id}</code>
                    <span>
                      {partyLevelRange(data.party)} · {data.party.length} mon
                      {data.party.length === 1 ? "" : "s"}
                      {id === trainer.trainerId ? " (this map battle)" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="trainer-modal__section" aria-label="Party">
            <h5 className="trainer-modal__section-title">Party</h5>
            <ul className="trainer-modal__party-grid">
              {battle.party.map((mon, i) => (
                <TrainerMonCard key={`${mon.species}-${i}`} mon={mon} index={i} />
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p className="trainer-detail__empty">
          {trainer.script === "BattlePyramid_TrainerBattle"
            ? "Battle Pyramid — party is randomly rented from the facility pool each run."
            : "No linked party data for this map trainer."}
        </p>
      )}

      {tips.length > 0 && (
        <section className="trainer-modal__section" aria-label="Battle tips">
          <h5 className="trainer-modal__section-title">Battle tips</h5>
          <ul className="trainer-modal__tips">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="trainer-modal__section trainer-modal__section--meta" aria-label="Game data">
        <h5 className="trainer-modal__section-title">Encounter details</h5>
        <dl className="trainer-modal__meta-list">
          {trainer.desc && (
            <div>
              <dt>Behavior</dt>
              <dd>{trainer.desc}</dd>
            </div>
          )}
          {trainer.note && trainer.note !== trainer.desc && (
            <div>
              <dt>Map note</dt>
              <dd>{trainer.note}</dd>
            </div>
          )}
          {trainer.graphicsId && (
            <div>
              <dt>Sprite</dt>
              <dd>
                <code>{trainer.graphicsId}</code>
              </dd>
            </div>
          )}
          {trainer.script && (
            <div>
              <dt>Script</dt>
              <dd>
                <code>{trainer.script}</code>
              </dd>
            </div>
          )}
          {trainer.trainerId && (
            <div>
              <dt>Trainer ID</dt>
              <dd>
                <code>{trainer.trainerId}</code>
              </dd>
            </div>
          )}
          {trainer.mapId && (
            <div>
              <dt>Map</dt>
              <dd>
                <code>{trainer.mapId}</code>
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

/** Brief label shown when hovering a trainer map pin. */
export function TrainerPinHint({ trainer }: { trainer: TrainerPoint }) {
  const battle = getTrainerBattle(trainer.trainerId);
  const partyPreview = battle?.party.map((m) => `${m.species} Lv.${m.level}`).join(" · ");

  return (
    <>
      <span className="hoenn-map__pin-cat">Trainer</span>
      <span className="hoenn-map__pin-hint-name">{trainer.name}</span>
      <span className="hoenn-map__pin-hint-sub">{trainer.trainerClass}</span>
      {trainer.note ? <span className="hoenn-map__pin-hint-sub">{trainer.note}</span> : null}
      {trainer.sightRange ? (
        <span className="hoenn-map__pin-hint-sub">Sight range {trainer.sightRange} tiles</span>
      ) : null}
      {partyPreview ? <span className="hoenn-map__pin-hint-sub">{partyPreview}</span> : null}
    </>
  );
}

interface TrainerDetailModalProps {
  trainer: TrainerPoint | null;
  onClose: () => void;
}

/** Full-screen dialog with party, moves, items, and battle tips. */
export function TrainerDetailModal({ trainer, onClose }: TrainerDetailModalProps) {
  useEffect(() => {
    if (!trainer) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [trainer, onClose]);

  if (!trainer) return null;

  return createPortal(
    <div
      className="trainer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trainer-modal-title"
      onClick={onClose}
    >
      <div className="trainer-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal__head">
          <div>
            <h3 id="trainer-modal-title">{trainer.name}</h3>
            <p className="trainer-modal__subtitle">{trainer.trainerClass}</p>
          </div>
          <button type="button" className="trainer-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="trainer-modal__body">
          <TrainerModalBody trainer={trainer} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
