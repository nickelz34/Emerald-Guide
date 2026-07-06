import { useMemo, useState } from "react";
import { guideData, getFlatSteps } from "./data";
import { CategoryHeader, Sidebar } from "./components/Sidebar";
import { HoennMap } from "./components/HoennMap";
import { StepBrowser } from "./components/StepBrowser";
import { PokemonFinder } from "./components/PokemonFinder";
import { MapModal } from "./components/MapModal";
import { LightboxProvider } from "./components/ImageLightbox";
import { useViewMode } from "./hooks/useViewMode";
import type { GuideCategory } from "./types";
import type { MapRegion } from "./data/mapRegions";
import "./App.css";
import "./navbar-fix.css";

export type NavKey = GuideCategory | "map";

export default function App() {
  const [viewMode, setViewMode] = useViewMode();
  const [nav, setNav] = useState<NavKey>("walkthrough");
  const [activeStepId, setActiveStepId] = useState<string | undefined>();
  const [mapOpen, setMapOpen] = useState(false);

  const category: GuideCategory = nav === "map" ? "walkthrough" : nav;
  const categoryStepIds = useMemo(
    () => new Set(getFlatSteps(category).map((s) => s.id)),
    [category],
  );

  const handleSelect = (key: NavKey) => {
    setNav(key);
    if (key !== "map") setActiveStepId(undefined);
  };

  const handleShowOnMap = (stepId: string) => {
    setActiveStepId(stepId);
    setMapOpen(true);
  };

  const handleMapRegion = (region: MapRegion) => {
    const stepId = region.stepIds.find((id) => categoryStepIds.has(id)) ?? region.stepIds[0];
    setActiveStepId(stepId);
    setNav("walkthrough");
    setMapOpen(false);
  };

  return (
    <LightboxProvider>
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
            ) : nav === "encounters" ? (
              <PokemonFinder />
            ) : (
              <StepBrowser
                key={category}
                category={category}
                sections={guideData[category]}
                activeStepId={activeStepId}
                onActiveStepChange={setActiveStepId}
                onShowOnMap={handleShowOnMap}
                viewMode={viewMode}
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
