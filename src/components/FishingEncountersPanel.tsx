import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FISHING_SPECIAL_NOTES,
  getFishingMapEntries,
  type FishingEncounterMon,
  type FishingMapEntry,
} from "../data/fishingTables";
import { findDexEntryByName, loadAllDex, type DexEntry } from "../data/dex";
import { emeraldSpriteUrl } from "../data/species";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { METHOD_LABELS, type EncounterMethod } from "../types";
import { SpeciesPanel } from "./Pokedex";

type FishingMethod = Extract<EncounterMethod, "old-rod" | "good-rod" | "super-rod">;

const ROD_TABS: FishingMethod[] = ["old-rod", "good-rod", "super-rod"];

function FishingMonCell({
  mon,
  dexEntry,
  onOpen,
}: {
  mon: FishingEncounterMon;
  dexEntry?: DexEntry;
  onOpen?: () => void;
}) {
  const sprite =
    dexEntry && !dexEntry.isGlitch ? emeraldSpriteUrl(dexEntry.nationalNumber) : undefined;
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
            title={`View ${mon.name} stats`}
          >
            {mon.name}
          </button>
        ) : (
          <span className="encounter-name">{mon.name}</span>
        )}
      </div>
    </div>
  );
}

function filterEntries(entries: FishingMapEntry[], query: string): FishingMapEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter(
    (entry) =>
      entry.mapName.toLowerCase().includes(q) ||
      entry.sameTableAs.some((m) => m.toLowerCase().includes(q)) ||
      entry.encounters.some((mon) => mon.name.toLowerCase().includes(q)),
  );
}

/** Standalone Old / Good / Super Rod encounter finder by map. */
export function FishingEncountersPanel({
  className = "",
  defaultMethod = "super-rod",
}: {
  className?: string;
  defaultMethod?: FishingMethod;
}) {
  const [method, setMethod] = useState<FishingMethod>(defaultMethod);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dexEntries, setDexEntries] = useState<DexEntry[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<DexEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAllDex()
      .then((entries) => {
        if (!cancelled) setDexEntries(entries);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
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

  const entries = useMemo(() => getFishingMapEntries(method), [method]);
  const filtered = useMemo(() => filterEntries(entries, search), [entries, search]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filtered.some((e) => e.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  const dexLookup = useMemo(() => {
    const cache = new Map<string, DexEntry | undefined>();
    for (const mon of selected?.encounters ?? []) {
      if (!cache.has(mon.name)) {
        cache.set(mon.name, findDexEntryByName(dexEntries, mon.name));
      }
    }
    return cache;
  }, [dexEntries, selected]);

  const openPokemon = (name: string) => {
    const entry = findDexEntryByName(dexEntries, name);
    if (entry && !entry.isGlitch) setSelectedPokemon(entry);
  };

  return (
    <section
      className={`reference-table fishing-encounters ${className}`.trim()}
      aria-label="Fishing encounters by location"
    >
      <h5 className="reference-table__title">Fishing encounters by location</h5>
      <p className="reference-table__lead">
        Pick a rod and a map to see that water’s fishing table (from pokeemerald). Maps that share
        an identical table are noted under the selection — rates are separate from Surf.
      </p>

      <div className="fishing-encounters__controls">
        <div className="fishing-encounters__tabs" role="tablist" aria-label="Fishing rod">
          {ROD_TABS.map((rod) => (
            <button
              key={rod}
              type="button"
              role="tab"
              aria-selected={method === rod}
              className={`fishing-encounters__tab${
                method === rod ? " fishing-encounters__tab--active" : ""
              }`}
              onClick={() => setMethod(rod)}
            >
              {METHOD_LABELS[rod]}
            </button>
          ))}
        </div>

        <label className="fishing-encounters__field">
          <span className="fishing-encounters__field-label">Find a map or Pokémon</span>
          <input
            type="search"
            className="fishing-encounters__search"
            placeholder="e.g. Lilycove, Route 119, Sharpedo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className="fishing-encounters__field">
          <span className="fishing-encounters__field-label">
            Location
            <span className="fishing-encounters__count">
              {filtered.length}
              {filtered.length !== entries.length ? ` / ${entries.length}` : ""}
            </span>
          </span>
          <select
            className="fishing-encounters__select"
            value={selected?.id ?? ""}
            disabled={filtered.length === 0}
            onChange={(e) => setSelectedId(e.target.value || null)}
            aria-label="Fishing location"
          >
            {filtered.length === 0 ? (
              <option value="">No matches</option>
            ) : (
              filtered.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.mapName}
                </option>
              ))
            )}
          </select>
        </label>
      </div>

      {selected ? (
        <div className="fishing-encounters__result">
          <div className="fishing-encounters__result-head">
            <h6 className="fishing-encounters__map-name">{selected.mapName}</h6>
            <span className="fishing-encounters__rod-badge">{METHOD_LABELS[method]}</span>
          </div>
          {selected.note ? (
            <p className="fishing-encounters__note">{selected.note}</p>
          ) : null}
          {selected.sameTableAs.length > 0 ? (
            <p className="fishing-encounters__same-table">
              <span className="fishing-encounters__same-table-label">Same table as</span>
              {selected.sameTableAs.join(" · ")}
            </p>
          ) : null}

          <div className="encounter-table-wrap fishing-encounters__wrap">
            <table className="encounter-table fishing-encounters__grid">
              <thead>
                <tr>
                  <th scope="col">Pokémon</th>
                  <th scope="col">Levels</th>
                  <th scope="col">Rate</th>
                </tr>
              </thead>
              <tbody>
                {selected.encounters.map((mon) => (
                  <tr key={`${selected.id}-${mon.name}`}>
                    <td data-label="Pokémon">
                      <FishingMonCell
                        mon={mon}
                        dexEntry={dexLookup.get(mon.name)}
                        onOpen={() => openPokemon(mon.name)}
                      />
                    </td>
                    <td data-label="Levels">{mon.level}</td>
                    <td data-label="Rate">{mon.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="fishing-encounters__empty">No maps match that search for this rod.</p>
      )}

      <p className="encounter-legend">
        Rates are summed slot percentages within that rod’s group (each group totals 100%). Levels
        show the min–max across those slots. Click a Pokémon for types, abilities, and base stats.
      </p>

      <ul className="fishing-encounters__specials">
        {FISHING_SPECIAL_NOTES.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <span>{note.body}</span>
          </li>
        ))}
      </ul>

      {selectedPokemon &&
        createPortal(
          <ModalBackdrop
            className="route-modal"
            onClose={() => setSelectedPokemon(null)}
            aria-labelledby="fishing-species-title"
          >
            <div className="route-modal__panel" onClick={(e) => e.stopPropagation()}>
              <div className="route-modal__head">
                <div>
                  <h3 id="fishing-species-title">{selectedPokemon.name}</h3>
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
    </section>
  );
}
