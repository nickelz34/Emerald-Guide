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
import { useColorMode } from "./hooks/useColorMode";
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
import type { GuideCategory } from "./types";
import type { MapRegion } from "./data/mapRegions";
import { useAdmin } from "./admin/AdminContext";
import { AdminToolbar } from "./admin/AdminToolbar";
import { AdminChangesPanel } from "./admin/AdminChangesPanel";
import { AdminLoginModal } from "./admin/AdminLoginModal";
import { AdminToast } from "./admin/AdminToast";
import "./App.css";
import "./navbar-fix.css";
import "./admin/admin.css";

export type NavKey = GuideCategory | "map";

export default function App() {
  const [viewMode, setViewMode] = useViewMode();
  const [colorMode, setColorMode] = useColorMode();
  const [nav, setNav] = useState<NavKey>("walkthrough");
  const [walkthroughPrefs, setWalkthroughPrefs] = useWalkthroughPreferences();
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    () => walkthroughPrefs.activeStepId,
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const { isAdmin, draftWalkthrough, toast, dismissToast } = useAdmin();

  const category: GuideCategory = nav === "map" ? "walkthrough" : nav;

  const sourceWalkthrough = isAdmin ? draftWalkthrough : guideData.walkthrough;

  const walkthroughSections = useMemo(
    () =>
      isAdmin
        ? draftWalkthrough
        : filterWalkthroughSections(sourceWalkthrough, {
            setupComplete: walkthroughPrefs.setupComplete,
            skipPregame: walkthroughPrefs.skipPregame,
            playMode: walkthroughPrefs.playMode,
          }),
    [
      isAdmin,
      draftWalkthrough,
      sourceWalkthrough,
      walkthroughPrefs.setupComplete,
      walkthroughPrefs.skipPregame,
      walkthroughPrefs.playMode,
    ],
  );

  const sections = category === "walkthrough" ? walkthroughSections : guideData[category];

  const categoryStepIds = useMemo(
    () =>
      new Set(
        (category === "walkthrough"
          ? sourceWalkthrough.flatMap((s) => s.steps)
          : getFlatSteps(category)
        ).map((s) => s.id),
      ),
    [category, sourceWalkthrough],
  );

  const visibleStepIds = useMemo(
    () => new Set(walkthroughSections.flatMap((section) => section.steps.map((step) => step.id))),
    [walkthroughSections],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1" && !isAdmin) {
      setAdminLoginOpen(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (nav !== "walkthrough") return;
    if (isAdmin) {
      setShowSetup(false);
      return;
    }
    if (!walkthroughPrefs.setupComplete) {
      setShowSetup(true);
      return;
    }
    setShowSetup(false);
  }, [nav, walkthroughPrefs.setupComplete, isAdmin]);

  useEffect(() => {
    if (category !== "walkthrough") return;
    setActiveStepId((current) => resolveVisibleStepId(walkthroughSections, current));
  }, [category, walkthroughSections]);

  useEffect(() => {
    if (category !== "walkthrough") return;
    if (!activeStepId) return;
    setWalkthroughPrefs((prev) => {
      if (prev.activeStepId === activeStepId) return prev;
      return { ...prev, activeStepId };
    });
  }, [category, activeStepId, setWalkthroughPrefs]);

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
    setWalkthroughPrefs({
      ...next,
      activeStepId: stepId,
      completedStepIds: next.completedStepIds ?? walkthroughPrefs.completedStepIds,
    });
    setActiveStepId(stepId);
    setShowSetup(false);
  };

  const handleContinueFromSave = (next: WalkthroughPreferences, stepId: string) => {
    const sectionsForPrefs = filterWalkthroughSections(guideData.walkthrough, next);
    const resolved = resolveVisibleStepId(sectionsForPrefs, stepId);
    setWalkthroughPrefs({
      ...next,
      activeStepId: resolved,
      completedStepIds: walkthroughPrefs.completedStepIds,
    });
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
            colorMode={colorMode}
            onColorModeChange={setColorMode}
          />
          <main className="main">
            <div className="toolbar">
              <CategoryHeader nav={nav} />
            </div>

            <AdminToolbar onOpenLogin={() => setAdminLoginOpen(true)} />
            {isAdmin ? <AdminChangesPanel /> : null}

            {nav === "map" ? (
              <HoennMap onSelectRegion={handleMapRegion} />
            ) : nav === "pokedex" ? (
              <Pokedex />
            ) : showSetup && !isAdmin ? (
              <WalkthroughSetup
                preferences={walkthroughPrefs}
                onContinue={handleSetupContinue}
                onContinueFromSave={handleContinueFromSave}
              />
            ) : (
              <StepBrowser
                key={`${category}-${isAdmin ? "admin" : `${walkthroughPrefs.playMode}-${walkthroughPrefs.skipPregame}`}`}
                category={category}
                sections={sections}
                activeStepId={activeStepId}
                onActiveStepChange={setActiveStepId}
                onShowOnMap={handleShowOnMap}
                viewMode={viewMode}
                walkthroughPrefs={walkthroughPrefs}
                onWalkthroughPrefsChange={setWalkthroughPrefs}
                onOpenGuideSettings={() => setShowSetup(true)}
              />
            )}
          </main>
        </div>
      </div>

      <MapModal
        open={mapOpen}
        categoryStepIds={categoryStepIds}
        onSelectRegion={handleMapRegion}
        onClose={() => setMapOpen(false)}
      />

      <AdminLoginModal open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} />
      <AdminToast toast={toast} onDismiss={dismissToast} />
    </LightboxProvider>
  );
}
