// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'bun',
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
  ],

})
