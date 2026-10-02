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
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("arrow-left")
  await expect(page.getByText("Copied arrow-left", { exact: true })).toBeVisible()
  await expect(page.getByText("Copied arrow-left", { exact: true })).toBeHidden()
  await page.keyboard.press("/")
  await expect(filter).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(filter).toHaveValue("")
  await filter.fill("there-is-no-icon-named-this")
  await expect(page.getByText("No icons found")).toBeVisible()
  await page.getByText("Clear filter", { exact: true }).click()
  await expect(filter).toBeFocused()
})

test("applies the chosen icon color across collections", async ({ page }) => {
  await page.goto("/")
  const picker = page.getByLabel("Icon color", { exact: true })
  await expect(picker).toHaveValue("#454545")
  await page.getByRole("searchbox").fill("arrow-left")
  const icon = page.getByRole("button", { name: "Copy arrow-left", exact: true })
  await picker.fill("#cc3366")
  await expect(icon).toHaveCSS("color", "rgb(204, 51, 102)")
  await icon.hover()
  await expect(icon).toHaveCSS("color", "rgb(204, 51, 102)")
  await page.getByRole("combobox", { name: "Icon set" }).selectOption("lucide")
  await expect(icon).toHaveCSS("color", "rgb(204, 51, 102)")
})

test("resizes icons with the size slider", async ({ page }) => {
  await page.goto("/")
  const slider = page.getByRole("slider", { name: "Icon size" })
  await expect(slider).toHaveValue("48")
  await page.getByRole("searchbox").fill("arrow-left")
  const icon = page.getByRole("button", { name: "Copy arrow-left", exact: true }).locator("svg")
  await expect(icon).toHaveCSS("width", "48px")
  await slider.focus()
  await slider.press("End")
  await expect(page.getByText("72px", { exact: true })).toBeVisible()
  await expect(icon).toHaveCSS("width", "72px")
})
