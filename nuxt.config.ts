import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // CSR Configuration
  ssr: false,

  app: {
    head: {
      htmlAttrs: {
        lang: 'th',
      },
      title: 'Member Management System - Nuxt Elysia Starter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A modern member management system built with Nuxt 4, Elysia, and TailwindCSS. Features include sorting, pagination, and search functionality.',
        },
      ],

    },
  },

  experimental: {
    payloadExtraction: false,
  },

  nitro: {
    preset: 'bun',
  },

  // Development server configuration
  devServer: {
    port: 3000,
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      sourcemap: false,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
  },
  modules: ['@nuxt/eslint', 'nuxt-elysia'],

  runtimeConfig: {
    'nuxt-elysia': {
      path: '/api',
    },
  },
})
