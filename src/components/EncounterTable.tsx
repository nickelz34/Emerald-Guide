import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { PokemonEncounter, TimeSlot, EncounterMethod } from "../types";
import { TIME_LABELS, METHOD_LABELS } from "../types";
import {
  getAreaData,
  getAreasForStep,
  getSecretsExtrasForArea,
  getRouteHiddenItems,
  getRoutePickups,
  getRouteSecretsExtras,
  getRouteTrainers,
  loadRouteEncounters,
  SECRETS_EXTRAS_SECTION_TITLE,
} from "../data/areaData";
import { getAreaIdForEncounterStep } from "../data/encounters";
import { getAreaDisplayMap } from "../data/stepImages";
import type { MapPoint } from "../data/mapPoints";
import { findDexEntryByName, loadAllDex, type DexEntry } from "../data/dex";
import { emeraldSpriteUrl } from "../data/species";
import type { TrainerPoint } from "../data/mapTrainersGenerated";
import { HoennCrop } from "./HoennCrop";
import { AreaMapView } from "./AreaMapView";
import { SpeciesPanel } from "./Pokedex";
import { SecretsExtrasBlock, ItemsBerriesBlock } from "./StepSecretsExtras";
import { TrainerModalBody } from "./TrainerDetailPanel";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";

interface EncounterTableProps {
  areaIds: string[];
  compact?: boolean;
  showScreenshots?: boolean;
  /** When false, area secrets are omitted (shown on the parent walkthrough step instead). */
  showAreaSecrets?: boolean;
  /** Shown when the area has no wild encounters (instead of leaving the panel blank). */
  emptyMessage?: string;
}

const TIME_ORDER: TimeSlot[] = ["any", "morning", "day", "night"];

function timeBadgeClass(time: TimeSlot): string {
  return `encounter-time encounter-time--${time}`;
}

function EncounterMon({
  enc,
  dexEntry,
  onOpen,
}: {
  enc: PokemonEncounter;
  dexEntry?: DexEntry;
  onOpen?: () => void;
}) {
  const sprite = dexEntry && !dexEntry.isGlitch ? emeraldSpriteUrl(dexEntry.nationalNumber) : undefined;
  const clickable = Boolean(onOpen && dexEntry && !dexEntry.isGlitch);

  return (
    <div className="encounter-mon">
      <span className="encounter-mon__sprite" aria-hidden="true">
        {sprite ? (
          <img src={sprite} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="encounter-mon__sprite-fallback">?</span>
        )}
      </span>
      <div className="encounter-mon__label">
        {clickable ? (
          <button
            type="button"
            className="encounter-mon__link"
            onClick={onOpen}
            title={`View ${enc.name} stats`}
          >
            {enc.name}
          </button>
        ) : (
          <span className="encounter-name">{enc.name}</span>
        )}
        {enc.notes && <span className="encounter-note">{enc.notes}</span>}
      </div>
    </div>
  );
}

