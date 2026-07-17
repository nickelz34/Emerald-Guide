import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMapZoomPan, ZOOM_MAX, ZOOM_MIN } from "../lib/mapZoomPan";

interface MapZoomViewportProps {
  enabled: boolean;
  contentKey?: string | number;
  className?: string;
  /** Crop aspect ratio (e.g. "384 / 384") — sizes viewport to map, no letterboxing. */
  cropAspect?: string;
  /** Center/zoom to this content percent when set (and when focusKey changes). */
  focusPercent?: { x: number; y: number } | null;
  focusKey?: string | number;
  /** Show +/- zoom buttons (in addition to pinch / scroll / drag). */
  showControls?: boolean;
  /**
   * Native content pixel size. When set, zoom resizes the content box with
   * nearest-neighbor scaling instead of CSS transform scale (keeps pixel art sharp).
   */
  crispContentSize?: { width: number; height: number } | null;
  children: ReactNode;
}

function useNarrowViewport() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return narrow;
}

/** Pinch/drag zoom wrapper for walkthrough map lightboxes. */
export function MapZoomViewport({
  enabled,
  contentKey,
  className = "",
  cropAspect,
  focusPercent = null,
  focusKey,
  showControls = false,
  crispContentSize = null,
  children,
}: MapZoomViewportProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const narrow = useNarrowViewport();
  const cropFit = Boolean(cropAspect);
  const cropAspectRatio = cropAspect
    ? (() => {
        const [w, h] = cropAspect.split("/").map((part) => Number(part.trim()));
        return Number.isFinite(w) && Number.isFinite(h) && h > 0 ? w / h : undefined;
      })()
    : undefined;
  /** Ultra-tall maps (Petalburg Gym): don't derive width from height×aspect. */
  const isTall = cropAspectRatio !== undefined && cropAspectRatio < 0.4;
  const maxFitZoom = narrow ? 2 : 1;
  const {
    attachViewportRef,
    canvasStyle,
    contentStyle,
    crisp,
    fitToContent,
    recenterPos,
    resetView,
    zoom,
    zoomByFactor,
    zoomStyle,
  } = useMapZoomPan({
    enabled,
    contentKey,
    contentRef,
    maxFitZoom,
    focusPercent,
    focusKey,
    crispContentSize,
  });

  useEffect(() => {
    if (!enabled) return;
    const content = contentRef.current;
    if (!content) return;

    const onLoad = () => requestAnimationFrame(resetView);
    const imgs = content.querySelectorAll("img");
    imgs.forEach((img) => {
      if (img.complete) onLoad();
      else img.addEventListener("load", onLoad);
    });
    return () => imgs.forEach((img) => img.removeEventListener("load", onLoad));
  }, [contentKey, enabled, resetView]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={attachViewportRef}
      className={`map-zoom-viewport${cropFit ? " map-zoom-viewport--crop-fit" : ""}${
        isTall ? " map-zoom-viewport--tall" : ""
      }${crisp ? " map-zoom-viewport--crisp" : ""} ${className}`.trim()}
      style={{
        ...zoomStyle,
        // Tall maps use a fixed viewport box; locking aspectRatio collapses width to ~30px.
        // Crisp mode still needs aspect-ratio (or an explicit height) so the viewport
        // keeps a non-zero box — the canvas is absolutely positioned and won't size it.
        ...(cropAspect && !isTall
          ? { aspectRatio: cropAspect, ["--map-aspect" as string]: cropAspect }
          : {}),
        ...(cropAspectRatio ? { ["--map-aspect-ratio" as string]: cropAspectRatio } : {}),
        ...(cropAspect ? { ["--map-aspect" as string]: cropAspect } : {}),
      }}
    >
      <div className="map-zoom-viewport__canvas" style={canvasStyle}>
        <div ref={contentRef} className="map-zoom-viewport__content" style={contentStyle}>
          {children}
        </div>
      </div>
      {showControls && (
        <div className="map-zoom-viewport__controls" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="map-zoom-viewport__zoom-btn"
            onClick={(e) => {
              e.stopPropagation();
              zoomByFactor(1.25);
            }}
            disabled={zoom >= ZOOM_MAX - 0.001}
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="map-zoom-viewport__zoom-btn"
            onClick={(e) => {
              e.stopPropagation();
              zoomByFactor(1 / 1.25);
            }}
            disabled={zoom <= ZOOM_MIN + 0.001}
            aria-label="Zoom out"
            title="Zoom out"
          >
            −
          </button>
        </div>
      )}
      {recenterPos && (
        <button
          type="button"
          className="map-zoom-viewport__recenter"
          style={{
            left: recenterPos.left,
            top: recenterPos.top,
            right: "auto",
            bottom: "auto",
            transform: "translate(-100%, -100%)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            fitToContent();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Fit entire map in view"
          title="Fit entire map in view"
        >
          <svg className="map-zoom-viewport__recenter-icon" viewBox="0 0 24 24" aria-hidden="true">
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
}
