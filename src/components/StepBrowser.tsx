import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { GuideCategory, GuideSection, GuideStep } from "../types";
import { getRegionForStep } from "../data/mapRegions";
import type { LayoutViewMode } from "../hooks/useViewMode";
import { useAdmin } from "../admin/AdminContext";
import { ChapterTree } from "../admin/ChapterTree";
import { StepEditor } from "../admin/StepEditor";
import { resolveStepBlockOrder, type StepBlockId } from "../admin/stepBlocks";
import { GuideHtml } from "../lib/guideHtml";
import type { GuideStoryTrainerOverride } from "../types";
import type { GymData } from "../data/gymData";
import type { StoryTrainerBattle } from "../data/storyTrainerBattles";
import type { StarterGuideEntry, StarterSlug } from "../data/starterChoice";
import type { RaltsStageGuide } from "../data/raltsSpotlight";
import { ScreenshotGallery } from "./ScreenshotGallery";
import { StepDetails } from "./StepDetails";
import { StepEncounters } from "./EncounterTable";
import { StepSecretsExtras } from "./StepSecretsExtras";
import { GymGuidePanel } from "./GymGuidePanel";
import { RivalGuidePanelForStep } from "./RivalGuidePanel";
import { FlowerShopGuidePanelForStep } from "./FlowerShopGuidePanel";
import { StoryTrainerGuidePanelForStep } from "./StoryTrainerGuidePanel";
import { StarterChoicePanelForStep } from "./StarterChoicePanel";
import { RaltsSpotlightPanelForStep } from "./RaltsSpotlightPanel";
import { BattleBasicsPanel } from "./BattleBasicsPanel";
import { HmUnlockTable } from "./HmUnlockTable";
import { KeyItemsTable } from "./KeyItemsTable";
import { PokeBallTable } from "./PokeBallTable";
import { NatureTable } from "./NatureTable";
import { StatusTable } from "./StatusTable";
import { TypeChartTable } from "./TypeChartTable";
import { TmHmTable } from "./TmHmTable";
import { ScottSightingsPanel } from "./ScottSightingsPanel";
import { MatchCallRematchPanel } from "./MatchCallRematchPanel";
import { MatchCallSchedulePanel } from "./MatchCallSchedulePanel";
import { StoryProgressBar } from "./StoryProgressBar";
import { getGymForWalkthroughStep } from "../data/gymData";
import { getRivalForWalkthroughStep } from "../data/rivalData";
import { getStoryTrainerForWalkthroughStep } from "../data/storyTrainerBattles";
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
import { createSaveCode } from "../lib/saveCode";
import {
  canMarkStepComplete,
  isStepCompleted,
  stepIdForSave,
  toggleCompletedStepId,
} from "../lib/walkthroughProgress";

interface StepBrowserProps {
  category: GuideCategory;
  sections: GuideSection[];
  onShowOnMap?: (stepId: string) => void;
  activeStepId?: string;
  onActiveStepChange?: (stepId: string) => void;
  viewMode?: LayoutViewMode;
  walkthroughPrefs?: WalkthroughPreferences;
  onWalkthroughPrefsChange?: (next: WalkthroughPreferences) => void;
  onOpenGuideSettings?: () => void;
}

interface FlatStep {
  step: GuideStep;
  sectionTitle: string;
  sectionId: string;
}

