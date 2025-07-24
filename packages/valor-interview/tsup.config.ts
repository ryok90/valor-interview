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
  banner: {
    js: '#!/usr/bin/env node'
  }
});