import type { GuideStep } from "../types";
import { BlockOrderEditor } from "./BlockOrderEditor";
import { MediaEditor } from "./MediaEditor";
import { PanelsEditor } from "./PanelsEditor";
import { RichTextField } from "./RichTextField";
import { SortableStringList } from "./SortableStringList";
import { SpecialtyPanelEditors } from "./SpecialtyPanelEditors";
import { SpriteEditor } from "./SpriteEditor";

interface StepEditorProps {
  step: GuideStep;
  onChange: (patch: Partial<GuideStep>) => void;
}

export function StepEditor({ step, onChange }: StepEditorProps) {
  return (
    <div className="admin-step-editor">
      <BlockOrderEditor
        step={step}
        onChange={(blockOrder) =>
          onChange({ blockOrder: blockOrder.length ? blockOrder : undefined })
        }
      />

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
      <RichTextField
        label="Summary"
        value={step.summary}
        onChange={(summary) => onChange({ summary })}
      />

      <SortableStringList
        label="Story paragraphs"
        droppableId={`story-${step.id}`}
        items={step.story ?? []}
        richText
        multiline
        placeholder="Story paragraph…"
        addLabel="+ Add paragraph"
        emptyText="No story paragraphs yet."
        onChange={(story) => onChange({ story: story.length ? story : undefined })}
      />

      <SortableStringList
        label="Details / objectives"
        droppableId={`details-${step.id}`}
        items={step.details}
        richText
        multiline
        placeholder="Objective or detail…"
        addLabel="+ Add detail"
        emptyText="No details yet."
        onChange={(details) => onChange({ details })}
      />

      <SortableStringList
        label="Tips"
        droppableId={`tips-${step.id}`}
        items={step.tips ?? []}
        richText
        multiline
        placeholder="Tip…"
        addLabel="+ Add tip"
        emptyText="No tips yet."
        onChange={(tips) => onChange({ tips: tips.length ? tips : undefined })}
      />

      <SortableStringList
        label="Secrets"
        droppableId={`secrets-${step.id}`}
        items={step.secrets ?? []}
        richText
        multiline
        placeholder="Secret, hidden item, or extras note…"
        addLabel="+ Add secret"
        emptyText="No step secrets yet."
        onChange={(secrets) => onChange({ secrets: secrets.length ? secrets : undefined })}
      />

      <SortableStringList
        label="Tags"
        droppableId={`tags-${step.id}`}
        items={step.tags ?? []}
        placeholder="e.g. breeding-lookup"
        addLabel="+ Add tag"
        emptyText="No tags yet."
        onChange={(tags) => onChange({ tags: tags.length ? tags : undefined })}
      />

      <label className="admin-field admin-field--row">
        <span className="admin-field__label">Optional step</span>
        <input
          type="checkbox"
          checked={Boolean(step.optional)}
          onChange={(e) => onChange({ optional: e.target.checked || undefined })}
        />
      </label>

      <MediaEditor
        stepId={step.id}
        media={step.media ?? []}
        useCustomMedia={Boolean(step.useCustomMedia)}
        onChange={(media, useCustomMedia) =>
          onChange({
            media: useCustomMedia ? media : media.length ? media : undefined,
            useCustomMedia: useCustomMedia || undefined,
          })
        }
      />

      <SpriteEditor
        stepId={step.id}
        sprites={step.sprites ?? []}
        onChange={(sprites) => onChange({ sprites: sprites.length ? sprites : undefined })}
      />

      <PanelsEditor
        step={step}
        hiddenPanels={step.hiddenPanels ?? []}
        onChange={(hiddenPanels) =>
          onChange({ hiddenPanels: hiddenPanels.length ? hiddenPanels : undefined })
        }
      />

      <SpecialtyPanelEditors
        step={step}
        onChange={(specialty) => onChange({ specialty })}
      />
    </div>
  );
}
