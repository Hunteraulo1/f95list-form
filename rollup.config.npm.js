import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

/**
 * @type {import('rollup').RollupOptions}
 */
const baseConfig = {
  plugins: [commonjs(), resolve()],
};

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  {
    ...baseConfig,
    input: 'node_modules/zod/lib/index.js',
    output: {
      file: 'dist/server/lib/zod-bundle.js',
      format: 'iife',
      name: 'z',
    },
  },
];
