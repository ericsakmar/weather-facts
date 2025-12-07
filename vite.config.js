import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/weather-facts/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Weather Facts",
        short_name: "Weather",
        description: "The world's most boring weather app",
        theme_color: "#000000",
        background_color: "#ffffff",
        icons: [
          {
            src: "icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
