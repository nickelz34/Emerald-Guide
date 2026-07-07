import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import { getRegionForStep, type MapRegion } from "../data/mapRegions";
import {
  MAP_POINTS,
  POI_CATEGORIES,
  DEFAULT_VISIBLE_CATEGORIES,
  type MapPoint,
  type PoiCategory,
} from "../data/mapPoints";
import { GENERATED_POINTS } from "../data/mapPointsGenerated";
import { ROUTE_POINTS } from "../data/mapRoutesGenerated";
import { AREA_MAPS, type AreaMap } from "../data/areaMaps";
import { AREA_TRAINERS, MAP_TRAINERS, type TrainerPoint } from "../data/mapTrainersGenerated";
import { TrainerDetailModal, TrainerPinHint } from "./TrainerDetailPanel";
import { RouteDetailModal } from "./EncounterTable";
import { GymDetailModal } from "./GymDetailModal";

const ALL_POINTS: MapPoint[] = [...MAP_POINTS, ...GENERATED_POINTS, ...ROUTE_POINTS];

function isTrainerPoint(p: MapPoint): p is TrainerPoint {
  return p.category === "trainer" && "spriteSheet" in p;
}

/** Area maps grouped for the switcher's <optgroup> list. */
const AREA_GROUPS: { group: string; maps: AreaMap[] }[] = (() => {
  const byGroup = new Map<string, AreaMap[]>();
  for (const a of AREA_MAPS) {
    if (!byGroup.has(a.group)) byGroup.set(a.group, []);
    byGroup.get(a.group)!.push(a);
  }
  return [...byGroup.entries()]
    .map(([group, maps]) => ({ group, maps }))
    .sort((a, b) => a.group.localeCompare(b.group));
})();

/** Convert an area map's markers into the MapPoint shape used by the pins/list. */
function areaPoints(area: AreaMap): MapPoint[] {
  return area.markers.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
    x: m.x,
    y: m.y,
    desc: m.desc,
    note: area.name,
  }));
}

/** Region ids whose id doesn't match a map point id 1:1. */
const REGION_POINT_ALIAS: Record<string, string> = {
  route110: "trick-house",
  sealed: "pacifidlog",
  frontier: "battle-frontier",
};

/** Best map point to focus for a given walkthrough step. */
function resolveFocusPoint(stepId: string): MapPoint | undefined {
  const direct = ALL_POINTS.find((pt) => pt.stepId === stepId);
  if (direct) return direct;
  const region = getRegionForStep(stepId);
  if (!region) return undefined;
  const aliasId = REGION_POINT_ALIAS[region.id] ?? region.id;
  const byId = ALL_POINTS.find((pt) => pt.id === aliasId);
  if (byId) return byId;
  return ALL_POINTS.find((pt) => pt.stepId && region.stepIds.includes(pt.stepId));
}

function initialVisible(): Record<PoiCategory, boolean> {
  const v = {} as Record<PoiCategory, boolean>;
  for (const c of POI_CATEGORIES) v[c.id] = DEFAULT_VISIBLE_CATEGORIES.includes(c.id);
  return v;
}

const HOENN_MAP_PNG = assetUrl("maps/hoenn-map.png");
const HOENN_MAP_WEBP = assetUrl("maps/hoenn-map.webp");

/** Native pixel size of the source map (true-scale render, 16px per game tile). */
const MAP_W = 12800;
const MAP_H = 6128;

const MIN_SCALE = 1;
const MAX_SCALE = 14;
const ZOOM_STEP = 1.35;
/** Narrow viewports start zoomed in so the overworld map is readable on phones. */
const NARROW_VIEWPORT_MAX = 900;
const MOBILE_DEFAULT_SCALE = 2.75;
/** Route text labels only appear once zoomed in past this (overworld map). */
const ROUTE_LABEL_MIN_SCALE = 3.25;

interface HoennMapProps {
  activeStepId?: string;
  onSelectRegion: (region: MapRegion) => void;
  /** Unused now, kept for compatibility with existing callers. */
  categoryStepIds?: Set<string>;
  /** Tighter layout for the walkthrough map modal (hides the index list). */
  compact?: boolean;
}

