import { getStepImages } from "../data/stepImages";
import { getAreasForStep } from "../data/areaData";
import { getAreaIdForEncounterStep } from "../data/encounters";
import { preloadStepMapImages } from "../lib/preloadMapImages";
import { useEffect } from "react";
import type { GuideMediaItem } from "../types";
import { useLightbox } from "./ImageLightbox";
import { HoennCrop } from "./HoennCrop";
import { AreaMapView } from "./AreaMapView";
import { assetUrl } from "../lib/assetUrl";

interface ScreenshotGalleryProps {
  stepId: string;
  compact?: boolean;
  /** When present, CMS URL media overrides derived map/crop gallery. */
  media?: GuideMediaItem[];
}

function areaIdForStep(stepId: string): string | undefined {
  if (stepId.startsWith("enc-")) return getAreaIdForEncounterStep(stepId);
  return getAreasForStep(stepId)[0];
}

function resolveMediaUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  const cleaned = url.replace(/^\//, "");
  return assetUrl(cleaned);
}

export function ScreenshotGallery({ stepId, compact, media }: ScreenshotGalleryProps) {
  const { open } = useLightbox();
  const cmsMedia = (media ?? []).filter((item) => item.url.trim().length > 0);
  const images = getStepImages(stepId);
  const defaultAreaId = areaIdForStep(stepId);

  useEffect(() => {
    if (cmsMedia.length > 0) return;
    preloadStepMapImages(getStepImages(stepId));
  }, [stepId, cmsMedia.length]);

  if (cmsMedia.length > 0) {
    const cmsShots = cmsMedia.map((item) => ({
      src: resolveMediaUrl(item.url),
      caption: item.caption,
    }));
    return (
      <div className={`screenshots ${compact ? "screenshots--compact" : ""}`}>
        {cmsMedia.map((item, i) => {
          const src = cmsShots[i].src;
          return (
            <figure key={item.id} className="screenshots__cms-shot">
              <button
                type="button"
                className="screenshots__cms-shot-btn"
                onClick={() => open(cmsShots, i)}
              >
                <img src={src} alt={item.caption || item.type} loading="lazy" />
              </button>
              {item.caption ? (
                <figcaption className="screenshots__cms-caption">{item.caption}</figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <div className={`screenshots ${compact ? "screenshots--compact" : ""}`}>
      {images.map((shot, i) => {
        if (shot.areaMapId) {
          return (
            <AreaMapView
              key={shot.areaMapId + i}
              areaMapId={shot.areaMapId}
              caption={shot.caption}
              onClick={() => open(images, i)}
              className="screenshots__annotated"
            />
          );
        }
        if (shot.crop) {
          return (
            <HoennCrop
              key={shot.src + i}
              crop={shot.crop}
              caption={shot.caption}
              areaId={shot.areaId ?? defaultAreaId}
              onClick={() => open(images, i, shot.areaId ?? defaultAreaId)}
              className="screenshots__annotated"
            />
          );
        }
        return null;
      })}
    </div>
  );
}
