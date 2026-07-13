import { useMemo, useState } from "react";
import { MATCH_CALL_RULES, MATCH_CALL_SCHEDULE_ROWS } from "../data/matchCallSchedule";

interface MatchCallSchedulePanelProps {
  className?: string;
}

/** Reference for where each Match Call trainer rematches and how the system works. */
export function MatchCallSchedulePanel({ className = "" }: MatchCallSchedulePanelProps) {
  const [search, setSearch] = useState("");
  const [leadersOnly, setLeadersOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MATCH_CALL_SCHEDULE_ROWS.filter((row) => {
      if (leadersOnly && !row.isGymLeader) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.location.toLowerCase().includes(q) ||
        row.mapId.toLowerCase().includes(q)
      );
    });
  }, [search, leadersOnly]);

  return (
    <section
      className={`reference-table match-call-schedule ${className}`.trim()}
      aria-label="Match Call rematch schedule"
    >
      <h5 className="reference-table__title">
        Match Call rematch locations ({MATCH_CALL_SCHEDULE_ROWS.length})
      </h5>
      <p className="reference-table__lead">
        Emerald does not use fixed clock times — rematches depend on badge progress, map section,
        and random rolls. This table lists each registered trainer&apos;s rematch map from
        pokeemerald&apos;s <code>gRematchTable</code>.
      </p>

      <ul className="match-call-schedule__rules">
        {MATCH_CALL_RULES.map((rule) => (
          <li key={rule.title}>
            <strong>{rule.title}:</strong> {rule.body}
          </li>
        ))}
      </ul>

      <div className="match-call-schedule__toolbar">
        <input
          type="search"
          className="match-call-rematch__search"
          placeholder="Filter by trainer or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Filter rematch locations"
        />
        <label className="match-call-schedule__filter">
          <input
            type="checkbox"
            checked={leadersOnly}
            onChange={(e) => setLeadersOnly(e.target.checked)}
          />
          Gym Leaders &amp; Elite Four only
        </label>
      </div>

      <div className="reference-table__scroll">
        <table className="match-call-schedule__table">
          <thead>
            <tr>
              <th scope="col">Trainer</th>
              <th scope="col">Rematch map</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.trainerKey}>
                <td>
                  {row.name}
                  {row.isGymLeader && (
                    <span className="match-call-schedule__badge" title="Gym Leader or Elite Four">
                      GL
                    </span>
                  )}
                </td>
                <td>{row.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="match-call-rematch__empty">No trainers match your filter.</p>
      )}
    </section>
  );
}
