import DOMPurify from "dompurify";
import type { ReactNode } from "react";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "span", "br", "p", "div", "ul", "ol", "li", "font"],
  ALLOWED_ATTR: ["style", "class", "face", "size", "color"],
  ALLOW_DATA_ATTR: false,
};

/** True when the string looks like HTML we should render, not plain text. */
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function sanitizeGuideHtml(html: string): string {
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
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

/** Renders guide copy that may be plain text or sanitized rich HTML. */
export function GuideHtml({ value, as = "div", className }: GuideHtmlProps): ReactNode {
  const Tag = as;
  if (!value) return null;
  const html = looksLikeHtml(value) ? sanitizeGuideHtml(value) : plainTextToHtml(value);
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
