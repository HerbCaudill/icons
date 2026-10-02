import tabler from "@iconify-json/tabler/icons.json"
import lucide from "@iconify-json/lucide/icons.json"
import heroicons from "@iconify-json/heroicons/icons.json"
import type { IconifyJSON } from "@iconify/types"

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
