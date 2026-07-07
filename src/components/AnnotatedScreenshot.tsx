import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";

import type { MarkerType } from "../data/mapAnnotations";

import { MARKER_LEGEND, getMapAnnotation } from "../data/mapAnnotations";



const ZOOM_MIN = 0.5;

const ZOOM_MAX = 4;

const WHEEL_ZOOM_FACTOR = 1.08;

const PANORAMIC_ASPECT = 2.5;

const TAP_DRAG_THRESHOLD = 6;



function computeFitView(
  frameW: number,
  frameH: number,
  contentW: number,
  contentH: number,
): { pan: Pan; zoom: number } {
  if (contentW <= 0 || contentH <= 0 || frameW <= 0 || frameH <= 0) {
    return { pan: { x: 0, y: 0 }, zoom: 1 };
  }

  const fitZoom = Math.min(frameW / contentW, frameH / contentH, 1);
  const zoom = Math.max(0.12, fitZoom);

  const scaledW = contentW * zoom;
  const scaledH = contentH * zoom;

  return {
    zoom,
    pan: {
      x: (frameW - scaledW) / 2,
      y: (frameH - scaledH) / 2,
    },
  };
}

interface Pan {

  x: number;

  y: number;

}



function clampZoom(value: number) {

  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));

}



function touchDistance(touches: TouchList) {

  const dx = touches[0].clientX - touches[1].clientX;

  const dy = touches[0].clientY - touches[1].clientY;

  return Math.hypot(dx, dy);

}



/** WebKit pinch events (iOS Safari). */

interface GestureEvent extends UIEvent {

  scale: number;

}



interface AnnotatedScreenshotProps {

  imageSrc: string;

  caption?: string;

  areaId?: string;

  compact?: boolean;

  showLegend?: boolean;

  /** Pixel-perfect location render — no zoom/pan inline; image scales up cleanly. */
  staticMap?: boolean;

  /** Expanded lightbox layout — larger map, sidebar info, no floating tooltips. */

  variant?: "default" | "lightbox";

  onImageClick?: () => void;

  className?: string;

}



export function MapMarkerLegend({

  hiddenTypes,

  onToggleType,

  usedTypes,

  showZoomHint = false,

}: {

  hiddenTypes: Set<MarkerType>;

  onToggleType: (type: MarkerType) => void;

  usedTypes: Set<MarkerType>;

  showZoomHint?: boolean;

}) {

  return (

    <div className="map-legend" role="list" aria-label="Map marker legend">

      <span className="map-legend__title">Legend</span>

      <div className="map-legend__items">

        {MARKER_LEGEND.filter((e) => usedTypes.has(e.type)).map((entry) => {

          const off = hiddenTypes.has(entry.type);

          return (

            <button

              key={entry.type}

              type="button"

              role="listitem"

              className={`map-legend__item ${off ? "map-legend__item--off" : ""}`}

              onClick={() => onToggleType(entry.type)}

              title={off ? `Show ${entry.label}` : `Hide ${entry.label}`}

            >

              <span

                className="map-legend__swatch"

                style={{ background: entry.color, opacity: off ? 0.35 : 1 }}

              >

                {entry.symbol}

              </span>

              <span>{entry.label}</span>

            </button>

          );

        })}

      </div>

      <p className="map-legend__hint">

        Click legend items to show/hide marker types. Click pins for details.

        {showZoomHint && " Scroll wheel to zoom; click and drag to pan."}

      </p>

    </div>

  );

}



