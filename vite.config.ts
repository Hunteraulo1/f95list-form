import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tsconfigPaths(),
    viteSingleFile(),
    tailwindcss(),

    // Delete the dist/ directory before each build
    del({ targets: 'dist/*' }),
    copy({
      targets: [{ src: 'src/appsscript.json', dest: 'dist' }],
    }),
    copy({
      targets: [
        { src: 'src/types', dest: 'dist' },
        { src: 'src/server', dest: 'dist' },
      ],
      flatten: false,
    }),
  ],
  build: {
    minify: true,
    outDir: resolve(__dirname, 'dist/client'),
  },
  resolve: {
    alias: {
      $lib: resolve(__dirname, 'src/lib'),
      $components: resolve(__dirname, 'src/lib/components'),
      $types: resolve(__dirname, 'src/types'),
    },
  },
});
