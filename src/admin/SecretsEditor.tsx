interface SecretsEditorProps {
  secrets: string[];
  onChange: (secrets: string[]) => void;
}

export function SecretsEditor({ secrets, onChange }: SecretsEditorProps) {
  const updateAt = (index: number, value: string) => {
    const next = secrets.slice();
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(secrets.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-secrets">
      <div className="admin-secrets__head">
        <strong>Secrets</strong>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => onChange([...secrets, ""])}
        >
          + Add secret
        </button>
      </div>
      {secrets.length === 0 ? (
        <p className="admin-muted">No step secrets yet.</p>
      ) : (
        <ul className="admin-secrets__list">
          {secrets.map((secret, index) => (
            <li key={index} className="admin-secrets__item">
              <textarea
                className="admin-field__textarea"
                rows={2}
                value={secret}
                onChange={(e) => updateAt(index, e.target.value)}
                placeholder="Secret, hidden item, or extras note"
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => removeAt(index)}
                aria-label="Remove secret"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
