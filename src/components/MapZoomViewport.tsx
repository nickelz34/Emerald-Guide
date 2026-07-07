import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMapZoomPan } from "../lib/mapZoomPan";

interface MapZoomViewportProps {
  enabled: boolean;
  contentKey?: string | number;
  className?: string;
  /** Crop aspect ratio (e.g. "384 / 384") — sizes viewport to map, no letterboxing. */
  cropAspect?: string;
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
  children,
}: MapZoomViewportProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const narrow = useNarrowViewport();
  const cropFit = Boolean(cropAspect) && narrow;
  const maxFitZoom = narrow ? 2 : 1;
  const { attachViewportRef, canvasStyle, fitToContent, recenterPos, zoomStyle } = useMapZoomPan({
    enabled,
    contentKey,
    contentRef,
    maxFitZoom,
  });

  useEffect(() => {
    if (!enabled) return;
    const content = contentRef.current;
    if (!content) return;

    const onLoad = () => requestAnimationFrame(fitToContent);
    const imgs = content.querySelectorAll("img");
    imgs.forEach((img) => {
      if (img.complete) onLoad();
      else img.addEventListener("load", onLoad);
    });
    return () => imgs.forEach((img) => img.removeEventListener("load", onLoad));
  }, [contentKey, enabled, fitToContent]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={attachViewportRef}
      className={`map-zoom-viewport${cropFit ? " map-zoom-viewport--crop-fit" : ""} ${className}`.trim()}
      style={{
        ...zoomStyle,
        ...(cropAspect ? { aspectRatio: cropAspect, ["--map-aspect" as string]: cropAspect } : {}),
      }}
    >
      <div className="map-zoom-viewport__canvas" style={canvasStyle}>
        <div ref={contentRef} className="map-zoom-viewport__content">
          {children}
        </div>
      </div>
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
