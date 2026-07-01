import { useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import { MAP_REGIONS, type MapRegion } from "../data/mapRegions";

const HOENN_MAP_SRC = assetUrl("maps/hoenn-map.png");

interface HoennMapProps {
  activeStepId?: string;
  onSelectRegion: (region: MapRegion) => void;
  categoryStepIds?: Set<string>;
}

export function HoennMap({ activeStepId, onSelectRegion, categoryStepIds }: HoennMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleRegions = MAP_REGIONS.filter((region) => {
    const count = region.stepIds.filter((id) => !categoryStepIds || categoryStepIds.has(id)).length;
    return count > 0;
  });

  const activeRegion =
    visibleRegions.find((r) => r.stepIds.includes(activeStepId ?? "")) ??
    visibleRegions.find((r) => r.id === hoveredId);

  return (
    <div className="hoenn-map">
      <div className="hoenn-map__stage">
        <img
          src={HOENN_MAP_SRC}
          alt="Map of the Hoenn region"
          className="hoenn-map__image"
          draggable={false}
        />
        <div className="hoenn-map__pins" aria-hidden={false}>
          {visibleRegions.map((region) => {
            const active = region.stepIds.includes(activeStepId ?? "");
            const hovered = hoveredId === region.id;
            const stepCount = region.stepIds.filter(
              (id) => !categoryStepIds || categoryStepIds.has(id),
            ).length;

            return (
              <button
                key={region.id}
                type="button"
                className={`hoenn-map__pin ${active ? "hoenn-map__pin--active" : ""} ${hovered ? "hoenn-map__pin--hover" : ""}`}
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
                onClick={() => onSelectRegion(region)}
                onMouseEnter={() => setHoveredId(region.id)}
                onMouseLeave={() => setHoveredId((id) => (id === region.id ? null : id))}
                onFocus={() => setHoveredId(region.id)}
                onBlur={() => setHoveredId((id) => (id === region.id ? null : id))}
                aria-label={`${region.label}, ${stepCount} guide ${stepCount === 1 ? "step" : "steps"}`}
              >
                <span className="hoenn-map__pin-dot" />
                {(active || hovered) && (
                  <span className="hoenn-map__pin-label">{region.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hoenn-map__footer">
        <p className="hoenn-map__hint">Click a marker to jump to guide steps for that area.</p>
        {activeRegion && (
          <div className="hoenn-map__card">
            <h3>{activeRegion.label}</h3>
            <p>
              {activeRegion.stepIds.filter((id) => !categoryStepIds || categoryStepIds.has(id)).length}{" "}
              {categoryStepIds ? "steps in this category" : "guide steps"} here
            </p>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => onSelectRegion(activeRegion)}>
              View steps
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
