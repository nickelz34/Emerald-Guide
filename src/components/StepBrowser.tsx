import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GuideCategory, GuideSection, GuideStep } from "../types";
import { getRegionForStep } from "../data/mapRegions";
import type { LayoutViewMode } from "../hooks/useViewMode";
import { ScreenshotGallery } from "./ScreenshotGallery";
import { StepDetails } from "./StepDetails";
import { StepEncounters } from "./EncounterTable";
import { StepSecretsExtras } from "./StepSecretsExtras";
import { GymGuidePanel } from "./GymGuidePanel";
import { RivalGuidePanelForStep } from "./RivalGuidePanel";
import { HmUnlockTable } from "./HmUnlockTable";
import { KeyItemsTable } from "./KeyItemsTable";
import { ScottSightingsPanel } from "./ScottSightingsPanel";
import { MatchCallRematchPanel } from "./MatchCallRematchPanel";
import { MatchCallSchedulePanel } from "./MatchCallSchedulePanel";
import { getGymForWalkthroughStep } from "../data/gymData";
import { getRivalForWalkthroughStep } from "../data/rivalData";
import { BreedingLookup } from "./BreedingLookup";
import { BreedingChart } from "./BreedingChart";
import { EvolutionChart } from "./EvolutionChart";
import { PREGAME_EVOLUTION_CHARTS } from "../data/evolutionCharts";
import { PREGAME_BREEDING_CHARTS } from "../data/breedingCharts";
import {
  filterWalkthroughSteps,
  walkthroughMatchFieldLabel,
} from "../data/walkthroughSearch";
import type { WalkthroughPreferences } from "../hooks/useWalkthroughPreferences";
import { encodeSaveCode } from "../lib/saveCode";

