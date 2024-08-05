import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import pages from './pages.config.js';
import viteImagemin from '@vheemstra/vite-plugin-imagemin'

import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminWebp from 'imagemin-webp'


const pagesInput = {};

pages.forEach((page) => {
  pagesInput[page.name] = page.path;
});

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    outDir: 'build',
    rollupOptions: {
      input: {
        ...pagesInput,
      },
    },
  },

  server: {
    port: 3025,
    host: '0.0.0.0',
    hmr: true,
  },
  plugins: [
    injectHTML(),
    viteImagemin({
      plugins: {
        jpg: imageminMozjpeg(),
      },
      makeWebp: {
        plugins: {
          jpg: imageminWebp(),
        },
      },
    }),
  ],
});
