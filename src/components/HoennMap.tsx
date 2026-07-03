import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import type { MapRegion } from "../data/mapRegions";
import {
  MAP_POINTS,
  POI_CATEGORIES,
  DEFAULT_VISIBLE_CATEGORIES,
  type MapPoint,
  type PoiCategory,
} from "../data/mapPoints";
import { GENERATED_POINTS } from "../data/mapPointsGenerated";

const ALL_POINTS: MapPoint[] = [...MAP_POINTS, ...GENERATED_POINTS];

function initialVisible(): Record<PoiCategory, boolean> {
  const v = {} as Record<PoiCategory, boolean>;
  for (const c of POI_CATEGORIES) v[c.id] = DEFAULT_VISIBLE_CATEGORIES.includes(c.id);
  return v;
}

const HOENN_MAP_SRC = assetUrl("maps/hoenn-map.png");

/** Native pixel size of the source map (true-scale render, 16px per game tile). */
const MAP_W = 12800;
const MAP_H = 6128;
const MAP_AR = MAP_W / MAP_H;

const MIN_SCALE = 1;
const MAX_SCALE = 14;
const ZOOM_STEP = 1.35;

interface HoennMapProps {
  activeStepId?: string;
  onSelectRegion: (region: MapRegion) => void;
  /** Unused now, kept for compatibility with existing callers. */
  categoryStepIds?: Set<string>;
}

interface View {
  /** Zoom multiplier relative to the "fit whole map" size. */
  scale: number;
  /** Top-left offset of the map canvas within the viewport, in px. */
  x: number;
  y: number;
}

export function HoennMap({ onSelectRegion }: HoennMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visible, setVisible] = useState<Record<PoiCategory, boolean>>(initialVisible);

  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const visiblePoints = useMemo(
    () => ALL_POINTS.filter((p) => visible[p.category]),
    [visible],
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
        points: ALL_POINTS.filter((p) => p.category === cat.id).sort(
          (a, b) =>
            (a.note ?? "").localeCompare(b.note ?? "") || a.name.localeCompare(b.name),
        ),
      }))
      .filter((g) => g.points.length > 0);
  }, [visible]);

  /** Width the map occupies at scale 1 (whole map contained in the viewport). */
  const fitW = vp.w && vp.h ? Math.min(vp.w, vp.h * MAP_AR) : vp.w;

  const canvasW = fitW * view.scale;
  const canvasH = canvasW / MAP_AR;

  /** Clamp the pan offset so the map stays sensibly framed; center when smaller. */
  const clamp = useCallback(
    (v: View): View => {
      const w = vp.w;
      const h = vp.h;
      const fw = (w && h ? Math.min(w, h * MAP_AR) : w) || 0;
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale));
      const cw = fw * scale;
      const ch = cw / MAP_AR;
      let { x, y } = v;
      x = cw <= w ? (w - cw) / 2 : Math.min(0, Math.max(w - cw, x));
      y = ch <= h ? (h - ch) / 2 : Math.min(0, Math.max(h - ch, y));
      return { scale, x, y };
    },
    [vp.w, vp.h],
  );

  const fit = useCallback(() => setView(clamp({ scale: 1, x: 0, y: 0 })), [clamp]);

  /** Select a point and pan/zoom the map so it sits in the middle of the view. */
  const focusPoint = useCallback(
    (p: MapPoint) => {
      setSelectedId(p.id);
      setView((prev) => {
        const targetScale = Math.max(prev.scale, 6);
        const cw = fitW * targetScale;
        const ch = cw / MAP_AR;
        const px = (p.x / 100) * cw;
        const py = (p.y / 100) * ch;
        return clamp({ scale: targetScale, x: vp.w / 2 - px, y: vp.h / 2 - py });
      });
    },
    [clamp, fitW, vp.w, vp.h],
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
    setView((v) => clamp(v));
  }, [vp.w, vp.h, clamp]);

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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
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
    dragState.current = null;
  };

  const handleMarkerClick = (point: MapPoint) => {
    if (dragState.current?.moved) return;
    setSelectedId((id) => (id === point.id ? null : point.id));
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
    const next = {} as Record<PoiCategory, boolean>;
    for (const c of POI_CATEGORIES) next[c.id] = on;
    setVisible(next);
    setSelectedId(null);
  };

  const anyVisible = POI_CATEGORIES.some((c) => visible[c.id]);
  const isDragging = dragState.current !== null;

  return (
    <div className="hoenn-map">
      <div className="hoenn-map__body">
        <div
          className={`hoenn-map__viewport ${isDragging ? "is-dragging" : ""}`}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="hoenn-map__canvas"
            style={{
              width: `${canvasW}px`,
              height: `${canvasH}px`,
              transform: `translate(${view.x}px, ${view.y}px)`,
            }}
          >
            <img
              src={HOENN_MAP_SRC}
              alt="Map of the Hoenn region"
              className="hoenn-map__image"
              draggable={false}
            />
            {visiblePoints.map((point) => {
              const cat = POI_CATEGORIES.find((c) => c.id === point.category);
              const active = selectedId === point.id;
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
                  onClick={() => handleMarkerClick(point)}
                  aria-label={point.name}
                >
                  <span className="hoenn-map__pin-dot" />
                  {!active && (
                    <span className="hoenn-map__pin-hint" aria-hidden="true">
                      <span className="hoenn-map__pin-cat" style={{ color: cat?.color }}>
                        {cat?.label}
                      </span>
                      <span className="hoenn-map__pin-hint-name">{point.name}</span>
                    </span>
                  )}
                  {active && (
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
                          onClick={() => jumpToGuide(point)}
                        >
                          View guide steps
                        </button>
                      )}
                    </span>
                  )}
                </button>
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
            {POI_CATEGORIES.map((cat) => {
              const count = ALL_POINTS.filter((p) => p.category === cat.id).length;
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
                    <span className="hoenn-map__legend-count">{count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
        {selectedPoint ? (
          <div className="hoenn-map__legend-detail">
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
                View guide steps
              </button>
            )}
          </div>
        ) : (
          <p className="hoenn-map__hint">
            Drag to pan, scroll or use + / − to zoom, and click a marker for details.
          </p>
        )}
      </aside>

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
                        onClick={() => focusPoint(p)}
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
    </div>
  );
}
