import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import makeManifest from "./utils/plugins/make-manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  plugins: [react(), makeManifest()],
  publicDir,
  build: {
    outDir,
    sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      input: {
        devtools: resolve(pagesDir, "devtools", "index.html"),
        panel: resolve(pagesDir, "panel", "index.html"),
        content: resolve(pagesDir, "content", "index.ts"),
        contentView: resolve(pagesDir, "contentView", "index.tsx"),
        background: resolve(pagesDir, "background", "index.ts"),
        popup: resolve(pagesDir, "popup", "index.html"),
        newtab: resolve(pagesDir, "newtab", "index.html"),
        options: resolve(pagesDir, "options", "index.html"),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
        assetFileNames: (chunk) => {
          let chunkNameShort = chunk.name;
          if (chunkNameShort?.startsWith(__dirname)) {
            chunkNameShort = chunkNameShort.replace(__dirname + "/", "");
          }
          if (!chunkNameShort?.startsWith("src")) {
            chunkNameShort = `src/pages/${chunkNameShort?.replace(
              /\.\w+$/,
              ""
            )}`;
            return `${chunkNameShort}/index.[ext]`;
          }
          return chunkNameShort;
        },
      },
    },
  },
});
