import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/MiniSaaS/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/saas-icon.svg"],
      manifest: {
        name: "SaaS",
        short_name: "SaaS",
        description: "Scanner y gestion de ventas SaaS",
        theme_color: "#0c0f18",
        background_color: "#0c0f18",
        display: "standalone",
        orientation: "portrait",
        scope: "/MiniSaaS/",
        start_url: "/MiniSaaS/#/",
        icons: [
          {
            src: "/MiniSaaS/icons/saas-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"]
      }
    })
  ]
});
