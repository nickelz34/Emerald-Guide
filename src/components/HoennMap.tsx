import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import type { MapRegion } from "../data/mapRegions";
import {
  ENTRANCE_STEP_IDS,
  MAP_POINTS,
  POI_CATEGORIES,
  DEFAULT_VISIBLE_CATEGORIES,
  type MapPoint,
  type PoiCategory,
} from "../data/mapPoints";
import { GENERATED_POINTS } from "../data/mapPointsGenerated";
import { LANDMARK_PINS_GENERATED } from "../data/mapLandmarksGenerated";
import { SHOP_PINS_GENERATED } from "../data/shopPinsGenerated";
import { ROUTE_POINTS } from "../data/mapRoutesGenerated";
import { AREA_MAPS, type AreaMap } from "../data/areaMaps";
import { AREA_MAP_ENTRANCES } from "../data/areaMapEntrancesGenerated";
import { AREA_MAP_ENTITIES } from "../data/areaMapEntitiesGenerated";
import {
  AREA_MAP_BAKE_MANIFEST,
  AREA_MAP_BAKE_SPRITE_SCALE,
} from "../data/areaMapBakeManifest";
import { GYM_MAP_ENTITIES } from "../data/gymMapEntitiesGenerated";
import { MAP_SELECTOR_GROUPS, mapSelectorLabel } from "../data/mapSelectorAreas";
import { AREA_TRAINERS, MAP_TRAINERS, type TrainerPoint } from "../data/mapTrainersGenerated";
import { TrainerDetailModal, TrainerPinHint } from "./TrainerDetailPanel";
import { MapPinVisual, MapSelectionVisual, isTrainerPoint, pinSpriteStyle } from "./MapPinVisual";
import { getCollectibleSprite } from "../data/itemSpritesGenerated";
import { RouteDetailModal } from "./EncounterTable";
import { GymDetailModal } from "./GymDetailModal";
import { MartDetailModal } from "./MartDetailModal";
import { isMartMapPoint } from "../data/martData";
import { fitPinPopups } from "../lib/fitMapPopup";
import { formatItemDescription } from "../lib/itemText";

const SHOP_NAMES = new Set([
  "Mart",
  "Herb Shop",
  "Department Store",
  "Bike Shop",
  "Pretty Petal Flower Shop",
  "Glass Workshop",
  "Decoration Shop",
  "Market",
]);

function asShopPoint(point: MapPoint): MapPoint {
  if (point.category === "entrance" && SHOP_NAMES.has(point.name)) {
    return { ...point, category: "shop" };
  }
  return point;
}

function withCleanItemDesc(point: MapPoint): MapPoint {
  if (!point.desc) return point;
  const desc = formatItemDescription(point.desc);
  return desc === point.desc ? point : { ...point, desc };
}

const ALL_POINTS: MapPoint[] = [
  ...MAP_POINTS,
  ...LANDMARK_PINS_GENERATED,
  ...GENERATED_POINTS,
  ...SHOP_PINS_GENERATED,
  ...ROUTE_POINTS,
].map(asShopPoint).map(withCleanItemDesc);

/** Convert an area map's markers into the MapPoint shape used by the pins/list. */
function areaPoints(area: AreaMap): MapPoint[] {
  const markers = [...area.markers, ...(AREA_MAP_ENTRANCES[area.id] ?? [])];
  return markers.map((m) =>
    withCleanItemDesc({
      id: m.id,
      name: m.name,
      category: m.category,
      x: m.x,
      y: m.y,
      desc: m.desc,
      note: area.name,
      pinCode: "code" in m ? (m as { code?: string }).code : undefined,
    }),
  );
}

/**
 * Trainers / NPCs for an area map: battle trainers + interior entities + gym
 * rosters, deduped (same sources AreaMapView uses, minus cutscene-only crops).
 */
