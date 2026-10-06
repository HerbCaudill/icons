import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"
import { fileURLToPath } from "node:url"

/** Route the assigned loopback port and hot reload through the shared HTTPS proxy. */
const localhostServer = process.env.PORTLESS_URL
  ? {
      port: Number(process.env.PORT),
      host: "127.0.0.1",
      strictPort: true,
      allowedHosts: [new URL(process.env.PORTLESS_URL).hostname],
      hmr: {
        protocol: "wss" as const,
        host: new URL(process.env.PORTLESS_URL).hostname,
        clientPort: 443,
      },
    }
  : {}

export default defineConfig({
  ...(process.env.PORTLESS_URL
    ? { cacheDir: `node_modules/.cache/localhost-dev/${process.env.PORT}` }
    : {}),
  server: { port: 5179, strictPort: true, ...localhostServer },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Icons",
        short_name: "Icons",
        description: "Browse icons and copy their names.",
        start_url: "/",
        display: "standalone",
        background_color: "#fafafa",
        theme_color: "#fafafa",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2,txt}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
})
