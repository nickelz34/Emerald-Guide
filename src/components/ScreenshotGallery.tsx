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
import type { StepScreenshot } from "../data/stepImages";

interface ScreenshotGalleryProps {
  stepId: string;
  compact?: boolean;
  /** CMS media gallery items. */
  media?: GuideMediaItem[];
  /** When true, use `media` only — never fall back to derived maps. */
  useCustomMedia?: boolean;
  /** When set, only render this CMS media item id. */
  onlyMediaId?: string;
}

function areaIdForStep(stepId: string): string | undefined {
  if (stepId.startsWith("enc-")) return getAreaIdForEncounterStep(stepId);
  return getAreasForStep(stepId)[0];
}

function resolveMediaUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  return assetUrl(url.replace(/^\//, ""));
}

function cmsToScreenshots(media: GuideMediaItem[]): StepScreenshot[] {
  const shots: StepScreenshot[] = [];
  for (const item of media) {
    if (item.type === "area-map" && item.areaMapId) {
      shots.push({
        src: "",
        caption: item.caption,
        areaMapId: item.areaMapId,
      });
      continue;
    }
    if (item.type === "hoenn-crop" && item.crop) {
      shots.push({
        src: resolveMediaUrl(item.url) || assetUrl("maps/hoenn-map.png"),
        caption: item.caption,
        areaId: item.areaId,
        crop: item.crop,
      });
      continue;
    }
    if (!item.url.trim()) continue;
    shots.push({
      src: resolveMediaUrl(item.url),
      caption: item.caption,
    });
  }
  return shots;
}

export function ScreenshotGallery({
  stepId,
  compact,
  media,
  useCustomMedia = false,
  onlyMediaId,
}: ScreenshotGalleryProps) {
  const { open } = useLightbox();
  const cmsItems = (media ?? []).filter((item) =>
    onlyMediaId ? item.id === onlyMediaId : true,
  );
  const usingCms = Boolean(onlyMediaId) || useCustomMedia || (media ?? []).length > 0;
  const cmsShots = usingCms ? cmsToScreenshots(cmsItems) : [];
  const images = usingCms ? cmsShots : getStepImages(stepId);
  const defaultAreaId = areaIdForStep(stepId);

  useEffect(() => {
    if (usingCms) return;
    preloadStepMapImages(getStepImages(stepId));
  }, [stepId, usingCms]);

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
              key={(shot.src || "crop") + i}
              crop={shot.crop}
              caption={shot.caption}
              areaId={shot.areaId ?? defaultAreaId}
              onClick={() => open(images, i, shot.areaId ?? defaultAreaId)}
              className="screenshots__annotated"
            />
          );
        }
        if (shot.src) {
          return (
            <figure key={shot.src + i} className="screenshots__cms-shot">
              <button
                type="button"
                className="screenshots__cms-shot-btn"
                onClick={() => open(images, i)}
              >
                <img src={shot.src} alt={shot.caption || "Guide media"} loading="lazy" />
              </button>
              {shot.caption ? (
                <figcaption className="screenshots__cms-caption">{shot.caption}</figcaption>
              ) : null}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}
