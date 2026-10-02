import type { IconSet } from "./types"

/** Persist the collection where browser storage is available. */
export function saveIconSet(
  /** Collection selected in the global picker. */
  set: IconSet,
) {
  try {
    localStorage.setItem("icons:set", set)
  } catch {
    /* Persistence is optional when storage is blocked. */
  }
}
