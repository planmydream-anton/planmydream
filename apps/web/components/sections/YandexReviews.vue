<template>
  <section class="py-16 md:py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 mb-4">
          <!-- Yandex logo -->
          <svg class="h-6" viewBox="0 0 86 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.56 23.33h-3.87V12.48L4.28 1.13h4.34l3.64 7.75 3.63-7.75h4.07l-5.4 11.35v10.85zM26.42 20.37c-.84 2.1-2.15 3.2-4.34 3.2-.63 0-1.4-.12-1.88-.3l.54-2.86c.3.12.66.18 1.05.18.84 0 1.32-.42 1.65-1.26l.3-.78-4.64-12.1h3.69l2.87 8.53 2.69-8.53h3.57l-5.5 13.92zM36.5 17.03h3.2v2.82c-.93.42-2.33.72-3.63.72-3.45 0-5.7-2.4-5.7-6.16 0-3.69 2.4-6.22 5.94-6.22 1.47 0 2.75.36 3.93 1.14l-1.2 2.4c-.78-.54-1.62-.84-2.55-.84-1.62 0-2.69 1.26-2.69 3.45 0 2.28 1.02 3.51 2.75 3.51.24 0 .48-.06.72-.12v-3.51h-.77v-2.7h3.2v5.51zM50.69 20.21h-3.39v-1.14c-.78.9-1.74 1.38-2.93 1.38-2.16 0-3.51-1.62-3.51-4.22V8.45h3.39v6.94c0 1.44.54 2.16 1.56 2.16.84 0 1.44-.54 1.68-1.26V8.45h3.39v11.76h-.19zM57.71 20.45c-1.32 0-2.57-.42-3.57-1.26l1.38-2.34c.72.6 1.5.96 2.28.96.84 0 1.32-.36 1.32-.9 0-.6-.6-.84-1.56-1.14-1.74-.54-3.45-1.26-3.45-3.39 0-2.16 1.74-3.57 4.07-3.57 1.26 0 2.28.36 3.21 1.02l-1.32 2.28c-.66-.48-1.32-.72-2.01-.72-.72 0-1.08.3-1.08.78 0 .6.6.84 1.68 1.2 1.68.54 3.33 1.2 3.33 3.33 0 2.22-1.68 3.75-4.28 3.75zM70.87 20.21h-3.39V3.45h3.39v11.76c.78-.9 1.74-1.38 2.87-1.38 2.16 0 3.51 1.62 3.51 4.22v5.46h-3.39V16.4c0-1.44-.54-2.16-1.56-2.16-.84 0-1.44.54-1.62 1.26v4.71h.19z" fill="#FC3F1D"/>
          </svg>
          <span class="text-gray-400 text-sm">|</span>
          <span class="text-gray-500 text-sm font-medium">Отзывы на Яндекс.Картах</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Отзывы путешественников
        </h2>
        <p class="text-gray-500 text-lg mb-6">
          Реальные отзывы наших путешественников на Яндекс.Картах
        </p>

        <!-- Rating badge -->
        <div class="inline-flex items-center gap-3 bg-gray-50 rounded-2xl px-6 py-3">
          <div class="flex items-center gap-1">
            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-900">5.0</span>
          <a
            href="https://yandex.ru/maps/org/plan_my_dream/184002063475/"
            target="_blank"
            rel="noopener"
            class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Читать все отзывы &rarr;
          </a>
        </div>
      </div>

      <!-- Yandex Reviews Widget -->
      <div class="max-w-4xl mx-auto">
        <div class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          <iframe
            :src="widgetUrl"
            class="w-full border-0"
            :style="{ height: iframeHeight + 'px' }"
            loading="lazy"
            referrerpolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        <!-- Link to leave review -->
        <div class="text-center mt-6">
          <a
            href="https://yandex.ru/maps/org/plan_my_dream/184002063475/?tab=reviews"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Оставить отзыв
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const orgId = '184002063475'

// Yandex Maps review widget URL with comments
const widgetUrl = `https://yandex.ru/maps-reviews-widget/${orgId}?comments`

// Responsive height
const iframeHeight = ref(600)

onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
})

function updateHeight() {
  // Taller on mobile since reviews stack vertically
  iframeHeight.value = window.innerWidth < 768 ? 500 : 600
}
</script>
