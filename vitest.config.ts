import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    server: {
      deps: {
        external: ['bun:sqlite'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        '.nuxt/**',
        '.output/**',
        'dist/**',
        '**/*.config.{ts,js}',
        '**/types.ts',
        '**/__mocks__/**',
        '**/app.vue', // Presentation layer - should be tested with E2E
      ],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '#app': fileURLToPath(new URL('./__mocks__/nuxt.ts', import.meta.url)),
      'bun:sqlite': fileURLToPath(new URL('./__mocks__/bun-sqlite.ts', import.meta.url)),
    },
  },
})