interface View {
  /** Zoom multiplier relative to the "fit whole map" size. */
  scale: number;
  /** Top-left offset of the map canvas within the viewport, in px. */
  x: number;
  y: number;
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

export function HoennMap({ activeStepId, onSelectRegion, compact = false }: HoennMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);
  const [modalRoute, setModalRoute] = useState<MapPoint | null>(null);
  const [modalGym, setModalGym] = useState<MapPoint | null>(null);
  const [visible, setVisible] = useState<Record<PoiCategory, boolean>>(initialVisible);
  const [rematchableOnly, setRematchableOnly] = useState(false);
  const [currentAreaId, setCurrentAreaId] = useState<string | null>(null);

  const currentArea = useMemo(
    () => (currentAreaId ? AREA_MAPS.find((a) => a.id === currentAreaId) ?? null : null),
    [currentAreaId],
  );

  /** Points + image + native size for the map currently shown. */
  const trainerPoints = useMemo(
    (): MapPoint[] =>
      currentArea ? (AREA_TRAINERS[currentArea.id] ?? []) : MAP_TRAINERS,
    [currentArea],
  );
  const basePoints = useMemo(
    () => [...(currentArea ? areaPoints(currentArea) : ALL_POINTS), ...trainerPoints],
    [currentArea, trainerPoints],
  );
  const imgSrc = currentArea ? assetUrl(currentArea.image) : HOENN_MAP_PNG;
  const useHoennWebp = !currentArea;
  const [mapReady, setMapReady] = useState(false);
  const mapW = currentArea ? currentArea.width : MAP_W;
  const mapH = currentArea ? currentArea.height : MAP_H;
  const mapAr = mapW / mapH;

