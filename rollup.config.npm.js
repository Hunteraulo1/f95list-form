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
    input: 'node_modules/valibot/dist/index.js',
    output: {
      file: 'dist/server/lib/valibot-bundle.js',
      format: 'iife',
      name: 'v',
    },
  },
];
