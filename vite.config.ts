import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Served from the root of a GitHub Pages custom domain (https://trax.parsasam.ir/).
// Override VITE_BASE for a project sub-path (e.g. "/TRAX/").
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'logo.svg', 'logo.png'],
      manifest: {
        id: base,
        name: 'TRAX — AI Trading Desk',
        short_name: 'TRAX',
        description:
          'An AI trading desk that crawls the sources that matter, reads your assets, and turns market noise into clear, sourced calls.',
        theme_color: '#080A0C',
        background_color: '#080A0C',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        lang: 'en',
        dir: 'ltr',
        categories: ['finance', 'productivity'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})
