import { EMERALD_HM_CATALOG, EMERALD_TM_CATALOG } from "../data/tmHmCatalog";

interface TmHmTableProps {
  className?: string;
}

/** Full Emerald TM01–TM50 and HM01–HM08 obtain catalog. */
export function TmHmTable({ className = "" }: TmHmTableProps) {
  return (
    <section
      className={`reference-table tm-hm-table ${className}`.trim()}
      aria-label="TM and HM reference"
    >
      <h5 className="reference-table__title">TMs & HMs in Emerald</h5>
      <p className="reference-table__lead">
        Generation III TMs are reusable. HMs are reusable too, but field use waits for the matching
        gym badge — the move still works in battle as soon as you teach it.
      </p>

      <h6 className="reference-table__subtitle">Technical Machines (TM01–TM50)</h6>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">TM</th>
              <th scope="col">Move</th>
              <th scope="col">Type</th>
              <th scope="col">Where you get it</th>
            </tr>
          </thead>
          <tbody>
            {EMERALD_TM_CATALOG.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.move}</td>
                <td>{row.type ?? "—"}</td>
                <td>
                  {row.locations.join(" · ")}
                  {row.notes ? ` (${row.notes})` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h6 className="reference-table__subtitle">Hidden Machines (HM01–HM08)</h6>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">HM</th>
              <th scope="col">Move</th>
              <th scope="col">Where you get it</th>
              <th scope="col">Field use after</th>
              <th scope="col">Field effect</th>
            </tr>
          </thead>
          <tbody>
            {EMERALD_HM_CATALOG.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.move}</td>
                <td>{row.locations.join(" · ")}</td>
                <td>
                  {row.fieldBadgeNumber != null
                    ? `Badge ${row.fieldBadgeNumber} — ${row.fieldBadge}`
                    : "—"}
                </td>
                <td>{row.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
