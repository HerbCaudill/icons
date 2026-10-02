import { iconSets } from "./constants"
import type { IconSet } from "./types"

/** Read the saved collection, tolerating blocked storage and stale values. */
export function readIconSet(): IconSet {
  try {
    const saved = localStorage.getItem("icons:set")
    if (saved && Object.hasOwn(iconSets, saved)) return saved as IconSet
  } catch {
    /* Browsing still works when the browser blocks storage. */
  }
  return "tabler"
}
