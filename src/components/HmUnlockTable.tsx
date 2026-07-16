import { HM_UNLOCK_TABLE, type HmUnlockRow } from "../data/hmUnlock";

interface HmUnlockTableProps {
  /** Highlight the row for this walkthrough step, if any. */
  highlightStepId?: string;
  className?: string;
  rows?: HmUnlockRow[];
}

/** Emerald HM obtain locations and badge gates for field use. */
export function HmUnlockTable({
  highlightStepId,
  className = "",
  rows = HM_UNLOCK_TABLE,
}: HmUnlockTableProps) {
  return (
    <section className={`reference-table hm-unlock-table ${className}`.trim()} aria-label="HM unlock reference">
      <h5 className="reference-table__title">HM unlock & field use (Emerald)</h5>
      <p className="reference-table__lead">
        You can receive an HM before its badge, but the move only works outside battle once you hold
        that badge.
      </p>
      <div className="reference-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">HM</th>
              <th scope="col">Move</th>
              <th scope="col">Where you get it</th>
              <th scope="col">Field use after</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.hm}
                className={highlightStepId === row.obtainStepId ? "reference-table__row--active" : undefined}
              >
                <td>{row.hm}</td>
                <td>{row.move}</td>
                <td>{row.obtainLocation}</td>
                <td>
                  Badge {row.fieldBadgeNumber} — {row.fieldBadge}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
