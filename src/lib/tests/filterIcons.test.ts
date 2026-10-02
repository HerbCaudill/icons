import { expect, it } from "vitest"
import { filterIcons } from "../filterIcons"

it("matches every word regardless of case or separator", () => {
  expect(
    filterIcons(["arrow-left", "arrow-right", "arrow-left-circle", "alarm"], "LEFT Arrow"),
  ).toEqual(["arrow-left", "arrow-left-circle"])
  expect(filterIcons(["arrow-left", "arrow-right"], "arrow_left")).toEqual(["arrow-left"])
})

it("returns every icon for an empty filter", () => {
  expect(filterIcons(["alarm", "arrow-left"], "   ")).toEqual(["alarm", "arrow-left"])
})

it("returns no results when one of the search words is missing", () => {
  expect(filterIcons(["alarm", "arrow-left"], "arrow missing")).toEqual([])
})
