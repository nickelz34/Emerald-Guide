import { NATURE_TABLE } from "../data/natures";

interface NatureTableProps {
  className?: string;
}

function fmtStat(stat: string | null): string {
  return stat ?? "—";
}

/** All 25 Emerald natures with +/− battle stats and contest flavor ties. */
export function NatureTable({ className = "" }: NatureTableProps) {
  return (
    <section
      className={`reference-table nature-table ${className}`.trim()}
      aria-label="Nature reference"
    >
      <h5 className="reference-table__title">Pokémon Natures (all 25)</h5>
      <p className="reference-table__lead">
        Raised stats are ×1.1 and lowered stats are ×0.9 after IVs and EVs. Neutral natures leave
        every battle stat alone. Liked flavors make Pokéblocks raise contest conditions faster;
        disliked flavors work against you.
      </p>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Nature</th>
              <th scope="col">Raises</th>
              <th scope="col">Lowers</th>
              <th scope="col">Contest</th>
              <th scope="col">Likes</th>
              <th scope="col">Dislikes</th>
            </tr>
          </thead>
          <tbody>
            {NATURE_TABLE.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{fmtStat(row.raised)}</td>
                <td>{fmtStat(row.lowered)}</td>
                <td>{fmtStat(row.contest)}</td>
                <td>{fmtStat(row.likes)}</td>
                <td>{fmtStat(row.dislikes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
