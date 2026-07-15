import { STATUS_CONDITION_TABLE } from "../data/statusConditions";

interface StatusTableProps {
  className?: string;
}

/** Emerald status anomalies with effects and cures. */
export function StatusTable({ className = "" }: StatusTableProps) {
  return (
    <section
      className={`reference-table status-table ${className}`.trim()}
      aria-label="Status condition reference"
    >
      <h5 className="reference-table__title">Status anomalies & cures</h5>
      <p className="reference-table__lead">
        Persistent (non-volatile) statuses replace each other — a Pokémon holds only one at a time.
        Volatile conditions can stack with a burn or paralysis and usually clear on switch.
      </p>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Kind</th>
              <th scope="col">Effect</th>
              <th scope="col">Cures</th>
            </tr>
          </thead>
          <tbody>
            {STATUS_CONDITION_TABLE.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.kind === "persistent" ? "Persistent" : "Volatile"}</td>
                <td>
                  {row.effect}
                  {row.notes ? ` ${row.notes}` : ""}
                </td>
                <td>{row.cures}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
