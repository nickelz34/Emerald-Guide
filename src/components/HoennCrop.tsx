import { useMemo, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { assetUrl } from "../lib/assetUrl";
import { HOENN_MAP_W, HOENN_MAP_H, type MapCrop } from "../data/mapCrops";
import { getCropMapPoints, isTrainerPoint } from "../data/cropMarkers";
import { POI_CATEGORIES, type MapPoint } from "../data/mapPoints";
import { MapZoomViewport } from "./MapZoomViewport";
import { TrainerDetailModal, TrainerPinHint } from "./TrainerDetailPanel";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

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
 * Renders a window into the shared true-scale Hoenn map with the same POI /
 * trainer pins and colors as the main interactive map modal.
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
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);

  const points = useMemo(() => getCropMapPoints(crop, areaId), [crop, areaId]);
  const activePoint = points.find((p) => p.id === activeId) ?? null;

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
  const maxH = inLightbox ? 720 : 460;
  const isWide = aspect > 1.25;

  const frameStyle: CSSProperties = {
    ...(inLightbox
      ? { width: "100%", height: "100%" }
      : {
          aspectRatio: `${cropWpx} / ${cropHpx}`,
          width: `min(100%, ${Math.round(aspect * maxH)}px)`,
        }),
    backgroundImage: `url(${HOENN_MAP_SRC})`,
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: "no-repeat",
  };

  const interactive = Boolean(onClick);
  const categories = POI_CATEGORIES.filter((c) => points.some((p) => p.category === c.id));

  const onKeyDown = interactive
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }
    : undefined;

  const handlePinClick = (point: MapPoint, e: MouseEvent) => {
    e.stopPropagation();
    if (isTrainerPoint(point)) {
      setActiveId(point.id);
      setModalTrainer(point);
      return;
    }
    setModalTrainer(null);
    setActiveId(activeId === point.id ? null : point.id);
  };

  const pinLayer = (
    <>
      {points.map((point) => {
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
            onClick={(e) => handlePinClick(point, e)}
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
      })}
    </>
  );

  const sidebar =
    showLegend && points.length > 0 ? (
      <div className="hoenn-crop__sidebar">
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
        {inLightbox && (
          <p className="map-zoom-viewport__hint">Pinch to zoom; drag to pan.</p>
        )}
        {inLightbox && (
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
                      handlePinClick(point, e);
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
      </div>
    ) : null;

  const mapFrame = (
    <div
      className={`hoenn-crop__frame hoenn-crop__frame--pins ${interactive ? "hoenn-crop__frame--clickable" : ""}`}
      style={frameStyle}
      onClick={interactive ? onClick : undefined}
      onKeyDown={onKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Enlarge ${caption ?? "map"}` : undefined}
    >
      {pinLayer}
    </div>
  );

  const frame = inLightbox ? (
    <MapZoomViewport
      enabled
      contentKey={`${crop.x}-${crop.y}-${crop.w}-${crop.h}-${areaId ?? ""}`}
      className="hoenn-crop__zoom"
      cropAspect={`${cropWpx} / ${cropHpx}`}
    >
      {mapFrame}
    </MapZoomViewport>
  ) : (
    mapFrame
  );

  if (inLightbox) {
    return (
      <figure className={`hoenn-crop hoenn-crop--lightbox${isWide ? " hoenn-crop--wide" : ""} ${className}`}>
        {(caption || areaId) && <p className="hoenn-crop__lightbox-title">{caption}</p>}
        <div className="hoenn-crop__lightbox-body">
          {frame}
          {sidebar}
        </div>
        <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
      </figure>
    );
  }

  return (
    <figure className={`hoenn-crop ${className}`}>
      {frame}
      {activePoint && !isTrainerPoint(activePoint) && !showLegend && (
        <figcaption className="area-map-view__active">
          <span style={{ color: POI_CATEGORIES.find((c) => c.id === activePoint.category)?.color }}>
            {POI_CATEGORIES.find((c) => c.id === activePoint.category)?.label}
          </span>
          {" — "}
          {activePoint.name}
        </figcaption>
      )}
      {caption && <figcaption className="hoenn-crop__caption">{caption}</figcaption>}
      {points.length > 0 && !showLegend && (
        <span className="hoenn-crop__badge">{points.length} markers</span>
      )}
      <TrainerDetailModal trainer={modalTrainer} onClose={() => setModalTrainer(null)} />
    </figure>
  );
}
