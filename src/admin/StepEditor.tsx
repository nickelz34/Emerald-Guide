import type { GuideStep } from "../types";
import { MediaEditor } from "./MediaEditor";
import { SecretsEditor } from "./SecretsEditor";

interface StepEditorProps {
  step: GuideStep;
  onChange: (patch: Partial<GuideStep>) => void;
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
}

function paragraphsToArray(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function StepEditor({ step, onChange }: StepEditorProps) {
  return (
    <div className="admin-step-editor">
      <label className="admin-field">
        <span className="admin-field__label">Title</span>
        <input
          type="text"
          className="admin-field__input"
          value={step.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Location</span>
        <input
          type="text"
          className="admin-field__input"
          value={step.location ?? ""}
          onChange={(e) => onChange({ location: e.target.value || undefined })}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Summary</span>
        <textarea
          className="admin-field__textarea"
          rows={3}
          value={step.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Story (paragraphs separated by blank lines)</span>
        <textarea
          className="admin-field__textarea"
          rows={8}
          value={(step.story ?? []).join("\n\n")}
          onChange={(e) => {
            const story = paragraphsToArray(e.target.value);
            onChange({ story: story.length ? story : undefined });
          }}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Details / objectives (one per line)</span>
        <textarea
          className="admin-field__textarea"
          rows={5}
          value={step.details.join("\n")}
          onChange={(e) => onChange({ details: linesToArray(e.target.value) })}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Tips (one per line)</span>
        <textarea
          className="admin-field__textarea"
          rows={4}
          value={(step.tips ?? []).join("\n")}
          onChange={(e) => {
            const tips = linesToArray(e.target.value);
            onChange({ tips: tips.length ? tips : undefined });
          }}
        />
      </label>
      <label className="admin-field admin-field--row">
        <span className="admin-field__label">Optional step</span>
        <input
          type="checkbox"
          checked={Boolean(step.optional)}
          onChange={(e) => onChange({ optional: e.target.checked || undefined })}
        />
      </label>
      <SecretsEditor
        secrets={step.secrets ?? []}
        onChange={(secrets) => onChange({ secrets: secrets.length ? secrets : undefined })}
      />
      <MediaEditor
        media={step.media ?? []}
        onChange={(media) => onChange({ media: media.length ? media : undefined })}
      />
    </div>
  );
}
