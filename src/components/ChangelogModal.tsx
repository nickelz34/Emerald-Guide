import { useEffect } from "react";
import { CHANGELOG } from "../data/changelog";

interface ChangelogModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangelogModal({ open, onClose }: ChangelogModalProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="changelog-modal" role="dialog" aria-modal="true" aria-labelledby="changelog-title" onClick={onClose}>
      <div className="changelog-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-modal__head">
          <div>
            <h3 id="changelog-title">Changelog</h3>
            <p className="changelog-modal__subtitle">Every version of Emerald-Guide, newest first.</p>
          </div>
          <button type="button" className="changelog-modal__close" onClick={onClose} aria-label="Close changelog">
            ×
          </button>
        </div>

        <div className="changelog-modal__body">
          {CHANGELOG.map((release, index) => (
            <article
              key={release.version}
              className={`changelog-release ${index === 0 ? "changelog-release--latest" : ""}`}
            >
              <header className="changelog-release__head">
                <div className="changelog-release__version-row">
                  <span className="changelog-release__version">v{release.version}</span>
                  {index === 0 && <span className="changelog-release__badge">Current</span>}
                </div>
                <time className="changelog-release__date" dateTime={release.date}>
                  {formatReleaseDate(release.date)}
                </time>
              </header>
              <p className="changelog-release__summary">{release.summary}</p>
              {release.sections.map((section) => (
                <section key={section.heading} className="changelog-release__section">
                  <h4>{section.heading}</h4>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatReleaseDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
