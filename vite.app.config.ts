import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for building the app (not the library)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
    },
  },
  server: {
    port: 5173,
  },
});
