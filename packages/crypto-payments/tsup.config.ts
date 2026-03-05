import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  minify: true,
  clean: true,
  noExternal: ['buffer'],
  target: 'es2020',
  sourcemap: true,
});
