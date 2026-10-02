import { execFileSync } from "node:child_process"
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

/** Refresh pinned upstream snapshots without touching custom keywords. */
export async function vendorIconMetadata() {
  const directory = new URL("../src/data/icon-metadata/", import.meta.url)
  const sources: Sources = JSON.parse(await readFile(new URL("sources.json", directory), "utf8"))
  const tabler = (await downloadJson(
    `https://cdn.jsdelivr.net/npm/@tabler/icons@${sources.tablerVersion}/icons.json`,
  )) as Record<string, TablerIcon>
  const tablerMetadata = Object.fromEntries(
    Object.entries(tabler).map(([name, icon]) => [
      name,
      { tags: (icon.tags ?? []).map(String), categories: icon.category ? [icon.category] : [] },
    ]),
  )
  const temporary = await mkdtemp(join(tmpdir(), "icons-metadata-"))
  try {
    const response = await fetch(
      `https://codeload.github.com/lucide-icons/lucide/tar.gz/${sources.lucideRevision}`,
    )
    if (!response.ok) throw new Error(`Lucide download failed: ${response.status}`)
    const archive = join(temporary, "lucide.tgz")
    await writeFile(archive, new Uint8Array(await response.arrayBuffer()))
    execFileSync("tar", [
      "-xzf",
      archive,
      "-C",
      temporary,
      "--strip-components=1",
      `lucide-${sources.lucideRevision}/icons`,
    ])
    const lucideMetadata: Record<string, Metadata> = {}
    for (const file of (await readdir(join(temporary, "icons"))).toSorted()) {
      if (!file.endsWith(".json")) continue
      const icon: LucideIcon = JSON.parse(await readFile(join(temporary, "icons", file), "utf8"))
      const name = file.slice(0, -5)
      const aliases = (icon.aliases ?? []).map(alias => alias.name)
      const metadata = {
        tags: [...(icon.tags ?? []).map(String), ...aliases],
        categories: icon.categories ?? [],
        ...(icon["use-cases"]?.length ? { useCases: icon["use-cases"] } : {}),
      }
      lucideMetadata[name] = metadata
      for (const alias of aliases) lucideMetadata[alias] = metadata
    }
    for (const [set, metadata] of Object.entries({
      tabler: tablerMetadata,
      lucide: lucideMetadata,
    })) {
      const sorted = Object.fromEntries(
        Object.entries(metadata).toSorted(([a], [b]) => a.localeCompare(b)),
      )
      await writeFile(new URL(`${set}.json`, directory), `${JSON.stringify(sorted, null, 2)}\n`)
      console.log(`${set}: ${Object.keys(sorted).length} metadata entries`)
    }
    execFileSync(
      "pnpm",
      ["exec", "oxfmt", "src/data/icon-metadata/tabler.json", "src/data/icon-metadata/lucide.json"],
      { stdio: "inherit" },
    )
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

/** Download a public JSON snapshot, failing before writing incomplete data. */
async function downloadJson(
  /** Pinned upstream resource. */
  url: string,
) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Metadata download failed: ${response.status}`)
  return response.json()
}

await vendorIconMetadata()

type Sources = {
  /** Published Tabler package version. */
  tablerVersion: string
  /** Exact Lucide Git commit. */
  lucideRevision: string
}

type Metadata = {
  /** Searchable related concepts. */
  tags: string[]
  /** Broader subject areas. */
  categories: string[]
  /** Optional descriptions of usage. */
  useCases?: string[]
}

type TablerIcon = {
  /** Raw tags can include numeric labels. */
  tags?: (string | number)[]
  /** Upstream category name. */
  category?: string
}

type LucideIcon = {
  /** Searchable related concepts. */
  tags?: string[]
  /** Upstream category names. */
  categories?: string[]
  /** Older names that still appear in some bundled catalogs. */
  aliases?: { name: string }[]
  /** Optional usage descriptions. */
  "use-cases"?: string[]
}
