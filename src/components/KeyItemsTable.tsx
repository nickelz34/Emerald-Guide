import { KEY_ITEM_UNLOCKS } from "../data/keyItems";

interface KeyItemsTableProps {
  highlightStepId?: string;
  className?: string;
}

/** Key item unlock locations across Hoenn. */
export function KeyItemsTable({ highlightStepId, className = "" }: KeyItemsTableProps) {
  return (
    <section className={`reference-table key-items-table ${className}`.trim()} aria-label="Key items reference">
      <h5 className="reference-table__title">Key items & tools</h5>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Location</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {KEY_ITEM_UNLOCKS.map((item) => (
              <tr
                key={item.id}
                className={
                  highlightStepId === item.walkthroughStepId ? "reference-table__row--active" : undefined
                }
              >
                <td>{item.name}</td>
                <td>{item.obtainLocation}</td>
                <td>
                  {[item.prerequisite, item.note].filter(Boolean).join(" — ") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