export function EncounterTable({
  areaIds,
  compact,
  showScreenshots = true,
  showAreaSecrets = true,
  emptyMessage,
}: EncounterTableProps) {
  const [timeFilter, setTimeFilter] = useState<TimeSlot | "all">("all");
  const [methodFilter, setMethodFilter] = useState<EncounterMethod | "all">("all");
  const [search, setSearch] = useState("");
  const [encountersByArea, setEncountersByArea] = useState<Record<string, PokemonEncounter[]>>({});
  const [encLoading, setEncLoading] = useState(false);
  const [dexEntries, setDexEntries] = useState<DexEntry[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<DexEntry | null>(null);

  useEffect(() => {
    if (areaIds.length === 0) {
      setEncountersByArea({});
      return;
    }
    let alive = true;
    setEncLoading(true);
    Promise.all(
      areaIds.map(async (id) => {
        const encounters = await loadRouteEncounters(id);
        return [id, encounters] as const;
      }),
    )
      .then((pairs) => {
        if (!alive) return;
        setEncountersByArea(Object.fromEntries(pairs));
      })
      .catch(() => alive && setEncountersByArea({}))
      .finally(() => alive && setEncLoading(false));
    return () => {
      alive = false;
    };
  }, [areaIds]);

  useEffect(() => {
    let alive = true;
    loadAllDex()
      .then((entries) => alive && setDexEntries(entries))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPokemon) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPokemon(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPokemon]);

  const areas = useMemo(
    () =>
      areaIds.map((id) => ({
        id,
        data: getAreaData(id),
        encounters: encountersByArea[id] ?? [],
      })),
    [areaIds, encountersByArea],
  );

  const allEncounters = useMemo(() => {
    const rows: { areaId: string; areaName: string; enc: PokemonEncounter }[] = [];
    for (const { id, encounters } of areas) {
      const label = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      for (const enc of encounters) {
        rows.push({ areaId: id, areaName: label, enc });
      }
    }
    return rows;
  }, [areas]);

  const dexLookup = useMemo(() => {
    const cache = new Map<string, DexEntry | undefined>();
    for (const { enc } of allEncounters) {
      if (!cache.has(enc.name)) {
        cache.set(enc.name, findDexEntryByName(dexEntries, enc.name));
      }
    }
    return cache;
  }, [allEncounters, dexEntries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allEncounters.filter(({ enc }) => {
      if (timeFilter !== "all" && enc.time !== "any" && enc.time !== timeFilter) return false;
      if (methodFilter !== "all" && enc.method !== methodFilter) return false;
      if (q && !enc.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allEncounters, timeFilter, methodFilter, search]);

  const methods = useMemo(() => {
    const set = new Set<EncounterMethod>();
    allEncounters.forEach(({ enc }) => set.add(enc.method));
    return [...set];
  }, [allEncounters]);

  if (areaIds.length === 0) return null;

  const hasEncounters = allEncounters.length > 0;
  const hasAreaExtras = areas.some(({ data }) => data && (showScreenshots || showAreaSecrets));

  if (!hasEncounters && !hasAreaExtras && !encLoading && !emptyMessage) return null;

  const openPokemon = (name: string) => {
    const entry = findDexEntryByName(dexEntries, name);
    if (entry && !entry.isGlitch) setSelectedPokemon(entry);
  };

  return (
    <div className={`encounter-panel ${compact ? "encounter-panel--compact" : ""}`}>
      {areas.map(({ id, data }) => {
        const label = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const mapShot = getAreaDisplayMap(id, label);
        const extras = showAreaSecrets && data ? getSecretsExtrasForArea(id) : [];
        if (!data && !showScreenshots && extras.length === 0) return null;
        return (
          <div key={id} className="area-block">
            {areas.length > 1 && <h4 className="area-block__title">{label}</h4>}
            {showScreenshots && data && mapShot && (
              mapShot.areaMapId ? (
                <AreaMapView areaMapId={mapShot.areaMapId} caption={mapShot.caption} showLegend />
              ) : mapShot.crop ? (
                <HoennCrop crop={mapShot.crop} caption={mapShot.caption} areaId={mapShot.areaId} showLegend />
              ) : null
            )}
            {extras.length > 0 && (
              <div className="area-block__secrets">
                <strong>{SECRETS_EXTRAS_SECTION_TITLE}</strong>
                <ul>
                  {extras.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {encLoading && !hasEncounters && (
        <p className="encounter-panel__loading">Loading wild encounter data…</p>
      )}

      {!encLoading && !hasEncounters && emptyMessage && (
        <p className="encounter-panel__empty" role="status">
          {emptyMessage}
        </p>
      )}

      {hasEncounters && (
        <>
          {!compact && (
            <div className="encounter-filters">
              <input
                type="search"
                className="encounter-filters__search"
                placeholder="Filter Pokémon…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeSlot | "all")}
                aria-label="Time of day"
              >
                <option value="all">All times</option>
                {TIME_ORDER.map((t) => (
                  <option key={t} value={t}>
                    {TIME_LABELS[t]}
                  </option>
                ))}
              </select>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as EncounterMethod | "all")}
                aria-label="Encounter method"
              >
                <option value="all">All methods</option>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="encounter-table-wrap">
            <table className="encounter-table">
              <thead>
                <tr>
                  {areas.length > 1 && <th>Area</th>}
                  <th>Pokémon</th>
                  <th>Level</th>
                  <th>Time</th>
                  <th>Method</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={areas.length > 1 ? 6 : 5} className="encounter-table__empty">
                      No matches for current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map(({ areaName, enc }, i) => (
                    <tr key={`${areaName}-${enc.name}-${enc.method}-${i}`}>
                      {areas.length > 1 && <td data-label="Area">{areaName}</td>}
                      <td data-label="Pokémon">
                        <EncounterMon
                          enc={enc}
                          dexEntry={dexLookup.get(enc.name)}
                          onOpen={() => openPokemon(enc.name)}
                        />
                      </td>
                      <td data-label="Level">{enc.level}</td>
                      <td data-label="Time">
                        <span className={timeBadgeClass(enc.time)}>{TIME_LABELS[enc.time]}</span>
                      </td>
                      <td data-label="Method">{METHOD_LABELS[enc.method]}</td>
                      <td data-label="Rate">{enc.rate ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="encounter-legend">
            Click a Pokémon name for types, abilities, and base stats. Gen 3 times: Morning
            4:00–9:59 · Day 10:00–19:59 · Night 20:00–3:59
          </p>
        </>
      )}

      {selectedPokemon &&
        createPortal(
          <ModalBackdrop
            className="route-modal"
            onClose={() => setSelectedPokemon(null)}
            aria-labelledby="encounter-species-title"
          >
            <div className="route-modal__panel" onClick={(e) => e.stopPropagation()}>
              <div className="route-modal__head">
                <div>
                  <h3 id="encounter-species-title">{selectedPokemon.name}</h3>
                </div>
                <ModalCloseButton
                  className="route-modal__close"
                  onClose={() => setSelectedPokemon(null)}
                />
              </div>
              <div className="route-modal__body">
                <SpeciesPanel
                  slug={selectedPokemon.slug}
                  name={selectedPokemon.name}
                  nationalNumber={selectedPokemon.nationalNumber}
                />
              </div>
            </div>
          </ModalBackdrop>,
          document.body,
        )}
    </div>
  );
}

interface StepEncountersProps {
  stepId: string;
}

/** Show encounters for a walkthrough/secret step via STEP_AREA_MAP. */
export function StepEncounters({ stepId }: StepEncountersProps) {
  const areaIds = getAreasForStep(stepId);
  if (areaIds.length === 0) return null;
  return (
    <div className="step-card__encounters">
      <strong>Wild Pokémon</strong>
      <EncounterTable
        areaIds={areaIds}
        showScreenshots={false}
        showAreaSecrets={false}
        emptyMessage="No wild Pokémon encountered in this area."
      />
    </div>
  );
}

/** Show encounters for an encounter-category step. */
export function EncounterStepPanel({ stepId }: { stepId: string }) {
  const areaId = getAreaIdForEncounterStep(stepId);
  if (!areaId) return null;
  return <EncounterTable areaIds={[areaId]} />;
}

interface RouteDetailModalProps {
  route: MapPoint | null;
  onClose: () => void;
  onJumpToGuide?: (point: MapPoint) => void;
}

/** Full route guide — encounters, items, trainers, secrets — opened from the Hoenn map. */
export function RouteDetailModal({
  route,
  onClose,
  onJumpToGuide,
}: RouteDetailModalProps) {
  const areaId = route?.id ?? "";
  const [encounters, setEncounters] = useState<PokemonEncounter[]>([]);
  const [encLoading, setEncLoading] = useState(false);
  const [encError, setEncError] = useState(false);
  const [dexEntries, setDexEntries] = useState<DexEntry[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<DexEntry | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerPoint | null>(null);

  const pickups = useMemo(() => (areaId ? getRoutePickups(areaId) : []), [areaId]);
  const hiddenItems = useMemo(() => (areaId ? getRouteHiddenItems(areaId) : []), [areaId]);
  const trainers = useMemo(() => (areaId ? getRouteTrainers(areaId) : []), [areaId]);
  const secretsExtras = useMemo(
    () => (areaId ? getRouteSecretsExtras(areaId, hiddenItems) : []),
    [areaId, hiddenItems],
  );

  const dexLookup = useMemo(() => {
    const cache = new Map<string, DexEntry | undefined>();
    for (const enc of encounters) {
      if (!cache.has(enc.name)) {
        cache.set(enc.name, findDexEntryByName(dexEntries, enc.name));
      }
    }
    return cache;
  }, [encounters, dexEntries]);

  useEffect(() => {
    if (!route) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedTrainer) setSelectedTrainer(null);
      else if (selectedPokemon) setSelectedPokemon(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [route, onClose, selectedTrainer, selectedPokemon]);

  useEffect(() => {
    if (!route) {
      setEncounters([]);
      setSelectedPokemon(null);
      setSelectedTrainer(null);
      return;
    }
    setSelectedPokemon(null);
    setSelectedTrainer(null);
    setEncLoading(true);
    setEncError(false);
    loadRouteEncounters(route.id)
      .then(setEncounters)
      .catch(() => setEncError(true))
      .finally(() => setEncLoading(false));
  }, [route]);

  useEffect(() => {
    let alive = true;
    loadAllDex()
      .then((entries) => alive && setDexEntries(entries))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!route) return null;

  const isTown = route.category === "town";

  const openPokemon = (name: string) => {
    const entry = findDexEntryByName(dexEntries, name);
    if (entry && !entry.isGlitch) setSelectedPokemon(entry);
  };

  return createPortal(
    <ModalBackdrop
      className="route-modal"
      onClose={onClose}
      aria-labelledby="route-modal-title"
    >
      <div className="route-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="route-modal__head">
          <div>
            {selectedPokemon ? (
              <button
                type="button"
                className="btn btn--ghost route-modal__back"
                onClick={() => setSelectedPokemon(null)}
              >
                ← Back to {route.name}
              </button>
            ) : selectedTrainer ? (
              <button
                type="button"
                className="btn btn--ghost route-modal__back"
                onClick={() => setSelectedTrainer(null)}
              >
                ← Back to {route.name}
              </button>
            ) : (
              <>
                <h3 id="route-modal-title">{route.name}</h3>
                <p className="route-modal__subtitle">
                  {isTown
                    ? "Town guide — secrets, items, trainers, and encounters"
                    : "Route guide — wild Pokémon, items, and trainers"}
                </p>
              </>
            )}
          </div>
          <ModalCloseButton className="route-modal__close" onClose={onClose} />
        </div>

        <div className="route-modal__body">
          {selectedPokemon ? (
            <SpeciesPanel
              slug={selectedPokemon.slug}
              name={selectedPokemon.name}
              nationalNumber={selectedPokemon.nationalNumber}
            />
          ) : selectedTrainer ? (
            <TrainerModalBody trainer={selectedTrainer} />
          ) : (
            <>
              {secretsExtras.length > 0 && <SecretsExtrasBlock items={secretsExtras} />}

              <section className="route-modal__section">
                <h4>Wild Pokémon</h4>
                {encLoading ? (
                  <p className="route-modal__note">Loading encounter data…</p>
                ) : encError ? (
                  <p className="route-modal__note">Couldn&apos;t load wild encounter data (offline?).</p>
                ) : encounters.length === 0 ? (
                  <p className="route-modal__note">
                    No wild encounters recorded for this {isTown ? "town" : "route"}.
                  </p>
                ) : (
                  <>
                    <div className="encounter-table-wrap">
                      <table className="encounter-table route-modal__enc-table">
                        <thead>
                          <tr>
                            <th>Pokémon</th>
                            <th>Level</th>
                            <th>Time</th>
                            <th>Method</th>
                            <th>Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {encounters.map((enc, i) => (
                            <tr key={`${enc.name}-${enc.method}-${enc.time}-${i}`}>
                              <td data-label="Pokémon">
                                <EncounterMon
                                  enc={enc}
                                  dexEntry={dexLookup.get(enc.name)}
                                  onOpen={() => openPokemon(enc.name)}
                                />
                              </td>
                              <td data-label="Level">{enc.level}</td>
                              <td data-label="Time">
                                <span className={timeBadgeClass(enc.time)}>{TIME_LABELS[enc.time]}</span>
                              </td>
                              <td data-label="Method">{METHOD_LABELS[enc.method]}</td>
                              <td data-label="Rate">{enc.rate ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="encounter-legend">
                      Click a Pokémon name for types, abilities, and base stats. Gen 3 times: Morning
                      4:00–9:59 · Day 10:00–19:59 · Night 20:00–3:59
                    </p>
                  </>
                )}
              </section>

              {pickups.length > 0 && <ItemsBerriesBlock items={pickups} />}

              {trainers.length > 0 && (
                <section className="route-modal__section">
                  <h4>Trainers</h4>
                  <ul className="route-modal__trainers">
                    {trainers.map((trainer) => (
                      <li key={trainer.id}>
                        <button
                          type="button"
                          className="route-modal__trainer-btn"
                          onClick={() => setSelectedTrainer(trainer)}
                        >
                          <span className="route-modal__trainer-name">{trainer.name}</span>
                          <span className="route-modal__trainer-meta">{trainer.trainerClass}</span>
                          {trainer.rematchable && (
                            <span className="route-modal__trainer-badge">Rematch</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {route.stepId && onJumpToGuide && (
                <div className="route-modal__actions">
                  <button type="button" className="btn btn--primary" onClick={() => onJumpToGuide(route)}>
                    Return to walkthrough
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ModalBackdrop>,
    document.body,
  );
}
