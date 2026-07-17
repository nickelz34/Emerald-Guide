import { useMemo, useState } from "react";
import {
  FEEBAS_FISHING_AREA_MAP_IDS,
  FEEBAS_FISHING_SECTIONS,
  FEEBAS_FISHING_SPOT_COUNT,
  FEEBAS_ACTIVE_SPOT_COUNT,
} from "../data/feebasFishingSpots";
import { FEEBAS_DEMO_SEED, feebasSpotsForSeed } from "../data/feebasSeed";
import { AreaMapView } from "./AreaMapView";

const SECTION_TABS = FEEBAS_FISHING_SECTIONS.map((s, i) => ({
  ...s,
  areaMapId: FEEBAS_FISHING_AREA_MAP_IDS[i],
}));

/** Numbered Route 119 fishing-spot maps + example Feebas tile set. */
export function FeebasFishingMap({ className = "" }: { className?: string }) {
  const [section, setSection] = useState(0);
  const [showDemo, setShowDemo] = useState(true);

  const demoSpots = useMemo(() => feebasSpotsForSeed(FEEBAS_DEMO_SEED), []);
  const active = SECTION_TABS[section] ?? SECTION_TABS[0];
  const demoInSection = demoSpots.filter((s) => s.section === section);

  return (
    <section
      className={`feebas-map ${className}`.trim()}
      aria-label="Route 119 Feebas fishing spot map"
    >
      <h5 className="reference-table__subtitle">Feebas tiles (Route 119)</h5>
      <p className="reference-table__lead">
        Emerald does <strong>not</strong> use six fixed Feebas tiles. Every surfable water tile
        (not waterfall) is a numbered fishing spot ({FEEBAS_FISHING_SPOT_COUNT} total). Exactly{" "}
        {FEEBAS_ACTIVE_SPOT_COUNT} of those IDs are active, chosen from Dewford’s trendy-phrase
        seed. Change the phrase in Dewford to reshuffle. On an active tile, Feebas is about 50%;
        Surf never finds it.
      </p>

      <div className="feebas-map__toolbar">
        <div className="feebas-map__tabs" role="tablist" aria-label="Route 119 section">
          {SECTION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={section === tab.id}
              className={`feebas-map__tab${section === tab.id ? " feebas-map__tab--active" : ""}`}
              onClick={() => setSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <label className="feebas-map__demo-toggle">
          <input
            type="checkbox"
            checked={showDemo}
            onChange={(e) => setShowDemo(e.target.checked)}
          />
          Show example active spots (demo seed)
        </label>
      </div>

      <AreaMapView
        areaMapId={active.areaMapId}
        caption={`Route 119 Feebas fishing spots — ${active.label}`}
        showLegend
      />

      {showDemo ? (
        <div className="feebas-map__demo">
          <p className="feebas-map__demo-lead">
            Example only — seed <code>0x{FEEBAS_DEMO_SEED.toString(16).toUpperCase()}</code> (not
            your save). Find these spot numbers on the yellow tiles above. Your six IDs will differ
            until you reshuffle Dewford’s trendy phrase.
          </p>
          <ol className="feebas-map__demo-list">
            {demoSpots.map((spot) => {
              const sec = FEEBAS_FISHING_SECTIONS[spot.section];
              const here = spot.section === section;
              return (
                <li
                  key={`${spot.id}-${spot.x}-${spot.y}`}
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
          {demoInSection.length === 0 ? (
            <p className="feebas-map__demo-empty">
              No example Feebas spots in this section — switch tabs above.
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="encounter-legend">
        Yellow tiles = fishable spots (IDs match pokeemerald). Spots 1–3 are inaccessible. Sweep
        with the Old Rod, or reshuffle the Dewford trend and try again.
      </p>
    </section>
  );
}
