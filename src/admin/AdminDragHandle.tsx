import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface AdminDragHandleProps {
  label: string;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

/**
 * Non-interactive drag handle for @hello-pangea/dnd.
 * Buttons are blocked as drag sources unless disableInteractiveElementBlocking is set.
 */
export function AdminDragHandle({ label, dragHandleProps }: AdminDragHandleProps) {
  return (
    <span
      className="admin-chapter-tree__handle"
      aria-label={label}
      {...dragHandleProps}
    >
      ⋮⋮
    </span>
  );
}
