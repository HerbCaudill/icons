import type { iconSets } from "./constants"

/** Supported collection keys. */
export type IconSet = keyof typeof iconSets

/** Searchable keywords vendored upstream or added locally. */
export type IconMetadata = {
  /** Related concepts and alternative names. */
  tags?: readonly string[]
  /** Broader subject areas. */
  categories?: readonly string[]
  /** Descriptions of the icon's uses. */
  useCases?: readonly string[]
}

/** Precomputed search fields for one rendered icon. */
export type IconSearchEntry = {
  /** Name copied to the clipboard. */
  name: string
  /** Name normalized for phrase matching. */
  text: string
  /** Complete words in the icon name. */
  nameWords: ReadonlySet<string>
  /** Normalized related keywords and use cases. */
  tags: readonly string[]
  /** Complete words in keywords and use cases. */
  tagWords: ReadonlySet<string>
  /** Normalized category labels. */
  categories: readonly string[]
  /** Complete words in category labels. */
  categoryWords: ReadonlySet<string>
}
