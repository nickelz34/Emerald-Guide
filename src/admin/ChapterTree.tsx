import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { GuideSection } from "../types";
import { AdminDragHandle } from "./AdminDragHandle";
import { useAdmin } from "./AdminContext";

interface ChapterTreeProps {
  sections: GuideSection[];
  activeStepId?: string;
  onSelectStep: (stepId: string) => void;
}

export function ChapterTree({ sections, activeStepId, onSelectStep }: ChapterTreeProps) {
  const {
    isAdmin,
    reorderChapters,
    reorderSteps,
    addChapter,
    deleteChapter,
    addStep,
    deleteStep,
    updateChapter,
  } = useAdmin();

  if (!isAdmin) return null;

  const activeChapterId = sections.find((ch) =>
    ch.steps.some((s) => s.id === activeStepId),
  )?.id;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "CHAPTER") {
      reorderChapters(source.index, destination.index);
      return;
    }

    if (type === "STEP") {
      const chapterId = source.droppableId.replace(/^steps-/, "");
      if (destination.droppableId !== source.droppableId) return;
      reorderSteps(chapterId, source.index, destination.index);
    }
  };

  return (
    <div className="admin-chapter-tree">
      <div className="admin-chapter-tree__toolbar">
        <strong>Chapter tree</strong>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => {
            const { stepId } = addChapter();
            onSelectStep(stepId);
          }}
        >
          + Chapter
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters" type="CHAPTER">
          {(provided) => (
            <div
              className="admin-chapter-tree__list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sections.map((chapter, chapterIndex) => (
                <Draggable key={chapter.id} draggableId={chapter.id} index={chapterIndex}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={`admin-chapter-tree__chapter${
                        snapshot.isDragging ? " admin-chapter-tree__chapter--dragging" : ""
                      }${chapter.id === activeChapterId ? " admin-chapter-tree__chapter--active" : ""}`}
                    >
                      <div className="admin-chapter-tree__chapter-head">
                        <AdminDragHandle
                          label="Drag chapter"
                          dragHandleProps={dragProvided.dragHandleProps}
                        />
                        <input
                          type="text"
                          className="admin-chapter-tree__title-input"
                          value={chapter.title}
                          onChange={(e) =>
                            updateChapter(chapter.id, { title: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => {
                            const stepId = addStep(chapter.id);
                            onSelectStep(stepId);
                          }}
                        >
                          + Step
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete chapter “${chapter.title}” and all of its steps?`,
                              )
                            ) {
                              deleteChapter(chapter.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <Droppable droppableId={`steps-${chapter.id}`} type="STEP">
                        {(stepProvided) => (
                          <div
                            className="admin-chapter-tree__steps"
                            ref={stepProvided.innerRef}
                            {...stepProvided.droppableProps}
                          >
                            {chapter.steps.map((step, stepIndex) => (
                              <Draggable
                                key={step.id}
                                draggableId={step.id}
                                index={stepIndex}
                              >
                                {(stepDrag, stepSnap) => (
                                  <div
                                    ref={stepDrag.innerRef}
                                    {...stepDrag.draggableProps}
                                    className={`admin-chapter-tree__step${
                                      step.id === activeStepId
                                        ? " admin-chapter-tree__step--active"
                                        : ""
                                    }${
                                      stepSnap.isDragging
                                        ? " admin-chapter-tree__step--dragging"
                                        : ""
                                    }`}
                                  >
                                    <AdminDragHandle
                                      label="Drag step"
                                      dragHandleProps={stepDrag.dragHandleProps}
                                    />
                                    <button
                                      type="button"
                                      className="admin-chapter-tree__step-select"
                                      onClick={() => onSelectStep(step.id)}
                                    >
                                      <span className="admin-chapter-tree__step-num">
                                        {stepIndex + 1}
                                      </span>
                                      <span className="admin-chapter-tree__step-label">
                                        {step.title}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn--ghost btn--sm"
                                      aria-label="Delete step"
                                      onClick={() => {
                                        if (
                                          window.confirm(`Delete step “${step.title}”?`)
                                        ) {
                                          deleteStep(chapter.id, step.id);
                                        }
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {stepProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
