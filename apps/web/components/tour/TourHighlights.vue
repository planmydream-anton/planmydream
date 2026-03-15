<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
        Что нас ждет в путешествии
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        В программу входят самые известные достопримечательности, атмосферные старинные города и потрясающие природные локации
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(highlight, index) in highlights"
          :key="highlight.id || index"
          class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <!-- Image -->
          <div class="aspect-[4/3] overflow-hidden">
            <NuxtImg
              v-if="getImageUrl(highlight)"
              :src="getImageUrl(highlight)!"
              :alt="highlight.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <div v-else-if="!getImageUrl(highlight)" class="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
              {{ highlight.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ highlight.description }}
            </p>
          </div>

          <!-- Hover overlay for emphasis -->
          <div class="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/20 rounded-2xl transition-colors pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TourHighlight, TourHighlightDB } from '~/types/tour'

defineProps<{
  highlights: (TourHighlight | TourHighlightDB)[]
}>()

function getImageUrl(highlight: TourHighlight | TourHighlightDB): string | undefined {
  if ('image' in highlight && highlight.image?.url) return highlight.image.url
  if ('imageUrl' in highlight && highlight.imageUrl) return highlight.imageUrl
  return undefined
}
</script>
