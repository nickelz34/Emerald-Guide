import { useEffect, useId, useState, type FormEvent } from "react";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { useAdmin } from "./AdminContext";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  const { login } = useAdmin();
  const titleId = useId();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setToken("");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(token.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalBackdrop className="admin-login-modal" onClose={onClose} aria-labelledby={titleId}>
      <div className="admin-login-modal__panel">
        <div className="admin-login-modal__head">
          <h2 id={titleId}>Admin login</h2>
          <ModalCloseButton className="admin-login-modal__close" onClose={onClose} />
        </div>
        <p className="admin-login-modal__hint">
          Paste a GitHub Personal Access Token with Contents write access for this repository.
          The token is stored in session storage for this tab only and is never committed.
        </p>
        <form className="admin-login-modal__form" onSubmit={(e) => void handleSubmit(e)}>
          <label className="admin-field">
            <span className="admin-field__label">GitHub PAT</span>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              className="admin-field__input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_… or github_pat_…"
              required
            />
          </label>
          {error ? (
            <p className="admin-login-modal__error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="admin-login-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={busy || !token.trim()}>
              {busy ? "Validating…" : "Enter Admin Mode"}
            </button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  );
}