  /** Categories that actually have points on the current map. */
  const activeCategories = useMemo(
    () => POI_CATEGORIES.filter((c) => basePoints.some((p) => p.category === c.id)),
    [basePoints],
  );

  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const viewRef = useRef(view);
  viewRef.current = view;
  const blockMapMarkerUntilRef = useRef(0);
  const markerTouchHandledRef = useRef(false);
  const pinPointerRef = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null);
  const modalOpenRef = useRef(false);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setModalTrainer(null);
    setModalRoute(null);
    setModalGym(null);
  }, []);

  const closeRouteModal = useCallback(() => {
    blockMapMarkerUntilRef.current = Date.now() + 600;
    setModalRoute(null);
  }, []);

  const closeTrainerModal = useCallback(() => {
    blockMapMarkerUntilRef.current = Date.now() + 600;
    setModalTrainer(null);
  }, []);

  const closeGymModal = useCallback(() => {
    blockMapMarkerUntilRef.current = Date.now() + 600;
    setModalGym(null);
  }, []);

  useEffect(() => {
    setMapReady(false);
  }, [imgSrc, currentAreaId]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouchDevice(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const passesTrainerFilter = useCallback(
    (p: MapPoint) => {
      if (!rematchableOnly || currentArea) return true;
      if (!isTrainerPoint(p)) return true;
      return p.rematchable === true;
    },
    [rematchableOnly, currentArea],
  );

  const visiblePoints = useMemo(
    () => basePoints.filter((p) => visible[p.category] && passesTrainerFilter(p)),
    [visible, basePoints, passesTrainerFilter],
  );

  const selectedPoint = useMemo(
    () => visiblePoints.find((p) => p.id === selectedId) ?? null,
    [visiblePoints, selectedId],
  );

  /** Visible points grouped by category (for the list below the map). */
  const groupedVisible = useMemo(() => {
    return POI_CATEGORIES.filter((c) => visible[c.id])
      .map((cat) => ({
        cat,
        points: basePoints
          .filter((p) => p.category === cat.id && passesTrainerFilter(p))
          .sort(
            (a, b) =>
              (a.note ?? "").localeCompare(b.note ?? "") || a.name.localeCompare(b.name),
          ),
      }))
      .filter((g) => g.points.length > 0);
  }, [visible, basePoints, passesTrainerFilter]);

  const overworldRematchTrainerCount = useMemo(
    () => MAP_TRAINERS.filter((t) => t.rematchable).length,
    [],
  );

  /** Width the map occupies at scale 1 (whole map contained in the viewport). */
  const fitW = vp.w && vp.h ? Math.min(vp.w, vp.h * mapAr) : vp.w;

  const isNarrowViewport = vp.w > 0 && vp.w <= NARROW_VIEWPORT_MAX;
  const isOverworld = !currentArea;
  const defaultScale = isNarrowViewport && isOverworld ? MOBILE_DEFAULT_SCALE : 1;
  const compactRouteLabels = isOverworld && view.scale < ROUTE_LABEL_MIN_SCALE;
  modalOpenRef.current = modalRoute !== null || modalTrainer !== null || modalGym !== null;

  const canvasW = fitW * view.scale;
  const canvasH = canvasW / mapAr;

  /** Clamp the pan offset so the map stays sensibly framed; center when smaller. */
  const clamp = useCallback(
    (v: View): View => {
      const w = vp.w;
      const h = vp.h;
      const fw = (w && h ? Math.min(w, h * mapAr) : w) || 0;
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale));
      const cw = fw * scale;
      const ch = cw / mapAr;
      let { x, y } = v;
      x = cw <= w ? (w - cw) / 2 : Math.min(0, Math.max(w - cw, x));
      y = ch <= h ? (h - ch) / 2 : Math.min(0, Math.max(h - ch, y));
      return { scale, x, y };
    },
    [vp.w, vp.h, mapAr],
  );

  const fit = useCallback(
    () => setView(clamp({ scale: defaultScale, x: 0, y: 0 })),
    [clamp, defaultScale],
  );

  /** Select a point and pan/zoom the map so it sits in the middle of the view. */
  const focusPoint = useCallback(
    (p: MapPoint, opts?: { overworld?: boolean }) => {
      const onOverworld = opts?.overworld ?? !currentArea;
      const ar = onOverworld ? MAP_W / MAP_H : mapAr;
      const fw = vp.w && vp.h ? Math.min(vp.w, vp.h * ar) : vp.w;
      setSelectedId(p.id);
      if (isTrainerPoint(p)) {
        setModalTrainer(p);
      } else {
        setModalTrainer(null);
      }
      setView((prev) => {
        const targetScale = Math.max(prev.scale, onOverworld ? 6 : 3);
        const cw = fw * targetScale;
        const ch = cw / ar;
        const px = (p.x / 100) * cw;
        const py = (p.y / 100) * ch;
        const w = vp.w;
        const h = vp.h;
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale));
        const cw2 = fw * scale;
        const ch2 = cw2 / ar;
        let x = w / 2 - px;
        let y = h / 2 - py;
        x = cw2 <= w ? (w - cw2) / 2 : Math.min(0, Math.max(w - cw2, x));
        y = ch2 <= h ? (h - ch2) / 2 : Math.min(0, Math.max(h - ch2, y));
        return { scale, x, y };
      });
    },
    [vp.w, vp.h, mapAr, currentArea],
  );

  /** Switch the displayed map (null = overworld composite). */
  const switchMap = useCallback(
    (areaId: string | null) => {
      setCurrentAreaId(areaId);
      setSelectedId(null);
      setRematchableOnly(false);
      if (areaId) {
        // Area maps exist to show their items — turn those layers on by default.
        const area = AREA_MAPS.find((a) => a.id === areaId);
        const next = {} as Record<PoiCategory, boolean>;
        for (const c of POI_CATEGORIES) next[c.id] = false;
        for (const m of area?.markers ?? []) next[m.category] = true;
        if ((AREA_TRAINERS[areaId] ?? []).length) next.trainer = true;
        setVisible(next);
      } else {
        setVisible(initialVisible());
      }
      setView(clamp({ scale: defaultScale, x: 0, y: 0 }));
    },
    [clamp, defaultScale],
  );

  // When a step asks to be shown (e.g. "Show on Hoenn map"), pan the overworld map to
  // the matching location. Interior area maps stay in the step gallery — not here.
  useEffect(() => {
    if (!activeStepId || !vp.w || !vp.h) return;
    const target = resolveFocusPoint(activeStepId);
    if (!target) return;
    setCurrentAreaId(null);
    setVisible((v) => (v[target.category] ? v : { ...v, [target.category]: true }));
    focusPoint(target, { overworld: true });
  }, [activeStepId, vp.w, vp.h, focusPoint]);

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      setView((prev) => {
        const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * factor));
        if (nextScale === prev.scale) return prev;
        const ratio = nextScale / prev.scale;
        // Keep the point under the cursor fixed while zooming.
        const x = cx - (cx - prev.x) * ratio;
        const y = cy - (cy - prev.y) * ratio;
        return clamp({ scale: nextScale, x, y });
      });
    },
    [clamp],
  );

  const zoomToScale = useCallback(
    (targetScale: number, cx: number, cy: number) => {
      setView((prev) => {
        const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale));
        if (nextScale === prev.scale) return prev;
        const ratio = nextScale / prev.scale;
        const x = cx - (cx - prev.x) * ratio;
        const y = cy - (cy - prev.y) * ratio;
        return clamp({ scale: nextScale, x, y });
      });
    },
    [clamp],
  );

  const zoomButton = useCallback(
    (factor: number) => zoomAt(factor, vp.w / 2, vp.h / 2),
    [zoomAt, vp.w, vp.h],
  );

  // Track viewport size and keep the map framed on resize / first paint.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setVp({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-center / re-clamp whenever the viewport size changes.
  useEffect(() => {
    if (!vp.w || !vp.h) return;
    setView((v) => {
      const next = clamp(v);
      // When rotating or resizing onto a phone, bump a "fit whole map" view to the mobile default zoom.
      if (isNarrowViewport && isOverworld && v.scale === 1 && defaultScale > 1) {
        return clamp({ ...next, scale: defaultScale });
      }
      return next;
    });
  }, [vp.w, vp.h, clamp, isNarrowViewport, isOverworld, defaultScale]);

  // Native wheel listener so we can preventDefault (React onWheel is passive).
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      zoomAt(factor, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Touch pan + pinch zoom, plus WebKit gesture events for iOS Safari.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const pinchRef: { current: { startDist: number; startScale: number } | null } = { current: null };
    const touchPanRef: {
      current: { x: number; y: number; originX: number; originY: number; moved: boolean } | null;
    } = { current: null };
    let gestureStartScale = 1;

    const onTouchStart = (e: TouchEvent) => {
      suppressClickRef.current = false;
      if (e.touches.length === 1) {
        const v = viewRef.current;
        touchPanRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          originX: v.x,
          originY: v.y,
          moved: false,
        };
        pinchRef.current = null;
      } else if (e.touches.length === 2) {
        touchPanRef.current = null;
        pinchRef.current = {
          startDist: touchDistance(e.touches),
          startScale: viewRef.current.scale,
        };
        suppressClickRef.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = el.getBoundingClientRect();

      if (e.touches.length === 1 && touchPanRef.current) {
        e.preventDefault();
        const pan = touchPanRef.current;
        const dx = e.touches[0].clientX - pan.x;
        const dy = e.touches[0].clientY - pan.y;
        if (!pan.moved && Math.hypot(dx, dy) > 4) {
          pan.moved = true;
          suppressClickRef.current = true;
        }
        setView((prev) => clamp({ ...prev, x: pan.originX + dx, y: pan.originY + dy }));
        return;
      }

      if (e.touches.length !== 2 || !pinchRef.current) return;
      e.preventDefault();
      const dist = touchDistance(e.touches);
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      zoomToScale(pinchRef.current.startScale * (dist / pinchRef.current.startDist), cx, cy);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        const pan = touchPanRef.current;
        if (pan && !pan.moved && !modalOpenRef.current) {
          const target = e.target as HTMLElement;
          if (!target.closest(".hoenn-map__pin")) {
            clearSelection();
          }
        }
        touchPanRef.current = null;
        pinchRef.current = null;
      } else if (e.touches.length === 1) {
        pinchRef.current = null;
        const v = viewRef.current;
        touchPanRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          originX: v.x,
          originY: v.y,
          moved: false,
        };
      }
    };

    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureStartScale = viewRef.current.scale;
    };

    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const ge = e as GestureEvent;
      const rect = el.getBoundingClientRect();
      zoomToScale(gestureStartScale * ge.scale, rect.width / 2, rect.height / 2);
    };

    const onGestureEnd = (e: Event) => {
      e.preventDefault();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    el.addEventListener("gestureend", onGestureEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
      el.removeEventListener("gestureend", onGestureEnd);
    };
  }, [clamp, zoomToScale, clearSelection]);

  const onViewportClick = () => {
    if (suppressClickRef.current || modalOpenRef.current) {
      suppressClickRef.current = false;
      return;
    }
    clearSelection();
  };

  const activateMarker = useCallback(
    (point: MapPoint) => {
      if (Date.now() < blockMapMarkerUntilRef.current) return;
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }

      if (isTrainerPoint(point)) {
        setSelectedId(point.id);
        setModalRoute(null);
        setModalGym(null);
        setModalTrainer(point);
        return;
      }
      if (point.category === "route") {
        setSelectedId(point.id);
        setModalRoute(point);
        setModalTrainer(null);
        setModalGym(null);
        return;
      }
      if (point.category === "gym") {
        setSelectedId(point.id);
        setModalGym(point);
        setModalTrainer(null);
        setModalRoute(null);
        return;
      }
      setModalTrainer(null);
      setModalRoute(null);
      setModalGym(null);
      setSelectedId((id) => (id === point.id ? null : point.id));
    },
    [],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: view.x,
      originY: view.y,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
    setView((prev) => clamp({ ...prev, x: drag.originX + dx, y: drag.originY + dy }));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (drag.moved) suppressClickRef.current = true;
    dragState.current = null;
  };

  const jumpToGuide = (point: MapPoint) => {
    if (!point.stepId) return;
    onSelectRegion({
      id: point.id,
      label: point.name,
      x: point.x,
      y: point.y,
      stepIds: [point.stepId],
    });
  };

  const toggleCategory = (id: PoiCategory) =>
    setVisible((v) => ({ ...v, [id]: !v[id] }));

  const setAllCategories = (on: boolean) => {
    setVisible((prev) => {
      const next = { ...prev };
      for (const c of activeCategories) next[c.id] = on;
      return next;
    });
    setSelectedId(null);
  };

  const anyVisible = activeCategories.some((c) => visible[c.id]);
  const isDragging = dragState.current !== null;

  return (
    <div className={`hoenn-map${compact ? " hoenn-map--compact" : ""}`}>
      <div className="hoenn-map__body">
        <div
          className={`hoenn-map__viewport ${isDragging ? "is-dragging" : ""}${!mapReady ? " hoenn-map__viewport--loading" : ""}${compactRouteLabels ? " hoenn-map__viewport--compact-routes" : ""}${modalRoute || modalTrainer || modalGym ? " hoenn-map__viewport--modal-open" : ""}`}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={onViewportClick}
        >
          <div
            className="hoenn-map__canvas"
            style={{
              width: `${canvasW}px`,
              height: `${canvasH}px`,
              transform: `translate(${view.x}px, ${view.y}px)`,
            }}
          >
            {useHoennWebp ? (
              <picture>
                <source srcSet={HOENN_MAP_WEBP} type="image/webp" />
                <img
                  src={imgSrc}
                  alt="Map of the Hoenn region"
                  className={`hoenn-map__image${mapReady ? "" : " hoenn-map__image--loading"}`}
                  decoding="async"
                  draggable={false}
                  onLoad={() => setMapReady(true)}
                />
              </picture>
            ) : (
              <img
                src={imgSrc}
                alt={currentArea!.name}
                className={`hoenn-map__image hoenn-map__image--pixel${mapReady ? "" : " hoenn-map__image--loading"}`}
                decoding="async"
                draggable={false}
                onLoad={() => setMapReady(true)}
              />
            )}
            {visiblePoints.map((point) => {
              const cat = POI_CATEGORIES.find((c) => c.id === point.category);
              const active = selectedId === point.id;
              const trainer = isTrainerPoint(point);
              return (
                <div
                  key={point.id}
                  role="button"
                  tabIndex={0}
                  className={`hoenn-map__pin hoenn-map__pin--${point.category} ${active ? "is-active" : ""}`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    ["--pin-color" as string]: cat?.color,
                    ...(trainer
                      ? {
                          ["--trainer-frame" as string]: point.spriteFrame,
                          ["--trainer-fw" as string]: point.spriteWidth,
                          ["--trainer-fh" as string]: point.spriteHeight,
                        }
                      : {}),
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    suppressClickRef.current = false;
                    pinPointerRef.current = {
                      pointerId: e.pointerId,
                      x: e.clientX,
                      y: e.clientY,
                      moved: false,
                    };
                  }}
                  onPointerMove={(e) => {
                    e.stopPropagation();
                    const p = pinPointerRef.current;
                    if (!p || p.pointerId !== e.pointerId) return;
                    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) p.moved = true;
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    const p = pinPointerRef.current;
                    if (!p || p.pointerId !== e.pointerId) return;
                    pinPointerRef.current = null;
                    if (p.moved) return;
                    if (e.pointerType === "touch") {
                      markerTouchHandledRef.current = true;
                      e.preventDefault();
                      activateMarker(point);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (markerTouchHandledRef.current) {
                      markerTouchHandledRef.current = false;
                      return;
                    }
                    activateMarker(point);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activateMarker(point);
                    }
                  }}
                  aria-label={point.name}
                >
                  {trainer ? (
                    <span
                      className="hoenn-map__trainer-frame"
                      aria-hidden="true"
                    >
                      <img
                        src={assetUrl(point.spriteSheet)}
                        alt=""
                        className="hoenn-map__trainer-sprite"
                        draggable={false}
                      />
                    </span>
                  ) : point.category === "route" ? (
                    <>
                      <span className="hoenn-map__pin-dot hoenn-map__pin-dot--route" aria-hidden="true" />
                      <span className="hoenn-map__pin-label">{point.name}</span>
                    </>
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
                  {!trainer && point.category !== "route" && active && (
                    <span className="hoenn-map__pin-tip" onClick={(e) => e.stopPropagation()}>
                      <span className="hoenn-map__pin-cat" style={{ color: cat?.color }}>
                        {cat?.label}
                      </span>
                      <strong>{point.name}</strong>
                      {point.desc && <span className="hoenn-map__pin-desc">{point.desc}</span>}
                      {point.note && <span className="hoenn-map__pin-note">{point.note}</span>}
                      {point.stepId && (
                        <button
                          type="button"
                          className="btn btn--primary btn--sm"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToGuide(point);
                          }}
                        >
                          Return to guide
                        </button>
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hoenn-map__controls">
            <button type="button" onClick={() => zoomButton(ZOOM_STEP)} aria-label="Zoom in">
              +
            </button>
            <button type="button" onClick={() => zoomButton(1 / ZOOM_STEP)} aria-label="Zoom out">
              −
            </button>
            <button type="button" onClick={fit} aria-label="Reset map view" title="Reset view">
              ⟳
            </button>
          </div>
        </div>
      </div>

      <aside className="hoenn-map__legend" aria-label="Map layers">
        <div className="hoenn-map__switcher">
          <label htmlFor="hoenn-map-select">Map</label>
          <select
            id="hoenn-map-select"
            className="hoenn-map__switcher-select"
            value={currentAreaId ?? ""}
            onChange={(e) => switchMap(e.target.value || null)}
          >
            <option value="">Hoenn Region (overworld)</option>
            {AREA_GROUPS.map(({ group, maps }) =>
              maps.length === 1 && !maps[0].floor ? (
                <option key={maps[0].id} value={maps[0].id}>
                  {group}
                </option>
              ) : (
                <optgroup key={group} label={group}>
                  {maps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.floor || a.name}
                    </option>
                  ))}
                </optgroup>
              ),
            )}
          </select>
          {currentArea && (
            <button
              type="button"
              className="hoenn-map__switcher-back"
              onClick={() => switchMap(null)}
            >
              ← Hoenn
            </button>
          )}
        </div>
        <div className="hoenn-map__legend-bar">
          <div className="hoenn-map__legend-head">
            <h4>Map layers</h4>
            <div className="hoenn-map__legend-actions">
              <button
                type="button"
                className="hoenn-map__legend-action"
                onClick={() => setAllCategories(false)}
                disabled={!anyVisible}
              >
                Clear all
              </button>
              <button
                type="button"
                className="hoenn-map__legend-action"
                onClick={() => setAllCategories(true)}
              >
                Show all
              </button>
            </div>
          </div>
          <ul>
            {activeCategories.map((cat) => {
              const points = basePoints.filter((p) => p.category === cat.id);
              const count =
                rematchableOnly && !currentArea && cat.id === "trainer"
                  ? points.filter((p) => isTrainerPoint(p) && p.rematchable).length
                  : points.length;
              const showRematchFilter =
                !currentArea && cat.id === "trainer" && points.length > 0;
              return (
                <li key={cat.id}>
                  <label className="hoenn-map__legend-item">
                    <input
                      type="checkbox"
                      checked={visible[cat.id]}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    <span className="hoenn-map__legend-swatch" style={{ background: cat.color }} />
                    <span className="hoenn-map__legend-label">{cat.label}</span>
                    <span className="hoenn-map__legend-count">
                      {rematchableOnly && !currentArea && cat.id === "trainer"
                        ? `${count}/${points.length}`
                        : count}
                    </span>
                  </label>
                  {showRematchFilter && (
                    <label className="hoenn-map__legend-subfilter">
                      <input
                        type="checkbox"
                        checked={rematchableOnly}
                        onChange={(e) => {
                          const on = e.target.checked;
                          setRematchableOnly(on);
                          if (on) setVisible((v) => (v.trainer ? v : { ...v, trainer: true }));
                        }}
                      />
                      <span>Rematchable only</span>
                      <span className="hoenn-map__legend-count">{overworldRematchTrainerCount}</span>
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {selectedPoint ? (
          <div className="hoenn-map__legend-detail">
            {isTrainerPoint(selectedPoint) ? (
              <div className="hoenn-map__trainer-summary">
                <TrainerPinHint trainer={selectedPoint} />
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setModalTrainer(selectedPoint)}
                >
                  View battle details
                </button>
              </div>
            ) : selectedPoint.category === "route" ? (
              <>
                <span
                  className="hoenn-map__pin-cat"
                  style={{ color: POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.color }}
                >
                  {POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.label}
                </span>
                <h5>{selectedPoint.name}</h5>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setModalRoute(selectedPoint)}
                >
                  View route guide
                </button>
                {selectedPoint.stepId && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => jumpToGuide(selectedPoint)}
                  >
                    Return to walkthrough
                  </button>
                )}
              </>
            ) : selectedPoint.category === "gym" ? (
              <>
                <span
                  className="hoenn-map__pin-cat"
                  style={{ color: POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.color }}
                >
                  {POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.label}
                </span>
                <h5>{selectedPoint.name}</h5>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setModalGym(selectedPoint)}
                >
                  View gym guide
                </button>
                {selectedPoint.stepId && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => jumpToGuide(selectedPoint)}
                  >
                    Return to walkthrough
                  </button>
                )}
              </>
            ) : (
              <>
                <span
                  className="hoenn-map__pin-cat"
                  style={{ color: POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.color }}
                >
                  {POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.label}
                </span>
                <h5>{selectedPoint.name}</h5>
                {selectedPoint.desc && <p className="hoenn-map__detail-desc">{selectedPoint.desc}</p>}
                {selectedPoint.note && <p className="hoenn-map__detail-note">{selectedPoint.note}</p>}
                {selectedPoint.stepId && (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => jumpToGuide(selectedPoint)}
                  >
                    Return to guide
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <p className="hoenn-map__hint">
            {isTouchDevice
              ? "Drag to pan, pinch to zoom. Tap a marker for details. Tap empty map to dismiss."
              : "Drag to pan, scroll or use + / − to zoom, and hover or click a marker for details."}
          </p>
        )}
      </aside>

      {!compact && (
      <div className="hoenn-map__index" aria-label="Items on the map">
        <div className="hoenn-map__index-head">
          <h4>On the map</h4>
          <p>
            Everything in the layers you've enabled. Click an entry to jump to it on the map.
          </p>
        </div>
        {groupedVisible.length === 0 ? (
          <p className="hoenn-map__hint">Enable a layer above to list its points here.</p>
        ) : (
          <div className="hoenn-map__index-groups">
            {groupedVisible.map(({ cat, points }) => (
              <section key={cat.id} className="hoenn-map__index-group">
                <h5>
                  <span className="hoenn-map__legend-swatch" style={{ background: cat.color }} />
                  {cat.label}
                  <span className="hoenn-map__index-count">{points.length}</span>
                </h5>
                <ul>
                  {points.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className={`hoenn-map__index-item ${selectedId === p.id ? "is-active" : ""}`}
                        onClick={() => {
                          focusPoint(p);
                          if (p.category === "route") {
                            setModalRoute(p);
                            setModalTrainer(null);
                            setModalGym(null);
                          } else if (p.category === "gym") {
                            setModalGym(p);
                            setModalTrainer(null);
                            setModalRoute(null);
                          } else if (isTrainerPoint(p)) {
                            setModalTrainer(p);
                            setModalRoute(null);
                            setModalGym(null);
                          }
                        }}
                      >
                        <span className="hoenn-map__index-name">{p.name}</span>
                        {p.note && <span className="hoenn-map__index-loc">{p.note}</span>}
                        {p.desc && <span className="hoenn-map__index-desc">{p.desc}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
      )}
      <GymDetailModal gymPoint={modalGym} onClose={closeGymModal} onJumpToGuide={jumpToGuide} />
      <RouteDetailModal
        route={modalRoute}
        onClose={closeRouteModal}
        onJumpToGuide={jumpToGuide}
      />
      <TrainerDetailModal trainer={modalTrainer} onClose={closeTrainerModal} />
    </div>
  );
}
