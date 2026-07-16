import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { reorderList } from "../lib/reorderList";

interface SortableStringListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  multiline?: boolean;
  droppableId: string;
  emptyText?: string;
}

export function SortableStringList({
  label,
  items,
  onChange,
  placeholder = "Enter text…",
  addLabel = "+ Add item",
  multiline = false,
  droppableId,
  emptyText = "No items yet.",
}: SortableStringListProps) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    onChange(reorderList(items, result.source.index, result.destination.index));
  };

  const updateAt = (index: number, value: string) => {
    const next = items.slice();
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-sortable-list">
      <div className="admin-sortable-list__head">
        <strong>{label}</strong>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => onChange([...items, ""])}
        >
          {addLabel}
        </button>
      </div>
      {items.length === 0 ? <p className="admin-muted">{emptyText}</p> : null}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <ul
              className="admin-sortable-list__items"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable
                  key={`${droppableId}-${index}`}
                  draggableId={`${droppableId}-${index}`}
                  index={index}
                >
                  {(drag, snapshot) => (
                    <li
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      className={`admin-sortable-list__item${
                        snapshot.isDragging ? " admin-sortable-list__item--dragging" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="admin-chapter-tree__handle"
                        aria-label={`Drag ${label} item`}
                        {...drag.dragHandleProps}
                      >
                        ⋮⋮
                      </button>
                      {multiline ? (
                        <textarea
                          className="admin-field__textarea"
                          rows={3}
                          value={item}
                          placeholder={placeholder}
                          onChange={(e) => updateAt(index, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className="admin-field__input"
                          value={item}
                          placeholder={placeholder}
                          onChange={(e) => updateAt(index, e.target.value)}
                        />
                      )}
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        aria-label="Delete item"
                        onClick={() => removeAt(index)}
                      >
                        ×
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
