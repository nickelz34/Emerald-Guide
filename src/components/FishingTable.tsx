import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FISHING_ROD_TABLE,
  FISHING_SPECIAL_NOTES,
  getFishingClusters,
  type FishingEncounterMon,
  type FishingRodRow,
} from "../data/fishingTables";
import { findDexEntryByName, loadAllDex, type DexEntry } from "../data/dex";
import { emeraldSpriteUrl } from "../data/species";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { METHOD_LABELS, type EncounterMethod } from "../types";
import { SpeciesPanel } from "./Pokedex";

type FishingMethod = Extract<EncounterMethod, "old-rod" | "good-rod" | "super-rod">;

const ROD_TABS: FishingMethod[] = ["old-rod", "good-rod", "super-rod"];

interface FishingTableProps {
  className?: string;
  rods?: FishingRodRow[];
  /** Initial rod tab (defaults to Super Rod). */
  defaultMethod?: FishingMethod;
}

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

/** Emerald fishing rods + full Old / Good / Super Rod tables from pokeemerald. */
export function FishingTable({
  className = "",
  rods = FISHING_ROD_TABLE,
  defaultMethod = "super-rod",
}: FishingTableProps) {
  const [method, setMethod] = useState<FishingMethod>(defaultMethod);
  const [search, setSearch] = useState("");
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

  const clusters = useMemo(() => getFishingClusters(method), [method]);

  const dexLookup = useMemo(() => {
    const cache = new Map<string, DexEntry | undefined>();
    for (const cluster of clusters) {
      for (const mon of cluster.encounters) {
        if (!cache.has(mon.name)) {
          cache.set(mon.name, findDexEntryByName(dexEntries, mon.name));
        }
      }
    }
    return cache;
  }, [clusters, dexEntries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clusters;
    return clusters
      .map((cluster) => {
        const locHit =
          cluster.location.toLowerCase().includes(q) ||
          cluster.maps.some((m) => m.toLowerCase().includes(q));
        const encounters = locHit
          ? cluster.encounters
          : cluster.encounters.filter((m) => m.name.toLowerCase().includes(q));
        if (encounters.length === 0) return null;
        return { ...cluster, encounters };
      })
      .filter((c): c is NonNullable<typeof c> => c != null);
  }, [clusters, search]);

  const openPokemon = (name: string) => {
    const entry = findDexEntryByName(dexEntries, name);
    if (entry && !entry.isGlitch) setSelectedPokemon(entry);
  };

  const mapCount = clusters.reduce((n, c) => n + c.maps.length, 0);

  return (
    <section
      className={`reference-table fishing-table ${className}`.trim()}
      aria-label="Fishing rods and encounter tables"
    >
      <h5 className="reference-table__title">Fishing rods</h5>
      <p className="reference-table__lead">
        Face a water tile, open the Bag, and use a rod. Each map has its own fishing table —
        separate from Surf. Missed reels cancel the attempt; try again on the same tile.
      </p>

      <ul className="fishing-table__rods">
        {rods.map((rod) => (
          <li key={rod.id} className={`fishing-table__rod fishing-table__rod--${rod.id}`}>
            <header className="fishing-table__rod-head">
              <div className="fishing-table__rod-title">
                <span className="fishing-table__rod-name">{rod.name}</span>
                <span className="fishing-table__rod-tier">{rod.tier}</span>
              </div>
              <span className="fishing-table__rod-levels">{rod.typicalLevels}</span>
            </header>

            <dl className="fishing-table__rod-fields">
              <div className="fishing-table__rod-field">
                <dt>Obtained</dt>
                <dd>
                  <strong className="fishing-table__rod-place">{rod.location}</strong>
                  <span className="fishing-table__rod-npc">{rod.npc}</span>
                </dd>
              </div>

              <div className="fishing-table__rod-field">
                <dt>Requirement</dt>
                <dd>{rod.prerequisite ?? "None — available as soon as you reach the giver."}</dd>
              </div>

              <div className="fishing-table__rod-field">
                <dt>Reel prompts</dt>
                <dd>{rod.reelPrompts}</dd>
              </div>

              <div className="fishing-table__rod-field">
                <dt>Typical catches</dt>
                <dd>
                  <ul className="fishing-table__rod-catches">
                    {rod.catches.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <p className="fishing-table__rod-tip">
              <span className="fishing-table__rod-tip-label">Tip</span>
              {rod.tip}
            </p>
          </li>
        ))}
      </ul>

      <h5 className="reference-table__subtitle">Fishing encounter tables</h5>
      <p className="reference-table__lead">
        Slot rates and levels from pokeemerald’s <code>fishing_mons</code> groups
        ({mapCount} maps). Maps that share an identical table are grouped. Click a Pokémon for
        types, abilities, base stats, and more.
      </p>

      <div className="fishing-table__toolbar">
        <div className="fishing-table__tabs" role="tablist" aria-label="Fishing rod">
          {ROD_TABS.map((rod) => (
            <button
              key={rod}
              type="button"
              role="tab"
              aria-selected={method === rod}
              className={`fishing-table__tab${method === rod ? " fishing-table__tab--active" : ""}`}
              onClick={() => setMethod(rod)}
            >
              {METHOD_LABELS[rod]}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="fishing-table__search"
          placeholder="Filter location or Pokémon…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Filter fishing table"
        />
      </div>

      <div className="encounter-table-wrap fishing-table__wrap">
        <table className="encounter-table fishing-table__grid">
          <thead>
            <tr>
              <th scope="col">Pokémon</th>
              <th scope="col">Levels</th>
              <th scope="col">Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="encounter-table__empty">
                  No matches for current filters.
                </td>
              </tr>
            ) : (
              filtered.flatMap((cluster) => [
                <tr key={`${cluster.id}-head`} className="fishing-table__section">
                  <th scope="colgroup" colSpan={3}>
                    <span className="fishing-table__loc-name">{cluster.location}</span>
                    {cluster.maps.length > 1 ? (
                      <span className="fishing-table__loc-count">
                        {cluster.maps.length} maps
                      </span>
                    ) : null}
                    {cluster.note ? (
                      <span className="fishing-table__loc-note">{cluster.note}</span>
                    ) : null}
                  </th>
                </tr>,
                ...cluster.encounters.map((mon) => (
                  <tr key={`${cluster.id}-${mon.name}`}>
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
                )),
              ])
            )}
          </tbody>
        </table>
      </div>

      <p className="encounter-legend">
        Rates are summed Super/Good/Old Rod slot percentages within that rod’s group (each group
        totals 100%). Levels show the min–max across those slots.
      </p>

      <ul className="fishing-table__specials">
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