function areaSpritePoints(areaId: string): TrainerPoint[] {
  const seen = new Set<string>();
  const out: TrainerPoint[] = [];
  for (const src of [
    AREA_TRAINERS[areaId],
    AREA_MAP_ENTITIES[areaId],
    GYM_MAP_ENTITIES[areaId],
  ]) {
    if (!src) continue;
    for (const p of src) {
      const key =
        ("trainerId" in p && p.trainerId) ||
        `${("script" in p && p.script) || p.name}-${p.x}-${p.y}`;
      if (seen.has(String(key))) continue;
      seen.add(String(key));
      out.push(p);
    }
  }
  return out;
}

/** Walkthrough step id for a map pin (hand points or linked entrances). */
function stepIdForPoint(point: MapPoint): string | undefined {
  return point.stepId ?? ENTRANCE_STEP_IDS[point.id];
}

/** Pins that show an on-map callout instead of opening a modal. */
function isMapCalloutPoint(point: MapPoint): boolean {
  return (
    !isTrainerPoint(point) &&
    !isMartMapPoint(point) &&
    point.category !== "route" &&
    point.category !== "gym"
  );
}

function initialVisible(): Record<PoiCategory, boolean> {
  const v = {} as Record<PoiCategory, boolean>;
  for (const c of POI_CATEGORIES) v[c.id] = DEFAULT_VISIBLE_CATEGORIES.includes(c.id);
  return v;
}

const HOENN_MAP_PNG = assetUrl("maps/hoenn-map.png");
const HOENN_MAP_WEBP = assetUrl("maps/hoenn-map.webp");
const HOENN_MAP_BAKED_PNG = assetUrl("maps/hoenn-map-baked.png");
const HOENN_MAP_BAKED_WEBP = assetUrl("maps/hoenn-map-baked.webp");
/**
 * When true, show baked trainers / items / hidden / berries with invisible hit
 * targets on the overworld and on area maps that have bake assets.
 * Uses one composite when every available bake layer is on; otherwise clean map
 * + only the visible category layers.
 * See `npm run bake:hoenn-overworld` / `npm run bake:area-maps`.
 */
const BAKE_MAP_SPRITES = true;
/** Keep in sync with `SPRITE_SCALE` in scripts/bake-hoenn-overworld-sprites.mjs */
const BAKE_OVERWORLD_SPRITE_SCALE = 2;
const BAKED_SPRITE_CATEGORIES = ["trainer", "item", "hidden", "berry"] as const;
type BakedSpriteCategory = (typeof BAKED_SPRITE_CATEGORIES)[number];

/** Invisible hit box matching the on-canvas baked sprite (feet-anchored at x%/y%). */
function bakedSpriteHitStyle(
  point: MapPoint,
  canvasW: number,
  canvasH: number,
  mapW: number,
  mapH: number,
  spriteScale: number,
): Record<string, string | number> {
  let fw = 16;
  let fh = 32;
  if (isTrainerPoint(point)) {
    fw = point.spriteWidth ?? 16;
    fh = point.spriteHeight ?? 32;
  } else {
    const collectible = getCollectibleSprite(point.category);
    if (collectible) {
      fw = collectible.spriteWidth;
      fh = collectible.spriteHeight;
    }
  }
  const w = ((fw * spriteScale) / mapW) * canvasW;
  const h = ((fh * spriteScale) / mapH) * canvasH;
  return {
    width: Math.max(12, w),
    height: Math.max(12, h),
    transform: "translate(-50%, -100%)",
    transformOrigin: "center bottom",
  };
}

function hoennBakeLayers(): Record<BakedSpriteCategory, { png: string; webp: string }> {
  return {
    trainer: {
      png: assetUrl("maps/hoenn-map-baked-trainer.png"),
      webp: assetUrl("maps/hoenn-map-baked-trainer.webp"),
    },
    item: {
      png: assetUrl("maps/hoenn-map-baked-item.png"),
      webp: assetUrl("maps/hoenn-map-baked-item.webp"),
    },
    hidden: {
      png: assetUrl("maps/hoenn-map-baked-hidden.png"),
      webp: assetUrl("maps/hoenn-map-baked-hidden.webp"),
    },
    berry: {
      png: assetUrl("maps/hoenn-map-baked-berry.png"),
      webp: assetUrl("maps/hoenn-map-baked-berry.webp"),
    },
  };
}

