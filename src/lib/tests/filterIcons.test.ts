import { expect, it } from "vitest"
import { filterIcons } from "../filterIcons"
import { createIconSearchIndex } from "../createIconSearchIndex"

it("matches every word regardless of case or separator", () => {
  expect(
    filterIcons(
      createIconSearchIndex(["arrow-left", "arrow-right", "arrow-left-circle", "alarm"], {}),
      "LEFT Arrow",
    ),
  ).toEqual(["arrow-left", "arrow-left-circle"])
  expect(
    filterIcons(createIconSearchIndex(["arrow-left", "arrow-right"], {}), "arrow_left"),
  ).toEqual(["arrow-left"])
})

it("returns every icon for an empty filter", () => {
  expect(filterIcons(createIconSearchIndex(["alarm", "arrow-left"], {}), "   ")).toEqual([
    "alarm",
    "arrow-left",
  ])
})

it("returns no results when one of the search words is missing", () => {
  expect(filterIcons(createIconSearchIndex(["alarm", "arrow-left"], {}), "arrow missing")).toEqual(
    [],
  )
})

it("ranks name matches before tags, then categories", () => {
  const index = createIconSearchIndex(["chart-bar", "database", "table"], {
    "chart-bar": { tags: ["data", "analytics"] },
    table: { categories: ["Database"] },
  })
  expect(filterIcons(index, "data")).toEqual(["database", "chart-bar", "table"])
  expect(filterIcons(index, "analytics")).toEqual(["chart-bar"])
})

it("combines words across names and metadata and ranks exact names first", () => {
  const index = createIconSearchIndex(["table", "table-filled", "table-plus"], {
    table: { tags: ["spreadsheet"], categories: ["Database"] },
    "table-plus": { tags: ["spreadsheet"] },
  })
  expect(filterIcons(index, "TABLE spreadsheet")).toEqual(["table", "table-filled", "table-plus"])
  expect(filterIcons(index, "table")[0]).toBe("table")
  expect(filterIcons(index, "spreadsheet missing")).toEqual([])
})

it("keeps custom additions alongside upstream tags and inherits filled metadata", () => {
  const index = createIconSearchIndex(
    ["table", "table-filled"],
    { table: { tags: ["spreadsheet"] } },
    { table: { tags: ["data"] } },
  )
  expect(filterIcons(index, "data")).toEqual(["table", "table-filled"])
  expect(filterIcons(index, "spreadsheet")).toEqual(["table", "table-filled"])
})

it("prioritizes exact names and complete name words over substrings", () => {
  const index = createIconSearchIndex(
    ["aerial-lift", "ai", "air-balloon", "bookmark-ai", "mail-opened-filled"],
    {},
  )
  expect(filterIcons(index, "ai")).toEqual([
    "ai",
    "bookmark-ai",
    "air-balloon",
    "mail-opened-filled",
  ])
})
