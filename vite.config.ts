import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { generateContentIndex } from './scripts/content.mjs';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist', assetsDir: 'assets', sourcemap: false, manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/katex/')) return 'math-typesetting';
          if (id.includes('/node_modules/highlight.js/') || id.includes('/node_modules/lowlight/')) return 'syntax-highlighting';
        },
      },
    },
  },
  plugins: [
    { name: 'content-index', async buildStart() { await generateContentIndex(); }, configureServer(server) {
      server.watcher.on('all', (_event, file) => {
        if (/[/\\]src[/\\]posts[/\\].+\.md$/.test(file)) generateContentIndex().catch(error => server.config.logger.error(String(error)));
      });
    } },
    react(), tsconfigPaths(),
  ],
});
