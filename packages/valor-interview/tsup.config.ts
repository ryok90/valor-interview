import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  minify: false,
  platform: 'node',
  target: 'node18',
  noExternal: ['fs-extra', 'inquirer', 'ora', 'chalk'],
  bundle: true
});