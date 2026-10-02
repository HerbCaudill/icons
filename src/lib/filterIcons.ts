import type { IconSearchEntry } from "./types"
import { normalizeSearchText } from "./normalizeSearchText"

/** Match every query word and rank exact names, name words, tags, then categories. */
export function filterIcons(
  /** Search fields in the collection's default display order. */
  index: readonly IconSearchEntry[],
  /** User-entered search text. */
  query: string,
) {
  const text = normalizeSearchText(query)
  if (!text) return index.map(entry => entry.name)
  const words = text.split(" ")
  return index
    .flatMap(entry => {
      const score = Math.min(...words.map(word => matchWord(entry, word)))
      if (!score) return []
      return [{ name: entry.name, score: entry.text === text ? 7 : score }]
    })
    .toSorted((a, b) => b.score - a.score)
    .map(entry => entry.name)
}

/** Use the strongest field that matches a query word. */
function matchWord(
  /** Normalized name and related concepts. */
  entry: IconSearchEntry,
  /** One normalized query word. */
  word: string,
) {
  if (entry.nameWords.has(word)) return 6
  if (entry.text.includes(word)) return 5
  if (entry.tagWords.has(word)) return 4
  if (entry.tags.some(tag => tag.includes(word))) return 3
  if (entry.categoryWords.has(word)) return 2
  if (entry.categories.some(category => category.includes(word))) return 1
  return 0
}
