import type { MouseEvent, TouchEvent } from "react";

/** Prevents iOS ghost clicks after touch-close by handling touchend + preventDefault. */
export function touchSafeButtonClose(onClose: () => void) {
  return {
    onClick: (e: MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    onTouchEnd: (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    },
  };
}

export function touchSafeBackdropClose(onClose: () => void) {
  return {
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    onTouchEnd: (e: TouchEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        onClose();
      }
    },
  };
}
