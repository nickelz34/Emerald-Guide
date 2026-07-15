import { useMemo, useState } from "react";
import { ALL_TYPES, typeEffectiveness } from "../lib/typeChart";

interface TypeChartTableProps {
  className?: string;
}

function formatMult(m: number): string {
  if (m === 0) return "0×";
  if (m === 0.25) return "¼×";
  if (m === 0.5) return "½×";
  if (m === 1) return "1×";
  if (m === 2) return "2×";
  if (m === 4) return "4×";
  return `${m}×`;
}

function multClass(m: number): string {
  if (m === 0) return "type-chart-table__mult--immune";
  if (m >= 2) return "type-chart-table__mult--super";
  if (m < 1) return "type-chart-table__mult--resist";
  return "";
}

/** Interactive Gen III type multiplier lookup for the battles pregame chapter. */
export function TypeChartTable({ className = "" }: TypeChartTableProps) {
  const [attackType, setAttackType] = useState(ALL_TYPES[0] ?? "Normal");

  const rows = useMemo(
    () =>
      ALL_TYPES.map((def) => ({
        def,
        mult: typeEffectiveness(attackType, [def]),
      })),
    [attackType],
  );

  return (
    <section
      className={`reference-table type-chart-table ${className}`.trim()}
      aria-label="Type chart reference"
    >
      <h5 className="reference-table__title">Damage multipliers (Gen III)</h5>
      <p className="reference-table__lead">
        Pick an attacking move type to see how it hits every defending type. Dual-typed Pokémon
        multiply both factors (for example Water/Ground takes 4× from Grass). STAB (1.5×) is
        separate and applies when the move matches the user’s type.
      </p>
      <label className="type-chart-table__picker">
        <span className="type-chart-table__picker-label">Attacking type</span>
        <select
          value={attackType}
          onChange={(e) => setAttackType(e.target.value)}
          aria-label="Attacking type"
        >
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Defending type</th>
              <th scope="col">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.def}>
                <td>{row.def}</td>
                <td className={multClass(row.mult)}>{formatMult(row.mult)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
