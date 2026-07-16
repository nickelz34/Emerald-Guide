import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ModalCloseButton } from "../lib/touchSafeClose";

interface AdminMobileSheetProps {
  titleId: string;
  title: string;
  subtitle?: ReactNode;
  onClose: () => void;
  /** Sticky controls under the title (e.g. primary action buttons). */
  actions?: ReactNode;
  children: ReactNode;
  footnote?: ReactNode;
  className?: string;
}

/**
 * Full-viewport admin sheet that scrolls as one document.
 * Avoids nested flex/overflow traps that break touch scrolling on mobile Safari.
 */
export function AdminMobileSheet({
  titleId,
  title,
  subtitle,
  onClose,
  actions,
  children,
  footnote,
  className,
}: AdminMobileSheetProps) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`admin-sheet${className ? ` ${className}` : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="admin-sheet__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="admin-sheet__frame">
        <div className="admin-sheet__chrome">
          <div className="admin-sheet__head">
            <div className="admin-sheet__titles">
              <h3 id={titleId}>{title}</h3>
              {subtitle ? <div className="admin-sheet__subtitle">{subtitle}</div> : null}
            </div>
            <ModalCloseButton className="admin-sheet__close" onClose={onClose} />
          </div>
          {actions ? <div className="admin-sheet__actions">{actions}</div> : null}
        </div>
        <div className="admin-sheet__content">{children}</div>
        {footnote ? <p className="admin-sheet__footnote">{footnote}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
