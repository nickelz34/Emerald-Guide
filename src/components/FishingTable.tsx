import {
  FISHING_ROD_TABLE,
  FISHING_SPECIAL_NOTES,
  SUPER_ROD_LOCATION_TABLE,
  type FishingLocationRow,
  type FishingRodRow,
} from "../data/fishingTables";
import { emeraldSpriteUrl } from "../data/species";

interface FishingTableProps {
  className?: string;
  rods?: FishingRodRow[];
  locations?: FishingLocationRow[];
}

/** Emerald fishing rods + Super Rod encounter tables from pokeemerald. */
export function FishingTable({
  className = "",
  rods = FISHING_ROD_TABLE,
  locations = SUPER_ROD_LOCATION_TABLE,
}: FishingTableProps) {
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
        Rates and levels from pokeemerald’s <code>fishing_mons</code> Super Rod slots. Walkthrough
        area pages still show that map’s full Old / Good / Super tables.
      </p>

      <div className="reference-table__scroll fishing-table__scroll">
        <table className="fishing-table__grid">
          <thead>
            <tr>
              <th scope="col">Location</th>
              <th scope="col">Pokémon</th>
              <th scope="col">Rate</th>
              <th scope="col">Levels</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) =>
              loc.encounters.map((mon, idx) => (
                <tr key={`${loc.id}-${mon.name}`}>
                  {idx === 0 ? (
                    <th
                      scope="row"
                      rowSpan={loc.encounters.length}
                      className="fishing-table__loc"
                    >
                      <span className="fishing-table__loc-name">{loc.location}</span>
                      {loc.note ? (
                        <span className="fishing-table__loc-note">{loc.note}</span>
                      ) : null}
                    </th>
                  ) : null}
                  <td>
                    <span className="fishing-table__mon">
                      {emeraldSpriteUrl(mon.dex) ? (
                        <img
                          src={emeraldSpriteUrl(mon.dex)}
                          alt=""
                          width={32}
                          height={32}
                          loading="lazy"
                          decoding="async"
                          className="fishing-table__sprite"
                        />
                      ) : null}
                      {mon.name}
                    </span>
                  </td>
                  <td>{mon.rate}</td>
                  <td>{mon.level}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      <ul className="fishing-table__specials">
        {FISHING_SPECIAL_NOTES.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>
            <span>{note.body}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
