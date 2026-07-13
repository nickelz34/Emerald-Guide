import { useState } from "react";
import type { WalkthroughPlayMode } from "../types";
import type { WalkthroughPreferences } from "../hooks/useWalkthroughPreferences";

interface WalkthroughSetupProps {
  preferences: WalkthroughPreferences;
  onContinue: (next: WalkthroughPreferences) => void;
}

export function WalkthroughSetup({ preferences, onContinue }: WalkthroughSetupProps) {
  const [skipPregame, setSkipPregame] = useState(preferences.skipPregame);
  const [playMode, setPlayMode] = useState<WalkthroughPlayMode>(preferences.playMode);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onContinue({
      setupComplete: true,
      skipPregame,
      playMode,
    });
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

        <form className="walkthrough-setup__form" onSubmit={handleSubmit}>
          <fieldset className="walkthrough-setup__fieldset">
            <legend className="walkthrough-setup__legend">Pregame chapters</legend>
            <label className="walkthrough-setup__checkbox">
              <input
                type="checkbox"
                checked={skipPregame}
                onChange={(e) => setSkipPregame(e.target.checked)}
              />
              <span>
                <strong>Skip Evolution &amp; Breeding prep</strong>
                <span className="walkthrough-setup__hint">
                  Jump straight to Littleroot Town and the main story.
                </span>
              </span>
            </label>
          </fieldset>

          <fieldset className="walkthrough-setup__fieldset">
            <legend className="walkthrough-setup__legend">Walkthrough mode</legend>
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
          </fieldset>

          <button type="submit" className="walkthrough-setup__continue">
            Start walkthrough
          </button>
        </form>
      </div>
    </div>
  );
}
