import { useEffect, useRef, type ReactNode } from "react";
import { sanitizeGuideHtml } from "../lib/guideHtml";

const FONT_FAMILIES = [
  { label: "Font", value: "" },
  { label: "Default", value: "inherit" },
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
  { label: "Huge", value: "6" },
];

const BLOCK_STYLES = [
  { label: "Paragraph", value: "p" },
  { label: "Heading", value: "h3" },
  { label: "Subheading", value: "h4" },
  { label: "Quote", value: "blockquote" },
  { label: "Preformatted", value: "pre" },
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

function ToolbarDivider() {
  return <span className="admin-richtext__divider" aria-hidden="true" />;
}

function ToolButton({
  title,
  onAction,
  children,
  wide,
}: {
  title: string;
  onAction: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      className={`admin-richtext__btn${wide ? " admin-richtext__btn--wide" : ""}`}
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onAction();
      }}
    >
      {children}
    </button>
  );
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

  const apply = (command: string, commandValue?: string) => {
    ref.current?.focus();
    runCommand(command, commandValue);
    emit();
  };

  const applyBlock = (tag: string) => {
    ref.current?.focus();
    // Browsers differ on whether formatBlock wants "h3" or "<h3>".
    runCommand("formatBlock", tag);
    if (!document.queryCommandValue("formatBlock")) {
      runCommand("formatBlock", `<${tag}>`);
    }
    emit();
  };

  const applyLink = () => {
    const existing = document.queryCommandValue("createLink");
    const next = window.prompt("Link URL", existing || "https://");
    if (next === null) return;
    const trimmed = next.trim();
    if (!trimmed) {
      apply("unlink");
      return;
    }
    apply("createLink", trimmed);
  };

  return (
    <div className="admin-richtext">
      {label ? <span className="admin-field__label">{label}</span> : null}
      <div className="admin-richtext__toolbar" role="toolbar" aria-label="Text formatting">
        <ToolButton title="Undo" onAction={() => apply("undo")}>
          ↶
        </ToolButton>
        <ToolButton title="Redo" onAction={() => apply("redo")}>
          ↷
        </ToolButton>

        <ToolbarDivider />

        <ToolButton title="Bold" onAction={() => apply("bold")}>
          <strong>B</strong>
        </ToolButton>
        <ToolButton title="Italic" onAction={() => apply("italic")}>
          <em>I</em>
        </ToolButton>
        <ToolButton title="Underline" onAction={() => apply("underline")}>
          <span style={{ textDecoration: "underline" }}>U</span>
        </ToolButton>
        <ToolButton title="Strikethrough" onAction={() => apply("strikeThrough")}>
          <span style={{ textDecoration: "line-through" }}>S</span>
        </ToolButton>
        <ToolButton title="Subscript" onAction={() => apply("subscript")}>
          X₂
        </ToolButton>
        <ToolButton title="Superscript" onAction={() => apply("superscript")}>
          X²
        </ToolButton>

        <ToolbarDivider />

        <select
          className="admin-richtext__select"
          aria-label="Paragraph style"
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;
            applyBlock(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="">Style</option>
          {BLOCK_STYLES.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
        <select
          className="admin-richtext__select"
          aria-label="Font"
          defaultValue=""
          onChange={(e) => {
            if (!e.target.value) return;
            apply("fontName", e.target.value === "inherit" ? "sans-serif" : e.target.value);
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
            apply("fontSize", e.target.value);
            e.target.value = "";
          }}
        >
          {FONT_SIZES.map((size) => (
            <option key={size.label} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <ToolbarDivider />

        <label className="admin-richtext__color" title="Text color">
          <span aria-hidden="true">A</span>
          <input
            type="color"
            defaultValue="#34d399"
            aria-label="Text color"
            onChange={(e) => apply("foreColor", e.target.value)}
          />
        </label>
        <label className="admin-richtext__color admin-richtext__color--highlight" title="Highlight">
          <span aria-hidden="true">▰</span>
          <input
            type="color"
            defaultValue="#fef08a"
            aria-label="Highlight color"
            onChange={(e) => apply("hiliteColor", e.target.value)}
          />
        </label>

        <ToolbarDivider />

        <ToolButton title="Bulleted list" onAction={() => apply("insertUnorderedList")}>
          • List
        </ToolButton>
        <ToolButton title="Numbered list" onAction={() => apply("insertOrderedList")}>
          1. List
        </ToolButton>
        <ToolButton title="Decrease indent" onAction={() => apply("outdent")}>
          ⇤
        </ToolButton>
        <ToolButton title="Increase indent" onAction={() => apply("indent")}>
          ⇥
        </ToolButton>

        <ToolbarDivider />

        <ToolButton title="Align left" onAction={() => apply("justifyLeft")}>
          ≣←
        </ToolButton>
        <ToolButton title="Align center" onAction={() => apply("justifyCenter")}>
          ≡
        </ToolButton>
        <ToolButton title="Align right" onAction={() => apply("justifyRight")}>
          →≣
        </ToolButton>
        <ToolButton title="Justify" onAction={() => apply("justifyFull")}>
          ☰
        </ToolButton>

        <ToolbarDivider />

        <ToolButton title="Insert / edit link" onAction={applyLink} wide>
          Link
        </ToolButton>
        <ToolButton title="Remove link" onAction={() => apply("unlink")}>
          Unlink
        </ToolButton>
        <ToolButton title="Horizontal line" onAction={() => apply("insertHorizontalRule")}>
          ―
        </ToolButton>
        <ToolButton
          title="Clear formatting"
          onAction={() => apply("removeFormat")}
          wide
        >
          Clear
        </ToolButton>
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
