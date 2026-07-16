import { VITAMIN_TABLE, type VitaminRow } from "../data/vitamins";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { assetUrl } from "../lib/assetUrl";

interface VitaminsTableProps {
  className?: string;
  rows?: VitaminRow[];
}

/** Emerald vitamin catalog with bag sprites, EV gains, and shop notes. */
export function VitaminsTable({ className = "", rows = VITAMIN_TABLE }: VitaminsTableProps) {
  return (
    <section
      className={`reference-table vitamins-table ${className}`.trim()}
      aria-label="Vitamin reference"
    >
      <h5 className="reference-table__title">Vitamins in Emerald</h5>
      <p className="reference-table__lead">
        Each vitamin adds 10 Effort Values to one stat. A vitamin fails once that stat already has
        100 EVs from any source. Every Pokémon is also capped at 510 EVs total across all stats.
        Vitamins never change nature or IVs.
      </p>
      <ul className="vitamins-table__list">
        {rows.map((row) => {
          const icon = getItemBagIcon(row.iconName);
          return (
            <li key={row.id} className="vitamins-table__item">
              <div className="vitamins-table__heading">
                {icon ? (
                  <img
                    className="vitamins-table__icon"
                    src={assetUrl(icon.spriteSheet)}
                    alt=""
                    width={24}
                    height={24}
                    draggable={false}
                  />
                ) : null}
                <span className="vitamins-table__name">{row.name}</span>
                <span className="vitamins-table__ev">{row.evGain}</span>
              </div>
              <p className="vitamins-table__meta">
                <span className="vitamins-table__label">Stat</span>
                {row.stat}
              </p>
              <p className="vitamins-table__meta">
                <span className="vitamins-table__label">Effect</span>
                {row.effect}
              </p>
              <p className="vitamins-table__meta">
                <span className="vitamins-table__label">Fails when</span>
                {row.failsWhen}
              </p>
              <p className="vitamins-table__meta">
                <span className="vitamins-table__label">Price</span>
                {row.price}
              </p>
              <p className="vitamins-table__meta">
                <span className="vitamins-table__label">Where</span>
                {row.obtain}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
