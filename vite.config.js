import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    viteSingleFile(),

    // Delete the dist/ directory before each build
    del({ targets: "dist/*" }),
    copy({
      targets: [{ src: "src/appsscript.json", dest: "dist" }],
    }),
    copy({
      targets: [
        { src: "src/types", dest: "dist" },
        { src: "src/server", dest: "dist" },
      ],
      flatten: false,
    }),
  ],
  build: {
    minify: true,
    outDir: resolve(__dirname, "dist/client"),
    rollupOptions: {
      input: {
        zod: "node_modules/zod/lib/index.js",
        // cheerio: 'node_modules/cheerio/lib/index.js',
      },
      output: {
        // file: "dist/server/lib/zod-bundle.js",
        dir: "dist/server/lib",
        format: "es",
      },
    },
  },
});
