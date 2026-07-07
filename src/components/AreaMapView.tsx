import { useMemo, useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import { AREA_MAPS } from "../data/areaMaps";
import { AREA_TRAINERS, type TrainerPoint } from "../data/mapTrainersGenerated";
import { POI_CATEGORIES, type MapPoint } from "../data/mapPoints";
import { MapZoomViewport } from "./MapZoomViewport";
import { TrainerDetailModal, TrainerPinHint } from "./TrainerDetailPanel";

function isTrainerPoint(p: MapPoint): p is TrainerPoint {
  return p.category === "trainer" && "spriteSheet" in p;
}

interface AreaMapViewProps {
  areaMapId: string;
  caption?: string;
  showLegend?: boolean;
  variant?: "default" | "lightbox";
  onClick?: () => void;
  className?: string;
}

/** Compact interactive area map for walkthrough step galleries. */
export function AreaMapView({
  areaMapId,
  caption,
  showLegend = false,
  variant = "default",
  onClick,
  className = "",
}: AreaMapViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);

  const area = useMemo(() => AREA_MAPS.find((a) => a.id === areaMapId) ?? null, [areaMapId]);

  const points = useMemo((): MapPoint[] => {
    if (!area) return [];
    const items: MapPoint[] = area.markers.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      x: m.x,
      y: m.y,
      desc: m.desc,
      note: area.name,
    }));
    return [...items, ...(AREA_TRAINERS[area.id] ?? [])];
  }, [area]);

  const activePoint = points.find((p) => p.id === activeId) ?? null;
  const maxH = variant === "lightbox" ? 720 : 360;
  const aspect = area ? area.width / area.height : 1;
  const inLightbox = variant === "lightbox";
  const isWide = aspect > 1.25;

  if (!area) return null;

  const label = caption ?? (area.floor ? `${area.name} — ${area.floor}` : area.name);
  const categories = POI_CATEGORIES.filter((c) => points.some((p) => p.category === c.id));

  const handlePinClick = (point: MapPoint, active: boolean) => {
    if (isTrainerPoint(point)) {
      setActiveId(point.id);
      setModalTrainer(point);
      return;
    }
    setModalTrainer(null);
    setActiveId(active ? null : point.id);
  };

  const pinLayer = points.map((point) => {
    const cat = POI_CATEGORIES.find((c) => c.id === point.category);
    const active = activeId === point.id;
    const trainer = isTrainerPoint(point);
    return (
      <button
        key={point.id}
        type="button"
        className={`hoenn-map__pin hoenn-map__pin--${point.category} ${active ? "is-active" : ""}`}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          ["--pin-color" as string]: cat?.color,
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handlePinClick(point, active);
        }}
        aria-label={point.name}
      >
        {trainer ? (
          <span
            className="hoenn-map__trainer-frame"
            style={{
              ["--trainer-frame" as string]: point.spriteFrame,
              ["--trainer-fw" as string]: point.spriteWidth,
              ["--trainer-fh" as string]: point.spriteHeight,
            }}
            aria-hidden="true"
          >
            <img
              src={assetUrl(point.spriteSheet)}
              alt=""
              className="hoenn-map__trainer-sprite"
              draggable={false}
            />
          </span>
        ) : (
          <span className="hoenn-map__pin-dot" />
        )}
        <span className="hoenn-map__pin-hint" aria-hidden="true">
          {trainer ? (
            <TrainerPinHint trainer={point} />
          ) : (
            <>
              <span className="hoenn-map__pin-cat" style={{ color: cat?.color }}>
                {cat?.label}
              </span>
              <span className="hoenn-map__pin-hint-name">{point.name}</span>
            </>
          )}
        </span>
        {!trainer && active && (
          <span className="hoenn-map__pin-tip" onClick={(e) => e.stopPropagation()}>
            <span className="hoenn-map__pin-cat" style={{ color: cat?.color }}>
              {cat?.label}
            </span>
            <strong>{point.name}</strong>
            {point.desc && <span className="hoenn-map__pin-desc">{point.desc}</span>}
          </span>
        )}
      </button>
    );
  });

  const mapFrame = (
    <div
      className="area-map-view__frame"
      style={{
        aspectRatio: `${area.width} / ${area.height}`,
        width: inLightbox ? "100%" : `min(100%, ${Math.round(aspect * maxH)}px)`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <img src={assetUrl(area.image)} alt={label} className="area-map-view__image" draggable={false} />
      {pinLayer}
    </div>
  );

  const sidebar =
    showLegend && categories.length > 0 ? (
      <>
        <ul className="area-map-view__legend" aria-label="Map markers">
          {categories.map((cat) => (
            <li key={cat.id}>
              <span className="hoenn-map__legend-swatch" style={{ background: cat.color }} />
              {cat.label}
              <span className="area-map-view__legend-count">
                {points.filter((p) => p.category === cat.id).length}
              </span>
            </li>
          ))}
        </ul>
        {inLightbox && <p className="map-zoom-viewport__hint">Pinch to zoom; drag to pan.</p>}
        {inLightbox && points.length > 0 && (
          <ul className="area-map-view__point-index" aria-label="All points of interest">
            {points.map((point) => {
              const cat = POI_CATEGORIES.find((c) => c.id === point.category);
              const active = activeId === point.id;
              return (
                <li key={point.id}>
                  <button
                    type="button"
                    className={`marker-index__btn ${active ? "marker-index__btn--active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinClick(point, active);
                    }}
                  >
                    <span className="marker-index__swatch" style={{ background: cat?.color }}>
                      {cat?.label.charAt(0)}
                    </span>
                    <span>
                      <strong>{point.name}</strong>
                      {point.desc && <small>{point.desc}</small>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </>
    ) : null;

  if (inLightbox) {
    return (
      <figure
        className={`area-map-view area-map-view--lightbox${isWide ? " area-map-view--wide" : ""} ${className}`}
      >
        <p className="area-map-view__lightbox-title">{label}</p>
        <div className="area-map-view__lightbox-body">
          <MapZoomViewport
            enabled
            contentKey={areaMapId}
            className="area-map-view__zoom"
            cropAspect={`${area.width} / ${area.height}`}
          >
            {mapFrame}
          </MapZoomViewport>
          {sidebar}
        </div>
        <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
      </figure>
    );
  }

  return (
    <figure
      className={`area-map-view area-map-view--${variant}${onClick ? " area-map-view--clickable" : ""} ${className}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {mapFrame}
      {sidebar}

      {activePoint && !isTrainerPoint(activePoint) && !showLegend && (
        <figcaption className="area-map-view__active">
          <span style={{ color: POI_CATEGORIES.find((c) => c.id === activePoint.category)?.color }}>
            {POI_CATEGORIES.find((c) => c.id === activePoint.category)?.label}
          </span>
          {" — "}
          {activePoint.name}
        </figcaption>
      )}

      <figcaption className="area-map-view__caption">{label}</figcaption>
      <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
    </figure>
  );
}
