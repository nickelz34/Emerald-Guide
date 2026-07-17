import { useMemo, useState, type FormEvent } from "react";
import {
  FEEBAS_FISHING_AREA_MAP_IDS,
  FEEBAS_FISHING_SECTIONS,
  FEEBAS_FISHING_SPOT_COUNT,
  FEEBAS_ACTIVE_SPOT_COUNT,
} from "../data/feebasFishingSpots";
import {
  FEEBAS_DEMO_SEED,
  feebasSpotLocalPercent,
  feebasSpotsForSeed,
  formatFeebasSeed,
  parseFeebasSeed,
} from "../data/feebasSeed";
import { AreaMapView } from "./AreaMapView";

const SECTION_TABS = FEEBAS_FISHING_SECTIONS.map((s, i) => ({
  ...s,
  areaMapId: FEEBAS_FISHING_AREA_MAP_IDS[i],
}));

/** Numbered Route 119 fishing-spot maps + Dewford-trend seed calculator. */
export function FeebasFishingMap({ className = "" }: { className?: string }) {
  const [section, setSection] = useState(0);
  const [seedInput, setSeedInput] = useState(formatFeebasSeed(FEEBAS_DEMO_SEED));
  const [appliedSeed, setAppliedSeed] = useState(FEEBAS_DEMO_SEED);

  const parsedSeed = useMemo(() => parseFeebasSeed(seedInput), [seedInput]);
  const seedError =
    seedInput.trim().length > 0 && parsedSeed == null
      ? "Enter a hex seed (e.g. 4A7C or 0x4A7C) or a decimal 0–65535."
      : null;

  const activeSpots = useMemo(() => feebasSpotsForSeed(appliedSeed), [appliedSeed]);
  const uniqueCount = useMemo(() => new Set(activeSpots.map((s) => s.id)).size, [activeSpots]);
  const active = SECTION_TABS[section] ?? SECTION_TABS[0];
  const spotsInSection = activeSpots.filter((s) => s.section === section);

  const extraMarkers = useMemo(
    () =>
      spotsInSection.map((spot) => {
        const { x, y } = feebasSpotLocalPercent(spot);
        return {
          id: `feebas-seed-${appliedSeed}-${spot.id}-${spot.x}-${spot.y}`,
          name: `Feebas spot ${spot.id}`,
          category: "wild" as const,
          x,
          y,
          desc: `Active for seed ${formatFeebasSeed(appliedSeed)}. Tile (${spot.x}, ${spot.y}). Fish any rod — about 50% Feebas on this tile.`,
        };
      }),
    [spotsInSection, appliedSeed],
  );

  const applySeed = (seed: number) => {
    setAppliedSeed(seed);
    setSeedInput(formatFeebasSeed(seed));
    const first = feebasSpotsForSeed(seed)[0];
    if (first) setSection(first.section);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (parsedSeed == null) return;
    applySeed(parsedSeed);
  };

  return (
    <section
      className={`feebas-map reference-table ${className}`.trim()}
      aria-label="Route 119 Feebas fishing spot map"
    >
      <h5 className="reference-table__title">Feebas tiles (Route 119)</h5>
      <p className="reference-table__lead">
        Emerald does <strong>not</strong> use six fixed Feebas tiles. Every surfable water tile
        (not waterfall) is a numbered fishing spot ({FEEBAS_FISHING_SPOT_COUNT} total). Exactly{" "}
        {FEEBAS_ACTIVE_SPOT_COUNT} of those IDs are active, chosen from Dewford’s trendy-phrase
        seed (<code>dewfordTrends[0].rand</code>). Change the phrase in Dewford to reshuffle. On an
        active tile, Feebas is about 50%; Surf never finds it.
      </p>

      <form className="feebas-map__seed" onSubmit={onSubmit}>
        <div className="feebas-map__seed-row">
          <label className="feebas-map__seed-label" htmlFor="feebas-seed-input">
            Dewford trend seed
          </label>
          <div className="feebas-map__seed-controls">
            <input
              id="feebas-seed-input"
              type="text"
              className="feebas-map__seed-input"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="0x4A7C or 19068"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={Boolean(seedError)}
              aria-describedby="feebas-seed-help"
            />
            <button
              type="submit"
              className="feebas-map__seed-apply"
              disabled={parsedSeed == null}
            >
              Show tiles
            </button>
            <button
              type="button"
              className="feebas-map__seed-demo"
              onClick={() => applySeed(FEEBAS_DEMO_SEED)}
            >
              Demo seed
            </button>
          </div>
        </div>
        <p id="feebas-seed-help" className="feebas-map__seed-help">
          Paste the u16 from your save’s Dewford trend RNG (<code>dewfordTrends[0].rand</code>) —
          hex or decimal. The trendy phrase text alone is not enough; the stored random value
          picks the six spots.
        </p>
        {seedError ? <p className="feebas-map__seed-error">{seedError}</p> : null}
      </form>

      <div className="feebas-map__results">
        <p className="feebas-map__results-lead">
          Active spots for <code>{formatFeebasSeed(appliedSeed)}</code>
          {uniqueCount < FEEBAS_ACTIVE_SPOT_COUNT
            ? ` (${uniqueCount} unique — the game can roll duplicate IDs)`
            : null}
          :
        </p>
        <ol className="feebas-map__demo-list">
          {activeSpots.map((spot, idx) => {
            const sec = FEEBAS_FISHING_SECTIONS[spot.section];
            const here = spot.section === section;
            return (
              <li
                key={`${spot.id}-${spot.x}-${spot.y}-${idx}`}
                className={here ? "feebas-map__demo-item--here" : undefined}
              >
                <button
                  type="button"
                  className="feebas-map__demo-jump"
                  onClick={() => setSection(spot.section)}
                >
                  Spot {spot.id}
                </button>
                <span>
                  ({spot.x}, {spot.y}) · {sec.label}
                  {here ? " · on this map" : ""}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="feebas-map__toolbar">
        <div className="feebas-map__tabs" role="tablist" aria-label="Route 119 section">
          {SECTION_TABS.map((tab) => {
            const count = activeSpots.filter((s) => s.section === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={section === tab.id}
                className={`feebas-map__tab${section === tab.id ? " feebas-map__tab--active" : ""}`}
                onClick={() => setSection(tab.id)}
              >
                {tab.label}
                {count > 0 ? ` · ${count}` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <AreaMapView
        areaMapId={active.areaMapId}
        caption={`Route 119 Feebas fishing spots — ${active.label}`}
        showLegend
        extraMarkers={extraMarkers}
      />

      {spotsInSection.length === 0 ? (
        <p className="feebas-map__demo-empty">
          No active Feebas spots in this section for the current seed — try another tab.
        </p>
      ) : null}

      <p className="encounter-legend">
        Yellow tiles = fishable spots (IDs match pokeemerald). Green wild pins mark the six active
        IDs for your seed. Spots 1–3 are inaccessible. Sweep with the Old Rod, or reshuffle the
        Dewford trend and enter the new seed.
      </p>
    </section>
  );
}
