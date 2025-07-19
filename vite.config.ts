import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/**/*.module.css",
          dest: ".",
        },
        {
          src: "src/types/css.d.ts",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AppShell",
      formats: ["es", "cjs"],
      fileName: (format) =>
        `index.${format === "es" ? "js" : format === "cjs" ? "cjs" : "js"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Export CSS as a separate file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "app-shell.css";
          return assetInfo.name as string;
        },
      },
    },
    cssCodeSplit: false,
  },
});