function areaBakeLayers(areaId: string): Record<BakedSpriteCategory, { png: string; webp: string }> {
  return {
    trainer: {
      png: assetUrl(`maps/areas/${areaId}-baked-trainer.png`),
      webp: assetUrl(`maps/areas/${areaId}-baked-trainer.webp`),
    },
    item: {
      png: assetUrl(`maps/areas/${areaId}-baked-item.png`),
      webp: assetUrl(`maps/areas/${areaId}-baked-item.webp`),
    },
    hidden: {
      png: assetUrl(`maps/areas/${areaId}-baked-hidden.png`),
      webp: assetUrl(`maps/areas/${areaId}-baked-hidden.webp`),
    },
    berry: {
      png: assetUrl(`maps/areas/${areaId}-baked-berry.png`),
      webp: assetUrl(`maps/areas/${areaId}-baked-berry.webp`),
    },
  };
}

/** Native pixel size of the source map (true-scale render, 16px per game tile). */
const MAP_W = 12800;
const MAP_H = 6128;

const MIN_SCALE = 1;
/** Slightly higher ceiling so baked overworld sprites stay readable on phones. */
const MAX_SCALE = 22;
const ZOOM_STEP = 1.35;
/** Narrow viewports start zoomed in so the overworld map is readable on phones. */
const NARROW_VIEWPORT_MAX = 900;
const MOBILE_DEFAULT_SCALE = 2.75;
/** Route text labels only appear once zoomed in past this (overworld map). */
const ROUTE_LABEL_MIN_SCALE = 3.25;
/** Session-scoped overworld pan/zoom so reopenings keep your last look. */
const HOENN_MAP_VIEW_KEY = "emerald-guide:hoenn-map-view";

interface View {
  /** Zoom multiplier relative to the "fit whole map" size. */
  scale: number;
  /** Top-left offset of the map canvas within the viewport, in px. */
  x: number;
  y: number;
}

function readSavedHoennMapView(): View | null {
  try {
    const raw = sessionStorage.getItem(HOENN_MAP_VIEW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<View>;
    if (
      typeof parsed.scale !== "number" ||
      typeof parsed.x !== "number" ||
      typeof parsed.y !== "number" ||
      !Number.isFinite(parsed.scale) ||
      !Number.isFinite(parsed.x) ||
      !Number.isFinite(parsed.y)
    ) {
      return null;
    }
    return {
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, parsed.scale)),
      x: parsed.x,
      y: parsed.y,
    };
  } catch {
    return null;
  }
}

function writeSavedHoennMapView(view: View) {
  try {
    sessionStorage.setItem(
      HOENN_MAP_VIEW_KEY,
      JSON.stringify({ scale: view.scale, x: view.x, y: view.y }),
    );
  } catch {
    // Ignore private mode / quota failures.
  }
}