const SWIPE_MIN_PX = 56;
const SWIPE_MAX_VERTICAL_RATIO = 0.85;

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
      ".story-progress",
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
  onWalkthroughPrefsChange,
  onOpenGuideSettings,
}: StepBrowserProps) {
  const mobileNav = useMobileGuideNav(viewMode);
  const { isAdmin, updateStep, updateChapter } = useAdmin();
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
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const railNavRef = useRef<HTMLElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  const currentId = activeStepId ?? internalId;
  const currentIndex = Math.max(0, flat.findIndex((f) => f.step.id === currentId));
  const current = flat[currentIndex] ?? flat[0];
  const hiddenPanels = useMemo(
    () => new Set(current?.step.hiddenPanels ?? []),
    [current?.step.hiddenPanels],
  );
  const panelVisible = useCallback((id: string) => !hiddenPanels.has(id), [hiddenPanels]);
  const specialty = current?.step.specialty;
  const gymForStep = (() => {
    if (!current || !panelVisible("gym")) return undefined;
    if (specialty?.gym) return specialty.gym as GymData;
    return getGymForWalkthroughStep(current.step.id);
  })();
  const rivalForStep = (() => {
    if (!current || !panelVisible("rival")) return undefined;
    return specialty?.rival ?? getRivalForWalkthroughStep(current.step.id);
  })();
  const storyTrainerForStep = (() => {
    if (!current || !panelVisible("story-trainer")) return undefined;
    const base = getStoryTrainerForWalkthroughStep(current.step.id);
    const override = specialty?.storyTrainer as GuideStoryTrainerOverride | undefined;
    if (!base && !override) return undefined;
    if (!override) return base;
    if (!base) return undefined;
    return {
      ...base,
      title: override.title,
      intro: override.intro,
      note: override.note,
      trainer: {
        ...base.trainer,
        name: override.trainerName ?? base.trainer.name,
        trainerName: override.trainerName ?? base.trainer.trainerName,
        trainerClass: override.trainerClass ?? base.trainer.trainerClass,
        note: override.trainerNote ?? base.trainer.note,
        desc: override.trainerDesc ?? base.trainer.desc,
        trainerId: override.trainerId ?? base.trainer.trainerId,
      },
    } satisfies StoryTrainerBattle;
  })();
  const showHmTable = current?.step.id === "rustboro-1" && panelVisible("hm-table");
  const showKeyItemsTable =
    current?.step.id === "rusturf-tunnel-2" && panelVisible("key-items");
  const showPokeBallTable =
    current?.step.id === "pregame-field-5" && panelVisible("poke-balls");
  const showBattleBasicsPanel =
    current?.step.id === "pregame-battles-1" && panelVisible("battle-basics");
  const showTypeChartTable =
    current?.step.id === "pregame-battles-3" && panelVisible("type-chart");
  const showStatusTable =
    current?.step.id === "pregame-battles-6" && panelVisible("status-table");
  const showNatureTable =
    current?.step.id === "pregame-battles-7" && panelVisible("nature-table");
  const showTmHmTable =
    current?.step.id === "pregame-battles-9" && panelVisible("tm-hm-table");
  const showScottChecklist =
    current?.step.id === "battle-frontier-2" && panelVisible("scott");
  const showMatchCallRematch =
    current?.step.id === "postgame-hoenn-6" && panelVisible("match-call");
  const showBreedingLookup =
    Boolean(current?.step.tags?.includes("breeding-lookup")) &&
    panelVisible("breeding-lookup");
  const evolutionChart =
    current && panelVisible("evolution-chart")
      ? PREGAME_EVOLUTION_CHARTS[current.step.id]
      : undefined;
  const breedingChart =
    current && panelVisible("breeding-chart")
      ? PREGAME_BREEDING_CHARTS[current.step.id]
      : undefined;

  const storyStepIds = useMemo(() => flat.map((entry) => entry.step.id), [flat]);

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

  const currentSectionBand = useMemo(
    () => sections.find((section) => section.steps.some((step) => step.id === current?.step.id))?.band,
    [sections, current?.step.id],
  );

  const completedStepIds = useMemo(
    () => new Set(walkthroughPrefs?.completedStepIds ?? []),
    [walkthroughPrefs?.completedStepIds],
  );

  const handleSaveProgress = useCallback(async () => {
    if (!walkthroughPrefs || !current?.step.id) return;
    const stepId = stepIdForSave(
      sections,
      current.step.id,
      walkthroughPrefs.completedStepIds,
    );
    if (!stepId) return;
    const code = createSaveCode({
      skipPregame: walkthroughPrefs.skipPregame,
      playMode: walkthroughPrefs.playMode,
      stepId,
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
  }, [walkthroughPrefs, current?.step.id, sections]);

  const handleToggleComplete = useCallback(() => {
    if (!walkthroughPrefs || !onWalkthroughPrefsChange || !current?.step.id) return;
    if (!canMarkStepComplete(category, currentSectionBand)) return;
    onWalkthroughPrefsChange({
      ...walkthroughPrefs,
      completedStepIds: toggleCompletedStepId(
        walkthroughPrefs.completedStepIds,
        current.step.id,
      ),
    });
  }, [
    walkthroughPrefs,
    onWalkthroughPrefsChange,
    current?.step.id,
    category,
    currentSectionBand,
  ]);

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
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

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
  }, [mobileNav, goNext, goPrev]);

  const didMountScroll = useRef(false);
  useEffect(() => {
    if (!didMountScroll.current) {
      didMountScroll.current = true;
      return;
    }
    // Keep the badge rail in view when changing steps — scrolling the stage
    // to the top would push a sibling progress bar above the scrollport.
    const progress = document.querySelector(".story-progress");
    if (progress instanceof HTMLElement) {
      progress.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
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

  // Close the mobile Steps menu when tapping outside it (or pressing Escape).
  useEffect(() => {
    if (!railOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const rail = railRef.current;
      const target = e.target;
      if (!(target instanceof Node) || !rail) return;
      if (rail.contains(target)) return;
      setRailOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRailOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [railOpen]);

  // Keep the active chapter/event visible in the left rail (including after refresh).
  // Prefer scrolling the nav on desktop. On mobile the panel scrolls under a sticky
  // search head — avoid scrolling while typing / while a filter is active so the
  // search field stays put.
  useEffect(() => {
    const nav = railNavRef.current;
    if (!nav || !currentId) return;
    if (document.activeElement === filterInputRef.current) return;
    if (q) return;

    const frame = window.requestAnimationFrame(() => {
      if (document.activeElement === filterInputRef.current) return;

      const active = nav.querySelector<HTMLElement>(".step-rail__item--active");
      if (!active) return;

      const style = window.getComputedStyle(nav);
      const navScrolls =
        /(auto|scroll)/.test(style.overflowY) && nav.scrollHeight > nav.clientHeight + 1;

      if (navScrolls) {
        const parentRect = nav.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        const nextTop =
          nav.scrollTop +
          (activeRect.top - parentRect.top) -
          parentRect.height / 2 +
          activeRect.height / 2;
        nav.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
        return;
      }

      active.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentId, searchGroups, q]);

  if (!current) return null;

  const region = getRegionForStep(current.step.id);

  const currentSection = sections.find((sec) =>
    sec.steps.some((s) => s.id === current.step.id),
  );
  const eventIndex = currentSection
    ? currentSection.steps.findIndex((s) => s.id === current.step.id)
    : 0;
  const eventTotal = currentSection ? currentSection.steps.length : 0;
  const currentCompleted = isStepCompleted({
    category,
    sectionBand: currentSection?.band,
    stepId: current.step.id,
    completedStepIds,
  });
  const showCompleteToggle =
    Boolean(walkthroughPrefs && onWalkthroughPrefsChange) &&
    canMarkStepComplete(category, currentSection?.band);

  const renderStepBlock = (blockId: StepBlockId): ReactNode => {
    const step = current.step;

    if (blockId === "summary") {
      return (
        <GuideHtml
          value={step.summary}
          as="p"
          className="step-card__summary"
        />
      );
    }

    if (blockId === "story") {
      if (!step.story?.length) return null;
      return (
        <div className="step-card__story">
          {step.story.map((para, i) => (
            <GuideHtml key={i} value={para} as="p" />
          ))}
        </div>
      );
    }

    if (blockId === "details") {
      if (!step.details.length) return null;
      return <StepDetails details={step.details} />;
    }

    if (blockId === "tips") {
      if (!step.tips?.length) return null;
      return (
        <div className="step-card__tips">
          <strong>Tips</strong>
          <ul>
            {step.tips.map((tip, i) => (
              <GuideHtml key={`${i}-${tip.slice(0, 24)}`} value={tip} as="li" />
            ))}
          </ul>
        </div>
      );
    }

    if (blockId === "secrets") {
      return (
        <StepSecretsExtras
          stepId={step.id}
          secrets={[...(step.secrets ?? []), ...(specialty?.encounters?.secrets ?? [])]}
        />
      );
    }

    if (blockId === "media") {
      return (
        <ScreenshotGallery
          stepId={step.id}
          compact
          media={step.media}
          useCustomMedia={step.useCustomMedia}
        />
      );
    }

    if (blockId.startsWith("media-item:")) {
      const mediaId = blockId.slice("media-item:".length);
      return (
        <ScreenshotGallery
          stepId={step.id}
          compact
          media={step.media}
          useCustomMedia
          onlyMediaId={mediaId}
        />
      );
    }

    if (blockId === "encounters") {
      if (!panelVisible("encounters")) return null;
      return (
        <>
          {specialty?.encounters?.tips?.length ? (
            <div className="step-card__tips">
              <strong>Encounter tips</strong>
              <ul>
                {specialty.encounters.tips.map((tip, i) => (
                  <GuideHtml key={`enc-tip-${i}`} value={tip} as="li" />
                ))}
              </ul>
            </div>
          ) : null}
          <StepEncounters stepId={step.id} />
        </>
      );
    }

    if (blockId === "tags") {
      if (!step.tags?.length) return null;
      return (
        <div className="step-card__tags">
          {step.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      );
    }

    if (blockId === "panel:battle-basics" && showBattleBasicsPanel) {
      return (
        <section
          className="reference-embed battle-basics-embed"
          aria-label="Battle types and commands"
        >
          <BattleBasicsPanel content={specialty?.battleBasics} />
        </section>
      );
    }

    if (blockId === "panel:starter" && step.id === "route-101-2" && panelVisible("starter")) {
      return (
        <section className="starter-choice-embed" aria-label="Starter comparison">
          <StarterChoicePanelForStep
            stepId={step.id}
            intro={specialty?.starter?.intro}
            entries={specialty?.starter?.entries?.map((entry) => ({
              ...entry,
              slug: entry.slug as StarterSlug,
              difficulty: entry.difficulty as StarterGuideEntry["difficulty"],
            }))}
          />
        </section>
      );
    }

    if (blockId === "panel:ralts" && step.id === "route-102-2" && panelVisible("ralts")) {
      return (
        <section
          className="starter-choice-embed ralts-spotlight-embed"
          aria-label="Ralts catch spotlight"
        >
          <RaltsSpotlightPanelForStep
            stepId={step.id}
            intro={specialty?.ralts?.intro}
            stages={specialty?.ralts?.stages as RaltsStageGuide[] | undefined}
            huntTips={specialty?.ralts?.huntTips}
            natures={specialty?.ralts?.natures}
            abilitiesNote={specialty?.ralts?.abilitiesNote}
          />
        </section>
      );
    }

    if (
      blockId === "panel:flower-shop" &&
      step.id === "route-104-2" &&
      panelVisible("flower-shop")
    ) {
      return (
        <section
          className="flower-shop-guide-embed"
          aria-label="Pretty Petal Flower Shop guide"
        >
          <FlowerShopGuidePanelForStep
            stepId={step.id}
            pailBlurb={specialty?.flowerShop?.pailBlurb}
            softSoilNote={specialty?.flowerShop?.softSoilNote}
          />
        </section>
      );
    }

    if (blockId === "panel:gym" && gymForStep) {
      return (
        <section className="gym-guide-embed" aria-label="Gym guide">
          <GymGuidePanel gym={gymForStep} showWalkthroughText={false} />
        </section>
      );
    }

    if (blockId === "panel:rival" && rivalForStep) {
      return (
        <section
          className="gym-guide-embed rival-guide-embed"
          aria-label="Rival battle guide"
        >
          <RivalGuidePanelForStep stepId={step.id} rival={rivalForStep} />
        </section>
      );
    }

    if (blockId === "panel:story-trainer" && storyTrainerForStep) {
      return (
        <section
          className="gym-guide-embed rival-guide-embed story-trainer-guide-embed"
          aria-label="Story trainer battle guide"
        >
          <StoryTrainerGuidePanelForStep
            stepId={step.id}
            battle={storyTrainerForStep}
          />
        </section>
      );
    }

    if (blockId === "panel:hm-table" && showHmTable) {
      return (
        <section className="reference-embed" aria-label="HM reference">
          <HmUnlockTable highlightStepId={step.id} rows={specialty?.hmTable} />
        </section>
      );
    }

    if (blockId === "panel:key-items" && showKeyItemsTable) {
      return (
        <section className="reference-embed" aria-label="Key items reference">
          <KeyItemsTable highlightStepId={step.id} rows={specialty?.keyItems} />
        </section>
      );
    }

    if (blockId === "panel:poke-balls" && showPokeBallTable) {
      return (
        <section className="reference-embed" aria-label="Poké Ball reference">
          <PokeBallTable rows={specialty?.pokeBalls} />
        </section>
      );
    }

    if (blockId === "panel:type-chart" && showTypeChartTable) {
      return (
        <section className="reference-embed" aria-label="Type chart reference">
          <TypeChartTable />
        </section>
      );
    }

    if (blockId === "panel:status-table" && showStatusTable) {
      return (
        <section className="reference-embed" aria-label="Status condition reference">
          <StatusTable
            rows={specialty?.statusTable?.map((row) => ({
              ...row,
              kind: row.kind as "persistent" | "volatile",
            }))}
          />
        </section>
      );
    }

    if (blockId === "panel:nature-table" && showNatureTable) {
      return (
        <section className="reference-embed" aria-label="Nature reference">
          <NatureTable rows={specialty?.natures} />
        </section>
      );
    }

    if (blockId === "panel:tm-hm-table" && showTmHmTable) {
      return (
        <section className="reference-embed" aria-label="TM and HM reference">
          <TmHmTable />
        </section>
      );
    }

    if (blockId === "panel:scott" && showScottChecklist) {
      return (
        <section className="reference-embed" aria-label="Scott sightings">
          <ScottSightingsPanel
            rows={specialty?.scott?.map((row) => ({
              ...row,
              mandatory: Boolean(row.mandatory),
            }))}
          />
        </section>
      );
    }

    if (blockId === "panel:match-call" && showMatchCallRematch) {
      return (
        <section className="reference-embed" aria-label="Match Call rematches">
          <MatchCallRematchPanel />
          <MatchCallSchedulePanel className="match-call-schedule--stacked" />
        </section>
      );
    }

    if (blockId === "panel:breeding-lookup" && showBreedingLookup) {
      return <BreedingLookup />;
    }

    if (blockId === "panel:evolution-chart" && evolutionChart) {
      return <EvolutionChart chart={evolutionChart} />;
    }

    if (blockId === "panel:breeding-chart" && breedingChart) {
      return <BreedingChart chart={breedingChart} />;
    }

    return null;
  };

  const activeChapterId = current.sectionId;

  return (
    <div className={`step-browser${isAdmin ? " step-browser--admin" : ""}`}>
      <StoryProgressBar
        stepIds={storyStepIds}
        currentIndex={currentIndex}
        completedStepIds={
          category === "walkthrough" ? walkthroughPrefs?.completedStepIds : undefined
        }
        onSelectStep={category === "walkthrough" ? select : undefined}
      />

      {isAdmin && category === "walkthrough" ? (
        <ChapterTree
          sections={sections}
          activeStepId={current.step.id}
          onSelectStep={select}
        />
      ) : null}

      <aside
        ref={railRef}
        className={`step-rail ${railOpen ? "step-rail--open" : ""}`}
      >
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
        <div className="step-rail__panel-head">
          {category === "walkthrough" && walkthroughPrefs && onOpenGuideSettings ? (
            <div className="step-rail__guide-settings">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setRailOpen(false);
                  onOpenGuideSettings();
                }}
              >
                Guide settings
              </button>
              <span className="step-rail__mode-label">
                {walkthroughPrefs.playMode === "storyline" ? "Storyline" : "Completionist"}
                {walkthroughPrefs.skipPregame ? " · No pregame" : ""}
              </span>
            </div>
          ) : null}
          <div className="step-rail__filter-wrap">
            <input
              ref={filterInputRef}
              type="search"
              className="step-rail__filter"
              placeholder="Search items, locations, story…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {filter ? (
              <button
                type="button"
                className="step-rail__filter-clear"
                aria-label="Clear search"
                onClick={() => {
                  setFilter("");
                  filterInputRef.current?.focus();
                }}
              >
                ×
              </button>
            ) : null}
          </div>
          {q ? (
            <p className="step-rail__results">
              {matchCount} matching step{matchCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <nav className="step-rail__nav" ref={railNavRef}>
          {searchGroups.map(({ section, visible }) => (
              <div
                key={section.id}
                className={`step-rail__group${section.optional ? " step-rail__group--optional" : ""}`}
              >
                <p className="step-rail__group-title">{section.title}</p>
                {visible.map(({ step: s, hit }) => {
                  const eventNum = section.steps.findIndex((x) => x.id === s.id) + 1;
                  const active = s.id === currentId;
                  const reached = isStepCompleted({
                    category,
                    sectionBand: section.band,
                    stepId: s.id,
                    completedStepIds,
                  });
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
                            <span className="step-reached-badge" aria-label="Complete">
                              Complete
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
        {mobileNav && (
          <p className="step-swipe-banner" role="note">
            <span className="step-swipe-banner__arrow" aria-hidden="true">
              ←
            </span>
            Swipe left or right to move through the guide
            <span className="step-swipe-banner__arrow" aria-hidden="true">
              →
            </span>
          </p>
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
                    ? "Copied to clipboard — keep this code to continue later on in this browser"
                    : copyStatus === "failed"
                      ? "Copy manually — clipboard unavailable"
                      : "Enter this code on Guide settings later on this browser"}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        <article className="step-card">
          <div className="step-card__head">
            <div className="step-card__head-text">
              <span className="step-card__crumb">
                {current.sectionTitle}
                {eventTotal > 0 ? ` · Event ${eventIndex + 1} of ${eventTotal}` : ""}
              </span>
              {isAdmin ? null : (
                <h2 className="step-card__title">
                  {current.step.title}
                  {current.step.optional ? (
                    <span className="step-optional-badge step-optional-badge--title">Optional</span>
                  ) : null}
                </h2>
              )}
            </div>
            {showCompleteToggle && !isAdmin ? (
              <button
                type="button"
                className={`btn btn--sm step-card__complete${
                  currentCompleted ? " step-card__complete--done" : ""
                }`}
                aria-pressed={currentCompleted}
                onClick={handleToggleComplete}
              >
                {currentCompleted ? "Completed" : "Mark complete"}
              </button>
            ) : null}
          </div>

          {isAdmin ? (
            <>
              <label className="admin-field" style={{ marginBottom: "0.75rem" }}>
                <span className="admin-field__label">Chapter description</span>
                <textarea
                  className="admin-field__textarea"
                  rows={2}
                  value={currentSection?.description ?? ""}
                  onChange={(e) =>
                    updateChapter(activeChapterId, { description: e.target.value })
                  }
                />
              </label>
              <StepEditor
                step={current.step}
                onChange={(patch) => updateStep(activeChapterId, current.step.id, patch)}
              />
              <p className="admin-muted" style={{ margin: "0.75rem 0 0.35rem" }}>
                Live page preview (follows page layout order)
              </p>
            </>
          ) : (
            current.step.location && (
              <p className="step-card__location">{current.step.location}</p>
            )
          )}

          {resolveStepBlockOrder(current.step).map(({ id }) => {
            // In admin, content fields are edited above — still preview layout for all blocks.
            return (
              <div key={id} className="step-card__block" data-block={id}>
                {renderStepBlock(id)}
              </div>
            );
          })}

          {!isAdmin && region && onShowOnMap ? (
            <div className="step-card__footerrow">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onShowOnMap(current.step.id)}
              >
                Show on Hoenn map
              </button>
            </div>
          ) : null}
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
