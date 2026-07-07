import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { LayoutViewMode } from "../hooks/useViewMode";
import type { StepScreenshot } from "../data/stepImages";
import { preloadStepMapImages } from "../lib/preloadMapImages";
import { HoennCrop } from "./HoennCrop";
import { AreaMapView } from "./AreaMapView";

interface LightboxState {
  images: StepScreenshot[];
  index: number;
  areaId?: string;
}

interface LightboxContextValue {
  open: (images: StepScreenshot[], index?: number, areaId?: string) => void;
  close: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({
  children,
  viewMode = "desktop",
}: {
  children: ReactNode;
  viewMode?: LayoutViewMode;
}) {
  const [state, setState] = useState<LightboxState | null>(null);

  const open = useCallback((images: StepScreenshot[], index = 0, areaId?: string) => {
    setState({ images, index, areaId });
  }, []);

  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return;
    preloadStepMapImages(state.images);
    (document.activeElement as HTMLElement | null)?.blur();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close]);

  const prev = () => {
    if (!state) return;
    setState({ ...state, index: (state.index - 1 + state.images.length) % state.images.length });
  };

  const next = () => {
    if (!state) return;
    setState({ ...state, index: (state.index + 1) % state.images.length });
  };

  const current = state?.images[state.index];

  return (
    <LightboxContext.Provider value={{ open, close }}>
      {children}
      {state && current && (
        <div className="lightbox" data-view={viewMode} role="dialog" aria-modal="true" onClick={close}>
          <div className="lightbox__panel lightbox__panel--annotated" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox__close" onClick={close} aria-label="Close">
              ×
            </button>
            {current.areaMapId ? (
              <AreaMapView
                key={current.areaMapId + state.index}
                areaMapId={current.areaMapId}
                caption={current.caption}
                showLegend
                variant="lightbox"
              />
            ) : current.crop ? (
              <HoennCrop
                key={current.src + state.index}
                crop={current.crop}
                caption={current.caption}
                areaId={current.areaId ?? state.areaId}
                showLegend
                variant="lightbox"
              />
            ) : null}
            {state.images.length > 1 && (
              <div className="lightbox__footer">
                <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Previous">
                  <svg className="lightbox__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <p className="lightbox__counter">
                  {state.index + 1} / {state.images.length}
                </p>
                <button type="button" className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Next">
                  <svg className="lightbox__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
