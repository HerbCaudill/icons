# Icon search metadata

These JSON snapshots are committed to the repository and bundled into the app. Searching never requests metadata from an external service.

`tabler.json` contains tags and categories from the MIT-licensed `@tabler/icons` package. `lucide.json` contains tags, categories, use cases, and aliases from the ISC-licensed Lucide repository. Their versions are pinned in `sources.json`. License notices are included in `public/icon-licenses.txt`.

Add our own keywords to `custom.json`, grouped by collection and icon name. Custom fields supplement upstream metadata. Filled and solid variants inherit their base icon's metadata, so adding keywords to `table` also helps searches find `table-filled`.

```json
{
  "tabler": {
    "table": {
      "tags": ["data", "dataset", "reporting"]
    }
  },
  "lucide": {},
  "heroicons": {}
}
```

Heroicons currently has no upstream keyword snapshot; its entries can be enriched in `custom.json`. Icons with missing upstream metadata still match by name.

To refresh the upstream snapshots, change the pinned version or commit in `sources.json` and run `pnpm metadata:refresh`. This requires network access and `tar`, and leaves `custom.json` untouched. Review the generated diff, then run `pnpm test:all`, `pnpm lint`, and `pnpm build`.

Sources: [Tabler package documentation](https://github.com/tabler/tabler-icons/blob/main/packages/icons/README.md), [Tabler snapshot](https://cdn.jsdelivr.net/npm/@tabler/icons@3.48.0/icons.json), [Lucide snapshot](https://github.com/lucide-icons/lucide/tree/3efde520fcce0716ceb861fcc82adbb43adf36d5/icons).
