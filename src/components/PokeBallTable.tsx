import { POKE_BALL_TABLE } from "../data/pokeBalls";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { assetUrl } from "../lib/assetUrl";

interface PokeBallTableProps {
  className?: string;
}

/** Emerald Poké Ball catch multipliers and obtain notes. */
export function PokeBallTable({ className = "" }: PokeBallTableProps) {
  return (
    <section
      className={`reference-table poke-ball-table ${className}`.trim()}
      aria-label="Poké Ball reference"
    >
      <h5 className="reference-table__title">Poké Balls in Emerald</h5>
      <p className="reference-table__lead">
        Multipliers apply in Generation III’s catch formula after HP and status. Sleep and freeze
        still help every Ball; the Master Ball skips the formula entirely.
      </p>
      <ul className="poke-ball-table__list">
        {POKE_BALL_TABLE.map((row) => {
          const icon = row.iconName ? getItemBagIcon(row.iconName) : undefined;
          return (
            <li key={row.id} className="poke-ball-table__item">
              <div className="poke-ball-table__heading">
                {icon && (
                  <img
                    className="poke-ball-table__icon"
                    src={assetUrl(icon.spriteSheet)}
                    alt=""
                    width={24}
                    height={24}
                    draggable={false}
                  />
                )}
                <span className="poke-ball-table__name">{row.name}</span>
                <span className="poke-ball-table__multiplier">{row.multiplier}</span>
              </div>
              <p className="poke-ball-table__meta">
                <span className="poke-ball-table__label">Best used</span>
                {row.bestUsed}
              </p>
              <p className="poke-ball-table__meta">
                <span className="poke-ball-table__label">Where</span>
                {row.obtain}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
