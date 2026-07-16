/** Immutable array reorder used by chapter/step drag-and-drop. */
export const reorderList = <T,>(
  list: T[],
  startIndex: number,
  endIndex: number,
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/** Recalculate `Ch. N —` prefixes after chapter reordering. */
export function renumberChapterTitles<T extends { title: string }>(chapters: T[]): T[] {
  return chapters.map((ch, i) => ({
    ...ch,
    title: ch.title.replace(/^Ch\. \d+ —/, `Ch. ${i + 1} —`),
  }));
}
