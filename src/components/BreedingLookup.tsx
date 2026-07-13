import { useMemo, useState } from "react";
import {
  checkBreeding,
  listBreedingOptions,
} from "../data/breeding";
import { emeraldSpriteUrl } from "../data/species";

export function BreedingLookup() {
  const options = useMemo(() => listBreedingOptions(), []);
  const [slugA, setSlugA] = useState("ditto");
  const [slugB, setSlugB] = useState("marill");

  const result = useMemo(() => {
    if (!slugA || !slugB) return null;
    return checkBreeding(slugA, slugB);
  }, [slugA, slugB]);

  const optA = options.find((o) => o.slug === slugA);
  const optB = options.find((o) => o.slug === slugB);

  return (
    <section className="breeding-lookup" aria-label="Breeding compatibility lookup">
      <h3 className="breeding-lookup__title">Breeding lookup</h3>
      <p className="breeding-lookup__lead">
        Pick two Emerald species to see whether they can produce an Egg at the Day Care.
      </p>
      <div className="breeding-lookup__pickers">
        <label className="breeding-lookup__field">
          <span>Parent A</span>
          <select value={slugA} onChange={(e) => setSlugA(e.target.value)}>
            {options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <span className="breeding-lookup__times" aria-hidden="true">
          ×
        </span>
        <label className="breeding-lookup__field">
          <span>Parent B</span>
          <select value={slugB} onChange={(e) => setSlugB(e.target.value)}>
            {options.map((o) => (
              <option key={`b-${o.slug}`} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="breeding-lookup__sprites" aria-hidden="true">
        {optA && (
          <img
            src={emeraldSpriteUrl(optA.nationalNumber)}
            alt=""
            width={64}
            height={64}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        )}
        {optB && (
          <img
            src={emeraldSpriteUrl(optB.nationalNumber)}
            alt=""
            width={64}
            height={64}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        )}
      </div>
      {result && (
        <div
          className={`breeding-lookup__result ${
            result.compatible ? "breeding-lookup__result--ok" : "breeding-lookup__result--no"
          }`}
        >
          <p className="breeding-lookup__summary">{result.summary}</p>
          {result.offspring.length > 0 && (
            <p className="breeding-lookup__offspring">
              <strong>Offspring:</strong> {result.offspring.join(" · ")}
            </p>
          )}
          {result.notes.length > 0 && (
            <ul>
              {result.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
