import type { AdminToastMessage } from "./AdminContext";

interface AdminToastProps {
  toast: AdminToastMessage | null;
  onDismiss: () => void;
}

export function AdminToast({ toast, onDismiss }: AdminToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`admin-toast admin-toast--${toast.tone}`}
      role="status"
      aria-live="polite"
    >
      <span className="admin-toast__message">{toast.message}</span>
      <button type="button" className="admin-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
