import { createRequire } from 'node:module';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const require = createRequire(import.meta.url);
/** Rolldown/Vite 8 can fail to resolve this bare import from virtual:pwa-register unless hoisted + aliased. */
const workboxWindowEntry = require.resolve('workbox-window/build/workbox-window.prod.es5.mjs');
const now = new Date();
const twoDigits = (n: number) => n.toString().padStart(2, '0');
const BUILD_TIME = `${now.getFullYear()}-${twoDigits(now.getMonth() + 1)}-${twoDigits(now.getDate())} ${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}:${twoDigits(now.getSeconds())}`;

export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  resolve: {
    alias: {
      'workbox-window': workboxWindowEntry,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png', 'audio/*.wav'],
      manifest: {
        name: 'Muay Thai Bag Trainer',
        short_name: 'Bag Trainer',
        description: 'Structured heavy-bag rounds for Muay Thai training',
        theme_color: '#ff8f73',
        background_color: '#0e0e0e',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,wav}'],
      },
    }),
  ],
});
