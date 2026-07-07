import { useEffect, useRef, type ReactNode } from "react";

interface ModalCloseButtonProps {
  className?: string;
  onClose: () => void;
}

/** Close button with native non-passive touchend to block iOS ghost clicks. */
export function ModalCloseButton({ className, onClose }: ModalCloseButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let handled = false;
    const dismiss = (e: Event) => {
      if (handled) return;
      handled = true;
      e.preventDefault();
      e.stopPropagation();
      onCloseRef.current();
      window.setTimeout(() => {
        handled = false;
      }, 500);
    };
    el.addEventListener("touchend", dismiss, { passive: false });
    el.addEventListener("click", dismiss);
    return () => {
      el.removeEventListener("touchend", dismiss);
      el.removeEventListener("click", dismiss);
    };
  }, []);

  return (
    <button ref={ref} type="button" className={className} aria-label="Close">
      ×
    </button>
  );
}

interface ModalBackdropProps {
  className?: string;
  onClose: () => void;
  children: ReactNode;
  role?: string;
  "aria-modal"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
}

/** Modal shell — backdrop tap closes via native non-passive touchend. */
export function ModalBackdrop({
  className,
  onClose,
  children,
  role = "dialog",
  "aria-modal": ariaModal = true,
  "aria-labelledby": ariaLabelledby,
}: ModalBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let handled = false;
    const dismiss = (e: Event) => {
      if (e.target !== el) return;
      if (handled) return;
      handled = true;
      e.preventDefault();
      e.stopPropagation();
      onCloseRef.current();
      window.setTimeout(() => {
        handled = false;
      }, 500);
    };
    el.addEventListener("touchend", dismiss, { passive: false });
    el.addEventListener("click", dismiss);
    return () => {
      el.removeEventListener("touchend", dismiss);
      el.removeEventListener("click", dismiss);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      role={role}
      aria-modal={ariaModal}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </div>
  );
}
