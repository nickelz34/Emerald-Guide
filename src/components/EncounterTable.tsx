import { useMemo, useState } from "react";
import type { PokemonEncounter, TimeSlot, EncounterMethod } from "../types";
import { TIME_LABELS, METHOD_LABELS } from "../types";
import { getAreaData, getAreasForStep } from "../data/areaData";
import { getAreaIdForEncounterStep } from "../data/encounters";
import { assetUrl } from "../lib/assetUrl";
import { AnnotatedScreenshot } from "./AnnotatedScreenshot";

interface EncounterTableProps {
  areaIds: string[];
  compact?: boolean;
  showScreenshots?: boolean;
}

const TIME_ORDER: TimeSlot[] = ["any", "morning", "day", "night"];

function timeBadgeClass(time: TimeSlot): string {
  return `encounter-time encounter-time--${time}`;
}

export function EncounterTable({ areaIds, compact, showScreenshots = true }: EncounterTableProps) {
  const [timeFilter, setTimeFilter] = useState<TimeSlot | "all">("all");
  const [methodFilter, setMethodFilter] = useState<EncounterMethod | "all">("all");
  const [search, setSearch] = useState("");

  const areas = useMemo(
    () => areaIds.map((id) => ({ id, data: getAreaData(id) })).filter((a) => a.data),
    [areaIds],
  );

  const allEncounters = useMemo(() => {
    const rows: { areaId: string; areaName: string; enc: PokemonEncounter }[] = [];
    for (const { id, data } of areas) {
      if (!data) continue;
      const label = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      for (const enc of data.encounters) {
        rows.push({ areaId: id, areaName: label, enc });
      }
    }
    return rows;
  }, [areas]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allEncounters.filter(({ enc }) => {
      if (timeFilter !== "all" && enc.time !== "any" && enc.time !== timeFilter) return false;
      if (methodFilter !== "all" && enc.method !== methodFilter) return false;
      if (q && !enc.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allEncounters, timeFilter, methodFilter, search]);

  const methods = useMemo(() => {
    const set = new Set<EncounterMethod>();
    allEncounters.forEach(({ enc }) => set.add(enc.method));
    return [...set];
  }, [allEncounters]);

  if (areas.length === 0) return null;

  const hasEncounters = allEncounters.length > 0;

  return (
    <div className={`encounter-panel ${compact ? "encounter-panel--compact" : ""}`}>
      {areas.map(({ id, data }) => {
        if (!data) return null;
        const shot = data.screenshot;
        return (
          <div key={id} className="area-block">
            {areas.length > 1 && <h4 className="area-block__title">{id.replace(/-/g, " ")}</h4>}
            {showScreenshots && shot && (
              <AnnotatedScreenshot
                imageSrc={assetUrl(`screenshots/${shot}`)}
                areaId={id}
                showLegend
              />
            )}
            {data.secrets && data.secrets.length > 0 && (
              <div className="area-block__secrets">
                <strong>Secrets & hidden items</strong>
                <ul>
                  {data.secrets.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.tips && data.tips.length > 0 && (
              <div className="area-block__tips">
                <strong>Area tips</strong>
                <ul>
                  {data.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {hasEncounters && (
        <>
          {!compact && (
            <div className="encounter-filters">
              <input
                type="search"
                className="encounter-filters__search"
                placeholder="Filter Pokémon…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeSlot | "all")}
                aria-label="Time of day"
              >
                <option value="all">All times</option>
                {TIME_ORDER.map((t) => (
                  <option key={t} value={t}>
                    {TIME_LABELS[t]}
                  </option>
                ))}
              </select>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as EncounterMethod | "all")}
                aria-label="Encounter method"
              >
                <option value="all">All methods</option>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="encounter-table-wrap">
            <table className="encounter-table">
              <thead>
                <tr>
                  {areas.length > 1 && <th>Area</th>}
                  <th>Pokémon</th>
                  <th>Level</th>
                  <th>Time</th>
                  <th>Method</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={areas.length > 1 ? 6 : 5} className="encounter-table__empty">
                      No matches for current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map(({ areaName, enc }, i) => (
                    <tr key={`${areaName}-${enc.name}-${enc.method}-${i}`}>
                      {areas.length > 1 && <td>{areaName}</td>}
                      <td>
                        <span className="encounter-name">{enc.name}</span>
                        {enc.notes && <span className="encounter-note">{enc.notes}</span>}
                      </td>
                      <td>{enc.level}</td>
                      <td>
                        <span className={timeBadgeClass(enc.time)}>{TIME_LABELS[enc.time]}</span>
                      </td>
                      <td>{METHOD_LABELS[enc.method]}</td>
                      <td>{enc.rate ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="encounter-legend">
            Gen 3 times: Morning 4:00–9:59 · Day 10:00–19:59 · Night 20:00–3:59
          </p>
        </>
      )}
    </div>
  );
}

interface StepEncountersProps {
  stepId: string;
}

/** Show encounters for a walkthrough/secret step via STEP_AREA_MAP. */
export function StepEncounters({ stepId }: StepEncountersProps) {
  const areaIds = getAreasForStep(stepId);
  if (areaIds.length === 0) return null;
  return (
    <div className="step-encounters">
      <h4 className="step-encounters__title">Wild Pokémon & area guide</h4>
      <EncounterTable areaIds={areaIds} showScreenshots={false} />
    </div>
  );
}

/** Show encounters for an encounter-category step. */
export function EncounterStepPanel({ stepId }: { stepId: string }) {
  const areaId = getAreaIdForEncounterStep(stepId);
  if (!areaId) return null;
  return <EncounterTable areaIds={[areaId]} />;
}
