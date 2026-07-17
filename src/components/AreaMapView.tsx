import { useMemo, useState, type CSSProperties } from "react";
import { assetUrl } from "../lib/assetUrl";
import { AREA_MAPS } from "../data/areaMaps";
import { formatAreaMapCaption } from "../data/areaMapLabels";
import { AREA_MAP_ENTITIES } from "../data/areaMapEntitiesGenerated";
import { AREA_MAP_CUTSCENE_ENTITIES, hasOwSprite, isBakedCutscenePoint } from "../data/areaMapCutsceneEntities";
import { AREA_MAP_ENTRANCES } from "../data/areaMapEntrancesGenerated";
import { GYM_MAP_ENTITIES } from "../data/gymMapEntitiesGenerated";
import { AREA_TRAINERS, type TrainerPoint } from "../data/mapTrainersGenerated";
import { POI_CATEGORIES, type MapPoint } from "../data/mapPoints";
import { MapZoomViewport } from "./MapZoomViewport";
import { MapPinVisual, isTrainerPoint, pinSpriteStyle, portraitSpriteStyle } from "./MapPinVisual";
import { TrainerDetailModal, TrainerPinHint } from "./TrainerDetailPanel";
import { fitPinPopups } from "../lib/fitMapPopup";
import { formatItemDescription } from "../lib/itemText";

export type AreaMapExtraMarker = {
  id: string;
  name: string;
  category: MapPoint["category"];
  x: number;
  y: number;
  desc?: string;
  pinCode?: string;
  markerStyle?: MapPoint["markerStyle"];
  tileW?: number;
  tileH?: number;
};

interface AreaMapViewProps {
  areaMapId: string;
  caption?: string;
  showLegend?: boolean;
  variant?: "default" | "lightbox";
  onClick?: () => void;
  className?: string;
  /** Extra pins merged on top of the area’s built-in markers (e.g. Feebas seed results). */
  extraMarkers?: AreaMapExtraMarker[];
  /** When true, omit the area’s baked markers (landmarks / demo pins). */
  hideBuiltInMarkers?: boolean;
  /**
   * Enable pinch / scroll / drag zoom in the inline (non-lightbox) preview.
   * Used by the Feebas fishing maps.
   */
  interactive?: boolean;
  /** Override preview max height (px). Ignored in lightbox. */
  previewMaxH?: number;
  /** Pan/zoom the viewport to this content percent (interactive / lightbox). */
  focusPercent?: { x: number; y: number } | null;
  /** Re-run focus when this key changes (e.g. selected Feebas spot id). */
  focusKey?: string | number;
  /** Show +/- zoom controls on the viewport. */
  showZoomControls?: boolean;
  /**
   * Zoom by resizing native map pixels (nearest-neighbor) instead of CSS scale.
   * Keeps baked Feebas spot numbers sharp.
   */
  crispPixelZoom?: boolean;
}

