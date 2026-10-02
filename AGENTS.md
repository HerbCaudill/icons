# Icons

A frontend icon browser using React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and IBM Plex fonts. Follow the global code-style skill.

Keep the app small. Tabler is the first-visit default. The global icon-set picker is saved as `icons:set` in localStorage, and invalid or blocked storage must not prevent browsing. Focus the filter on page load and keep keyboard shortcuts usable throughout the page. Clicking an icon copies its name directly, without the collection prefix; render the full collection without pagination.

All icon data and fonts are bundled locally. `pnpm dev` must run the complete app without external services. Use `pnpm test:all`, `pnpm lint`, and `pnpm build` to check behavioral changes. Playwright covers focus, filtering, persistence, storage failures, and copying.

Search metadata is vendored in `src/data/icon-metadata`. Put local keywords in `custom.json` so upstream refreshes preserve them. Exact icon names and complete name words outrank substring matches; tags, use cases, and categories broaden results. Keep search local and omit typo correction.

## Task tracking

Run `bd prime` for task-tracking context.
