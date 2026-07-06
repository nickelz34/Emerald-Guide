import { useEffect } from "react";
import { HoennMap } from "./HoennMap";
import type { MapRegion } from "../data/mapRegions";

interface MapModalProps {
  open: boolean;
  activeStepId?: string;
  categoryStepIds?: Set<string>;
  onSelectRegion: (region: MapRegion) => void;
  onClose: () => void;
}

export function MapModal({ open, activeStepId, categoryStepIds, onSelectRegion, onClose }: MapModalProps) {
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
    <div className="map-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="map-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="map-modal__head">
          <h3>Hoenn map</h3>
          <button type="button" className="map-modal__close" onClick={onClose} aria-label="Close map">
            ×
          </button>
        </div>
        <HoennMap
          compact
          activeStepId={activeStepId}
          categoryStepIds={categoryStepIds}
          onSelectRegion={(region) => {
            onSelectRegion(region);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