/** Compact interactive area map for walkthrough step galleries. */
export function AreaMapView({
  areaMapId,
  caption,
  showLegend = false,
  variant = "default",
  onClick,
  className = "",
  extraMarkers,
  hideBuiltInMarkers = false,
  interactive = false,
  previewMaxH,
  focusPercent = null,
  focusKey,
  showZoomControls = false,
  crispPixelZoom = false,
}: AreaMapViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);

  const area = useMemo(() => AREA_MAPS.find((a) => a.id === areaMapId) ?? null, [areaMapId]);

  const points = useMemo((): MapPoint[] => {
    if (!area) return [];
    const toPoint = (m: {
      id: string;
      name: string;
      category: MapPoint["category"];
      x: number;
      y: number;
      desc?: string;
      code?: string;
      pinCode?: string;
      markerStyle?: MapPoint["markerStyle"];
      tileW?: number;
      tileH?: number;
    }): MapPoint => ({
      id: m.id,
      name: m.name,
      category: m.category,
      x: m.x,
      y: m.y,
      desc: m.desc ? formatItemDescription(m.desc) : m.desc,
      note: area.name,
      pinCode: m.pinCode ?? m.code,
      markerStyle: m.markerStyle,
      tileW: m.tileW,
      tileH: m.tileH,
    });
    const items: MapPoint[] = [
      ...(hideBuiltInMarkers ? [] : area.markers.map(toPoint)),
      ...(hideBuiltInMarkers ? [] : (AREA_MAP_ENTRANCES[area.id] ?? []).map(toPoint)),
      ...(extraMarkers ?? []).map(toPoint),
    ];
    const seen = new Set<string>();
    const sprites: MapPoint[] = [];
    if (!hideBuiltInMarkers) {
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
    }
    return [...items, ...sprites];
  }, [area, extraMarkers, hideBuiltInMarkers]);

  const activePoint = points.find((p) => p.id === activeId) ?? null;
  const maxH = previewMaxH ?? (variant === "lightbox" ? 720 : 360);
  const aspect = area ? area.width / area.height : 1;
  const inLightbox = variant === "lightbox";
  const zoomEnabled = inLightbox || interactive;
  const isWide = aspect > 1.25;
  /** Petalburg Gym etc. — height≫width; aspect×maxH collapses to a useless strip. */
  const isTall = aspect > 0 && aspect < 0.4;
  const crispContentSize = useMemo(
    () =>
      crispPixelZoom && area
        ? { width: area.width, height: area.height }
        : null,
    [area, crispPixelZoom],
  );

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
    const isTile = point.markerStyle === "tile";
    return (
      <button
        key={point.id}
        type="button"
        className={`hoenn-map__pin ${
          isTile
            ? "hoenn-map__pin--tile"
            : baked
              ? "hoenn-map__pin--baked-cutscene"
              : `hoenn-map__pin--${point.category}${
                  trainer || owSprite ? " hoenn-map__pin--ow-sprite" : ""
                }`
        } ${point.pinCode && !isTile ? "has-code" : ""} ${active ? "is-active" : ""}`}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          ["--pin-color" as string]: cat?.color,
          ...(isTile
            ? {
                ["--tile-w" as string]: `${point.tileW ?? 2.5}%`,
                ["--tile-h" as string]: `${point.tileH ?? 2.5}%`,
              }
            : baked
              ? {}
              : pinSpriteStyle(point)),
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
        {isTile ? (
          <span className="hoenn-map__tile-label" aria-hidden="true">
            {point.pinCode ?? ""}
          </span>
        ) : (
          !baked && <MapPinVisual point={point} />
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
      className={`area-map-view__frame${crispPixelZoom && zoomEnabled ? " area-map-view__frame--crisp" : ""}`}
      style={
        crispPixelZoom && zoomEnabled
          ? {
              width: "100%",
              height: "100%",
              aspectRatio: "unset",
            }
          : zoomEnabled
            ? isTall
              ? { width: "100%" }
              : {
                  width: "100%",
                  height: "auto",
                  aspectRatio: `${area.width} / ${area.height}`,
                }
            : isTall
              ? {
                  width: "100%",
                  maxWidth: "100%",
                  height: maxH,
                  aspectRatio: "unset",
                }
              : {
                  aspectRatio: `${area.width} / ${area.height}`,
                  width: `min(100%, ${Math.round(aspect * maxH)}px)`,
                }
      }
      onClick={
        inLightbox
          ? (e) => e.stopPropagation()
          : onClick && !interactive
            ? (e) => {
                e.stopPropagation();
                onClick();
              }
            : undefined
      }
    >
      <img
        src={assetUrl(area.image)}
        alt={label}
        width={crispPixelZoom ? area.width : undefined}
        height={crispPixelZoom ? area.height : undefined}
        className={`area-map-view__image${isTall && !zoomEnabled ? " area-map-view__image--tall-preview" : ""}${
          crispPixelZoom && zoomEnabled ? " area-map-view__image--crisp" : ""
        }`}
        decoding="async"
        draggable={false}
      />
      {pinLayer}
    </div>
  );

  const zoomViewport = zoomEnabled ? (
    <MapZoomViewport
      enabled
      contentKey={areaMapId}
      className={`area-map-view__zoom${interactive && !inLightbox ? " area-map-view__zoom--inline" : ""}`}
      cropAspect={`${area.width} / ${area.height}`}
      focusPercent={focusPercent}
      focusKey={focusKey}
      showControls={showZoomControls || interactive}
      crispContentSize={crispContentSize}
    >
      {mapFrame}
    </MapZoomViewport>
  ) : (
    mapFrame
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
        {zoomEnabled && <p className="map-zoom-viewport__hint">Scroll or pinch to zoom; drag to pan.</p>}
        {inLightbox && points.length > 0 && (
          <ul className="area-map-view__point-index" aria-label="All points of interest">
            {points.map((point) => {
              const cat = POI_CATEGORIES.find((c) => c.id === point.category);
              const active = activeId === point.id;
              const thumb = hasOwSprite(point) || isTrainerPoint(point);
              const isTile = point.markerStyle === "tile";
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
                    {isTile ? (
                      <span className="marker-index__swatch marker-index__swatch--tile" aria-hidden="true">
                        {point.pinCode ?? cat?.label.charAt(0)}
                      </span>
                    ) : thumb ? (
                      <span
                        className="marker-index__sprite"
                        style={portraitSpriteStyle(point) as CSSProperties}
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
        className={`area-map-view area-map-view--lightbox${isWide ? " area-map-view--wide" : ""}${
          isTall ? " area-map-view--tall" : ""
        } ${className}`}
      >
        <p className="area-map-view__lightbox-title">{label}</p>
        <div className="area-map-view__lightbox-body">
          {zoomViewport}
          {sidebar}
        </div>
        <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
      </figure>
    );
  }

  return (
    <figure
      className={`area-map-view area-map-view--${variant}${interactive ? " area-map-view--interactive" : ""}${
        onClick && !interactive ? " area-map-view--clickable" : ""
      } ${className}`}
      style={interactive ? { ["--area-map-inline-max-h" as string]: `${maxH}px` } : undefined}
      onClick={onClick && !interactive ? onClick : undefined}
      onKeyDown={
        onClick && !interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick && !interactive ? "button" : undefined}
      tabIndex={onClick && !interactive ? 0 : undefined}
    >
      {interactive ? (
        <div className="area-map-view__interactive-body">
          {zoomViewport}
          {sidebar}
        </div>
      ) : (
        <>
          {zoomViewport}
          {sidebar}
        </>
      )}

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