export function AnnotatedScreenshot({

  imageSrc,

  caption,

  areaId,

  compact,

  showLegend = true,

  staticMap = false,

  variant = "default",

  onImageClick,

  className = "",

}: AnnotatedScreenshotProps) {

  const annotation = getMapAnnotation(imageSrc, areaId);

  const [activeId, setActiveId] = useState<string | null>(null);

  const [hiddenTypes, setHiddenTypes] = useState<Set<MarkerType>>(() => new Set());

  const [zoom, setZoom] = useState(1);

  const [fitZoom, setFitZoom] = useState(1);

  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });

  const [panoramic, setPanoramic] = useState(false);
  const [smallMap, setSmallMap] = useState(false);
  const [displayWidth, setDisplayWidth] = useState<number | undefined>(undefined);
  const [recenterPos, setRecenterPos] = useState<{ left: number; top: number } | null>(null);

  const frameRef = useRef<HTMLDivElement | null>(null);

  const frameCleanupRef = useRef<(() => void) | null>(null);

  const zoomRef = useRef(1);

  const panRef = useRef<Pan>({ x: 0, y: 0 });

  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);

  const gestureZoomRef = useRef(1);

  const touchPanRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);



  zoomRef.current = zoom;

  panRef.current = pan;



  const visibleMarkers = useMemo(() => {

    if (!annotation) return [];

    return annotation.markers.filter((m) => !hiddenTypes.has(m.type));

  }, [annotation, hiddenTypes]);



  const usedTypes = useMemo(() => {

    const s = new Set<MarkerType>();

    annotation?.markers.forEach((m) => s.add(m.type));

    return s;

  }, [annotation]);



  const toggleType = (type: MarkerType) => {

    setHiddenTypes((prev) => {

      const next = new Set(prev);

      if (next.has(type)) next.delete(type);

      else next.add(type);

      return next;

    });

    setActiveId(null);

  };



  const legendEntry = (type: MarkerType) => MARKER_LEGEND.find((e) => e.type === type)!;

  const activeMarker = annotation?.markers.find((m) => m.id === activeId);

  const activeStyle = activeMarker ? legendEntry(activeMarker.type) : null;

  const inLightbox = variant === "lightbox";
  const zoomEnabled = !compact && !staticMap;

  const syncRecenterPosition = useCallback(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img || img.offsetWidth <= 0 || img.offsetHeight <= 0) {
      setRecenterPos(null);
      return;
    }

    const frameRect = frame.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const pad = 8;
    const btnSize = 30;

    let left = imgRect.right - frameRect.left - pad;
    let top = imgRect.bottom - frameRect.top - pad;

    // Keep the control on the image corner when possible, but never outside the frame.
    left = Math.min(Math.max(left, pad + btnSize), frameRect.width - pad);
    top = Math.min(Math.max(top, pad + btnSize), frameRect.height - pad);

    setRecenterPos({ left, top });
  }, []);

  const recenterView = useCallback(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img || !zoomEnabled) return;

    const { pan: nextPan, zoom: nextZoom } = computeFitView(
      frame.clientWidth,
      frame.clientHeight,
      img.offsetWidth,
      img.offsetHeight,
    );
    setZoom(nextZoom);
    setFitZoom(nextZoom);
    setPan(nextPan);
    requestAnimationFrame(syncRecenterPosition);
  }, [zoomEnabled, syncRecenterPosition]);

  const zoomAtPoint = useCallback((newZoom: number, clientX: number, clientY: number) => {

    const frame = frameRef.current;

    if (!frame) {

      setZoom(newZoom);

      return;

    }

    const rect = frame.getBoundingClientRect();

    const mx = clientX - rect.left;

    const my = clientY - rect.top;

    const oldZoom = zoomRef.current;

    const ratio = newZoom / oldZoom;

    const p = panRef.current;

    setPan({

      x: mx - (mx - p.x) * ratio,

      y: my - (my - p.y) * ratio,

    });

    setZoom(newZoom);

  }, []);



  const attachFrameRef = useCallback(

    (node: HTMLDivElement | null) => {

      frameCleanupRef.current?.();

      frameCleanupRef.current = null;

      frameRef.current = node;

      if (!node || !zoomEnabled) return;



      const onWheel = (e: WheelEvent) => {

        e.preventDefault();

        const factor = e.deltaY < 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR;

        const newZoom = clampZoom(zoomRef.current * factor);

        zoomAtPoint(newZoom, e.clientX, e.clientY);

      };



      const onTouchStart = (e: TouchEvent) => {

        if (e.touches.length === 1) {

          touchPanRef.current = {

            x: e.touches[0].clientX,

            y: e.touches[0].clientY,

            panX: panRef.current.x,

            panY: panRef.current.y,

          };

          pinchRef.current = null;

        } else if (e.touches.length === 2) {

          touchPanRef.current = null;

          pinchRef.current = {

            startDist: touchDistance(e.touches),

            startZoom: zoomRef.current,

          };

        }

      };



      const onTouchMove = (e: TouchEvent) => {

        if (e.touches.length === 1 && touchPanRef.current) {

          e.preventDefault();

          const dx = e.touches[0].clientX - touchPanRef.current.x;

          const dy = e.touches[0].clientY - touchPanRef.current.y;

          setPan({

            x: touchPanRef.current.panX + dx,

            y: touchPanRef.current.panY + dy,

          });

          return;

        }

        if (e.touches.length !== 2 || !pinchRef.current) return;

        e.preventDefault();

        const dist = touchDistance(e.touches);

        const scale = dist / pinchRef.current.startDist;

        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;

        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        zoomAtPoint(clampZoom(pinchRef.current.startZoom * scale), cx, cy);

      };



      const clearTouch = (e: TouchEvent) => {

        if (e.touches.length === 0) {

          touchPanRef.current = null;

          pinchRef.current = null;

        } else if (e.touches.length === 1) {

          pinchRef.current = null;

          touchPanRef.current = {

            x: e.touches[0].clientX,

            y: e.touches[0].clientY,

            panX: panRef.current.x,

            panY: panRef.current.y,

          };

        }

      };



      const onGestureStart = (e: Event) => {

        e.preventDefault();

        gestureZoomRef.current = zoomRef.current;

      };



      const onGestureChange = (e: Event) => {

        e.preventDefault();

        const ge = e as GestureEvent;

        const rect = node.getBoundingClientRect();

        zoomAtPoint(

          clampZoom(gestureZoomRef.current * ge.scale),

          rect.left + rect.width / 2,

          rect.top + rect.height / 2,

        );

      };



      const onGestureEnd = (e: Event) => {
        e.preventDefault();
      };

      const endPointerDrag = (pointerId: number) => {
        if (node.hasPointerCapture(pointerId)) {
          node.releasePointerCapture(pointerId);
        }
        dragRef.current = null;
        node.classList.remove("annotated-map__frame--dragging");
      };

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest(".map-marker, .annotated-map__recenter")) return;

        dragRef.current = {
          pointerId: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          panX: panRef.current.x,
          panY: panRef.current.y,
          moved: false,
        };
        node.setPointerCapture(e.pointerId);
        node.classList.add("annotated-map__frame--dragging");
        e.preventDefault();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return;
        const dx = e.clientX - dragRef.current.x;
        const dy = e.clientY - dragRef.current.y;
        if (!dragRef.current.moved && Math.hypot(dx, dy) > TAP_DRAG_THRESHOLD) {
          dragRef.current.moved = true;
        }
        setPan({
          x: dragRef.current.panX + dx,
          y: dragRef.current.panY + dy,
        });
        e.preventDefault();
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return;
        const wasTap = !dragRef.current.moved;
        endPointerDrag(e.pointerId);
        if (wasTap && onImageClick) {
          onImageClick();
        }
        e.preventDefault();
      };

      node.addEventListener("wheel", onWheel, { passive: false });
      node.addEventListener("pointerdown", onPointerDown, { capture: true });
      node.addEventListener("pointermove", onPointerMove, { capture: true });
      node.addEventListener("pointerup", onPointerUp, { capture: true });
      node.addEventListener("pointercancel", onPointerUp, { capture: true });
      node.addEventListener("touchstart", onTouchStart, { passive: true });

      node.addEventListener("touchmove", onTouchMove, { passive: false });

      node.addEventListener("touchend", clearTouch);

      node.addEventListener("touchcancel", clearTouch);

      node.addEventListener("gesturestart", onGestureStart);

      node.addEventListener("gesturechange", onGestureChange);

      node.addEventListener("gestureend", onGestureEnd);



      frameCleanupRef.current = () => {
        node.removeEventListener("wheel", onWheel);
        node.removeEventListener("pointerdown", onPointerDown, { capture: true });
        node.removeEventListener("pointermove", onPointerMove, { capture: true });
        node.removeEventListener("pointerup", onPointerUp, { capture: true });
        node.removeEventListener("pointercancel", onPointerUp, { capture: true });
        node.removeEventListener("touchstart", onTouchStart);

        node.removeEventListener("touchmove", onTouchMove);

        node.removeEventListener("touchend", clearTouch);

        node.removeEventListener("touchcancel", clearTouch);

        node.removeEventListener("gesturestart", onGestureStart);

        node.removeEventListener("gesturechange", onGestureChange);

        node.removeEventListener("gestureend", onGestureEnd);

      };

    },

    [zoomEnabled, zoomAtPoint, onImageClick],

  );



  useEffect(() => () => frameCleanupRef.current?.(), []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const ro = new ResizeObserver(() => syncRecenterPosition());
    ro.observe(frame);
    return () => ro.disconnect();
  }, [syncRecenterPosition, imageSrc]);

  useEffect(() => {
    syncRecenterPosition();
  }, [pan, zoom, panoramic, imageSrc, syncRecenterPosition]);

  useEffect(() => {

    setZoom(1);

    setFitZoom(1);

    setPan({ x: 0, y: 0 });

    setActiveId(null);

    setPanoramic(false);
    setSmallMap(false);
    setDisplayWidth(undefined);

    pinchRef.current = null;

    touchPanRef.current = null;

    dragRef.current = null;

    frameRef.current?.classList.remove("annotated-map__frame--dragging");

  }, [imageSrc]);



  useEffect(() => {

    if (!activeId || !zoomEnabled) return;

    const frame = frameRef.current;

    const marker = frame?.querySelector<HTMLElement>(`[data-marker-id="${activeId}"]`);

    if (!frame || !marker) return;



    const mx = marker.offsetLeft + marker.offsetWidth / 2;

    const my = marker.offsetTop + marker.offsetHeight / 2;

    const z = zoomRef.current;

    setPan({

      x: frame.clientWidth / 2 - mx * z,

      y: frame.clientHeight / 2 - my * z,

    });
    requestAnimationFrame(syncRecenterPosition);

  }, [activeId, zoomEnabled, syncRecenterPosition]);



  const handleImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth <= 0 || naturalHeight <= 0) return;

      const isPanoramic = naturalWidth / naturalHeight >= PANORAMIC_ASPECT;
      setPanoramic(isPanoramic);
      if (staticMap && naturalWidth < 520) {
        setSmallMap(true);
        const target = Math.min(480, Math.max(240, naturalWidth * 2.5));
        setDisplayWidth(Math.round(Math.min(target, naturalWidth * 3)));
      } else {
        setSmallMap(false);
        setDisplayWidth(undefined);
      }

      if (!zoomEnabled) {
        requestAnimationFrame(syncRecenterPosition);
        return;
      }

      requestAnimationFrame(() => {
        const frame = frameRef.current;
        if (!frame) return;
        const { pan: nextPan, zoom: nextZoom } = computeFitView(
          frame.clientWidth,
          frame.clientHeight,
          img.offsetWidth,
          img.offsetHeight,
        );
        setPan(nextPan);
        setZoom(nextZoom);
        setFitZoom(nextZoom);
        requestAnimationFrame(syncRecenterPosition);
      });
    },
    [zoomEnabled, staticMap, syncRecenterPosition],
  );

  const mapMarkers =
    !compact &&
    visibleMarkers.map((marker) => {
      const style = legendEntry(marker.type);
      const active = activeId === marker.id;
      return (
        <button
          key={marker.id}
          data-marker-id={marker.id}
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
    });

  const mapSurface = (
    <>
      <img
        ref={imgRef}
        className="annotated-map__img"
        src={imageSrc}
        alt={caption ?? annotation?.title ?? "Location map"}
        loading="lazy"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onLoad={handleImageLoad}
        style={displayWidth ? { width: `${displayWidth}px`, maxWidth: "100%", height: "auto" } : undefined}
      />
      {mapMarkers}
    </>
  );

  const canvasStyle: CSSProperties | undefined = zoomEnabled

    ? {

        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,

        transformOrigin: "0 0",

      }

    : undefined;



  const mapFrame = (

    <div

      ref={attachFrameRef}

      className={`annotated-map__frame ${zoomEnabled && onImageClick ? "annotated-map__frame--clickable" : ""} ${staticMap && onImageClick ? "annotated-map__frame--clickable" : ""} ${zoomEnabled ? "annotated-map__frame--zoomable" : ""} ${panoramic ? "annotated-map__frame--panoramic" : ""}`}

      style={
        zoomEnabled
          ? ({
              "--map-zoom": zoom,
              "--map-zoom-fit": fitZoom,
            } as CSSProperties)
          : undefined
      }

      onClick={staticMap && onImageClick && !zoomEnabled ? onImageClick : undefined}

      onKeyDown={
        onImageClick && (zoomEnabled || staticMap)
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onImageClick();
              }
            }
          : undefined
      }

      role={onImageClick && (zoomEnabled || staticMap) ? "button" : undefined}

      tabIndex={onImageClick && (zoomEnabled || staticMap) ? 0 : undefined}

      aria-label={onImageClick && (zoomEnabled || staticMap) ? `Enlarge ${caption ?? annotation?.title ?? "map"}` : undefined}

    >

      <div className="annotated-map__canvas" style={canvasStyle}>
        {zoomEnabled ? mapSurface : <div className="annotated-map__surface">{mapSurface}</div>}
      </div>

      {recenterPos && (
        <button
          type="button"
          className="annotated-map__recenter"
          style={{
            left: recenterPos.left,
            top: recenterPos.top,
            right: "auto",
            bottom: "auto",
            transform: "translate(-100%, -100%)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (zoomEnabled) recenterView();
            else syncRecenterPosition();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Fit entire map in view"
          title="Fit entire map in view"
        >
          <svg className="annotated-map__recenter-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M12 3v3M12 18v3M3 12h3M18 12h3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>

  );



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

    showLegend && annotation && usedTypes.size > 0 && !compact ? (

      <div className="annotated-map__sidebar">

        <MapMarkerLegend

          hiddenTypes={hiddenTypes}

          onToggleType={toggleType}

          usedTypes={usedTypes}

          showZoomHint={zoomEnabled}

        />

        <ul className="marker-index" aria-label="All points of interest">

          {annotation.markers.map((marker) => {

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



  if (inLightbox) {

    return (

      <div className={`annotated-map annotated-map--lightbox ${panoramic ? "annotated-map--panoramic" : ""} ${className}`}>

        {(caption || annotation?.title) && (

          <p className="annotated-map__lightbox-title">{caption ?? annotation?.title}</p>

        )}

        {markerDetail}

        <div className="annotated-map__lightbox-body">

          {mapFrame}

          {sidebar}

        </div>

      </div>

    );

  }



  return (

    <div className={`annotated-map ${compact ? "annotated-map--compact" : ""} ${staticMap ? "annotated-map--location" : ""} ${smallMap ? "annotated-map--location-small" : ""} ${panoramic ? "annotated-map--panoramic" : ""} ${className}`}>

      {mapFrame}

      {markerDetail}

      {caption && <p className="annotated-map__caption">{caption}</p>}

      {sidebar}

      {compact && annotation && visibleMarkers.length > 0 && (

        <span className="annotated-map__badge">{visibleMarkers.length} markers</span>

      )}

    </div>

  );

}


