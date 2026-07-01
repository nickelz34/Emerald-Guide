/** Resolve a path under public/ (works on localhost and GitHub Pages). */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
