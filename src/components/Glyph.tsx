import { Icon } from "@iconify/react"
import tabler from "@iconify-json/tabler/icons.json"

/** Render a bundled Tabler icon for application controls. */
export function Glyph(
  /** Control icon and its display size. */
  { name, size = 20 }: Props,
) {
  const icon = tabler.icons[name as keyof typeof tabler.icons]
  return (
    <Icon icon={{ ...icon, width: 24, height: 24 }} width={size} height={size} aria-hidden="true" />
  )
}

type Props = {
  /** Tabler icon name. */
  name: string
  /** Width and height in pixels. */
  size?: number
}
