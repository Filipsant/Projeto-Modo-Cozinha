import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

const DAY = 60 * 60 * 24

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA (RNF09): instala no celular e abre sem internet o que já foi visto
    VitePWA({
      // A nova versão espera a pessoa tocar em "Atualizar": trocar o app no meio
      // de uma receita apagaria o passo e os timers
      registerType: 'prompt',
      // O registro é feito à mão em src/app/pwa, para avisar a interface
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Modo Cozinha',
        short_name: 'Modo Cozinha',
        description: 'Receitas passo a passo para cozinhar com o celular na bancada.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#F8F9FA',
        theme_color: '#7752D5',
        categories: ['food', 'lifestyle'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // Pressionar o ícone do app abre direto nestas telas
        shortcuts: [
          { name: 'Favoritos', url: '/favoritos' },
          { name: 'Lista de compras', url: '/lista-de-compras' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Qualquer rota do app abre offline: o React Router decide o que mostrar
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Receitas: tenta a rede primeiro (dados novos) e cai no cache sem internet
            urlPattern: /^https:\/\/www\.themealdb\.com\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mealdb-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Fotos não mudam: o cache responde na hora, sem esperar a rede
            urlPattern: /^https:\/\/www\.themealdb\.com\/images\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mealdb-images',
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * DAY, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Passos traduzidos: o mesmo texto sempre traduz igual, então o cache
            // responde na hora e a receita já vista continua em português offline
            urlPattern: /^https:\/\/translate\.googleapis\.com\/translate_a\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'translations',
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * DAY, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/shared/testing/setupTests.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/shared/testing/**',
        'src/app/main.tsx',
        // Depende do service worker de verdade, que só existe no build
        'src/app/pwa/**',
      ],
      // RNF12: ≥ 90% nas pastas lib/ e ≥ 70% no projeto
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
        'src/{entities,features}/**/lib/**': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  },
})
