import { getStepImages } from "../data/stepImages";
import { getAreasForStep } from "../data/areaData";
import { getAreaIdForEncounterStep } from "../data/encounters";
import { useLightbox } from "./ImageLightbox";
import { AnnotatedScreenshot } from "./AnnotatedScreenshot";

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
      {images.map((shot, i) => (
        <AnnotatedScreenshot
          key={shot.src}
          imageSrc={shot.src}
          caption={shot.caption}
          areaId={shot.areaId ?? defaultAreaId}
          showLegend={false}
          onImageClick={() => open(images, i, shot.areaId ?? defaultAreaId)}
          className="screenshots__annotated"
        />
      ))}
    </div>
  );
}
