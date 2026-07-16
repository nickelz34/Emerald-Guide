import { useAdmin } from "./AdminContext";

interface AdminToolbarProps {
  onOpenLogin: () => void;
}

export function AdminToolbar({ onOpenLogin }: AdminToolbarProps) {
  const {
    isAdmin,
    isDirty,
    isPublishing,
    publish,
    logout,
    isBootstrapping,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useAdmin();

  if (!isAdmin) {
    return (
      <div className="admin-toolbar admin-toolbar--guest">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onOpenLogin}
          disabled={isBootstrapping}
        >
          {isBootstrapping ? "Checking admin session…" : "Admin"}
        </button>
      </div>
    );
  }

  return (
    <div className="admin-toolbar" role="region" aria-label="Admin controls">
      <div className="admin-toolbar__status">
        <span className="admin-toolbar__badge">Admin Mode</span>
        <span className={`admin-toolbar__dirty${isDirty ? " admin-toolbar__dirty--on" : ""}`}>
          {isDirty ? "Unsaved changes" : "In sync with GitHub"}
        </span>
      </div>
      <div className="admin-toolbar__actions">
        <button
          type="button"
          className="btn btn--ghost"
          disabled={!canUndo || isPublishing}
          onClick={undo}
          title="Undo last change (Ctrl/Cmd+Z; add Alt while typing in a field)"
        >
          Undo
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={!canRedo || isPublishing}
          onClick={redo}
          title="Redo (Ctrl/Cmd+Shift+Z; add Alt while typing in a field)"
        >
          Redo
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={isPublishing || !isDirty}
          onClick={() => void publish()}
        >
          {isPublishing ? "Publishing…" : "Publish Changes to Live Guide"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={logout} disabled={isPublishing}>
          Logout
        </button>
      </div>
      {isPublishing ? (
        <p className="admin-toolbar__spinner" role="status">
          <span className="admin-toolbar__spinner-dot" aria-hidden="true" />
          Pushing commit directly to GitHub repository...
        </p>
      ) : null}
    </div>
  );
}
