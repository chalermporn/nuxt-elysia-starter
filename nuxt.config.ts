// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSG Configuration
  ssr: true,

  nitro: {
    preset: 'bun',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  // Development server configuration
  devServer: {
    port: 3000,
  },

  vite: {
    build: {
      sourcemap: false,
    },
  },
  modules: [
    '@nuxt/eslint',
    'nuxt-elysia',
  ],
  runtimeConfig: {
    'nuxt-elysia': {
      path: '/api',
    },
  },
})
