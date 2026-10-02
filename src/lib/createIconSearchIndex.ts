import { normalizeSearchText } from "./normalizeSearchText"
import type { IconMetadata, IconSearchEntry } from "./types"

/** Prepare metadata once, preserving upstream keywords and local additions. */
export function createIconSearchIndex(
  /** Ordered names available in the bundled collection. */
  names: readonly string[],
  /** Vendored metadata keyed by icon name. */
  metadata: Record<string, IconMetadata>,
  /** Additional keywords that survive upstream metadata refreshes. */
  custom: Record<string, IconMetadata> = {},
): IconSearchEntry[] {
  return names.map(name => {
    const base = name.replace(/(?:-filled|-20-solid|-16-solid|-solid)$/, "")
    const entries = [...new Set([metadata[base], metadata[name], custom[base], custom[name]])]
    const text = normalizeSearchText(name)
    const tags = [
      ...new Set(
        entries
          .flatMap(entry => [...(entry?.tags ?? []), ...(entry?.useCases ?? [])])
          .map(normalizeSearchText),
      ),
    ]
    const categories = [
      ...new Set(entries.flatMap(entry => entry?.categories ?? []).map(normalizeSearchText)),
    ]
    return {
      name,
      text,
      nameWords: new Set(text.split(" ")),
      tags,
      tagWords: new Set(tags.flatMap(tag => tag.split(" "))),
      categories,
      categoryWords: new Set(categories.flatMap(category => category.split(" "))),
    }
  })
}
