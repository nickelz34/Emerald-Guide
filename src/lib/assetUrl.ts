/** Resolve a path under public/ (works on localhost and GitHub Pages). */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  const base =
    (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  return `${base}${clean}`;
}
