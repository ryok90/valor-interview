const { build } = require('esbuild');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/index.js',
  banner: {
    js: '#!/usr/bin/env node',
  },
  minify: true,
  treeShaking: true,
  external: ['fs-extra', 'inquirer', 'ora', 'chalk'],
  target: 'node18',
  logLevel: 'info',
}).catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
