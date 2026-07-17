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
        Use this calculator to find the six active fishing tiles on your save. Emerald does{" "}
        <strong>not</strong> use fixed Feebas locations — tiles move with Dewford’s trendy phrase
        seed.
      </p>

      <div className="feebas-map__guide">
        <h6 className="feebas-map__guide-title">How to use this calculator</h6>
        <ol className="feebas-map__guide-steps">
          <li>
            <strong>Understand the mechanic.</strong> Route 119 has{" "}
            {FEEBAS_FISHING_SPOT_COUNT} numbered fishable water tiles (surfable, not waterfall),
            counted left→right and top→bottom. Exactly {FEEBAS_ACTIVE_SPOT_COUNT} of those spot IDs
            are active for Feebas. The active set comes from a 16-bit random value stored on your
            save: <code>dewfordTrends[0].rand</code> (the current Dewford trendy phrase’s RNG
            seed).
          </li>
          <li>
            <strong>Find your tiles</strong> with either tab below: paste a known{" "}
            <em>Dewford trend seed</em>, or enter your <em>Trainer ID + trendy phrase</em> (only
            if you never changed Dewford’s phrase) to reverse-engineer candidate seeds.
          </li>
          <li>
            <strong>Read the results.</strong> The green list shows your six active spot IDs with
            map coordinates. Tap a spot ID to jump to that North / Middle / South map section and
            zoom the map onto that exact tile. Bright magenta highlights mark the active
            metatiles on the numbered yellow grid — zoom in to read the crisp spot number on
            that tile.
          </li>
          <li>
            <strong>Fish those tiles in-game.</strong> Face the water tile, use any rod (Old Rod is
            fastest — only one “Oh! A bite!” prompt). On a correct tile, Feebas is about{" "}
            <strong>50%</strong> per bite, so cast several times before moving on.{" "}
            <strong>Surf never finds Feebas</strong> — fishing only.
          </li>
          <li>
            <strong>If tiles feel wrong,</strong> you entered the wrong seed, the trend changed
            since you dumped the seed, or you are not on the numbered tile (spots 1–3 at the top of
            the river are inaccessible and can never be Feebas). Reshuffle in Dewford and get a
            fresh seed if needed.
          </li>
        </ol>

        <details className="feebas-map__details" open>
          <summary>How to get your Dewford trend seed</summary>
          <div className="feebas-map__details-body">
            <h6 className="feebas-map__subhead">Method A — PKHeX Feebas Locator (recommended)</h6>
            <ol>
              <li>
                Export your Emerald save (<code>.sav</code>) from your cartridge / emulator /
                flashcart the usual way.
              </li>
              <li>
                Open the save in <strong>PKHeX</strong> with the{" "}
                <strong>Feebas Locator</strong> plugin installed (from Project Pokémon: drop the
                plugin into PKHeX’s <code>plugins</code> folder, then restart PKHeX).
              </li>
              <li>
                In PKHeX go to <strong>Tools → Feebas Locator</strong> (wording may vary slightly by
                plugin version). It reads the current Feebas RNG value from the save and can show
                the matching tiles.
              </li>
              <li>
                Copy the Feebas / Dewford trend random value it reports (a number from 0–65535, often
                shown in hex). Paste that value into the seed box below and press{" "}
                <em>Show tiles</em>.
              </li>
            </ol>

            <h6 className="feebas-map__subhead">Method B — TID + trendy phrase (built-in)</h6>
            <p>
              If you have <strong>never changed</strong> Dewford’s trendy phrase (still the
              new-game trend — common on dead-battery / early-game saves), switch to the{" "}
              <em>TID + phrase</em> tab below:
            </p>
            <ol>
              <li>
                Note your Trainer ID (Trainer Card).
              </li>
              <li>
                In Dewford Town, talk to the boy outside Dewford Hall (north of the Pokémon Center)
                and write down the two Easy Chat words of the current trendy phrase.
              </li>
              <li>
                Enter TID + both words and press <em>Find seeds</em>. The calculator lists
                candidate Feebas random values (timing variants) and applies the first one.
              </li>
              <li>
                If the first candidate’s tiles feel wrong in-game, tap the next candidate and
                verify by fishing (~50% Feebas on a hit). Keep the working seed until you change
                the Dewford trend.
              </li>
            </ol>
            <p className="feebas-map__callout">
              If you already submitted a new trendy phrase in Dewford Hall, Method B usually cannot
              recover the seed from the words alone — use Method A (PKHeX) or Method C instead.
            </p>

            <h6 className="feebas-map__subhead">Method C — Emulator / raw save (advanced)</h6>
            <p>
              The value lives in SaveBlock1 as <code>dewfordTrends[0].rand</code> (a{" "}
              <code>u16</code>). On pokeemerald layouts this is part of each 8-byte{" "}
              <code>DewfordTrend</code> struct. Memory viewers or save parsers that expose Dewford
              trends can dump that field; paste the low 16 bits into the seed box (hex or decimal).
            </p>
          </div>
        </details>

        <details className="feebas-map__details">
          <summary>Using the maps, zoom, and Demo seed</summary>
          <div className="feebas-map__details-body">
            <ul>
              <li>
                <strong>Yellow numbered tiles</strong> — every fishable spot on Route 119. Numbers
                match pokeemerald’s fishing-spot IDs (1–{FEEBAS_FISHING_SPOT_COUNT}).
              </li>
              <li>
                <strong>Magenta highlights</strong> — the active Feebas metatiles for the seed
                you applied. Each highlight is a bright pulsing magenta ring around the tile so
                the baked spot number stays readable in the clear center.
              </li>
              <li>
                <strong>Zoom &amp; pan</strong> — scroll / pinch to zoom, drag to pan, or use the + /
                − buttons. Zoom uses crisp pixel scaling so spot numbers stay sharp.{" "}
                <em>Enlarge map</em> opens a full lightbox with the same controls.
              </li>
              <li>
                <strong>North / Middle / South tabs</strong> — the route is split into three map
                sections so the grid stays readable. A tab shows how many of your six spots fall in
                that section (e.g. “Middle · 2”).
              </li>
              <li>
                <strong>Spot list links</strong> — click “Spot 262” (etc.) to jump straight to that
                section and center the map on that tile. Coordinates <code>(x, y)</code> are tile
                positions on the full Route 119 layout.
              </li>
              <li>
                <strong>Demo seed</strong> — loads a built-in example (
                <code>{formatFeebasSeed(FEEBAS_DEMO_SEED)}</code>) so you can practice reading the
                UI without a save. It is <em>not</em> your game’s tiles.
              </li>
              <li>
                <strong>Duplicate IDs</strong> — the game can roll the same spot more than once. If
                the list shows fewer than six unique IDs, that is normal; you still only need to
                fish the unique tiles.
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
                <code>dewfordTrends[0].rand</code>. Dump / look up the new seed and run{" "}
                <em>Show tiles</em> again.
              </li>
              <li>
                Register the Old Rod in Key Items and use Select to cast quickly while sweeping.
              </li>
              <li>
                You can fish from shore, bridges, or while surfing — as long as you face the target
                water tile. The encounter still comes from fishing, not from Surf’s encounter table.
              </li>
              <li>
                Feebas is weak; after catching one, raise Beauty to 170+ with Dry Pokéblocks and
                level it up for Milotic (see Contest / Evolution prep elsewhere in the guide).
              </li>
              <li>
                Relicanth is unrelated — it is a Dive encounter on Underwater Routes 124 / 126, not
                a Super Rod or Feebas-tile fish.
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
        Yellow tiles = all fishable spots (crisp baked IDs). Magenta highlights = exact active
        Feebas tiles for the seed above. Zoom / pan to read spot numbers. Spots 1–3 are
        inaccessible. Old Rod + several casts per tile (~50% Feebas on a hit).
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
