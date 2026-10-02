/** Normalize names, metadata, and queries using the same word separators. */
export function normalizeSearchText(
  /** Text to match without case or separator differences. */
  text: string,
) {
  return text.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
}
