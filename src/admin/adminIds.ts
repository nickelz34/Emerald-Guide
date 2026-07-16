/** Create a short unique id for new chapters/steps/media. */
export function createAdminId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
