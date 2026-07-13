import { useMemo, useState } from "react";
import { MAP_TRAINERS, type TrainerPoint } from "../data/mapTrainersGenerated";
import { TrainerDetailModal } from "./TrainerDetailPanel";

function formatMapId(mapId?: string): string | null {
  if (!mapId) return null;
  const raw = mapId.replace(/^MAP_/, "").replace(/_/g, " ").toLowerCase();
  const route = raw.match(/^route (\d+)$/);
  if (route) return `Route ${route[1]}`;
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

function dedupeRematchTrainers(trainers: TrainerPoint[]): TrainerPoint[] {
  const seen = new Map<string, TrainerPoint>();
  for (const trainer of trainers) {
    if (!trainer.rematchable || !trainer.trainerId) continue;
    const key = trainer.trainerId.replace(/_\d+$/, "");
    if (!seen.has(key)) seen.set(key, trainer);
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

interface MatchCallRematchPanelProps {
  className?: string;
}

/** Browse every PokéNav Match Call rematch trainer with full battle details. */
export function MatchCallRematchPanel({ className = "" }: MatchCallRematchPanelProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TrainerPoint | null>(null);

  const trainers = useMemo(() => dedupeRematchTrainers(MAP_TRAINERS), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return trainers;
    return trainers.filter((trainer) => {
      const location = formatMapId(trainer.mapId)?.toLowerCase() ?? "";
      return (
        trainer.name.toLowerCase().includes(q) ||
        trainer.trainerClass.toLowerCase().includes(q) ||
        location.includes(q) ||
        (trainer.note?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [trainers, search]);

  return (
    <section
      className={`reference-table match-call-rematch ${className}`.trim()}
      aria-label="Match Call rematch trainers"
    >
      <h5 className="reference-table__title">Match Call rematch trainers ({trainers.length})</h5>
      <p className="reference-table__lead">
        After becoming Champion, registered trainers call for rematches with higher levels and revised
        teams. Schedules depend on place and time in-game — use this list to plan money and EXP
        farming routes.
      </p>
      <input
        type="search"
        className="match-call-rematch__search"
        placeholder="Filter by name, class, or route…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Filter rematch trainers"
      />
      <div className="reference-table__scroll">
        <ul className="match-call-rematch__list">
          {filtered.map((trainer) => {
            const location = formatMapId(trainer.mapId);
            return (
              <li key={trainer.trainerId ?? trainer.id}>
                <button
                  type="button"
                  className="match-call-rematch__btn"
                  onClick={() => setSelected(trainer)}
                >
                  <span className="match-call-rematch__name">{trainer.name}</span>
                  <span className="match-call-rematch__meta">
                    {trainer.trainerClass}
                    {location ? ` · ${location}` : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {filtered.length === 0 && (
        <p className="match-call-rematch__empty">No trainers match your filter.</p>
      )}
      {selected && <TrainerDetailModal trainer={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
