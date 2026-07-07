import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 4;
const WHEEL_ZOOM_FACTOR = 1.08;
const TAP_DRAG_THRESHOLD = 6;

export interface Pan {
  x: number;
  y: number;
}

/** WebKit pinch events (iOS Safari). */
interface GestureEvent extends UIEvent {
  scale: number;
}

export function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
}

function touchDistance(touches: TouchList) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

export function computeFitView(
  frameW: number,
  frameH: number,
  contentW: number,
  contentH: number,
  maxZoom = 1,
): { pan: Pan; zoom: number } {
  if (contentW <= 0 || contentH <= 0 || frameW <= 0 || frameH <= 0) {
    return { pan: { x: 0, y: 0 }, zoom: 1 };
  }

  const fitZoom = Math.min(frameW / contentW, frameH / contentH, maxZoom);
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

interface UseMapZoomPanOptions {
  enabled: boolean;
  contentKey?: string | number;
  contentRef: RefObject<HTMLElement | null>;
  /** Ignore pointer drags that start on these selectors (pins, buttons, etc.). */
  dragIgnoreSelector?: string;
  /** Max initial fit zoom (e.g. 1.35 on mobile to fill portrait viewports). */
  maxFitZoom?: number;
}

export function useMapZoomPan({
  enabled,
  contentKey,
  contentRef,
  dragIgnoreSelector = ".hoenn-map__pin, .map-marker, .map-zoom-viewport__recenter",
  maxFitZoom = 1,
}: UseMapZoomPanOptions) {
  const [zoom, setZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [recenterPos, setRecenterPos] = useState<{ left: number; top: number } | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewportCleanupRef = useRef<(() => void) | null>(null);
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

  zoomRef.current = zoom;
  panRef.current = pan;

  const syncRecenterPosition = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || content.offsetWidth <= 0 || content.offsetHeight <= 0) {
      setRecenterPos(null);
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const pad = 8;
    const btnSize = 30;

    let left = contentRect.right - viewportRect.left - pad;
    let top = contentRect.bottom - viewportRect.top - pad;
    left = Math.min(Math.max(left, pad + btnSize), viewportRect.width - pad);
    top = Math.min(Math.max(top, pad + btnSize), viewportRect.height - pad);

    setRecenterPos({ left, top });
  }, [contentRef]);

  const fitToContent = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || !enabled) return;

    const { pan: nextPan, zoom: nextZoom } = computeFitView(
      viewport.clientWidth,
      viewport.clientHeight,
      content.offsetWidth,
      content.offsetHeight,
      maxFitZoom,
    );
    setFitZoom(nextZoom);
    setZoom(nextZoom);
    setPan(nextPan);
    requestAnimationFrame(syncRecenterPosition);
  }, [contentRef, enabled, maxFitZoom, syncRecenterPosition]);

  const zoomAtPoint = useCallback((newZoom: number, clientX: number, clientY: number) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      setZoom(newZoom);
      return;
    }

    const rect = viewport.getBoundingClientRect();
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

  const attachViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportCleanupRef.current?.();
      viewportCleanupRef.current = null;
      viewportRef.current = node;
      if (!node || !enabled) return;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR;
        zoomAtPoint(clampZoom(zoomRef.current * factor), e.clientX, e.clientY);
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
        node.classList.remove("map-zoom-viewport--dragging");
      };

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest(dragIgnoreSelector)) return;

        dragRef.current = {
          pointerId: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          panX: panRef.current.x,
          panY: panRef.current.y,
          moved: false,
        };
        node.setPointerCapture(e.pointerId);
        node.classList.add("map-zoom-viewport--dragging");
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
        endPointerDrag(e.pointerId);
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

      viewportCleanupRef.current = () => {
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
    [dragIgnoreSelector, enabled, zoomAtPoint],
  );

  useEffect(() => () => viewportCleanupRef.current?.(), []);

  useEffect(() => {
    if (!enabled) return;
    setZoom(1);
    setFitZoom(1);
    setPan({ x: 0, y: 0 });
    pinchRef.current = null;
    touchPanRef.current = null;
    dragRef.current = null;
    viewportRef.current?.classList.remove("map-zoom-viewport--dragging");
  }, [contentKey, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => {
      fitToContent();
    });
    ro.observe(viewport);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [contentKey, contentRef, enabled, fitToContent]);

  useEffect(() => {
    if (!enabled) return;
    syncRecenterPosition();
  }, [enabled, pan, zoom, syncRecenterPosition]);

  const canvasStyle: CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: "0 0",
  };

  return {
    attachViewportRef,
    canvasStyle,
    fitToContent,
    fitZoom,
    recenterPos,
    syncRecenterPosition,
    zoom,
    zoomStyle: {
      "--map-zoom": zoom,
      "--map-zoom-fit": fitZoom,
    } as CSSProperties,
  };
}
