import { useEffect, useRef } from "react";
import { sanitizeGuideHtml } from "../lib/guideHtml";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times", value: "\"Times New Roman\", Times, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Courier", value: "\"Courier New\", Courier, monospace" },
];

const FONT_SIZES = [
  { label: "Size", value: "" },
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "4" },
  { label: "Larger", value: "5" },
];

interface RichTextFieldProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export function RichTextField({
  label,
  value,
  onChange,
  placeholder = "Enter text…",
  minHeight = 88,
}: RichTextFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || focused.current) return;
    const next = value || "";
    if (el.innerHTML !== next) el.innerHTML = next;
  }, [value]);

  const emit = () => {
    const el = ref.current;
    if (!el) return;
    onChange(sanitizeGuideHtml(el.innerHTML));
  };

  return (
    <div className="admin-richtext">
      {label ? <span className="admin-field__label">{label}</span> : null}
      <div className="admin-richtext__toolbar" role="toolbar" aria-label="Text formatting">
        <button type="button" className="admin-richtext__btn" title="Bold" onMouseDown={(e) => { e.preventDefault(); runCommand("bold"); emit(); }}>
          <strong>B</strong>
        </button>
        <button type="button" className="admin-richtext__btn" title="Italic" onMouseDown={(e) => { e.preventDefault(); runCommand("italic"); emit(); }}>
          <em>I</em>
        </button>
        <button type="button" className="admin-richtext__btn" title="Underline" onMouseDown={(e) => { e.preventDefault(); runCommand("underline"); emit(); }}>
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>
        <select
          className="admin-richtext__select"
          aria-label="Font"
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;
            runCommand("fontName", e.target.value);
            emit();
            e.target.value = "";
          }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <select
          className="admin-richtext__select"
          aria-label="Font size"
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;
            runCommand("fontSize", e.target.value);
            emit();
            e.target.value = "";
          }}
        >
          {FONT_SIZES.map((size) => (
            <option key={size.label} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="admin-richtext__btn"
          title="Clear formatting"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand("removeFormat");
            emit();
          }}
        >
          Clear
        </button>
      </div>
      <div
        ref={ref}
        className="admin-richtext__editor"
        style={{ minHeight }}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
          emit();
        }}
        onInput={emit}
      />
    </div>
  );
}
