import {
  FISHING_ROD_TABLE,
  type FishingRodRow,
} from "../data/fishingTables";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { assetUrl } from "../lib/assetUrl";

interface FishingTableProps {
  className?: string;
  rods?: FishingRodRow[];
}

/** Emerald fishing rod obtain cards (Old / Good / Super). Encounter tables are a separate panel. */
export function FishingTable({
  className = "",
  rods = FISHING_ROD_TABLE,
}: FishingTableProps) {
  return (
    <section
      className={`reference-table fishing-table ${className}`.trim()}
      aria-label="Fishing rods"
    >
      <h5 className="reference-table__title">Fishing rods</h5>
      <p className="reference-table__lead">
        Face a water tile, open the Bag, and use a rod. Each map has its own fishing table —
        separate from Surf. Missed reels cancel the attempt; try again on the same tile. Use{" "}
        <strong>Fishing encounters by location</strong> below to look up a map’s catches.
      </p>

      <ul className="fishing-table__rods">
        {rods.map((rod) => {
          const icon = getItemBagIcon(rod.iconName);
          return (
            <li key={rod.id} className={`fishing-table__rod fishing-table__rod--${rod.id}`}>
              <header className="fishing-table__rod-head">
                <div className="fishing-table__rod-title">
                  <span className="fishing-table__rod-name-row">
                    {icon ? (
                      <img
                        className="fishing-table__rod-icon"
                        src={assetUrl(icon.spriteSheet)}
                        alt=""
                        width={48}
                        height={48}
                        draggable={false}
                      />
                    ) : null}
                    <span className="fishing-table__rod-name">{rod.name}</span>
                  </span>
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
          );
        })}
      </ul>
    </section>
  );
}
