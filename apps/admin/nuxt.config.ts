import { resolve } from 'path'

const rootDir = resolve(__dirname, '../..')

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

  // Алиасы для workspace-пакетов
  alias: {
    '@planmydream/database': resolve(rootDir, 'packages/database'),
    '@planmydream/database/schema': resolve(rootDir, 'packages/database/schema'),
    '@planmydream/shared': resolve(rootDir, 'packages/shared'),
    '@planmydream/shared/validators': resolve(rootDir, 'packages/shared/validators'),
  },

  // Nitro — встроить workspace-пакеты в серверный бандл
  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
    alias: {
      '@planmydream/database': resolve(rootDir, 'packages/database'),
      '@planmydream/database/schema': resolve(rootDir, 'packages/database/schema'),
      '@planmydream/shared': resolve(rootDir, 'packages/shared'),
      '@planmydream/shared/validators': resolve(rootDir, 'packages/shared/validators'),
    },
    externals: {
      inline: [
        '@planmydream/database',
        '@planmydream/shared',
      ],
    },
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
  },

  compatibilityDate: '2024-11-01',
})
