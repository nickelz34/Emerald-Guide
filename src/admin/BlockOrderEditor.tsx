import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMemo } from "react";
import { reorderList } from "../lib/reorderList";
import type { GuideStep } from "../types";
import { resolveStepBlockOrder } from "./stepBlocks";

interface BlockOrderEditorProps {
  step: GuideStep;
  onChange: (blockOrder: string[]) => void;
}

export function BlockOrderEditor({ step, onChange }: BlockOrderEditorProps) {
  const blocks = useMemo(() => resolveStepBlockOrder(step), [step]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const ids = blocks.map((b) => b.id);
    const next = reorderList(ids, result.source.index, result.destination.index);
    onChange(next);
  };

  if (blocks.length === 0) {
    return (
      <div className="admin-block-order">
        <strong>Page layout</strong>
        <p className="admin-muted">No movable blocks on this step yet.</p>
      </div>
    );
  }

  return (
    <div className="admin-block-order">
      <div className="admin-block-order__head">
        <strong>Page layout</strong>
      </div>
      <p className="admin-muted">
        Drag to place summary, story, images, specialty panels, and other sections anywhere on
        the step page.
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`block-order-${step.id}`}>
          {(provided) => (
            <ul
              className="admin-block-order__list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(drag, snapshot) => (
                    <li
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      className={`admin-block-order__item${
                        snapshot.isDragging ? " admin-block-order__item--dragging" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="admin-chapter-tree__handle"
                        aria-label={`Drag ${block.label}`}
                        {...drag.dragHandleProps}
                      >
                        ⋮⋮
                      </button>
                      <span className="admin-block-order__label">{block.label}</span>
                      <span className="admin-block-order__kind">
                        {block.id.startsWith("media")
                          ? "image"
                          : block.id.startsWith("panel:")
                            ? "panel"
                            : "content"}
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange([])}>
        Reset to default order
      </button>
    </div>
  );
}
