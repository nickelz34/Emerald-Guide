import { SCOTT_SIGHTINGS, scottBpBonus } from "../data/scottSightings";

interface ScottSightingsPanelProps {
  className?: string;
}

/** Checklist of every Scott conversation for the Frontier BP bonus. */
export function ScottSightingsPanel({ className = "" }: ScottSightingsPanelProps) {
  const mandatory = SCOTT_SIGHTINGS.filter((s) => s.mandatory).length;

  return (
    <section className={`reference-table scott-sightings ${className}`.trim()} aria-label="Scott sightings checklist">
      <h5 className="reference-table__title">Scott sightings checklist (13 total)</h5>
      <p className="reference-table__lead">
        Talk to Scott at every location below during the main game. On your first visit to his house at
        the Battle Frontier, he awards{" "}
        <strong>1–4 BP total</strong> depending on how many you found (5 → 1 BP, 6–8 → 2, 9–12 → 3, all
        13 → 4). {mandatory} encounters are mandatory for story progression; the rest can be missed
        permanently.
      </p>
      <ol className="scott-sightings__list">
        {SCOTT_SIGHTINGS.map((sighting) => (
          <li key={sighting.id} className="scott-sightings__item">
            <span className="scott-sightings__num">{sighting.id}.</span>
            <span className="scott-sightings__body">
              <strong>{sighting.location}</strong>
              <span className="scott-sightings__timing">{sighting.timing}</span>
              {sighting.mandatory ? (
                <span className="scott-sightings__tag scott-sightings__tag--mandatory">Story</span>
              ) : (
                <span className="scott-sightings__tag">Optional</span>
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="scott-sightings__footer">
        All 13 found → {scottBpBonus(13)} BP at Scott&apos;s house. Missing optional sightings lowers the
        bonus — there is no separate 64 BP payout.
      </p>
    </section>
  );
}
