import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    strictPort: true,
    host: "localhost",
    port: 3000,
    hmr: {
      clientPort: 3000,
    },
  },
  build: {
    esbuild: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
