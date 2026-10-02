import { expect, test } from "@playwright/test"

test("starts with the filter focused and filters Tabler icons as you type", async ({ page }) => {
  await page.goto("/")
  const filter = page.getByRole("searchbox", { name: "Filter icons" })
  await expect(filter).toBeFocused()
  await page.keyboard.type("arrow left")
  await expect(page.getByRole("button", { name: "Copy arrow-left", exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Copy alarm", exact: true })).toHaveCount(0)
})

test("remembers the global icon set after reloading", async ({ page }) => {
  await page.goto("/")
  const selector = page.getByRole("combobox", { name: "Icon set" })
  await expect(selector).toHaveValue("tabler")
  await selector.selectOption("lucide")
  await page.reload()
  await expect(selector).toHaveValue("lucide")
  await expect(page.getByRole("searchbox", { name: "Filter icons" })).toBeFocused()
  await page.keyboard.type("alarm clock")
  await expect(page.getByRole("button", { name: "Copy alarm-clock", exact: true })).toBeVisible()
})

test("uses Tabler when the stored set is invalid or storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("icons:set", "obsolete"))
  await page.goto("/")
  await expect(page.getByRole("combobox", { name: "Icon set" })).toHaveValue("tabler")
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value() {
        throw new Error("Blocked")
      },
    })
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw new Error("Blocked")
      },
    })
  })
  await page.reload()
  await page.getByRole("combobox", { name: "Icon set" }).selectOption("heroicons")
  await expect(page.getByRole("searchbox", { name: "Filter icons" })).toBeFocused()
  await page.keyboard.type("academic")
  await expect(page.getByRole("button", { name: "Copy academic-cap", exact: true })).toBeVisible()
})

test("copies an icon name on click and returns to filtering with keyboard shortcuts", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/")
  const filter = page.getByRole("searchbox", { name: "Filter icons" })
  await filter.fill("arrow-left")
  await page.getByRole("button", { name: "Copy arrow-left", exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("tabler:arrow-left")
  await expect(page.getByText("Copied tabler:arrow-left", { exact: true })).toBeVisible()
  await page.keyboard.press("/")
  await expect(filter).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(filter).toHaveValue("")
  await filter.fill("there-is-no-icon-named-this")
  await expect(page.getByText("No icons found")).toBeVisible()
  await page.getByText("Clear filter", { exact: true }).click()
  await expect(filter).toBeFocused()
})
