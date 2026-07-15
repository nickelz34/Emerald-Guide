import { useState } from "react";
import type { WalkthroughPlayMode } from "../types";
import type { WalkthroughPreferences } from "../hooks/useWalkthroughPreferences";
import { SAVE_CODE_LENGTH, loadSaveCode } from "../lib/saveCode";

interface WalkthroughSetupProps {
  preferences: WalkthroughPreferences;
  onContinue: (next: WalkthroughPreferences) => void;
  onContinueFromSave: (next: WalkthroughPreferences, stepId: string) => void;
}

export function WalkthroughSetup({
  preferences,
  onContinue,
  onContinueFromSave,
}: WalkthroughSetupProps) {
  const [skipPregame, setSkipPregame] = useState(preferences.skipPregame);
  const [playMode, setPlayMode] = useState<WalkthroughPlayMode>(preferences.playMode);
  const [saveCode, setSaveCode] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onContinue({
      setupComplete: true,
      skipPregame,
      playMode,
      activeStepId: preferences.activeStepId,
      completedStepIds: preferences.completedStepIds,
    });
  }

  function handleContinueFromSave(e: React.FormEvent) {
    e.preventDefault();
    const result = loadSaveCode(saveCode);
    if (!result.ok) {
      setSaveError(result.error);
      return;
    }
    setSaveError(null);
    onContinueFromSave(
      {
        setupComplete: true,
        skipPregame: result.state.skipPregame,
        playMode: result.state.playMode,
        activeStepId: result.state.stepId,
      },
      result.state.stepId,
    );
  }

  return (
    <div className="walkthrough-setup" role="dialog" aria-labelledby="walkthrough-setup-title">
      <div className="walkthrough-setup__card">
        <h2 id="walkthrough-setup-title" className="walkthrough-setup__title">
          How do you want to play?
        </h2>
        <p className="walkthrough-setup__lead">
          Choose whether to include pregame reference chapters and how much optional side content
          to show in the walkthrough.
        </p>

        {/*
          Avoid <fieldset>/<legend> here: Safari (esp. iOS) leaves a phantom flex gap
          above legends when they sit in a flex form. First tap collapses the gap and
          steals the Start walkthrough press — requiring a second tap.
        */}
        <form className="walkthrough-setup__form" onSubmit={handleSubmit}>
          <div
            className="walkthrough-setup__section"
            role="group"
            aria-labelledby="walkthrough-setup-pregame"
          >
            <h3 id="walkthrough-setup-pregame" className="walkthrough-setup__legend">
              Pregame chapters
            </h3>
            <label className="walkthrough-setup__checkbox">
              <input
                type="checkbox"
                checked={skipPregame}
                onChange={(e) => setSkipPregame(e.target.checked)}
              />
              <span>
                <strong>Skip Catching, Evolution, Breeding &amp; Battles prep</strong>
                <span className="walkthrough-setup__hint">
                  Jump straight to Littleroot Town and the main story.
                </span>
              </span>
            </label>
          </div>

          <div
            className="walkthrough-setup__section"
            role="group"
            aria-labelledby="walkthrough-setup-mode"
          >
            <h3 id="walkthrough-setup-mode" className="walkthrough-setup__legend">
              Walkthrough mode
            </h3>
            <div className="walkthrough-setup__modes">
              <label
                className={`walkthrough-setup__mode ${
                  playMode === "storyline" ? "walkthrough-setup__mode--active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="playMode"
                  value="storyline"
                  checked={playMode === "storyline"}
                  onChange={() => setPlayMode("storyline")}
                />
                <span>
                  <strong>Main storyline</strong>
                  <span className="walkthrough-setup__hint">
                    Required story events only — gyms, rivals, and plot beats without optional
                    side quests.
                  </span>
                </span>
              </label>

              <label
                className={`walkthrough-setup__mode ${
                  playMode === "completionist" ? "walkthrough-setup__mode--active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="playMode"
                  value="completionist"
                  checked={playMode === "completionist"}
                  onChange={() => setPlayMode("completionist")}
                />
                <span>
                  <strong>Completionist</strong>
                  <span className="walkthrough-setup__hint">
                    Main story plus every optional side quest, activity, and bonus area.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <button type="submit" className="walkthrough-setup__continue">
            Start walkthrough
          </button>
        </form>

        <div className="walkthrough-setup__divider" role="separator">
          <span>or</span>
        </div>

        <form className="walkthrough-setup__save-form" onSubmit={handleContinueFromSave}>
          <div
            className="walkthrough-setup__section"
            role="group"
            aria-labelledby="walkthrough-setup-save"
          >
            <h3 id="walkthrough-setup-save" className="walkthrough-setup__legend">
              Continue with save code
            </h3>
            <p className="walkthrough-setup__hint walkthrough-setup__hint--block">
              Enter a 4-letter save code from this browser to pick up exactly where you left off.
            </p>
            <div className="walkthrough-setup__save-row">
              <input
                type="text"
                className="walkthrough-setup__save-input"
                value={saveCode}
                onChange={(e) => {
                  setSaveCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z]/gi, "")
                      .slice(0, SAVE_CODE_LENGTH),
                  );
                  setSaveError(null);
                }}
                placeholder="ABCD"
                maxLength={SAVE_CODE_LENGTH}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={saveError ? true : undefined}
                aria-describedby={saveError ? "walkthrough-save-error" : undefined}
              />
              <button
                type="submit"
                className="walkthrough-setup__continue"
                disabled={saveCode.length !== SAVE_CODE_LENGTH}
              >
                Continue
              </button>
            </div>
            {saveError ? (
              <p id="walkthrough-save-error" className="walkthrough-setup__save-error" role="alert">
                {saveError}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