interface StepBrowserProps {
  category: GuideCategory;
  sections: GuideSection[];
  onShowOnMap?: (stepId: string) => void;
  activeStepId?: string;
  onActiveStepChange?: (stepId: string) => void;
  viewMode?: LayoutViewMode;
  walkthroughPrefs?: WalkthroughPreferences;
  onOpenGuideSettings?: () => void;
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

/** Ignore swipes on form controls, the step rail, and pannable map surfaces. */
function swipeShouldIgnore(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest(
    [
      "input",
      "textarea",
      "select",
      "button",
      "a",
      ".step-rail",
      ".annotated-map__frame--zoomable",
      ".annotated-map__frame--panoramic",
      ".hoenn-map__viewport",
    ].join(", "),
  );
}

export function StepBrowser({
  category,
  sections,
  onShowOnMap,
  activeStepId,
  onActiveStepChange,
  viewMode = "desktop",
  walkthroughPrefs,
  onOpenGuideSettings,
}: StepBrowserProps) {
  const mobileNav = useMobileGuideNav(viewMode);
  const flat = useMemo<FlatStep[]>(
    () =>
      sections.flatMap((section) =>
        section.steps.map((step) => ({ step, sectionTitle: section.title, sectionId: section.id })),
      ),
    [sections],
  );

  const [internalId, setInternalId] = useState<string | undefined>(
    () => activeStepId ?? flat[0]?.step.id,
  );
  const [filter, setFilter] = useState("");
  const [railOpen, setRailOpen] = useState(false);
  const [saveCode, setSaveCode] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
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
  const gymForStep = current ? getGymForWalkthroughStep(current.step.id) : undefined;
  const rivalForStep = current ? getRivalForWalkthroughStep(current.step.id) : undefined;
  const showHmTable = current?.step.id === "rustboro-1";
  const showKeyItemsTable = current?.step.id === "rusturf-tunnel-2";
  const showScottChecklist = current?.step.id === "battle-frontier-2";
  const showMatchCallRematch = current?.step.id === "postgame-hoenn-6";
  const showBreedingLookup = current?.step.tags?.includes("breeding-lookup");
  const evolutionChart = current ? PREGAME_EVOLUTION_CHARTS[current.step.id] : undefined;
  const breedingChart = current ? PREGAME_BREEDING_CHARTS[current.step.id] : undefined;

  const flatIndexById = useMemo(() => {
    const map = new Map<string, number>();
    flat.forEach((entry, index) => map.set(entry.step.id, index));
    return map;
  }, [flat]);

  const select = useCallback(
    (id: string) => {
      setInternalId(id);
      onActiveStepChange?.(id);
      setRailOpen(false);
      setSaveCode(null);
      setCopyStatus("idle");
    },
    [onActiveStepChange],
  );

  const goNext = useCallback(() => {
    if (currentIndex < flat.length - 1) select(flat[currentIndex + 1].step.id);
  }, [currentIndex, flat, select]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) select(flat[currentIndex - 1].step.id);
  }, [currentIndex, flat, select]);

  const handleSaveProgress = useCallback(async () => {
    if (!walkthroughPrefs || !current?.step.id) return;
    const code = encodeSaveCode({
      skipPregame: walkthroughPrefs.skipPregame,
      playMode: walkthroughPrefs.playMode,
      stepId: current.step.id,
    });
    if (!code) return;
    setSaveCode(code);
    setCopyStatus("idle");
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }, [walkthroughPrefs, current?.step.id]);

  useEffect(() => {
    if (activeStepId) setInternalId(activeStepId);
  }, [activeStepId]);

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

  const dismissSwipeIntro = useCallback(() => {
    setSwipeIntroDismissed(true);
    try {
      sessionStorage.setItem(SWIPE_INTRO_KEY, "1");
    } catch {
      /* private browsing */
    }
  }, []);

  // Capture-phase listeners so swipes register across the full step card, not only
  // above screenshot galleries (bubbling handlers miss touches on nested widgets).
  useEffect(() => {
    if (!mobileNav) return;
    const el = stageRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || swipeShouldIgnore(e.target)) {
        swipeRef.current = null;
        return;
      }
      swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onEnd = (e: TouchEvent) => {
      if (!swipeRef.current) return;
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

    const onCancel = () => {
      swipeRef.current = null;
    };

    el.addEventListener("touchstart", onStart, { capture: true, passive: true });
    el.addEventListener("touchend", onEnd, { capture: true, passive: true });
    el.addEventListener("touchcancel", onCancel, { capture: true, passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart, { capture: true });
      el.removeEventListener("touchend", onEnd, { capture: true });
      el.removeEventListener("touchcancel", onCancel, { capture: true });
    };
  }, [mobileNav, goNext, goPrev, dismissSwipeIntro]);

  const didMountScroll = useRef(false);
  useEffect(() => {
    if (!didMountScroll.current) {
      didMountScroll.current = true;
      return;
    }
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentId]);

  const q = filter.trim();
  const searchGroups = useMemo(() => {
    return sections
      .map((section) => {
        const results = filterWalkthroughSteps(section, filter);
        const visible = q ? results.filter((r) => r.hit) : results;
        return { section, visible };
      })
      .filter((g) => g.visible.length > 0);
  }, [sections, filter, q]);
  const matchCount = useMemo(
    () => (q ? searchGroups.reduce((n, g) => n + g.visible.length, 0) : 0),
    [q, searchGroups],
  );

  if (!current) return null;

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
        {category === "walkthrough" && walkthroughPrefs && onOpenGuideSettings ? (
          <div className="step-rail__guide-settings">
            <button type="button" className="btn btn--ghost btn--sm" onClick={onOpenGuideSettings}>
              Guide settings
            </button>
            <span className="step-rail__mode-label">
              {walkthroughPrefs.playMode === "storyline" ? "Storyline" : "Completionist"}
              {walkthroughPrefs.skipPregame ? " · No pregame" : ""}
            </span>
          </div>
        ) : null}
        <input
          type="search"
          className="step-rail__filter"
          placeholder="Search items, locations, story…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {q ? (
          <p className="step-rail__results">
            {matchCount} matching step{matchCount === 1 ? "" : "s"}
          </p>
        ) : null}
        <nav className="step-rail__nav">
          {searchGroups.map(({ section, visible }) => (
              <div
                key={section.id}
                className={`step-rail__group${section.optional ? " step-rail__group--optional" : ""}`}
              >
                <p className="step-rail__group-title">{section.title}</p>
                {visible.map(({ step: s, hit }) => {
                  const eventNum = section.steps.findIndex((x) => x.id === s.id) + 1;
                  const active = s.id === currentId;
                  const stepFlatIndex = flatIndexById.get(s.id) ?? -1;
                  const reached =
                    category === "walkthrough" && stepFlatIndex >= 0 && stepFlatIndex < currentIndex;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`step-rail__item ${active ? "step-rail__item--active" : ""}${
                        reached ? " step-rail__item--reached" : ""
                      }`}
                      onClick={() => select(s.id)}
                    >
                      <span className="step-rail__num">{eventNum}</span>
                      <span className="step-rail__item-body">
                        <span className="step-rail__label-row">
                          <span className="step-rail__label">{s.title}</span>
                          {s.optional ? (
                            <span className="step-optional-badge">Optional</span>
                          ) : null}
                          {reached ? (
                            <span className="step-reached-badge" aria-label="Reached">
                              Reached
                            </span>
                          ) : null}
                        </span>
                        {hit && (
                          <span className="step-rail__match">
                            <span className="step-rail__match-field">{walkthroughMatchFieldLabel(hit.field)}</span>
                            {hit.snippet}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
        </nav>
        </div>
      </aside>

      <div className="step-stage" ref={stageRef}>
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

        {category === "walkthrough" && walkthroughPrefs ? (
          <div className="step-stage__save">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => void handleSaveProgress()}
            >
              Save progress
            </button>
            {saveCode ? (
              <div className="step-stage__save-code" role="status">
                <span className="step-stage__save-code-label">Your save code</span>
                <code className="step-stage__save-code-value">{saveCode}</code>
                <span className="step-stage__save-code-hint">
                  {copyStatus === "copied"
                    ? "Copied to clipboard"
                    : copyStatus === "failed"
                      ? "Copy manually — clipboard unavailable"
                      : "Enter this on Guide settings to continue later"}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        <article className="step-card">
          <span className="step-card__crumb">
            {current.sectionTitle}
            {eventTotal > 0 ? ` · Event ${eventIndex + 1} of ${eventTotal}` : ""}
          </span>
          <h2 className="step-card__title">
            {current.step.title}
            {current.step.optional ? (
              <span className="step-optional-badge step-optional-badge--title">Optional</span>
            ) : null}
          </h2>
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

          {gymForStep && (
            <section className="gym-guide-embed" aria-label="Gym guide">
              <GymGuidePanel gym={gymForStep} showWalkthroughText={false} />
            </section>
          )}

          {rivalForStep && (
            <section className="gym-guide-embed rival-guide-embed" aria-label="Rival battle guide">
              <RivalGuidePanelForStep stepId={current.step.id} />
            </section>
          )}

          {showHmTable && (
            <section className="reference-embed" aria-label="HM reference">
              <HmUnlockTable highlightStepId={current.step.id} />
            </section>
          )}

          {showKeyItemsTable && (
            <section className="reference-embed" aria-label="Key items reference">
              <KeyItemsTable highlightStepId={current.step.id} />
            </section>
          )}

          {showScottChecklist && (
            <section className="reference-embed" aria-label="Scott sightings">
              <ScottSightingsPanel />
            </section>
          )}

          {showMatchCallRematch && (
            <section className="reference-embed" aria-label="Match Call rematches">
              <MatchCallRematchPanel />
              <MatchCallSchedulePanel className="match-call-schedule--stacked" />
            </section>
          )}

          {showBreedingLookup && <BreedingLookup />}
          {evolutionChart && <EvolutionChart chart={evolutionChart} />}
          {breedingChart && <BreedingChart chart={breedingChart} />}

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

          <StepSecretsExtras stepId={current.step.id} secrets={current.step.secrets} />

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
