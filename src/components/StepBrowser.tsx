import { useEffect, useMemo, useRef, useState } from "react";
import type { GuideCategory, GuideSection, GuideStep } from "../types";
import { getRegionForStep } from "../data/mapRegions";
import { ScreenshotGallery } from "./ScreenshotGallery";
import { StepDetails } from "./StepDetails";
import { StepEncounters } from "./EncounterTable";

interface StepBrowserProps {
  category: GuideCategory;
  sections: GuideSection[];
  onShowOnMap?: (stepId: string) => void;
  activeStepId?: string;
  onActiveStepChange?: (stepId: string) => void;
}

interface FlatStep {
  step: GuideStep;
  sectionTitle: string;
  sectionId: string;
}

export function StepBrowser({
  category,
  sections,
  onShowOnMap,
  activeStepId,
  onActiveStepChange,
}: StepBrowserProps) {
  const flat = useMemo<FlatStep[]>(
    () =>
      sections.flatMap((section) =>
        section.steps.map((step) => ({ step, sectionTitle: section.title, sectionId: section.id })),
      ),
    [sections],
  );

  const [internalId, setInternalId] = useState<string | undefined>(flat[0]?.step.id);
  const [filter, setFilter] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);

  const currentId = activeStepId ?? internalId;
  const currentIndex = Math.max(0, flat.findIndex((f) => f.step.id === currentId));
  const current = flat[currentIndex] ?? flat[0];

  const select = (id: string) => {
    setInternalId(id);
    onActiveStepChange?.(id);
  };

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
      if (e.key === "ArrowRight" && currentIndex < flat.length - 1) select(flat[currentIndex + 1].step.id);
      if (e.key === "ArrowLeft" && currentIndex > 0) select(flat[currentIndex - 1].step.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentId]);

  if (!current) return null;

  const q = filter.trim().toLowerCase();
  const region = getRegionForStep(current.step.id);

  return (
    <div className="step-browser">
      <aside className="step-rail">
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
                  const idx = flat.findIndex((f) => f.step.id === s.id);
                  const active = s.id === currentId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`step-rail__item ${active ? "step-rail__item--active" : ""}`}
                      onClick={() => select(s.id)}
                    >
                      <span className="step-rail__num">{idx + 1}</span>
                      <span className="step-rail__label">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="step-stage" ref={stageRef}>
        <div className="step-stage__progress">
          <div
            className="step-stage__progress-bar"
            style={{ width: `${((currentIndex + 1) / flat.length) * 100}%` }}
          />
        </div>

        <article className="step-card">
          <span className="step-card__crumb">
            {current.sectionTitle} · Step {currentIndex + 1} of {flat.length}
          </span>
          <h2 className="step-card__title">{current.step.title}</h2>
          {current.step.location && <p className="step-card__location">{current.step.location}</p>}
          <p className="step-card__summary">{current.step.summary}</p>

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
            onClick={() => select(flat[currentIndex - 1].step.id)}
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
            onClick={() => select(flat[currentIndex + 1].step.id)}
          >
            {category === "walkthrough" ? "Next step" : "Next"} →
          </button>
        </div>
        <p className="step-nav__keys">Tip: use ← → arrow keys to move between steps.</p>
      </div>
    </div>
  );
}
