import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { assetUrl } from "../lib/assetUrl";
import { HOENN_MAP_W, HOENN_MAP_H, type MapCrop } from "../data/mapCrops";
import { getCropMarkers } from "../data/cropMarkers";
import { MARKER_LEGEND, type MarkerType } from "../data/mapAnnotations";
import { MapMarkerLegend } from "./AnnotatedScreenshot";

const HOENN_MAP_SRC = assetUrl("maps/hoenn-map.png");

interface HoennCropProps {
  crop: MapCrop;
  caption?: string;
  areaId?: string;
  showLegend?: boolean;
  variant?: "default" | "lightbox";
  onClick?: () => void;
  className?: string;
}

/**
 * Renders a "window" into the shared true-scale Hoenn map, framed to a single
 * town or route. Uses the one big map image (already cached by the map modal)
 * and CSS background sizing/position — no separate per-event image needed.
 */
export function HoennCrop({
  crop,
  caption,
  areaId,
  showLegend = false,
  variant = "default",
  onClick,
  className = "",
}: HoennCropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hiddenTypes, setHiddenTypes] = useState<Set<MarkerType>>(() => new Set());

  const markers = useMemo(() => getCropMarkers(crop, areaId), [crop, areaId]);

  const visibleMarkers = useMemo(
    () => markers.filter((m) => !hiddenTypes.has(m.type)),
    [markers, hiddenTypes],
  );

  const usedTypes = useMemo(() => {
    const s = new Set<MarkerType>();
    markers.forEach((m) => s.add(m.type));
    return s;
  }, [markers]);

  const activeMarker = markers.find((m) => m.id === activeId) ?? null;
  const legendEntry = (type: MarkerType) => MARKER_LEGEND.find((e) => e.type === type)!;
  const activeStyle = activeMarker ? legendEntry(activeMarker.type) : null;

  const cropWpx = (crop.w / 100) * HOENN_MAP_W;
  const cropHpx = (crop.h / 100) * HOENN_MAP_H;
  const cropXpx = (crop.x / 100) * HOENN_MAP_W;
  const cropYpx = (crop.y / 100) * HOENN_MAP_H;

  const denomX = HOENN_MAP_W - cropWpx;
  const denomY = HOENN_MAP_H - cropHpx;

  const posX = denomX > 0 ? (cropXpx / denomX) * 100 : 0;
  const posY = denomY > 0 ? (cropYpx / denomY) * 100 : 0;
  const sizeX = (HOENN_MAP_W / cropWpx) * 100;
  const sizeY = (HOENN_MAP_H / cropHpx) * 100;

  const inLightbox = variant === "lightbox";
  const aspect = cropWpx / cropHpx;
  const maxH = inLightbox ? 640 : 460;

  const frameStyle: CSSProperties = {
    aspectRatio: `${cropWpx} / ${cropHpx}`,
    width: `min(100%, ${Math.round(aspect * maxH)}px)`,
    backgroundImage: `url(${HOENN_MAP_SRC})`,
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: "no-repeat",
  };

  const interactive = Boolean(onClick);
  const toggleType = (type: MarkerType) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
    setActiveId(null);
  };

  const onKeyDown = interactive
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }
    : undefined;

  const markerLayer =
    visibleMarkers.length > 0 ? (
      <div className="hoenn-crop__markers" aria-hidden={false}>
        {visibleMarkers.map((marker) => {
          const style = legendEntry(marker.type);
          const active = activeId === marker.id;
          return (
            <button
              key={marker.id}
              type="button"
              className={`map-marker map-marker--${marker.type} ${active ? "map-marker--active" : ""}`}
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                background: style.color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(active ? null : marker.id);
              }}
              aria-label={`${style.label}: ${marker.label}`}
              title={marker.label}
            >
              <span className="map-marker__symbol">{style.symbol}</span>
            </button>
          );
        })}
      </div>
    ) : null;

  const markerDetail =
    activeMarker && activeStyle ? (
      <div className={`map-marker-detail ${inLightbox ? "" : "map-marker-detail--inline"}`} role="status">
        <span className="map-marker-detail__swatch" style={{ background: activeStyle.color }}>
          {activeStyle.symbol}
        </span>
        <div className="map-marker-detail__body">
          <strong>{activeMarker.label}</strong>
          <span className="map-marker-detail__type">{activeStyle.label}</span>
          {activeMarker.detail && <p>{activeMarker.detail}</p>}
        </div>
      </div>
    ) : null;

  const sidebar =
    showLegend && markers.length > 0 ? (
      <div className="hoenn-crop__sidebar">
        <MapMarkerLegend
          hiddenTypes={hiddenTypes}
          onToggleType={toggleType}
          usedTypes={usedTypes}
          showZoomHint={false}
        />
        <ul className="marker-index" aria-label="All points of interest">
          {markers.map((marker) => {
            const style = legendEntry(marker.type);
            if (hiddenTypes.has(marker.type)) return null;
            return (
              <li key={marker.id}>
                <button
                  type="button"
                  className={`marker-index__btn ${activeId === marker.id ? "marker-index__btn--active" : ""}`}
                  onClick={() => setActiveId(activeId === marker.id ? null : marker.id)}
                >
                  <span className="marker-index__swatch" style={{ background: style.color }}>
                    {style.symbol}
                  </span>
                  <span>
                    <strong>{marker.label}</strong>
                    {marker.detail && <small>{marker.detail}</small>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    ) : null;

  const frame = (
    <div
      className={`hoenn-crop__frame ${interactive ? "hoenn-crop__frame--clickable" : ""}`}
      style={frameStyle}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Enlarge ${caption ?? "map"}` : undefined}
    >
      {markerLayer}
    </div>
  );

  if (inLightbox) {
    return (
      <figure className={`hoenn-crop hoenn-crop--lightbox ${className}`}>
        {(caption || areaId) && <p className="hoenn-crop__lightbox-title">{caption}</p>}
        {markerDetail}
        <div className="hoenn-crop__lightbox-body">
          {frame}
          {sidebar}
        </div>
      </figure>
    );
  }

  return (
    <figure className={`hoenn-crop ${className}`}>
      {frame}
      {markerDetail}
      {caption && <figcaption className="hoenn-crop__caption">{caption}</figcaption>}
      {markers.length > 0 && !showLegend && (
        <span className="hoenn-crop__badge">{visibleMarkers.length} markers</span>
      )}
    </figure>
  );
}
