import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [react(), VitePWA({ registerType: "prompt" })],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["src/**/tests/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["src/tests/setup.ts"],
  },
})
