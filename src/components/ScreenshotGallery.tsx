import { getStepImages } from "../data/stepImages";
import { getAreasForStep } from "../data/areaData";
import { getAreaIdForEncounterStep } from "../data/encounters";
import { useLightbox } from "./ImageLightbox";
import { AnnotatedScreenshot } from "./AnnotatedScreenshot";
import { HoennCrop } from "./HoennCrop";
import { AreaMapView } from "./AreaMapView";

interface ScreenshotGalleryProps {
  stepId: string;
  compact?: boolean;
}

function areaIdForStep(stepId: string): string | undefined {
  if (stepId.startsWith("enc-")) return getAreaIdForEncounterStep(stepId);
  return getAreasForStep(stepId)[0];
}

export function ScreenshotGallery({ stepId, compact }: ScreenshotGalleryProps) {
  const { open } = useLightbox();
  const images = getStepImages(stepId);
  const defaultAreaId = areaIdForStep(stepId);

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
        const areaId = shot.annotate === false ? undefined : shot.areaId ?? defaultAreaId;
        return (
          <AnnotatedScreenshot
            key={shot.src}
            imageSrc={shot.src}
            caption={shot.caption}
            areaId={areaId}
            staticMap={shot.annotate === false}
            showLegend={false}
            onImageClick={() => open(images, i, areaId)}
            className="screenshots__annotated"
          />
        );
      })}
    </div>
  );
}
