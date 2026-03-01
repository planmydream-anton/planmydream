export default defineNuxtConfig({
  // SPA mode — админке не нужен SSR
  ssr: false,

  // Модули
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
  ],

  // Runtime config
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || 'planmydream-admin-secret-change-in-production',
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    public: {
      appName: 'PlanMyDream Admin',
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
  },

  compatibilityDate: '2024-11-01',
})
