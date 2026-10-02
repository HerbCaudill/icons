import tabler from "@iconify-json/tabler/icons.json"
import lucide from "@iconify-json/lucide/icons.json"
import heroicons from "@iconify-json/heroicons/icons.json"
import type { IconifyJSON } from "@iconify/types"
import colors from "tailwindcss/colors"
import { formatHex } from "culori"

/** Discrete icon sizes available in the header, in pixels. */
export const iconSizeOptions = [24, 32, 40, 48, 56, 64, 72] as const

/** Discrete Tabler outline weights available in the header. */
export const iconStrokeOptions = [1, 1.25, 1.5, 1.75, 2] as const

/** Bundled collections keep browsing available without an icon API. */
export const iconSets = {
  tabler: {
    label: "Tabler",
    data: tabler as IconifyJSON,
    url: "https://tabler.io/icons",
    license: "MIT",
  },
  lucide: {
    label: "Lucide",
    data: lucide as IconifyJSON,
    url: "https://lucide.dev",
    license: "ISC",
  },
  heroicons: {
    label: "Heroicons",
    data: heroicons as IconifyJSON,
    url: "https://heroicons.com",
    license: "MIT",
  },
}

/** Sorted names are computed once per collection, rather than on every keystroke. */
export const iconNames = Object.fromEntries(
  Object.entries(iconSets).map(([key, set]) => [key, Object.keys(set.data.icons).sort()]),
) as Record<keyof typeof iconSets, string[]>

/** Tailwind's installed palette, converted to sRGB hex for the editable color field. */
export const tailwindPalette = Object.entries(colors).flatMap(([name, shades]) =>
  typeof shades === "object"
    ? [
        {
          name,
          shades: Object.entries(shades).map(([shade, color]) => ({
            shade,
            hex: formatHex(color)!,
          })),
        },
      ]
    : [],
)
