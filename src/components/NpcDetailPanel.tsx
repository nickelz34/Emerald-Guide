import { useEffect } from "react";
import { createPortal } from "react-dom";
import { assetUrl } from "../lib/assetUrl";
import { owPortraitCssVars } from "../lib/owPortrait";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import type { MapPoint } from "../data/mapPoints";
import {
  getNpcDialogue,
  getNpcStoryLinks,
  isNpcMapPoint,
  type NpcMapPoint,
} from "../lib/npcDetails";

const FACING_LABELS = ["south", "north", "west", "east"] as const;

function formatMapId(mapId?: string): string | null {
  if (!mapId) return null;
  const raw = mapId.replace(/^MAP_/, "").replace(/_/g, " ").toLowerCase();
  const route = raw.match(/^route (\d+)$/);
  if (route) return `Route ${route[1]}`;
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatScriptLabel(script?: string): string | null {
  if (!script) return null;
  const tail = script.match(/_EventScript_(.+)$/);
  if (!tail) return script;
  return tail[1].replace(/([a-z])([A-Z])/g, "$1 $2");
}

function facingLabel(frame?: number): string | null {
  if (frame == null || frame < 0 || frame > 3) return null;
  return FACING_LABELS[frame];
}

export function NpcModalBody({
  npc,
  onJumpToGuide,
}: {
  npc: NpcMapPoint;
  onJumpToGuide?: (point: MapPoint) => void;
}) {
  const mapLabel = formatMapId(npc.mapId) || npc.note || null;
  const facing = facingLabel(npc.spriteFrame);
  const dialogue = getNpcDialogue(npc);
  const story = getNpcStoryLinks(npc);
  const role =
    npc.trainerClass && npc.trainerClass !== npc.name
      ? npc.trainerClass
      : formatScriptLabel(npc.script) || "Overworld NPC";

  return (
    <div className="trainer-modal__content">
      <section className="trainer-modal__hero" aria-label="NPC overview">
        {npc.spriteSheet ? (
          <span
            className="trainer-modal__trainer-sprite"
            style={owPortraitCssVars(npc)}
            aria-hidden="true"
          >
            <img
              src={assetUrl(npc.spriteSheet)}
              alt=""
              className="hoenn-map__trainer-sprite"
              draggable={false}
            />
          </span>
        ) : null}
        <div className="trainer-modal__hero-text">
          <p className="trainer-modal__class">{role}</p>
          <h4 className="trainer-modal__name">{npc.trainerName || npc.name}</h4>
          {mapLabel && <p className="trainer-modal__location">{mapLabel}</p>}
          <div className="trainer-modal__hero-badges">
            <span className="trainer-detail__badge">Non-battle NPC</span>
            {facing && <span className="trainer-detail__badge">Facing {facing}</span>}
          </div>
        </div>
      </section>

      {npc.desc && (
        <section className="trainer-modal__section" aria-label="About">
          <h5 className="trainer-modal__section-title">About</h5>
          <p className="trainer-modal__section-desc">{npc.desc}</p>
        </section>
      )}

      {dialogue.length > 0 && (
        <section className="trainer-modal__section" aria-label="Dialogue">
          <h5 className="trainer-modal__section-title">What they say</h5>
          <p className="trainer-modal__section-desc">
            In-game lines from this character’s EventScript (including common branches).
          </p>
          <ul className="npc-modal__quotes">
            {dialogue.map((line, i) => (
              <li key={`${i}-${line.slice(0, 24)}`}>
                <blockquote className="npc-modal__quote">
                  {line.split("\n").map((part, j) => (
                    <span key={j}>
                      {j > 0 ? <br /> : null}
                      {part}
                    </span>
                  ))}
                </blockquote>
              </li>
            ))}
          </ul>
        </section>
      )}

      {story.length > 0 && (
        <section className="trainer-modal__section" aria-label="Story">
          <h5 className="trainer-modal__section-title">Story & walkthrough</h5>
          <p className="trainer-modal__section-desc">
            This character shows up in the guide’s story steps.
          </p>
          <ul className="npc-modal__story-list">
            {story.map((link) => (
              <li key={link.stepId} className="npc-modal__story-item">
                <div className="npc-modal__story-text">
                  <strong>{link.title}</strong>
                  {link.location && (
                    <span className="npc-modal__story-loc">{link.location}</span>
                  )}
                  {link.blurb && <p>{link.blurb}</p>}
                </div>
                {onJumpToGuide && (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() =>
                      onJumpToGuide({
                        ...npc,
                        stepId: link.stepId,
                      })
                    }
                  >
                    Open step
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!dialogue.length && !story.length && !npc.desc && (
        <p className="trainer-modal__empty">
          No dialogue or story links are indexed for this NPC yet — game data is below.
        </p>
      )}

      <section className="trainer-modal__section trainer-modal__section--meta" aria-label="Game data">
        <h5 className="trainer-modal__section-title">Game data</h5>
        <dl className="trainer-modal__meta-list">
          {npc.note && (
            <div>
              <dt>Location</dt>
              <dd>{npc.note}</dd>
            </div>
          )}
          {facing && (
            <div>
              <dt>Facing</dt>
              <dd>{facing}</dd>
            </div>
          )}
          {npc.trainerType && (
            <div>
              <dt>Trainer type</dt>
              <dd>
                <code>{npc.trainerType}</code>
              </dd>
            </div>
          )}
          {npc.graphicsId && (
            <div>
              <dt>Sprite</dt>
              <dd>
                <code>{npc.graphicsId}</code>
              </dd>
            </div>
          )}
          {npc.script && (
            <div>
              <dt>Script</dt>
              <dd>
                <code>{npc.script}</code>
              </dd>
            </div>
          )}
          {npc.mapId && (
            <div>
              <dt>Map</dt>
              <dd>
                <code>{npc.mapId}</code>
              </dd>
            </div>
          )}
          {npc.spriteWidth != null && npc.spriteHeight != null && (
            <div>
              <dt>Sprite size</dt>
              <dd>
                {npc.spriteWidth}×{npc.spriteHeight}px
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

interface NpcDetailModalProps {
  npc: MapPoint | null;
  onClose: () => void;
  onJumpToGuide?: (point: MapPoint) => void;
}

/** Full-screen dialog with dialogue, story links, and pokeemerald game data. */
export function NpcDetailModal({ npc, onClose, onJumpToGuide }: NpcDetailModalProps) {
  useEffect(() => {
    if (!npc) return;
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
  }, [npc, onClose]);

  if (!npc || !isNpcMapPoint(npc)) return null;

  return createPortal(
    <ModalBackdrop className="trainer-modal" onClose={onClose} aria-labelledby="npc-modal-title">
      <div className="trainer-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal__head">
          <div>
            <h3 id="npc-modal-title">{npc.name}</h3>
            <p className="trainer-modal__subtitle">NPC</p>
          </div>
          <ModalCloseButton className="trainer-modal__close" onClose={onClose} />
        </div>
        <div className="trainer-modal__body">
          <NpcModalBody npc={npc} onJumpToGuide={onJumpToGuide} />
        </div>
      </div>
    </ModalBackdrop>,
    document.body,
  );
}
