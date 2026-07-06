import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GuideCategory, GuideSection, GuideStep } from "../types";
import { getRegionForStep } from "../data/mapRegions";
import type { LayoutViewMode } from "../hooks/useViewMode";
import { ScreenshotGallery } from "./ScreenshotGallery";
import { StepDetails } from "./StepDetails";
import { StepEncounters } from "./EncounterTable";

interface StepBrowserProps {
  category: GuideCategory;
  sections: GuideSection[];
  onShowOnMap?: (stepId: string) => void;
  activeStepId?: string;
  onActiveStepChange?: (stepId: string) => void;
  viewMode?: LayoutViewMode;
}

interface FlatStep {
  step: GuideStep;
  sectionTitle: string;
  sectionId: string;
}

const SWIPE_MIN_PX = 56;
const SWIPE_MAX_VERTICAL_RATIO = 0.85;
const SWIPE_INTRO_KEY = "emerald-guide-swipe-intro-dismissed";

/** Mobile layout toggle or a touch-first device (phone/tablet). */
function useMobileGuideNav(viewMode: LayoutViewMode): boolean {
  const [touchDevice, setTouchDevice] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const onChange = () => setTouchDevice(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return viewMode === "mobile" || touchDevice;
}

/** Ignore swipes that start on maps, galleries, or form controls. */
function swipeShouldIgnore(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest(
    "input, textarea, select, button, a, .screenshots, .annotated-map, .area-map-view, .hoenn-map__viewport, .step-rail__panel",
  );
}

export function StepBrowser({
  category,
  sections,
  onShowOnMap,
  activeStepId,
  onActiveStepChange,
  viewMode = "desktop",
}: StepBrowserProps) {
  const mobileNav = useMobileGuideNav(viewMode);
  const flat = useMemo<FlatStep[]>(
    () =>
      sections.flatMap((section) =>
        section.steps.map((step) => ({ step, sectionTitle: section.title, sectionId: section.id })),
      ),
    [sections],
  );

  const [internalId, setInternalId] = useState<string | undefined>(flat[0]?.step.id);
  const [filter, setFilter] = useState("");
  const [railOpen, setRailOpen] = useState(false);
  const [swipeIntroDismissed, setSwipeIntroDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SWIPE_INTRO_KEY) === "1";
    } catch {
      return false;
    }
  });
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  const currentId = activeStepId ?? internalId;
  const currentIndex = Math.max(0, flat.findIndex((f) => f.step.id === currentId));
  const current = flat[currentIndex] ?? flat[0];

  const select = (id: string) => {
    setInternalId(id);
    onActiveStepChange?.(id);
    setRailOpen(false);
  };

  const goNext = useCallback(() => {
    if (currentIndex < flat.length - 1) select(flat[currentIndex + 1].step.id);
  }, [currentIndex, flat]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) select(flat[currentIndex - 1].step.id);
  }, [currentIndex, flat]);

  useEffect(() => {
    // Reset to first step when the category (sections) changes.
    if (!flat.some((f) => f.step.id === currentId)) {
      setInternalId(flat[0]?.step.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const dismissSwipeIntro = () => {
    setSwipeIntroDismissed(true);
    try {
      sessionStorage.setItem(SWIPE_INTRO_KEY, "1");
    } catch {
      /* private browsing */
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!mobileNav || e.touches.length !== 1 || swipeShouldIgnore(e.target)) {
      swipeRef.current = null;
      return;
    }
    swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!mobileNav || !swipeRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - swipeRef.current.x;
    const dy = touch.clientY - swipeRef.current.y;
    swipeRef.current = null;
    if (Math.abs(dx) < SWIPE_MIN_PX) return;
    if (Math.abs(dy) > Math.abs(dx) * SWIPE_MAX_VERTICAL_RATIO) return;
    dismissSwipeIntro();
    if (dx < 0) goNext();
    else goPrev();
  };

  const didMountScroll = useRef(false);
  useEffect(() => {
    if (!didMountScroll.current) {
      didMountScroll.current = true;
      return;
    }
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentId]);

  if (!current) return null;

  const q = filter.trim().toLowerCase();
  const region = getRegionForStep(current.step.id);

  const currentSection = sections.find((sec) =>
    sec.steps.some((s) => s.id === current.step.id),
  );
  const eventIndex = currentSection
    ? currentSection.steps.findIndex((s) => s.id === current.step.id)
    : 0;
  const eventTotal = currentSection ? currentSection.steps.length : 0;

  return (
    <div className="step-browser">
      <aside className={`step-rail ${railOpen ? "step-rail--open" : ""}`}>
        <button
          type="button"
          className="step-rail__toggle"
          aria-expanded={railOpen}
          onClick={() => setRailOpen((o) => !o)}
        >
          <span className="step-rail__toggle-icon" aria-hidden="true">☰</span>
          <span className="step-rail__toggle-text">
            <span className="step-rail__toggle-label">Steps</span>
            <span className="step-rail__toggle-current">
              {current.sectionTitle}
              {eventTotal > 0 ? ` · ${eventIndex + 1}/${eventTotal}` : ""}
            </span>
          </span>
          <span className="step-rail__toggle-caret" aria-hidden="true">▾</span>
        </button>
        <div className="step-rail__panel">
        <input
          type="search"
          className="step-rail__filter"
          placeholder="Filter steps…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <nav className="step-rail__nav">
          {sections.map((section) => {
            const steps = section.steps.filter(
              (s) =>
                !q ||
                s.title.toLowerCase().includes(q) ||
                s.location?.toLowerCase().includes(q) ||
                s.summary.toLowerCase().includes(q),
            );
            if (steps.length === 0) return null;
            return (
              <div key={section.id} className="step-rail__group">
                <p className="step-rail__group-title">{section.title}</p>
                {steps.map((s) => {
                  const eventNum = section.steps.findIndex((x) => x.id === s.id) + 1;
                  const active = s.id === currentId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`step-rail__item ${active ? "step-rail__item--active" : ""}`}
                      onClick={() => select(s.id)}
                    >
                      <span className="step-rail__num">{eventNum}</span>
                      <span className="step-rail__label">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
        </div>
      </aside>

      <div
        className="step-stage"
        ref={stageRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="step-stage__progress">
          <div
            className="step-stage__progress-bar"
            style={{ width: `${((currentIndex + 1) / flat.length) * 100}%` }}
          />
        </div>

        {mobileNav && (
          <>
            {!swipeIntroDismissed && (
              <div className="step-swipe-intro" role="status">
                <div className="step-swipe-intro__body">
                  <strong>Swipe to navigate</strong>
                  <p>
                    Swipe <strong>left</strong> for the next step and <strong>right</strong> to go
                    back. You can swipe anywhere on the guide except maps and screenshots.
                  </p>
                </div>
                <button
                  type="button"
                  className="step-swipe-intro__dismiss"
                  onClick={dismissSwipeIntro}
                >
                  Got it
                </button>
              </div>
            )}
            <p className="step-swipe-banner" role="note">
              <span className="step-swipe-banner__arrow" aria-hidden="true">
                ←
              </span>
              Swipe left or right to move through the guide
              <span className="step-swipe-banner__arrow" aria-hidden="true">
                →
              </span>
            </p>
          </>
        )}

        <article className="step-card">
          <span className="step-card__crumb">
            {current.sectionTitle}
            {eventTotal > 0 ? ` · Event ${eventIndex + 1} of ${eventTotal}` : ""}
          </span>
          <h2 className="step-card__title">{current.step.title}</h2>
          {current.step.location && <p className="step-card__location">{current.step.location}</p>}
          <p className="step-card__summary">{current.step.summary}</p>

          {current.step.story && current.step.story.length > 0 && (
            <div className="step-card__story">
              {current.step.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          <ScreenshotGallery stepId={current.step.id} compact />

          <StepDetails details={current.step.details} />

          {current.step.tips && current.step.tips.length > 0 && (
            <div className="step-card__tips">
              <strong>Tips</strong>
              <ul>
                {current.step.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {current.step.secrets && current.step.secrets.length > 0 && (
            <div className="step-card__secrets">
              <strong>Secrets &amp; extras</strong>
              <ul>
                {current.step.secrets.map((secret) => (
                  <li key={secret}>{secret}</li>
                ))}
              </ul>
            </div>
          )}

          <StepEncounters stepId={current.step.id} />

          <div className="step-card__footerrow">
            {current.step.tags && (
              <div className="step-card__tags">
                {current.step.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {region && onShowOnMap && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onShowOnMap(current.step.id)}
              >
                Show on Hoenn map
              </button>
            )}
          </div>
        </article>

        <div className="step-nav">
          <button
            type="button"
            className="btn"
            disabled={currentIndex === 0}
            onClick={() => goPrev()}
          >
            ← Previous
          </button>
          <span className="step-nav__counter">
            {currentIndex + 1} / {flat.length}
          </span>
          <button
            type="button"
            className="btn btn--primary"
            disabled={currentIndex >= flat.length - 1}
            onClick={() => goNext()}
          >
            {category === "walkthrough" ? "Next step" : "Next"} →
          </button>
        </div>
        {mobileNav ? (
          <p className="step-nav__swipe-hint">
            Swipe <strong>left</strong> for next · <strong>right</strong> for previous
          </p>
        ) : (
          <p className="step-nav__keys">Tip: use ← → arrow keys to move between steps.</p>
        )}
      </div>
    </div>
  );
}
