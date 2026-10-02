/** Match every search word, ignoring case and separators. */
export function filterIcons(
  /** Alphabetically ordered icon names. */
  names: string[],
  /** User-entered search text. */
  query: string,
) {
  const words = query
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
  return names.filter(name => words.every(word => name.toLowerCase().includes(word)))
}
