# Icons

[icons.herbcaudill.com](https://icons.herbcaudill.com)

A small browser for Tabler, Lucide, and Heroicons. The filter is focused on page load, so you can start typing immediately. A global icon-set picker remembers your selection in localStorage under `icons:set`.

Click an icon to copy its name directly (for example, `arrow-left`). The entire selected collection is shown at once. Search matches every word across names, tags, use cases, and categories, ignoring case and separator differences. Exact icon names rank first, followed by complete name words, partial name matches, keywords, and categories. Searching `ai` puts `bookmark-ai` ahead of `mail-opened-filled`; searching `data` also finds tables and charts. Press `/`, `⌘K`, or `Ctrl K` to focus the filter; press Escape in the filter to clear it.

Search metadata is vendored in `src/data/icon-metadata`. Add related concepts in `custom.json`; its entries supplement upstream metadata and survive refreshes. See [the metadata guide](src/data/icon-metadata/README.md) for sources, format, and update instructions. Typo correction is intentionally omitted.

Use the header controls to resize icons or change their color. The color picker offers Tailwind shades and a custom hex input; the default is `#454545`. Dot controls offer sizes from 24 to 72 pixels in steps of 8, and Tabler outline weights from 1 to 2 in quarter steps.

## Local development

Use Node.js 24 and pnpm. Install dependencies with `pnpm install`, then run `pnpm dev`. The complete app runs at <http://localhost:5179>. No API keys, backend processes, or external services are required.

The app uses React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and locally bundled IBM Plex fonts. Icon data comes from the `@iconify-json/tabler`, `@iconify-json/lucide`, and `@iconify-json/heroicons` packages. Upgrade those packages to refresh the collections.

## Checks

- `pnpm test:all` runs TypeScript, Vitest, and Playwright checks.
- `pnpm lint` runs the shared Oxlint rules.
- `pnpm format` formats the project with Oxfmt.
- `pnpm build` builds the production app.
- `pnpm preview` serves the production build locally.

The production build includes an installable PWA. After its first online visit finishes caching, the app, fonts, metadata, and all three icon sets work offline. Clipboard copying requires a secure browser context, such as HTTPS or localhost.

## Icon licenses

Tabler and Heroicons use the MIT license. Lucide uses the ISC license, with some icons derived from Feather. The original license notices are included in `public/icon-licenses.txt`. See [Tabler](https://github.com/tabler/tabler-icons/blob/main/LICENSE), [Lucide](https://github.com/lucide-icons/lucide/blob/main/LICENSE), and [Heroicons](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE) for their terms.
