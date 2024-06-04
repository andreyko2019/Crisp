import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'build',
  },

  server: {
    port: 3025,
    host: '0.0.0.0',
    hmr: true,
  },
  plugins: [injectHTML()],
});
