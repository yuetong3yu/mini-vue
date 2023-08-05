import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: [
    // cjs -> commonjs
    {
      format: 'cjs',
      file: 'lib/mini-vue.cjs.js',
    },
    // esm
    {
      format: 'es',
      file: 'lib/mini-vue.esm.js',
    },
  ],
  plugins: [typescript()],
}
