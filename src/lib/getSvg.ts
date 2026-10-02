import { getIconData, iconToSVG } from "@iconify/utils"
import { iconSets } from "./constants"
import type { IconSet } from "./types"

/** Build a standalone SVG using the collection's native dimensions. */
export function getSvg(
  /** Collection supplying the icon. */
  set: IconSet,
  /** Canonical icon name. */
  name: string,
) {
  const icon = getIconData(iconSets[set].data, name)
  if (!icon) return ""
  const svg = iconToSVG(icon, { width: "24", height: "24" })
  const attributes = Object.entries(svg.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attributes}>${svg.body}</svg>`
}
