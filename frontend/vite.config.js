import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Chorepal-favicon.ico', 'chorepal-logo-optimized.png', 'Chorepal-img-transparent.png'],
      manifest: {
        name: 'ChorePal',
        short_name: 'ChorePal',
        description: 'Family chore management — plan it, do it.',
        theme_color: '#1a2b4c',
        background_color: '#f7f9fa',
        display: 'standalone',
        start_url: '/dashboard',
        icons: [
          {
            src: 'Chorepal-img-transparent.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'Chorepal-img-transparent.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'Chorepal-img-transparent.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache static assets: JS bundles, CSS, fonts, images
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Do not cache backend API calls
        navigateFallbackDenylist: [/^\/api/, /^\/chores/, /^\/users/, /^\/children/, /^\/images/],
      },
    }),
  ],
});
