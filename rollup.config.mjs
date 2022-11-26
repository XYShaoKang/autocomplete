import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import { createRequire } from 'node:module'
import { defineConfig } from 'rollup'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json')

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default defineConfig({
  input: 'src/Autocomplete.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions,
    }),
  ],
})