interface HoennMapProps {
  onSelectRegion: (region: MapRegion) => void;
  /** Unused now, kept for compatibility with existing callers. */
  categoryStepIds?: Set<string>;
  /** Tighter layout for the walkthrough map modal (hides the index list). */
  compact?: boolean;
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

export function HoennMap({ onSelectRegion, compact = false }: HoennMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  /** Non-null when this mount restored a prior overworld camera from the session. */
  const restoredViewRef = useRef<View | null>(readSavedHoennMapView());
  const [view, setView] = useState<View>(
    () => restoredViewRef.current ?? { scale: 1, x: 0, y: 0 },
  );
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalTrainer, setModalTrainer] = useState<TrainerPoint | null>(null);
  const [modalRoute, setModalRoute] = useState<MapPoint | null>(null);
  const [modalGym, setModalGym] = useState<MapPoint | null>(null);
  const [modalMart, setModalMart] = useState<MapPoint | null>(null);
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
      currentArea ? areaSpritePoints(currentArea.id) : MAP_TRAINERS,
    [currentArea],
  );
  const basePoints = useMemo(
    () => [...(currentArea ? areaPoints(currentArea) : ALL_POINTS), ...trainerPoints],
    [currentArea, trainerPoints],
  );
  const areaBakeEntry =
    currentArea && BAKE_MAP_SPRITES ? AREA_MAP_BAKE_MANIFEST[currentArea.id] : undefined;
  /** AREA_TRAINERS ids covered by the area bake (layer paint and/or prebaked PNG). */
  const bakedAreaTrainerIds = useMemo(() => {
    if (!currentArea || !areaBakeEntry) return null;
    if (!areaBakeEntry.prebakedTrainers && !areaBakeEntry.layers.includes("trainer")) {
      return null;
    }
    return new Set((AREA_TRAINERS[currentArea.id] ?? []).map((t) => t.id));
  }, [currentArea, areaBakeEntry]);
  const bakeOverworld = BAKE_MAP_SPRITES && !currentArea;
  const bakeArea = Boolean(areaBakeEntry);
  const bakeSprites = bakeOverworld || bakeArea;
  const availableBakeLayers: BakedSpriteCategory[] = bakeOverworld
    ? [...BAKED_SPRITE_CATEGORIES]
    : (areaBakeEntry?.layers ?? []);
  const visibleBakeLayers = bakeSprites
    ? availableBakeLayers.filter((cat) => visible[cat])
    : [];
  /** One composite decode when every available bake layer is on; layers only when filtered. */
  const useBakeComposite =
    bakeSprites &&
    (availableBakeLayers.length === 0
      ? bakeArea // prebaked-only area: composite == base (+ nothing painted)
      : visibleBakeLayers.length === availableBakeLayers.length);
  const bakeSpriteScale = bakeArea ? AREA_MAP_BAKE_SPRITE_SCALE : BAKE_OVERWORLD_SPRITE_SCALE;
  const bakeLayerUrls = currentArea ? areaBakeLayers(currentArea.id) : hoennBakeLayers();
  const imgSrc = currentArea
    ? useBakeComposite
      ? assetUrl(`maps/areas/${currentArea.id}-baked.png`)
      : assetUrl(currentArea.image)
    : useBakeComposite
      ? HOENN_MAP_BAKED_PNG
      : HOENN_MAP_PNG;
  const useMapWebp = !currentArea || (bakeArea && useBakeComposite);
  const mapWebpSrc = !currentArea
    ? useBakeComposite
      ? HOENN_MAP_BAKED_WEBP
      : HOENN_MAP_WEBP
    : bakeArea && useBakeComposite
      ? assetUrl(`maps/areas/${currentArea.id}-baked.webp`)
      : undefined;
  const bakeLayersToShow = useBakeComposite ? [] : visibleBakeLayers;
  const mapImgRef = useRef<HTMLImageElement>(null);
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
  const desktopDragCleanupRef = useRef<(() => void) | null>(null);
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
    setModalMart(null);
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
    setSelectedId(null);
  }, []);

  const closeMartModal = useCallback(() => {
    blockMapMarkerUntilRef.current = Date.now() + 600;
    setModalMart(null);
    setSelectedId(null);
  }, []);

  useLayoutEffect(() => {
    setMapReady(false);
    const img = mapImgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setMapReady(true);
    }
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
  modalOpenRef.current =
    modalRoute !== null || modalTrainer !== null || modalGym !== null || modalMart !== null;

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

  /** Clamp a camera against an explicit map aspect ratio (for map switches). */
  const clampForAr = useCallback(
    (v: View, ar: number): View => {
      const w = vp.w;
      const h = vp.h;
      const fw = (w && h ? Math.min(w, h * ar) : w) || 0;
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale));
      const cw = fw * scale;
      const ch = cw / ar;
      let { x, y } = v;
      x = cw <= w ? (w - cw) / 2 : Math.min(0, Math.max(w - cw, x));
      y = ch <= h ? (h - ch) / 2 : Math.min(0, Math.max(h - ch, y));
      return { scale, x, y };
    },
    [vp.w, vp.h],
  );

  /** Switch the displayed map (null = overworld composite). */
  const switchMap = useCallback(
    (areaId: string | null) => {
      setCurrentAreaId(areaId);
      setSelectedId(null);
      setRematchableOnly(false);
      const area = areaId ? (AREA_MAPS.find((a) => a.id === areaId) ?? null) : null;
      if (area) {
        // Area maps exist to show their items — turn those layers on by default.
        const next = {} as Record<PoiCategory, boolean>;
        for (const c of POI_CATEGORIES) next[c.id] = false;
        for (const m of area.markers) next[m.category] = true;
        for (const m of AREA_MAP_ENTRANCES[areaId!] ?? []) next[m.category] = true;
        if (areaSpritePoints(areaId!).length) next.trainer = true;
        setVisible(next);
      } else {
        setVisible(initialVisible());
      }
      // Fit the *incoming* map. Do not reuse overworld mobile zoom on area maps —
      // that leaves small interiors extremely zoomed in.
      const ar = area ? area.width / area.height : MAP_W / MAP_H;
      if (area) {
        setView(clampForAr({ scale: 1, x: 0, y: 0 }, ar));
      } else {
        const narrow = vp.w > 0 && vp.w <= NARROW_VIEWPORT_MAX;
        const saved = readSavedHoennMapView();
        setView(
          clampForAr(
            saved ?? { scale: narrow ? MOBILE_DEFAULT_SCALE : 1, x: 0, y: 0 },
            ar,
          ),
        );
      }
    },
    [clampForAr, vp.w],
  );

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
      // Fresh sessions only: bump a "fit whole map" view to the mobile default zoom.
      // Do not override a camera restored from earlier in this browser session.
      if (
        !restoredViewRef.current &&
        isNarrowViewport &&
        isOverworld &&
        v.scale === 1 &&
        defaultScale > 1
      ) {
        return clamp({ ...next, scale: defaultScale });
      }
      return next;
    });
  }, [vp.w, vp.h, clamp, isNarrowViewport, isOverworld, defaultScale]);

  // Remember overworld pan/zoom for the rest of this browser session.
  useEffect(() => {
    if (!isOverworld || !vp.w || !vp.h) return;
    writeSavedHoennMapView(view);
    restoredViewRef.current = view;
  }, [view, isOverworld, vp.w, vp.h]);

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
        setModalMart(null);
        setModalTrainer(point);
        return;
      }
      if (point.category === "route" || point.category === "town") {
        setSelectedId(point.id);
        setModalRoute(point);
        setModalTrainer(null);
        setModalGym(null);
        setModalMart(null);
        return;
      }
      if (point.category === "gym") {
        setSelectedId(point.id);
        setModalGym(point);
        setModalTrainer(null);
        setModalRoute(null);
        setModalMart(null);
        return;
      }
      if (isMartMapPoint(point)) {
        setSelectedId(point.id);
        setModalMart(point);
        setModalTrainer(null);
        setModalRoute(null);
        setModalGym(null);
        return;
      }
      setModalTrainer(null);
      setModalRoute(null);
      setModalGym(null);
      setModalMart(null);
      setSelectedId((id) => (id === point.id ? null : point.id));
    },
    [],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === "touch") return;

    const target = e.target as HTMLElement;
    if (target.closest("button, input, select, textarea, a, .hoenn-map__selection, .hoenn-map__pin")) return;

    desktopDragCleanupRef.current?.();
    desktopDragCleanupRef.current = null;

    const viewport = e.currentTarget as HTMLElement;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add("is-dragging");
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: view.x,
      originY: view.y,
      moved: false,
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", onDesktopPointerMove, true);
      window.removeEventListener("pointerup", onDesktopPointerEnd, true);
      window.removeEventListener("pointercancel", onDesktopPointerEnd, true);
    };

    const finishDrag = (pointerId: number) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== pointerId) return;
      if (drag.moved) suppressClickRef.current = true;
      dragState.current = null;
      desktopDragCleanupRef.current = null;
      cleanup();
      if (viewport.hasPointerCapture(pointerId)) {
        viewport.releasePointerCapture(pointerId);
      }
      viewport.classList.remove("is-dragging");
    };

    function onDesktopPointerMove(event: PointerEvent) {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
      setView((prev) => clamp({ ...prev, x: drag.originX + dx, y: drag.originY + dy }));
      event.preventDefault();
    }

    function onDesktopPointerEnd(event: PointerEvent) {
      if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;
      finishDrag(event.pointerId);
      event.preventDefault();
    }

    desktopDragCleanupRef.current = cleanup;
    window.addEventListener("pointermove", onDesktopPointerMove, true);
    window.addEventListener("pointerup", onDesktopPointerEnd, true);
    window.addEventListener("pointercancel", onDesktopPointerEnd, true);
    e.preventDefault();
  };

  useEffect(() => {
    return () => {
      desktopDragCleanupRef.current?.();
      desktopDragCleanupRef.current = null;
    };
  }, []);

  const jumpToGuide = (point: MapPoint) => {
    const stepId = stepIdForPoint(point);
    if (!stepId) return;
    onSelectRegion({
      id: point.id,
      label: point.name,
      x: point.x,
      y: point.y,
      stepIds: [stepId],
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
          className={`hoenn-map__viewport ${isDragging ? "is-dragging" : ""}${!mapReady ? " hoenn-map__viewport--loading" : ""}${compactRouteLabels ? " hoenn-map__viewport--compact-routes" : ""}${modalRoute || modalTrainer || modalGym || modalMart ? " hoenn-map__viewport--modal-open" : ""}`}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onClick={onViewportClick}
        >
          <div
            className="hoenn-map__canvas"
            style={{
              width: `${canvasW}px`,
              height: `${canvasH}px`,
              transform: `translate(${view.x}px, ${view.y}px)`,
              // Area maps: live sprites sized in native map pixels (scale with zoom).
              // Overworld: keep 1 — trainers/items are baked into the atlas; town/gym
              // UI pins stay screen-readable at a fixed size.
              ["--hoenn-map-px" as string]:
                currentArea && mapW > 0 ? canvasW / mapW : 1,
            }}
          >
            {useMapWebp && mapWebpSrc ? (
              <picture>
                <source srcSet={mapWebpSrc} type="image/webp" />
                <img
                  ref={mapImgRef}
                  src={imgSrc}
                  alt={currentArea ? currentArea.name : "Map of the Hoenn region"}
                  className={`hoenn-map__image${currentArea ? " hoenn-map__image--pixel" : ""}${mapReady ? "" : " hoenn-map__image--loading"}`}
                  decoding="async"
                  draggable={false}
                  onLoad={() => setMapReady(true)}
                />
              </picture>
            ) : (
              <img
                ref={mapImgRef}
                src={imgSrc}
                alt={currentArea ? currentArea.name : "Map of the Hoenn region"}
                className={`hoenn-map__image${currentArea ? " hoenn-map__image--pixel" : ""}${mapReady ? "" : " hoenn-map__image--loading"}`}
                decoding="async"
                draggable={false}
                onLoad={() => setMapReady(true)}
              />
            )}
            {bakeLayersToShow.map((cat) => {
              const layer = bakeLayerUrls[cat];
              return (
                <picture key={`bake-${cat}`}>
                  <source srcSet={layer.webp} type="image/webp" />
                  <img
                    src={layer.png}
                    alt=""
                    className="hoenn-map__image hoenn-map__bake-layer"
                    decoding="async"
                    draggable={false}
                    aria-hidden="true"
                  />
                </picture>
              );
            })}
            {visiblePoints.map((point) => {
              const cat = POI_CATEGORIES.find((c) => c.id === point.category);
              const active = selectedId === point.id;
              const trainer = isTrainerPoint(point);
              const bakedCollectible =
                bakeSprites &&
                (point.category === "item" ||
                  point.category === "hidden" ||
                  point.category === "berry") &&
                (bakeOverworld || availableBakeLayers.includes(point.category));
              const bakedTrainer =
                point.category === "trainer" &&
                (bakeOverworld ||
                  Boolean(bakedAreaTrainerIds?.has(point.id)));
              const baked = bakedCollectible || bakedTrainer;
              return (
                <div
                  key={point.id}
                  role="button"
                  tabIndex={0}
                  className={`hoenn-map__pin ${
                    baked
                      ? "hoenn-map__pin--baked-overworld"
                      : `hoenn-map__pin--${point.category}`
                  } ${point.pinCode ? "has-code" : ""} ${active ? "is-active" : ""}`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    ["--pin-color" as string]: cat?.color,
                    ...(baked
                      ? bakedSpriteHitStyle(
                          point,
                          canvasW,
                          canvasH,
                          mapW,
                          mapH,
                          bakeSpriteScale,
                        )
                      : pinSpriteStyle(point)),
                  }}
                  onPointerDown={(e) => {
                    // Keep pin taps/clicks from starting a map pan (desktop + touch).
                    e.stopPropagation();
                    suppressClickRef.current = false;
                    if (e.pointerType === "touch") {
                      pinPointerRef.current = {
                        pointerId: e.pointerId,
                        x: e.clientX,
                        y: e.clientY,
                        moved: false,
                      };
                    } else {
                      pinPointerRef.current = null;
                    }
                  }}
                  onMouseEnter={(e) => {
                    const pin = e.currentTarget;
                    requestAnimationFrame(() => fitPinPopups(pin, viewportRef.current));
                  }}
                  onFocus={(e) => {
                    const pin = e.currentTarget;
                    requestAnimationFrame(() => fitPinPopups(pin, viewportRef.current));
                  }}
                  onPointerMove={(e) => {
                    const p = pinPointerRef.current;
                    if (!p) return;
                    e.stopPropagation();
                    if (p.pointerId !== e.pointerId) return;
                    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) p.moved = true;
                  }}
                  onPointerUp={(e) => {
                    const p = pinPointerRef.current;
                    if (!p) return;
                    e.stopPropagation();
                    if (p.pointerId !== e.pointerId) return;
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
                    const pin = e.currentTarget;
                    requestAnimationFrame(() => fitPinPopups(pin, viewportRef.current));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activateMarker(point);
                      const pin = e.currentTarget;
                      requestAnimationFrame(() => fitPinPopups(pin, viewportRef.current));
                    }
                  }}
                  aria-label={point.name}
                >
                  {baked ? null : point.category === "route" ? (
                    <>
                      <span className="hoenn-map__pin-dot hoenn-map__pin-dot--route" aria-hidden="true" />
                      <span className="hoenn-map__pin-label">{point.name}</span>
                    </>
                  ) : (
                    <MapPinVisual point={point} />
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
                  {!trainer && point.category !== "route" && active && !isMapCalloutPoint(point) && (
                    <span className="hoenn-map__pin-tip" onClick={(e) => e.stopPropagation()}>
                      <span className="hoenn-map__pin-cat" style={{ color: cat?.color }}>
                        {cat?.label}
                      </span>
                      <strong>{point.name}</strong>
                      {point.desc && <span className="hoenn-map__pin-desc">{point.desc}</span>}
                      {point.note && <span className="hoenn-map__pin-note">{point.note}</span>}
                      {stepIdForPoint(point) && (
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

          {selectedPoint && isMapCalloutPoint(selectedPoint) && (
            <div
              className="hoenn-map__selection"
              role="status"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="hoenn-map__selection-close"
                aria-label="Dismiss"
                onClick={clearSelection}
              >
                ×
              </button>
              <MapSelectionVisual point={selectedPoint} />
              <div className="hoenn-map__selection-body">
                <span
                  className="hoenn-map__pin-cat"
                  style={{
                    color: POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.color,
                  }}
                >
                  {POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.label}
                </span>
                <strong className="hoenn-map__selection-name">{selectedPoint.name}</strong>
                {selectedPoint.desc && (
                  <p className="hoenn-map__selection-desc">{selectedPoint.desc}</p>
                )}
                {selectedPoint.note && (
                  <p className="hoenn-map__selection-note">{selectedPoint.note}</p>
                )}
                {stepIdForPoint(selectedPoint) && (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => jumpToGuide(selectedPoint)}
                  >
                    Return to guide
                  </button>
                )}
              </div>
            </div>
          )}
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
            {MAP_SELECTOR_GROUPS.map(({ group, maps }) =>
              maps.length === 1 && mapSelectorLabel(maps[0]) === maps[0].name ? (
                <option key={maps[0].id} value={maps[0].id}>
                  {group}
                </option>
              ) : (
                <optgroup key={group} label={group}>
                  {maps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {mapSelectorLabel(a)}
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
        {selectedPoint && !isMapCalloutPoint(selectedPoint) ? (
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
                {stepIdForPoint(selectedPoint) && (
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
                {stepIdForPoint(selectedPoint) && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => jumpToGuide(selectedPoint)}
                  >
                    Return to walkthrough
                  </button>
                )}
              </>
            ) : isMartMapPoint(selectedPoint) ? (
              <>
                <span
                  className="hoenn-map__pin-cat"
                  style={{ color: POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.color }}
                >
                  Shop
                </span>
                <h5>
                  {selectedPoint.note ? `${selectedPoint.note} ` : ""}
                  {selectedPoint.name}
                </h5>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setModalMart(selectedPoint)}
                >
                  View shop stock
                </button>
                {stepIdForPoint(selectedPoint) && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => jumpToGuide(selectedPoint)}
                  >
                    Return to walkthrough
                  </button>
                )}
              </>
            ) : selectedPoint.category === "town" ? (
              <>
                <span
                  className="hoenn-map__pin-cat"
                  style={{ color: POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.color }}
                >
                  {POI_CATEGORIES.find((c) => c.id === selectedPoint.category)?.label}
                </span>
                <h5>{selectedPoint.name}</h5>
                {selectedPoint.note && <p className="hoenn-map__detail-note">{selectedPoint.note}</p>}
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setModalRoute(selectedPoint)}
                >
                  View town guide
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
              null
            )}
          </div>
        ) : (
          <p className="hoenn-map__hint">
            {selectedPoint && isMapCalloutPoint(selectedPoint)
              ? "Tap empty map or × to dismiss the marker details."
              : isTouchDevice
                ? "Drag to pan, pinch to zoom. Tap a marker for details. Tap empty map to dismiss."
                : "Drag to pan, scroll or use + / − to zoom, and click a marker for details."}
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
                          if (p.category === "route" || p.category === "town") {
                            setModalRoute(p);
                            setModalTrainer(null);
                            setModalGym(null);
                            setModalMart(null);
                          } else if (p.category === "gym") {
                            setModalGym(p);
                            setModalTrainer(null);
                            setModalRoute(null);
                            setModalMart(null);
                          } else if (isMartMapPoint(p)) {
                            setModalMart(p);
                            setModalTrainer(null);
                            setModalRoute(null);
                            setModalGym(null);
                          } else if (isTrainerPoint(p)) {
                            setModalTrainer(p);
                            setModalRoute(null);
                            setModalGym(null);
                            setModalMart(null);
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
      <MartDetailModal martPoint={modalMart} onClose={closeMartModal} onJumpToGuide={jumpToGuide} />
      <RouteDetailModal
        route={modalRoute}
        onClose={closeRouteModal}
        onJumpToGuide={jumpToGuide}
      />
      <TrainerDetailModal trainer={modalTrainer} onClose={closeTrainerModal} />
    </div>
  );
}
