import DOMPurify from "dompurify";
import type { ReactNode } from "react";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "b",
    "strong",
    "i",
    "em",
    "u",
    "s",
    "strike",
    "sub",
    "sup",
    "span",
    "br",
    "p",
    "div",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "pre",
    "hr",
    "a",
    "font",
  ],
  ALLOWED_ATTR: ["style", "class", "face", "size", "color", "href", "target", "rel"],
  ALLOW_DATA_ATTR: false,
};

const BLOCK_TAG_RE = /<\s*(ul|ol|li|p|div|h[2-4]|blockquote|pre|hr)\b/i;

/** True when the string looks like HTML we should render, not plain text. */
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function sanitizeGuideHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ...PURIFY_CONFIG,
    // Keep links safer when authors paste URLs.
    ADD_ATTR: ["target"],
  });

  // Force rel on external targets if present.
  return clean.replace(
    /<a\b([^>]*?)>/gi,
    (_full, attrs: string) => {
      let next = attrs;
      if (/\btarget\s*=/i.test(next) && !/\brel\s*=/i.test(next)) {
        next += ' rel="noopener noreferrer"';
      }
      if (!/\btarget\s*=/i.test(next) && /\bhref\s*=\s*["']https?:/i.test(next)) {
        next += ' target="_blank" rel="noopener noreferrer"';
      }
      return `<a${next}>`;
    },
  );
}

/** Plain text → escaped HTML (for mixed rendering). */
export function plainTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/\n/g, "<br>");
}

interface GuideHtmlProps {
  value: string;
  as?: "div" | "p" | "span" | "li";
  className?: string;
}

function resolveTag(
  as: NonNullable<GuideHtmlProps["as"]>,
  html: string,
): "div" | "p" | "span" | "li" {
  // Block-level rich content cannot live inside <p>/<span>.
  if ((as === "p" || as === "span") && BLOCK_TAG_RE.test(html)) return "div";
  return as;
}

/** Renders guide copy that may be plain text or sanitized rich HTML. */
export function GuideHtml({ value, as = "div", className }: GuideHtmlProps): ReactNode {
  if (!value) return null;
  const html = looksLikeHtml(value) ? sanitizeGuideHtml(value) : plainTextToHtml(value);
  const Tag = resolveTag(as, html);
  const classes = ["guide-html", className].filter(Boolean).join(" ");
  return <Tag className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
}
