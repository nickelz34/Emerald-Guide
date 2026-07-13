import { useMemo, useState } from "react";
import {
  checkBreeding,
  listBreedingOptions,
  type BreedingParentDetails,
  type BreedingResult,
} from "../data/breeding";
import { eggSpriteUrl, emeraldSpriteUrl, TYPE_COLORS } from "../data/species";

function ParentCard({
  label,
  slug,
  options,
  onChange,
  details,
  sharedEggGroups,
}: {
  label: string;
  slug: string;
  options: ReturnType<typeof listBreedingOptions>;
  onChange: (slug: string) => void;
  details: BreedingParentDetails;
  sharedEggGroups: string[];
}) {
  const spriteSrc = details.nationalNumber ? emeraldSpriteUrl(details.nationalNumber) : undefined;

  return (
    <div className="breeding-lookup__parent">
      <label className="breeding-lookup__field">
        <span className="breeding-lookup__field-label">{label}</span>
        <select value={slug} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={`${label}-${o.slug}`} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
      </label>

      <div className="breeding-lookup__card">
        <div className="breeding-lookup__sprite-stage">
          {spriteSrc ? (
            <img
              className="breeding-lookup__sprite"
              src={spriteSrc}
              alt=""
              width={64}
              height={64}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
          ) : (
            <span className="breeding-lookup__sprite-fallback" aria-hidden="true">
              ?
            </span>
          )}
        </div>

        <p className="breeding-lookup__mon-name">{details.name}</p>

        {details.types.length > 0 && (
          <div className="type-chips breeding-lookup__types">
            {details.types.map((t) => (
              <span key={t} className="type-chip" style={{ background: TYPE_COLORS[t] ?? "#666" }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="breeding-lookup__egg-groups">
          {details.isDitto ? (
            <span className="breeding-lookup__egg-group breeding-lookup__egg-group--ditto">Ditto group</span>
          ) : details.isUndiscovered ? (
            <span className="breeding-lookup__egg-group breeding-lookup__egg-group--blocked">Undiscovered</span>
          ) : details.eggGroups.length > 0 ? (
            details.eggGroups.map((group) => (
              <span
                key={group}
                className={`breeding-lookup__egg-group${
                  sharedEggGroups.includes(group) ? " breeding-lookup__egg-group--shared" : ""
                }`}
              >
                {group}
              </span>
            ))
          ) : (
            <span className="breeding-lookup__egg-group">—</span>
          )}
        </div>

        <p className="breeding-lookup__gender">{details.genderLabel}</p>
      </div>
    </div>
  );
}

function CompatibilityFlow({ result }: { result: BreedingResult }) {
  const hatchlings = result.offspringDetails.filter((o) => !o.isNote);

  return (
    <div
      className={`breeding-lookup__flow${result.compatible ? " breeding-lookup__flow--ok" : " breeding-lookup__flow--no"}`}
      aria-hidden="true"
    >
      {result.compatible ? (
        <>
          <img className="breeding-lookup__flow-egg" src={eggSpriteUrl()} alt="" width={48} height={96} />
          <span className="breeding-lookup__flow-arrow">→</span>
          <div className="breeding-lookup__flow-offspring">
            {hatchlings.length > 0 ? (
              hatchlings.map((o) => (
                <div key={o.name} className="breeding-lookup__flow-mon">
                  {o.nationalNumber ? (
                    <img
                      className="breeding-lookup__sprite"
                      src={emeraldSpriteUrl(o.nationalNumber)}
                      alt=""
                      width={64}
                      height={64}
                    />
                  ) : (
                    <span className="breeding-lookup__sprite-fallback">?</span>
                  )}
                  <span className="breeding-lookup__flow-name">{o.name}</span>
                </div>
              ))
            ) : (
              <span className="breeding-lookup__flow-name">Egg</span>
            )}
          </div>
        </>
      ) : (
        <span className="breeding-lookup__flow-blocked">✕ No Egg</span>
      )}
    </div>
  );
}

export function BreedingLookup() {
  const options = useMemo(() => listBreedingOptions(), []);
  const [slugA, setSlugA] = useState("ditto");
  const [slugB, setSlugB] = useState("marill");

  const result = useMemo(() => {
    if (!slugA || !slugB) return null;
    return checkBreeding(slugA, slugB);
  }, [slugA, slugB]);

  return (
    <section className="breeding-lookup" aria-label="Breeding compatibility lookup">
      <h3 className="breeding-lookup__title">Breeding lookup</h3>
      <p className="breeding-lookup__lead">
        Pick any two Emerald species to check Day Care compatibility, shared egg groups, gender ratios, and likely
        offspring. Highlighted egg groups match between both parents.
      </p>

      {result && (
        <div className="breeding-lookup__pair">
          <ParentCard
            label="Parent A"
            slug={slugA}
            options={options}
            onChange={setSlugA}
            details={result.parentA}
            sharedEggGroups={result.sharedEggGroups}
          />
          <span className="breeding-lookup__times" aria-hidden="true">
            ×
          </span>
          <ParentCard
            label="Parent B"
            slug={slugB}
            options={options}
            onChange={setSlugB}
            details={result.parentB}
            sharedEggGroups={result.sharedEggGroups}
          />
        </div>
      )}

      {result && <CompatibilityFlow result={result} />}

      {result && (
        <div
          className={`breeding-lookup__result ${
            result.compatible ? "breeding-lookup__result--ok" : "breeding-lookup__result--no"
          }`}
        >
          <p className="breeding-lookup__summary">{result.summary}</p>

          {result.sharedEggGroups.length > 0 && (
            <p className="breeding-lookup__shared">
              <strong>Shared egg groups:</strong> {result.sharedEggGroups.join(" · ")}
            </p>
          )}

          {result.offspring.length > 0 && (
            <div className="breeding-lookup__offspring-block">
              <p className="breeding-lookup__offspring-title">
                <strong>Likely offspring</strong>
              </p>
              <ul className="breeding-lookup__offspring-list">
                {result.offspringDetails.map((o) => (
                  <li
                    key={o.name}
                    className={o.isNote ? "breeding-lookup__offspring-note" : "breeding-lookup__offspring-item"}
                  >
                    {!o.isNote && o.nationalNumber && (
                      <img
                        className="breeding-lookup__offspring-sprite"
                        src={emeraldSpriteUrl(o.nationalNumber)}
                        alt=""
                        width={32}
                        height={32}
                      />
                    )}
                    <span>{o.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.notes.length > 0 && (
            <div className="breeding-lookup__notes">
              <p className="breeding-lookup__notes-title">
                <strong>Emerald breeding rules</strong>
              </p>
              <ul>
                {result.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
