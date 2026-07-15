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
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Ball</th>
              <th scope="col">Multiplier</th>
              <th scope="col">Best used</th>
              <th scope="col">Where you get it</th>
            </tr>
          </thead>
          <tbody>
            {POKE_BALL_TABLE.map((row) => {
              const icon = row.iconName ? getItemBagIcon(row.iconName) : undefined;
              return (
                <tr key={row.id}>
                  <td>
                    <span className="poke-ball-table__name">
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
                      {row.name}
                    </span>
                  </td>
                  <td>{row.multiplier}</td>
                  <td>{row.bestUsed}</td>
                  <td>{row.obtain}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
