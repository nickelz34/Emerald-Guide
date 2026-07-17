import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FEEBAS_FISHING_AREA_MAP_IDS,
  FEEBAS_FISHING_SECTIONS,
  FEEBAS_FISHING_SPOT_COUNT,
  FEEBAS_ACTIVE_SPOT_COUNT,
} from "../data/feebasFishingSpots";
import {
  FEEBAS_DEMO_SEED,
  feebasSpotLocalPercent,
  feebasSpotTileSizePercent,
  feebasSpotsForSeed,
  formatFeebasSeed,
  parseFeebasSeed,
} from "../data/feebasSeed";
import { EC_CONDITIONS_EN, EC_SECOND_WORD_EN } from "../data/easyChatDewford";
import {
  feebasSeedCandidatesFromTidAndPhrase,
  formatPhraseWords,
  parseTrainerId,
} from "../data/feebasTidPhrase";
import { AreaMapView } from "./AreaMapView";
import { useViewMode } from "../hooks/useViewMode";

const SECTION_TABS = FEEBAS_FISHING_SECTIONS.map((s, i) => ({
  ...s,
  areaMapId: FEEBAS_FISHING_AREA_MAP_IDS[i],
}));

type CalcMode = "seed" | "phrase";

/** Numbered Route 119 fishing-spot maps + Dewford-trend seed calculator. */
export function FeebasFishingMap({ className = "" }: { className?: string }) {
  const [viewMode] = useViewMode();
  const [section, setSection] = useState(0);
  const [calcMode, setCalcMode] = useState<CalcMode>("seed");
  const [seedInput, setSeedInput] = useState(formatFeebasSeed(FEEBAS_DEMO_SEED));
  const [appliedSeed, setAppliedSeed] = useState(FEEBAS_DEMO_SEED);
  const [focusSpotKey, setFocusSpotKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [tidInput, setTidInput] = useState("");
  const [word1, setWord1] = useState<string>(EC_CONDITIONS_EN[0]);
  const [word2, setWord2] = useState<string>(EC_SECOND_WORD_EN[0]);
  const [phraseCandidates, setPhraseCandidates] = useState<number[]>([]);
  const [phraseError, setPhraseError] = useState<string | null>(null);
  const [phraseMeta, setPhraseMeta] = useState<string | null>(null);

  const parsedSeed = useMemo(() => parseFeebasSeed(seedInput), [seedInput]);
  const parsedTid = useMemo(() => parseTrainerId(tidInput), [tidInput]);
  const seedError =
    seedInput.trim().length > 0 && parsedSeed == null
      ? "Enter a hex seed (e.g. 4A7C or 0x4A7C) or a decimal 0–65535."
      : null;
  const tidError =
    tidInput.trim().length > 0 && parsedTid == null
      ? "Trainer ID must be a number from 0–65535."
      : null;

  const activeSpots = useMemo(() => feebasSpotsForSeed(appliedSeed), [appliedSeed]);
  const uniqueCount = useMemo(() => new Set(activeSpots.map((s) => s.id)).size, [activeSpots]);
  const active = SECTION_TABS[section] ?? SECTION_TABS[0];
  const spotsInSection = activeSpots.filter((s) => s.section === section);

  const focusSpot = useMemo(() => {
    if (focusSpotKey) {
      const match = spotsInSection.find(
        (s) => `${s.id}-${s.x}-${s.y}` === focusSpotKey || String(s.id) === focusSpotKey,
      );
      if (match) return match;
    }
    return spotsInSection[0] ?? null;
  }, [focusSpotKey, spotsInSection]);

  const focusPercent = useMemo(
    () => (focusSpot ? feebasSpotLocalPercent(focusSpot) : null),
    [focusSpot],
  );

  const focusKey = focusSpot
    ? `${appliedSeed}-${focusSpot.id}-${focusSpot.x}-${focusSpot.y}-${section}`
    : `section-${section}-${appliedSeed}`;

  const extraMarkers = useMemo(
    () =>
      spotsInSection.map((spot) => {
        const { x, y } = feebasSpotLocalPercent(spot);
        const { w, h } = feebasSpotTileSizePercent(spot);
        return {
          id: `feebas-seed-${appliedSeed}-${spot.id}-${spot.x}-${spot.y}`,
          name: `Feebas spot ${spot.id}`,
          category: "wild" as const,
          x,
          y,
          tileW: w,
          tileH: h,
          markerStyle: "tile" as const,
          pinCode: String(spot.id),
          desc: `Active for seed ${formatFeebasSeed(appliedSeed)}. Exact tile (${spot.x}, ${spot.y}). Fish any rod — about 50% Feebas on this tile.`,
        };
      }),
    [spotsInSection, appliedSeed],
  );

  const applySeed = (seed: number) => {
    setAppliedSeed(seed);
    setSeedInput(formatFeebasSeed(seed));
    const first = feebasSpotsForSeed(seed)[0];
    if (first) {
      setSection(first.section);
      setFocusSpotKey(`${first.id}-${first.x}-${first.y}`);
    } else {
      setFocusSpotKey(null);
    }
  };

  const jumpToSpot = (spot: (typeof activeSpots)[number]) => {
    setSection(spot.section);
    setFocusSpotKey(`${spot.id}-${spot.x}-${spot.y}`);
  };

  const onSubmitSeed = (e: FormEvent) => {
    e.preventDefault();
    if (parsedSeed == null) return;
    setPhraseCandidates([]);
    setPhraseMeta(null);
    applySeed(parsedSeed);
  };

  const onSubmitPhrase = (e: FormEvent) => {
    e.preventDefault();
    if (parsedTid == null) {
      setPhraseError("Enter a valid Trainer ID (0–65535).");
      setPhraseCandidates([]);
      return;
    }
    const candidates = feebasSeedCandidatesFromTidAndPhrase(parsedTid, word1, word2);
    if (candidates.length === 0) {
      setPhraseError(
        "No matching seeds — check the words, or the Dewford phrase was changed (use PKHeX / raw seed).",
      );
      setPhraseCandidates([]);
      setPhraseMeta(null);
      return;
    }
    setPhraseError(null);
    setPhraseMeta(
      `TID ${parsedTid} · ${formatPhraseWords(word1, word2)} · ${candidates.length} candidate${
        candidates.length === 1 ? "" : "s"
      }`,
    );
    setPhraseCandidates(candidates);
    applySeed(candidates[0]);
  };

  useEffect(() => {
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const mapView = (variant: "default" | "lightbox") => (
    <AreaMapView
      areaMapId={active.areaMapId}
      caption={`Route 119 Feebas fishing spots — ${active.label}`}
      showLegend
      variant={variant}
      interactive={variant === "default"}
      previewMaxH={variant === "default" ? 640 : undefined}
      showZoomControls
      crispPixelZoom
      extraMarkers={extraMarkers}
      focusPercent={focusPercent}
      focusKey={focusKey}
      className={variant === "default" ? "feebas-map__area" : undefined}
    />
  );

  return (
    <section
      className={`feebas-map reference-table ${className}`.trim()}
      aria-label="Route 119 Feebas fishing spot map"
    >
      <h5 className="reference-table__title">Feebas tiles (Route 119)</h5>
      <p className="reference-table__lead">
        Find the six active fishing tiles on your Emerald save. Feebas locations are{" "}
        <strong>not</strong> fixed — they follow a hidden Dewford trend seed (
        <code>dewfordTrends[0].rand</code>). Use the calculator below (<em>Seed</em> or{" "}
        <em>TID + phrase</em>), then fish the magenta-ringed tiles on the map.
      </p>

      <div className="feebas-map__guide">
        <h6 className="feebas-map__guide-title">How to use this calculator</h6>
        <ol className="feebas-map__guide-steps">
          <li>
            <strong>Understand the mechanic.</strong> Route 119 has{" "}
            {FEEBAS_FISHING_SPOT_COUNT} numbered fishable water tiles (surfable, not waterfall),
            counted left→right and top→bottom. Exactly {FEEBAS_ACTIVE_SPOT_COUNT} of those spot IDs
            are active for Feebas at a time. The set comes from a u16 on your save:{" "}
            <code>dewfordTrends[0].rand</code>.
          </li>
          <li>
            <strong>Pick a calculator tab</strong> under this guide:
            <ul>
              <li>
                <em>Seed</em> — paste a known Dewford trend / Feebas random value (hex or decimal)
                and press <em>Show tiles</em>. Use <em>Demo seed</em> to practice the UI.
              </li>
              <li>
                <em>TID + phrase</em> — enter your Trainer ID and the two Dewford Easy Chat words,
                then press <em>Find seeds</em> (only if you never manually changed the trendy
                phrase).
              </li>
            </ul>
          </li>
          <li>
            <strong>Read the results.</strong> The spot list shows the six active IDs for the
            applied seed. Magenta pulsing rings mark those tiles on the yellow numbered grid (center
            stays clear so you can read the spot number). Tap a spot ID — or a candidate seed from
            TID + phrase — to jump the map to that tile.
          </li>
          <li>
            <strong>Fish those tiles in-game.</strong> Face the water tile; any rod works (Old Rod
            is fastest — one “Oh! A bite!” prompt). On a correct tile, Feebas is about{" "}
            <strong>50%</strong> per bite, so cast several times.{" "}
            <strong>Surf never finds Feebas</strong> — fishing only.
          </li>
          <li>
            <strong>If tiles feel wrong,</strong> try the next candidate seed (TID + phrase),
            re-check the seed/TID/words, confirm you are on the numbered tile (spots 1–3 are
            inaccessible), or get a fresh seed after the Dewford trend changes.
          </li>
        </ol>

        <details className="feebas-map__details" open>
          <summary>How to get your seed (three methods)</summary>
          <div className="feebas-map__details-body">
            <h6 className="feebas-map__subhead">Method A — PKHeX Feebas Locator (recommended)</h6>
            <p>
              Best when you can dump a save. Gives the exact current seed — works even after you
              changed Dewford’s phrase.
            </p>
            <ol>
              <li>
                Export your Emerald save (<code>.sav</code>) from your cartridge / emulator /
                flashcart.
              </li>
              <li>
                Open it in <strong>PKHeX</strong> with the <strong>Feebas Locator</strong> plugin
                (Project Pokémon: drop the plugin into PKHeX’s <code>plugins</code> folder, restart
                PKHeX).
              </li>
              <li>
                Go to <strong>Tools → Feebas Locator</strong> (wording may vary). It reads the Feebas
                / Dewford trend random value from the save.
              </li>
              <li>
                Copy that value (0–65535, often hex). In this panel open the <em>Seed</em> tab,
                paste it into <em>Dewford trend seed</em>, and press <em>Show tiles</em>.
              </li>
            </ol>

            <h6 className="feebas-map__subhead">Method B — TID + phrase (built into this panel)</h6>
            <p>
              No save dump needed. Works only while Dewford is still on the{" "}
              <strong>original new-game trendy phrase</strong> (you have never successfully
              submitted a new phrase in Dewford Hall). Common on dead-battery / early-game saves.
            </p>
            <ol>
              <li>
                Note your <strong>Trainer ID</strong> from the Trainer Card (0–65535).
              </li>
              <li>
                In Dewford Town, talk to the boy outside Dewford Hall (north of the Pokémon Center)
                and write down both Easy Chat words of the current trendy phrase.
              </li>
              <li>
                Open the <em>TID + phrase</em> tab below. Enter TID, pick the first word
                (Conditions) and second word (Lifestyle / Hobbies), then press{" "}
                <em>Find seeds</em>.
              </li>
              <li>
                The panel lists candidate seeds (timing variants) and applies the first one. If
                those tiles fail in-game, tap the next candidate and fish again (~50% Feebas on a
                hit). Keep the working seed until the Dewford trend changes.
              </li>
            </ol>
            <p className="feebas-map__callout">
              If you already set a new trendy phrase in Dewford Hall, Method B cannot recover the
              seed from the words alone — use Method A (PKHeX) or Method C.
            </p>

            <h6 className="feebas-map__subhead">Method C — Emulator / raw save (advanced)</h6>
            <p>
              The value is SaveBlock1 <code>dewfordTrends[0].rand</code> (a <code>u16</code> inside
              each 8-byte <code>DewfordTrend</code>). Dump that field from a memory viewer or save
              parser, then paste the low 16 bits into the <em>Seed</em> tab (hex or decimal) and
              press <em>Show tiles</em>.
            </p>
          </div>
        </details>

        <details className="feebas-map__details">
          <summary>Calculator tabs, maps, zoom, and Demo seed</summary>
          <div className="feebas-map__details-body">
            <ul>
              <li>
                <strong>Seed tab</strong> — direct entry for <code>dewfordTrends[0].rand</code>.
                Accepts hex (<code>4A7C</code>, <code>0x4A7C</code>) or decimal (
                <code>19068</code>). <em>Demo seed</em> loads{" "}
                <code>{formatFeebasSeed(FEEBAS_DEMO_SEED)}</code> so you can practice; it is{" "}
                <em>not</em> your game’s tiles.
              </li>
              <li>
                <strong>TID + phrase tab</strong> — Trainer ID + two Easy Chat dropdowns →{" "}
                <em>Find seeds</em>. Candidate seed buttons appear under the form; the active one
                is labeled “showing.”
              </li>
              <li>
                <strong>Yellow numbered tiles</strong> — every fishable spot on Route 119
                (pokeemerald IDs 1–{FEEBAS_FISHING_SPOT_COUNT}).
              </li>
              <li>
                <strong>Magenta rings</strong> — active Feebas tiles for the applied seed. Clear
                center so the spot number stays readable; the bright ring pulses to stand out on
                yellow water.
              </li>
              <li>
                <strong>Zoom &amp; pan</strong> — scroll / pinch, drag, or use + / −. Zoom uses
                crisp pixel scaling. <em>Enlarge map</em> opens a full lightbox with the same
                controls.
              </li>
              <li>
                <strong>North / Middle / South</strong> — route sections; a tab shows how many of
                your six spots fall there (e.g. “Middle · 2”).
              </li>
              <li>
                <strong>Spot list</strong> — click “Spot 262” (etc.) to jump to that section and
                center the map. Coordinates <code>(x, y)</code> are tiles on the full Route 119
                layout.
              </li>
              <li>
                <strong>Duplicate IDs</strong> — the game can roll the same spot more than once. Fewer
                than six unique IDs is normal; fish each unique tile.
              </li>
            </ul>
          </div>
        </details>

        <details className="feebas-map__details">
          <summary>Reshuffling tiles &amp; catching tips</summary>
          <div className="feebas-map__details-body">
            <ul>
              <li>
                To reshuffle Feebas tiles, go to Dewford Hall and successfully set a{" "}
                <strong>new</strong> trendy phrase (it must become the #1 trend). That regenerates{" "}
                <code>dewfordTrends[0].rand</code>. Afterward Method B no longer works from the old
                words — dump the new seed (Method A or C), paste it in the <em>Seed</em> tab, and
                press <em>Show tiles</em>.
              </li>
              <li>
                Register the Old Rod in Key Items and use Select to cast quickly while sweeping.
              </li>
              <li>
                You can fish from shore, bridges, or while surfing — as long as you face the target
                water tile. The encounter still comes from fishing, not Surf’s encounter table.
              </li>
              <li>
                Feebas is weak; after catching one, raise Beauty to 170+ with Dry Pokéblocks and
                level it up for Milotic (see Contest / Evolution prep elsewhere in the guide).
              </li>
              <li>
                Relicanth is unrelated — Dive on Underwater Routes 124 / 126, not a Super Rod or
                Feebas-tile fish.
              </li>
            </ul>
          </div>
        </details>
      </div>

      <div className="feebas-map__seed">
        <div className="feebas-map__mode-tabs" role="tablist" aria-label="Feebas calculator mode">
          <button
            type="button"
            role="tab"
            aria-selected={calcMode === "seed"}
            className={`feebas-map__mode-tab${calcMode === "seed" ? " feebas-map__mode-tab--active" : ""}`}
            onClick={() => setCalcMode("seed")}
          >
            Seed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={calcMode === "phrase"}
            className={`feebas-map__mode-tab${calcMode === "phrase" ? " feebas-map__mode-tab--active" : ""}`}
            onClick={() => setCalcMode("phrase")}
          >
            TID + phrase
          </button>
        </div>

        {calcMode === "seed" ? (
          <form className="feebas-map__seed-form" onSubmit={onSubmitSeed}>
            <div className="feebas-map__seed-row">
              <label className="feebas-map__seed-label" htmlFor="feebas-seed-input">
                Dewford trend seed
              </label>
              <div className="feebas-map__seed-controls">
                <input
                  id="feebas-seed-input"
                  type="text"
                  className="feebas-map__seed-input"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="0x4A7C or 19068"
                  spellCheck={false}
                  autoComplete="off"
                  aria-invalid={Boolean(seedError)}
                  aria-describedby="feebas-seed-help"
                />
                <button
                  type="submit"
                  className="feebas-map__seed-apply"
                  disabled={parsedSeed == null}
                >
                  Show tiles
                </button>
                <button
                  type="button"
                  className="feebas-map__seed-demo"
                  onClick={() => {
                    setPhraseCandidates([]);
                    setPhraseMeta(null);
                    applySeed(FEEBAS_DEMO_SEED);
                  }}
                >
                  Demo seed
                </button>
              </div>
            </div>
            <p id="feebas-seed-help" className="feebas-map__seed-help">
              Accepts hex (<code>4A7C</code>, <code>0x4A7C</code>) or decimal (<code>19068</code>).
              Values are treated as a u16 (0–65535), matching <code>dewfordTrends[0].rand</code>.
            </p>
            {seedError ? <p className="feebas-map__seed-error">{seedError}</p> : null}
          </form>
        ) : (
          <form className="feebas-map__seed-form" onSubmit={onSubmitPhrase}>
            <div className="feebas-map__phrase-grid">
              <label className="feebas-map__seed-label" htmlFor="feebas-tid-input">
                Trainer ID
              </label>
              <input
                id="feebas-tid-input"
                type="text"
                inputMode="numeric"
                className="feebas-map__seed-input"
                value={tidInput}
                onChange={(e) => setTidInput(e.target.value)}
                placeholder="0–65535"
                spellCheck={false}
                autoComplete="off"
                aria-invalid={Boolean(tidError)}
              />
              <label className="feebas-map__seed-label" htmlFor="feebas-word1">
                First word (Conditions)
              </label>
              <select
                id="feebas-word1"
                className="feebas-map__seed-select"
                value={word1}
                onChange={(e) => setWord1(e.target.value)}
              >
                {EC_CONDITIONS_EN.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <label className="feebas-map__seed-label" htmlFor="feebas-word2">
                Second word (Lifestyle / Hobbies)
              </label>
              <select
                id="feebas-word2"
                className="feebas-map__seed-select"
                value={word2}
                onChange={(e) => setWord2(e.target.value)}
              >
                {EC_SECOND_WORD_EN.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div className="feebas-map__seed-controls feebas-map__seed-controls--phrase">
              <button
                type="submit"
                className="feebas-map__seed-apply"
                disabled={parsedTid == null}
              >
                Find seeds
              </button>
            </div>
            <p className="feebas-map__seed-help">
              Emerald only. Works when the Dewford trendy phrase was never manually changed.
              May return several candidate seeds (timing variants) — try each until fishing
              confirms.
            </p>
            {tidError ? <p className="feebas-map__seed-error">{tidError}</p> : null}
            {phraseError ? <p className="feebas-map__seed-error">{phraseError}</p> : null}
            {phraseMeta ? <p className="feebas-map__phrase-meta">{phraseMeta}</p> : null}
            {phraseCandidates.length > 0 ? (
              <ul className="feebas-map__candidates" aria-label="Candidate Feebas seeds">
                {phraseCandidates.map((seed) => {
                  const active = seed === appliedSeed;
                  return (
                    <li key={seed}>
                      <button
                        type="button"
                        className={`feebas-map__candidate${active ? " feebas-map__candidate--active" : ""}`}
                        onClick={() => applySeed(seed)}
                      >
                        {formatFeebasSeed(seed)}
                        {active ? " · showing" : ""}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </form>
        )}
      </div>

      <div className="feebas-map__results">
        <p className="feebas-map__results-lead">
          Active spots for <code>{formatFeebasSeed(appliedSeed)}</code>
          {uniqueCount < FEEBAS_ACTIVE_SPOT_COUNT
            ? ` (${uniqueCount} unique — the game can roll duplicate IDs)`
            : null}
          :
        </p>
        <ol className="feebas-map__demo-list">
          {activeSpots.map((spot, idx) => {
            const sec = FEEBAS_FISHING_SECTIONS[spot.section];
            const here = spot.section === section;
            const focused =
              focusSpot != null &&
              focusSpot.id === spot.id &&
              focusSpot.x === spot.x &&
              focusSpot.y === spot.y;
            return (
              <li
                key={`${spot.id}-${spot.x}-${spot.y}-${idx}`}
                className={
                  focused
                    ? "feebas-map__demo-item--here feebas-map__demo-item--focused"
                    : here
                      ? "feebas-map__demo-item--here"
                      : undefined
                }
              >
                <button
                  type="button"
                  className="feebas-map__demo-jump"
                  onClick={() => jumpToSpot(spot)}
                >
                  Spot {spot.id}
                </button>
                <span>
                  ({spot.x}, {spot.y}) · {sec.label}
                  {focused ? " · focused" : here ? " · on this map" : ""}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="feebas-map__toolbar">
        <div className="feebas-map__tabs" role="tablist" aria-label="Route 119 section">
          {SECTION_TABS.map((tab) => {
            const count = activeSpots.filter((s) => s.section === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={section === tab.id}
                className={`feebas-map__tab${section === tab.id ? " feebas-map__tab--active" : ""}`}
                onClick={() => {
                  setSection(tab.id);
                  const first = activeSpots.find((s) => s.section === tab.id);
                  setFocusSpotKey(first ? `${first.id}-${first.x}-${first.y}` : null);
                }}
              >
                {tab.label}
                {count > 0 ? ` · ${count}` : ""}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="feebas-map__enlarge"
          onClick={() => setExpanded(true)}
        >
          Enlarge map
        </button>
      </div>

      {mapView("default")}

      {spotsInSection.length === 0 ? (
        <p className="feebas-map__demo-empty">
          No active Feebas spots in this section for the current seed — try another tab.
        </p>
      ) : null}

      <p className="encounter-legend">
        Yellow tiles = all fishable spots. Magenta rings = active Feebas tiles for the applied
        seed (number stays readable in the center). Use the Seed or TID + phrase tabs above. Spots
        1–3 are inaccessible. Old Rod + several casts per tile (~50% Feebas on a hit).
      </p>

      {expanded ? (
        <div
          className="lightbox"
          data-view={viewMode}
          role="dialog"
          aria-modal="true"
          aria-label="Feebas fishing map"
          onClick={() => setExpanded(false)}
        >
          <div
            className="lightbox__panel lightbox__panel--annotated"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox__close"
              onClick={() => setExpanded(false)}
              aria-label="Close"
            >
              ×
            </button>
            {mapView("lightbox")}
          </div>
        </div>
      ) : null}
    </section>
  );
}
