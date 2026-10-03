import { readFile, writeFile } from "node:fs/promises"
import { chromium } from "@playwright/test"

/** Render the original header mark as local favicon and home-screen assets. */
async function generateAppIcons() {
  const data = JSON.parse(await readFile("node_modules/@iconify-json/tabler/icons.json", "utf8"))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#222222"/><g transform="translate(10 10) scale(1.833333)" color="#ffffff">${data.icons.category.body}</g></svg>`
  await writeFile("public/favicon.svg", `${svg}\n`)
  const browser = await chromium.launch()
  try {
    for (const [size, file] of [
      [180, "apple-touch-icon.png"],
      [192, "icon-192.png"],
      [512, "icon-512.png"],
    ] as const) {
      const page = await browser.newPage({
        viewport: { width: size, height: size },
        deviceScaleFactor: 1,
      })
      await page.setContent(
        `<style>body{margin:0;background:#222}svg{display:block;width:100vw;height:100vh}</style>${svg}`,
      )
      await page.screenshot({ path: `public/${file}` })
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

await generateAppIcons()
