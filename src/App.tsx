import { useMemo, useState, useEffect } from "react";
import { guideData, getFlatSteps } from "./data";
import { CategoryHeader, Sidebar } from "./components/Sidebar";
import { HoennMap } from "./components/HoennMap";
import { StepBrowser } from "./components/StepBrowser";
import { Pokedex } from "./components/Pokedex";
import { MapModal } from "./components/MapModal";
import { WalkthroughSetup } from "./components/WalkthroughSetup";
import { LightboxProvider } from "./components/ImageLightbox";
import { preloadHoennOverworldMap } from "./lib/preloadMapImages";
import { useViewMode } from "./hooks/useViewMode";
import {
  getWalkthroughStartStepId,
  useWalkthroughPreferences,
  type WalkthroughPreferences,
} from "./hooks/useWalkthroughPreferences";
import {
  filterWalkthroughSections,
  resolveVisibleStepId,
} from "./lib/filterWalkthroughSections";
import { isPregameStep, nextProgressStepId } from "./lib/walkthroughProgress";
import type { GuideCategory } from "./types";
import type { MapRegion } from "./data/mapRegions";
import "./App.css";
import "./navbar-fix.css";

export type NavKey = GuideCategory | "map";

export default function App() {
  const [viewMode, setViewMode] = useViewMode();
  const [nav, setNav] = useState<NavKey>("walkthrough");
  const [walkthroughPrefs, setWalkthroughPrefs] = useWalkthroughPreferences();
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    () => walkthroughPrefs.activeStepId,
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const category: GuideCategory = nav === "map" ? "walkthrough" : nav;

  const walkthroughSections = useMemo(
    () =>
      filterWalkthroughSections(guideData.walkthrough, {
        setupComplete: walkthroughPrefs.setupComplete,
        skipPregame: walkthroughPrefs.skipPregame,
        playMode: walkthroughPrefs.playMode,
      }),
    [walkthroughPrefs.setupComplete, walkthroughPrefs.skipPregame, walkthroughPrefs.playMode],
  );

  const sections = category === "walkthrough" ? walkthroughSections : guideData[category];

  const categoryStepIds = useMemo(
    () => new Set(getFlatSteps(category).map((s) => s.id)),
    [category],
  );

  const visibleStepIds = useMemo(
    () => new Set(walkthroughSections.flatMap((section) => section.steps.map((step) => step.id))),
    [walkthroughSections],
  );

  useEffect(() => {
    if (nav !== "walkthrough") return;
    if (!walkthroughPrefs.setupComplete) {
      setShowSetup(true);
      return;
    }
    setShowSetup(false);
  }, [nav, walkthroughPrefs.setupComplete]);

  useEffect(() => {
    if (category !== "walkthrough") return;
    setActiveStepId((current) => resolveVisibleStepId(walkthroughSections, current));
  }, [category, walkthroughSections]);

  useEffect(() => {
    if (category !== "walkthrough") return;
    if (!activeStepId) return;
    setWalkthroughPrefs((prev) => {
      const visibleProgress = prev.progressStepId
        ? resolveVisibleStepId(walkthroughSections, prev.progressStepId)
        : undefined;
      const retainedProgress =
        visibleProgress && !isPregameStep(walkthroughSections, visibleProgress)
          ? visibleProgress
          : undefined;
      const progressStepId = nextProgressStepId(
        walkthroughSections,
        activeStepId,
        retainedProgress,
      );
      if (prev.activeStepId === activeStepId && prev.progressStepId === progressStepId) {
        return prev;
      }
      return { ...prev, activeStepId, progressStepId };
    });
  }, [category, activeStepId, walkthroughSections, setWalkthroughPrefs]);

  const handleSelect = (key: NavKey) => {
    setNav(key);
  };

  const handleShowOnMap = (stepId: string) => {
    setActiveStepId(stepId);
    setMapOpen(true);
  };

  const handleMapRegion = (region: MapRegion) => {
    const stepId =
      region.stepIds.find((id) => visibleStepIds.has(id) && categoryStepIds.has(id)) ??
      region.stepIds.find((id) => categoryStepIds.has(id)) ??
      region.stepIds[0];
    setActiveStepId(stepId);
    setNav("walkthrough");
    setMapOpen(false);
  };

  const handleSetupContinue = (next: WalkthroughPreferences) => {
    const sectionsForPrefs = filterWalkthroughSections(guideData.walkthrough, next);
    const stepId = resolveVisibleStepId(
      sectionsForPrefs,
      next.activeStepId ?? getWalkthroughStartStepId(next),
    );
    const progressStepId = nextProgressStepId(
      sectionsForPrefs,
      stepId,
      next.progressStepId,
    );
    setWalkthroughPrefs({ ...next, activeStepId: stepId, progressStepId });
    setActiveStepId(stepId);
    setShowSetup(false);
  };

  const handleContinueFromSave = (next: WalkthroughPreferences, stepId: string) => {
    const sectionsForPrefs = filterWalkthroughSections(guideData.walkthrough, next);
    const resolved = resolveVisibleStepId(sectionsForPrefs, stepId);
    const progressStepId = isPregameStep(sectionsForPrefs, resolved)
      ? undefined
      : resolved;
    setWalkthroughPrefs({ ...next, activeStepId: resolved, progressStepId });
    setActiveStepId(resolved);
    setShowSetup(false);
  };

  useEffect(() => {
    const run = () => preloadHoennOverworldMap();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run);
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(run, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (nav === "map" || mapOpen) preloadHoennOverworldMap();
  }, [nav, mapOpen]);

  return (
    <LightboxProvider viewMode={viewMode}>
      <div className="app-shell" data-view={viewMode}>
        <div className="app">
          <Sidebar
            active={nav}
            onSelect={handleSelect}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <main className="main">
            <div className="toolbar">
              <CategoryHeader nav={nav} />
            </div>

            {nav === "map" ? (
              <HoennMap activeStepId={activeStepId} onSelectRegion={handleMapRegion} />
            ) : nav === "pokedex" ? (
              <Pokedex />
            ) : showSetup ? (
              <WalkthroughSetup
                preferences={walkthroughPrefs}
                onContinue={handleSetupContinue}
                onContinueFromSave={handleContinueFromSave}
              />
            ) : (
              <StepBrowser
                key={`${category}-${walkthroughPrefs.playMode}-${walkthroughPrefs.skipPregame}`}
                category={category}
                sections={sections}
                activeStepId={activeStepId}
                onActiveStepChange={setActiveStepId}
                onShowOnMap={handleShowOnMap}
                viewMode={viewMode}
                walkthroughPrefs={walkthroughPrefs}
                onOpenGuideSettings={() => setShowSetup(true)}
              />
            )}
          </main>
        </div>
      </div>

      <MapModal
        open={mapOpen}
        activeStepId={activeStepId}
        categoryStepIds={categoryStepIds}
        onSelectRegion={handleMapRegion}
        onClose={() => setMapOpen(false)}
      />
    </LightboxProvider>
  );
}
