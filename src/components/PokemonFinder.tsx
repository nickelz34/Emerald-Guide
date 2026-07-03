import { useEffect, useMemo, useState } from "react";
import { METHOD_LABELS } from "../types";
import { loadWildPokedex, type Rarity, type WildPokemon } from "../data/wildSource";
import { loadDex, DEX_META, type DexEntry, type DexScope } from "../data/dex";
import { emeraldSpriteUrl, loadSpeciesInfo, TYPE_COLORS, type SpeciesInfo } from "../data/species";
import { assetUrl } from "../lib/assetUrl";
import { AnnotatedScreenshot } from "./AnnotatedScreenshot";
import { useLightbox } from "./ImageLightbox";

const RARITY_CLASS: Record<Rarity, string> = {
  Common: "rarity--common",
  Uncommon: "rarity--uncommon",
  Rare: "rarity--rare",
  "Very Rare": "rarity--vrare",
};

const STAT_MAX = 200;
const SCOPES: DexScope[] = ["hoenn", "national", "all"];

interface FinderCard {
  entry: DexEntry;
  wild?: WildPokemon;
}

function dexNumber(entry: DexEntry, scope: DexScope): number | undefined {
  return scope === "hoenn" ? entry.hoennNumber : entry.nationalNumber;
}

function TypeChips({ types }: { types: string[] }) {
  if (types.length === 0) return null;
  return (
    <span className="type-chips">
      {types.map((t) => (
        <span key={t} className="type-chip" style={{ background: TYPE_COLORS[t] ?? "#666" }}>
          {t}
        </span>
      ))}
    </span>
  );
}

function MethodTags({ methods }: { methods: WildPokemon["methods"] }) {
  return (
    <span className="poke-card__methods">
      {methods.map((m) => (
        <span key={m} className="method-tag">
          {METHOD_LABELS[m]}
        </span>
      ))}
    </span>
  );
}

