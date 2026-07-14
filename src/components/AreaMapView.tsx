import { useMemo, useState, type CSSProperties } from "react";
import { assetUrl } from "../lib/assetUrl";
import { AREA_MAPS } from "../data/areaMaps";
import { formatAreaMapCaption } from "../data/areaMapLabels";
import { AREA_MAP_ENTITIES } from "../data/areaMapEntitiesGenerated";
import { AREA_MAP_CUTSCENE_ENTITIES, hasOwSprite, isBakedCutscenePoint } from "../data/areaMapCutsceneEntities";
import { GYM_MAP_ENTITIES } from "../data/gymMapEntitiesGenerated";
import { AREA_TRAINERS, type TrainerPoint } from "../data/mapTrainersGenerated";
import { POI_CATEGORIES, type MapPoint } from "../data/mapPoints";
import { MapZoomViewport } from "./MapZoomViewport";
import { MapPinVisual, isTrainerPoint, pinSpriteStyle } from "./MapPinVisual";
import { TrainerDetailModal, TrainerPinHint } from "./TrainerDetailPanel";
import { fitPinPopups } from "../lib/fitMapPopup";
import { formatItemDescription } from "../lib/itemText";

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
      desc: m.desc ? formatItemDescription(m.desc) : m.desc,
      note: area.name,
    }));
    const seen = new Set<string>();
    const sprites: MapPoint[] = [];
    for (const src of [
      AREA_MAP_CUTSCENE_ENTITIES[area.id],
      AREA_MAP_ENTITIES[area.id],
      GYM_MAP_ENTITIES[area.id],
      AREA_TRAINERS[area.id],
    ]) {
      if (!src) continue;
      for (const p of src) {
        const key =
          ("trainerId" in p && p.trainerId) ||
          `${("script" in p && p.script) || p.name}-${p.x}-${p.y}`;
        if (seen.has(String(key))) continue;
        seen.add(String(key));
        sprites.push(p);
      }
    }
    return [...items, ...sprites];
  }, [area]);

  const activePoint = points.find((p) => p.id === activeId) ?? null;
  const maxH = variant === "lightbox" ? 720 : 360;
  const aspect = area ? area.width / area.height : 1;
  const inLightbox = variant === "lightbox";
  const isWide = aspect > 1.25;

  if (!area) return null;

  const label = caption ?? formatAreaMapCaption(area);
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
    const owSprite = hasOwSprite(point);
    const baked = isBakedCutscenePoint(point);
    return (
      <button
        key={point.id}
        type="button"
        className={`hoenn-map__pin hoenn-map__pin--${point.category} ${
          baked ? "hoenn-map__pin--baked-cutscene" : trainer || owSprite ? "hoenn-map__pin--ow-sprite" : ""
        } ${active ? "is-active" : ""}`}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          ["--pin-color" as string]: cat?.color,
          ...(baked ? {} : pinSpriteStyle(point)),
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          const pin = e.currentTarget;
          const viewport = pin.closest(".map-zoom-viewport");
          requestAnimationFrame(() => fitPinPopups(pin, viewport));
        }}
        onFocus={(e) => {
          const pin = e.currentTarget;
          const viewport = pin.closest(".map-zoom-viewport");
          requestAnimationFrame(() => fitPinPopups(pin, viewport));
        }}
        onClick={(e) => {
          e.stopPropagation();
          handlePinClick(point, active);
          const pin = e.currentTarget;
          const viewport = pin.closest(".map-zoom-viewport");
          requestAnimationFrame(() => fitPinPopups(pin, viewport));
        }}
        aria-label={point.name}
      >
        {!baked && <MapPinVisual point={point} />}
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
      style={
        inLightbox
          ? { width: "100%", height: "100%" }
          : {
              aspectRatio: `${area.width} / ${area.height}`,
              width: `min(100%, ${Math.round(aspect * maxH)}px)`,
            }
      }
      onClick={
        inLightbox
          ? (e) => e.stopPropagation()
          : onClick
            ? (e) => {
                e.stopPropagation();
                onClick();
              }
            : undefined
      }
    >
      <img src={assetUrl(area.image)} alt={label} className="area-map-view__image" decoding="async" draggable={false} />
      {pinLayer}
    </div>
  );

  const sidebar =
    showLegend && categories.length > 0 ? (
      <div className="area-map-view__sidebar">
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
              const thumb = hasOwSprite(point) || isTrainerPoint(point);
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
                    {thumb ? (
                      <span
                        className="marker-index__sprite"
                        style={pinSpriteStyle(point) as CSSProperties}
                        aria-hidden="true"
                      >
                        <MapPinVisual point={point} />
                      </span>
                    ) : (
                      <span className="marker-index__swatch" style={{ background: cat?.color }}>
                        {cat?.label.charAt(0)}
                      </span>
                    )}
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
      </div>
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
