import type { GuideCustomTable } from "../types";

interface GuideCustomTablesProps {
  tables?: GuideCustomTable[];
}

export function GuideCustomTables({ tables }: GuideCustomTablesProps) {
  if (!tables?.length) return null;

  return (
    <div className="guide-tables">
      {tables.map((table) => (
        <section key={table.id} className="guide-tables__table" aria-label={table.title}>
          {table.title ? <h3 className="guide-tables__title">{table.title}</h3> : null}
          <div className="guide-tables__scroll">
            <table>
              <thead>
                <tr>
                  {table.headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.id}>
                    {table.headers.map((_, i) => (
                      <td key={i}>{row.cells[i] ?? ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
