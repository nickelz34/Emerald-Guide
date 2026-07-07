import { useEffect } from "react";
import { createPortal } from "react-dom";
import { getGymForMapPoint } from "../data/gymData";
import type { MapPoint } from "../data/mapPoints";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { GymGuidePanel } from "./GymGuidePanel";

interface GymDetailModalProps {
  gymPoint: MapPoint | null;
  onClose: () => void;
  onJumpToGuide: (point: MapPoint) => void;
}

export function GymDetailModal({ gymPoint, onClose, onJumpToGuide }: GymDetailModalProps) {
  const gym = gymPoint ? getGymForMapPoint(gymPoint.id) : undefined;

  useEffect(() => {
    if (!gymPoint) return;
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
  }, [gymPoint, onClose]);

  if (!gymPoint || !gym) return null;

  return createPortal(
    <ModalBackdrop className="gym-modal" onClose={onClose} aria-labelledby="gym-modal-title">
      <div className="gym-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="gym-modal__head">
          <div>
            <h3 id="gym-modal-title">{gym.gymName}</h3>
            <p className="gym-modal__subtitle">
              Gym {gym.gymNumber} · {gym.city}
            </p>
          </div>
          <ModalCloseButton className="gym-modal__close" onClose={onClose} />
        </div>

        <div className="gym-modal__body">
          <GymGuidePanel gym={gym} />
        </div>

        <div className="gym-modal__foot">
          {gymPoint.stepId && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onJumpToGuide({ ...gymPoint, stepId: gym.walkthroughStepId })}
            >
              Open walkthrough step
            </button>
          )}
        </div>
      </div>
    </ModalBackdrop>,
    document.body,
  );
}
