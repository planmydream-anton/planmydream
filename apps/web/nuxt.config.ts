import { resolve } from 'path'

const rootDir = resolve(__dirname, '../..')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // SSR/SSG настройки
  ssr: true,

  // Алиасы для workspace-пакетов
  alias: {
    '@planmydream/database': resolve(rootDir, 'packages/database'),
    '@planmydream/database/schema': resolve(rootDir, 'packages/database/schema'),
    '@planmydream/shared': resolve(rootDir, 'packages/shared'),
    '@planmydream/shared/validators': resolve(rootDir, 'packages/shared/validators'),
    '@planmydream/shared/utils': resolve(rootDir, 'packages/shared/utils'),
  },

  // Nitro — серверная конфигурация
  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
    alias: {
      '@planmydream/database': resolve(rootDir, 'packages/database'),
      '@planmydream/database/schema': resolve(rootDir, 'packages/database/schema'),
      '@planmydream/shared': resolve(rootDir, 'packages/shared'),
      '@planmydream/shared/validators': resolve(rootDir, 'packages/shared/validators'),
      '@planmydream/shared/utils': resolve(rootDir, 'packages/shared/utils'),
    },
    externals: {
      inline: [
        '@planmydream/database',
        '@planmydream/shared',
      ],
    },
  },

  // Модули
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  // Runtime config
  runtimeConfig: {
    // Серверные переменные (не публичные)
    databaseUrl: process.env.DATABASE_URL,
    amocrmClientId: process.env.AMOCRM_CLIENT_ID,
    amocrmClientSecret: process.env.AMOCRM_CLIENT_SECRET,
    
    // Публичные переменные (доступны на клиенте)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://planmydream.ru',
      siteName: 'Plan My Dream',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || '',
    }
  },

  // App настройки
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Plan My Dream — Авторские туры',
      meta: [
        { name: 'description', content: 'Авторские туры в Китай, Вьетнам, Корею и другие страны. Небольшие группы, проверенные маршруты, русскоязычные гиды.' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: 'Plan My Dream' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ru_RU' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Preconnect для ускорения загрузки
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  // Nuxt Image оптимизация
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Для production можно подключить Cloudflare Images или imgproxy
    // provider: 'cloudflare',
    // cloudflare: {
    //   baseURL: 'https://imagedelivery.net/your-account-hash'
    // }
  },

  // Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  // Experimental features для лучшей производительности
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Vite оптимизации
  vite: {
    build: {
      // Разбиваем бандл для лучшего кеширования
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
          },
        },
      },
    },
  },

  // Route rules для ISR (если деплоим на Vercel)
  routeRules: {
    // Главная - пересобираем каждые 5 минут
    '/': { isr: 300 },
    // Каталог туров - каждые 5 минут
    '/tours': { isr: 300 },
    // Страницы туров - каждые 10 минут
    '/tours/**': { isr: 600 },
    // Статические страницы - раз в час
    '/about': { isr: 3600 },
    '/faq': { isr: 3600 },
    '/contacts': { isr: 3600 },
    // API - без кеширования
    '/api/**': { cache: false },
  },

  compatibilityDate: '2024-11-01',
})