function DexCard({ card, scope, onSelect }: { card: FinderCard; scope: DexScope; onSelect: () => void }) {
  const { entry, wild } = card;
  const num = dexNumber(entry, scope);
  const sprite = emeraldSpriteUrl(entry.nationalNumber);
  return (
    <button type="button" className="poke-card" onClick={onSelect}>
      <div className="poke-card__top">
        <span className="poke-card__sprite" aria-hidden="true">
          {sprite ? (
            <img
              src={sprite}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
          ) : (
            <span className="poke-card__sprite-fallback">?</span>
          )}
        </span>
        <span className="poke-card__name">{entry.name}</span>
        {num != null && <span className="poke-card__num">#{String(num).padStart(3, "0")}</span>}
      </div>
      {entry.isGlitch ? (
        <span className="rarity rarity--glitch">Glitch</span>
      ) : wild ? (
        <>
          <MethodTags methods={wild.methods} />
          <span className="poke-card__meta">
            Lv {wild.minLevel}–{wild.maxLevel} · {wild.locationCount}{" "}
            {wild.locationCount === 1 ? "location" : "locations"}
          </span>
        </>
      ) : (
        <span className="poke-card__meta poke-card__meta--muted">Not in the wild · evolve / trade / gift</span>
      )}
    </button>
  );
}

function StatBars({ stats, total }: { stats: SpeciesInfo["stats"]; total: number }) {
  return (
    <div className="stat-bars">
      {stats.map((s) => (
        <div key={s.label} className="stat-bar">
          <span className="stat-bar__label">{s.label}</span>
          <span className="stat-bar__value">{s.value}</span>
          <span className="stat-bar__track">
            <span
              className="stat-bar__fill"
              style={{ width: `${Math.min(100, (s.value / STAT_MAX) * 100)}%` }}
            />
          </span>
        </div>
      ))}
      <div className="stat-bar stat-bar--total">
        <span className="stat-bar__label">Total</span>
        <span className="stat-bar__value">{total}</span>
        <span className="stat-bar__track" />
      </div>
    </div>
  );
}

function SpeciesPanel({ slug, name, nationalNumber }: { slug: string; name: string; nationalNumber: number }) {
  const [info, setInfo] = useState<SpeciesInfo | null>(null);
  const [error, setError] = useState(false);
  const sprite = emeraldSpriteUrl(nationalNumber);

  useEffect(() => {
    let alive = true;
    setInfo(null);
    setError(false);
    loadSpeciesInfo(slug)
      .then((data) => alive && setInfo(data))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <div className="species-panel">
      <div className="species-panel__head">
        {sprite ? (
          <img className="species-panel__sprite" src={sprite} alt={name} />
        ) : (
          <span className="species-panel__sprite species-panel__sprite--fallback" aria-hidden="true">
            ?
          </span>
        )}
        {info ? (
          <div className="species-panel__id">
            <TypeChips types={info.types} />
            {info.genus && <span className="species-panel__genus">{info.genus}</span>}
          </div>
        ) : error ? (
          <p className="poke-detail__note">Couldn’t load extended stats for {name} (offline?).</p>
        ) : (
          <p className="poke-detail__note">Loading stats &amp; type info…</p>
        )}
      </div>

      {info && (
        <>
          {info.flavor && <p className="poke-detail__blurb">{info.flavor}</p>}

          <div className="species-panel__meta">
            <div className="poke-stat">
              <span className="poke-stat__label">Abilities</span>
              <span className="poke-stat__value">
                {info.abilities.join(", ")}
                {info.hiddenAbility ? ` · ${info.hiddenAbility} (hidden)` : ""}
              </span>
            </div>
            {info.heightM != null && (
              <div className="poke-stat">
                <span className="poke-stat__label">Height / Weight</span>
                <span className="poke-stat__value">
                  {info.heightM} m · {info.weightKg} kg
                </span>
              </div>
            )}
            {info.evolution.length > 1 && (
              <div className="poke-stat">
                <span className="poke-stat__label">Evolution line</span>
                <span className="poke-stat__value">{info.evolution.join(" → ")}</span>
              </div>
            )}
          </div>

          <h3 className="poke-detail__section">Base stats</h3>
          <StatBars stats={info.stats} total={info.total} />
        </>
      )}
    </div>
  );
}

function GlitchPanel() {
  return (
    <div className="species-panel">
      <p className="poke-detail__blurb">
        “Decamark” (??????????) is not a real Pokémon — it’s the famous Gen-3 glitch slot that
        sits just past National #386. It can only appear through memory-corruption exploits like
        the Pomeg/Glitzer-Popping glitches, has no legitimate stats or encounters, and is unsafe to
        use in a normal save.
      </p>
      <div className="species-panel__meta">
        <div className="poke-stat">
          <span className="poke-stat__label">National No.</span>
          <span className="poke-stat__value">#387 (glitch)</span>
        </div>
        <div className="poke-stat">
          <span className="poke-stat__label">How to obtain</span>
          <span className="poke-stat__value">Glitch exploits only — not naturally available</span>
        </div>
      </div>
    </div>
  );
}

function WhereToFind({ wild }: { wild?: WildPokemon }) {
  const { open } = useLightbox();

  if (!wild) {
    return (
      <p className="poke-detail__note">
        This Pokémon isn’t found in the wild in Emerald. Obtain it via evolution, in-game trade,
        a gift/static encounter, or by transferring/breeding.
      </p>
    );
  }

  return (
    <>
      <p className="poke-detail__timenote">
        Emerald wild encounters don’t change with the time of day — the rates below apply around
        the clock. (Tides only affect Shoal Cave.)
      </p>
      <div className="poke-locations">
        {wild.locations.map((loc) => {
          const images = loc.screenshot
            ? [{ src: assetUrl(`screenshots/${loc.screenshot}`), caption: loc.name, areaId: loc.areaId }]
            : [];
          return (
            <div key={loc.id} className={`poke-location ${images.length === 0 ? "poke-location--nomap" : ""}`}>
              <div className="poke-location__info">
                <h4>{loc.name}</h4>
                <table className="poke-location__table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Level</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loc.rows.map((row, i) => (
                      <tr key={`${row.method}-${i}`}>
                        <td>
                          <span className="method-tag">{METHOD_LABELS[row.method]}</span>
                        </td>
                        <td>Lv {row.level}</td>
                        <td>{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {images.length > 0 && (
                <div className="poke-location__map">
                  <AnnotatedScreenshot
                    imageSrc={images[0].src}
                    areaId={loc.areaId}
                    showLegend={false}
                    onImageClick={() => open(images, 0, loc.areaId)}
                  />
                  <span className="poke-location__map-hint">Click the map to zoom &amp; see every marker</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function PokemonDetail({ card, onBack }: { card: FinderCard; onBack: () => void }) {
  const { entry, wild } = card;
  return (
    <div className="poke-detail">
      <button type="button" className="btn btn--ghost poke-detail__back" onClick={onBack}>
        ← Back to Pokédex
      </button>

      <header className="poke-detail__head">
        <div>
          <h2>{entry.name}</h2>
          <span className="poke-detail__sub">
            {entry.hoennNumber ? `Hoenn #${String(entry.hoennNumber).padStart(3, "0")} · ` : ""}
            National #{String(entry.nationalNumber).padStart(3, "0")}
            {wild ? ` · ${wild.locationCount} ${wild.locationCount === 1 ? "location" : "locations"}` : ""}
          </span>
        </div>
        {entry.isGlitch ? (
          <span className="rarity rarity--glitch">Glitch</span>
        ) : wild ? (
          <span className={`rarity ${RARITY_CLASS[wild.rarity]}`}>{wild.rarity}</span>
        ) : null}
      </header>

      {entry.isGlitch ? <GlitchPanel /> : <SpeciesPanel slug={entry.slug} name={entry.name} nationalNumber={entry.nationalNumber} />}

      {!entry.isGlitch && (
        <>
          <h3 className="poke-detail__section">Where to find it</h3>
          <WhereToFind wild={wild} />
        </>
      )}
    </div>
  );
}

export function PokemonFinder() {
  const [scope, setScope] = useState<DexScope>("hoenn");
  const [dex, setDex] = useState<DexEntry[] | null>(null);
  const [wildList, setWildList] = useState<WildPokemon[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DexEntry | null>(null);

  useEffect(() => {
    let alive = true;
    loadWildPokedex()
      .then((data) => alive && setWildList(data))
      .catch(() => {
        /* wild data is enrichment only; dex still works without it */
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setDex(null);
    setLoadError(null);
    loadDex(scope)
      .then((data) => alive && setDex(data))
      .catch((err) => alive && setLoadError(err.message ?? "Failed to load"));
    return () => {
      alive = false;
    };
  }, [scope]);

  const wildMap = useMemo(() => {
    const map = new Map<string, WildPokemon>();
    wildList?.forEach((w) => map.set(w.slug, w));
    return map;
  }, [wildList]);

  const cards = useMemo<FinderCard[]>(() => {
    if (!dex) return [];
    return dex.map((entry) => ({ entry, wild: entry.slug ? wildMap.get(entry.slug) : undefined }));
  }, [dex, wildMap]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(({ entry, wild }) => {
      if (entry.name.toLowerCase().includes(q)) return true;
      if (String(entry.nationalNumber) === q || String(entry.hoennNumber ?? "") === q) return true;
      if (wild?.methods.some((m) => METHOD_LABELS[m].toLowerCase().includes(q))) return true;
      if (wild?.locations.some((l) => l.name.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [cards, query]);

  const selectedCard = selected
    ? { entry: selected, wild: selected.slug ? wildMap.get(selected.slug) : undefined }
    : null;

  const switchScope = (next: DexScope) => {
    if (next === scope) return;
    setDex(null);
    setScope(next);
    setSelected(null);
  };

  if (selectedCard) {
    return <PokemonDetail card={selectedCard} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="pokefinder">
      <div className="dex-toggle" role="tablist" aria-label="Pokédex scope">
        {SCOPES.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={scope === s}
            className={`dex-toggle__btn ${scope === s ? "dex-toggle__btn--active" : ""}`}
            onClick={() => switchScope(s)}
          >
            <span className="dex-toggle__label">{DEX_META[s].label}</span>
            <span className="dex-toggle__count">{DEX_META[s].count}</span>
          </button>
        ))}
      </div>
      <p className="dex-toggle__blurb">{DEX_META[scope].blurb}</p>

      <div className="pokefinder__searchbar">
        <input
          type="search"
          className="search pokefinder__search"
          placeholder="Search by name, dex number, method, or location… (e.g. Ralts, 280, Surf, Route 119)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <span className="pokefinder__count">
          {dex ? `${results.length} / ${dex.length}` : "…"} Pokémon
        </span>
      </div>

      {loadError ? (
        <p className="pokefinder__empty">
          Couldn’t load the Pokédex ({loadError}). Check your connection and reopen this tab.
        </p>
      ) : !dex ? (
        <p className="pokefinder__empty">Loading the {DEX_META[scope].label} Pokédex…</p>
      ) : results.length === 0 ? (
        <p className="pokefinder__empty">No Pokémon match “{query}”.</p>
      ) : (
        <div className="poke-grid">
          {results.map((card) => (
            <DexCard
              key={card.entry.nationalNumber + card.entry.slug}
              card={card}
              scope={scope}
              onSelect={() => setSelected(card.entry)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
