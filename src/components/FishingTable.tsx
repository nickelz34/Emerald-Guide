import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FISHING_ROD_TABLE,
  FISHING_SPECIAL_NOTES,
  SUPER_ROD_LOCATION_TABLE,
  type FishingEncounterMon,
  type FishingLocationRow,
  type FishingRodRow,
} from "../data/fishingTables";
import { findDexEntryByName, loadAllDex, type DexEntry } from "../data/dex";
import { emeraldSpriteUrl } from "../data/species";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { SpeciesPanel } from "./Pokedex";

interface FishingTableProps {
  className?: string;
  rods?: FishingRodRow[];
  locations?: FishingLocationRow[];
}

function FishingMonButton({
  mon,
  onOpen,
}: {
  mon: FishingEncounterMon;
  onOpen?: () => void;
}) {
  const sprite = emeraldSpriteUrl(mon.dex);
  const clickable = Boolean(onOpen);

  const inner = (
    <>
      {sprite ? (
        <img
          src={sprite}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="fishing-table__sprite"
        />
      ) : (
        <span className="fishing-table__sprite fishing-table__sprite--fallback" aria-hidden="true">
          ?
        </span>
      )}
      <span className="fishing-table__mon-name">{mon.name}</span>
    </>
  );

  if (!clickable) {
    return <span className="fishing-table__mon">{inner}</span>;
  }

  return (
    <button
      type="button"
      className="fishing-table__mon fishing-table__mon--link"
      onClick={onOpen}
      title={`View ${mon.name} stats`}
    >
      {inner}
    </button>
  );
}

/** Emerald fishing rods + Super Rod encounter tables from pokeemerald. */
export function FishingTable({
  className = "",
  rods = FISHING_ROD_TABLE,
  locations = SUPER_ROD_LOCATION_TABLE,
}: FishingTableProps) {
  const [dexEntries, setDexEntries] = useState<DexEntry[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<DexEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAllDex().then((entries) => {
      if (!cancelled) setDexEntries(entries);
    });
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

  const openSpecies = (name: string) => {
    const entry = findDexEntryByName(dexEntries, name);
    if (entry && !entry.isGlitch) setSelectedPokemon(entry);
  };

  return (
    <section
      className={`reference-table fishing-table ${className}`.trim()}
      aria-label="Fishing rods and Super Rod encounters"
    >
      <h5 className="reference-table__title">Fishing rods</h5>
      <p className="reference-table__lead">
        Face a water tile, open the Bag, and use a rod. Each map has its own fishing table —
        separate from Surf. Missed reels cancel the attempt; try again on the same tile.
      </p>

      <ul className="fishing-table__rods">
        {rods.map((rod) => (
          <li key={rod.id} className={`fishing-table__rod fishing-table__rod--${rod.id}`}>
            <div className="fishing-table__rod-head">
              <span className="fishing-table__rod-name">{rod.name}</span>
              <span className="fishing-table__rod-levels">{rod.typicalLevels}</span>
            </div>
            <p className="fishing-table__meta">
              <span className="fishing-table__label">Where</span>
              {rod.obtain}
            </p>
            {rod.prerequisite ? (
              <p className="fishing-table__meta">
                <span className="fishing-table__label">Needs</span>
                {rod.prerequisite}
              </p>
            ) : null}
            <p className="fishing-table__meta">
              <span className="fishing-table__label">Often finds</span>
              {rod.commonCatches}
            </p>
            <p className="fishing-table__note">{rod.note}</p>
          </li>
        ))}
      </ul>

      <h5 className="reference-table__subtitle">Super Rod encounters (highlight maps)</h5>
      <p className="reference-table__lead">
        Rates and levels from pokeemerald’s <code>fishing_mons</code> Super Rod slots. Tap a
        Pokémon for types, abilities, and base stats. Walkthrough area pages still show that map’s
        full Old / Good / Super tables.
      </p>

      <div className="fishing-table__locations">
        {locations.map((loc) => (
          <article key={loc.id} className="fishing-table__location">
            <header className="fishing-table__location-head">
              <h6 className="fishing-table__loc-name">{loc.location}</h6>
              {loc.note ? <p className="fishing-table__loc-note">{loc.note}</p> : null}
            </header>
            <ul className="fishing-table__encounters">
              {loc.encounters.map((mon) => (
                <li key={`${loc.id}-${mon.name}`} className="fishing-table__encounter">
                  <FishingMonButton mon={mon} onOpen={() => openSpecies(mon.name)} />
                  <span className="fishing-table__rate">{mon.rate}</span>
                  <span className="fishing-table__level">{mon.level}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

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
