import { copyFileSync } from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [
    react(),
    {
      name: "spa-fallback",
      closeBundle() {
        try {
          copyFileSync("dist/index.html", "dist/404.html");
        } catch {
          /* dist missing in vite serve */
        }
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": "http://127.0.0.1:8787",
      "/uploads": "http://127.0.0.1:8787",
    },
  },
  preview: { port: 4173, host: true },
});
