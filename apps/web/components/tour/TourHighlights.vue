<template>
  <section class="py-8 md:py-10">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Что нас ждет в путешествии
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(highlight, index) in highlights"
          :key="highlight.id || index"
          class="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <!-- Image with hover switch -->
          <div class="aspect-[4/3] overflow-hidden relative">
            <!-- Primary image -->
            <NuxtImg
              v-if="getImageUrl(highlight, 0)"
              :src="getImageUrl(highlight, 0)!"
              :alt="highlight.title"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              :class="hoveredIndex === index && getImageUrl(highlight, 1) ? 'opacity-0' : 'opacity-100'"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <!-- Second image (shown on hover) -->
            <NuxtImg
              v-if="getImageUrl(highlight, 1)"
              :src="getImageUrl(highlight, 1)!"
              :alt="`${highlight.title} - фото 2`"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              :class="hoveredIndex === index ? 'opacity-100' : 'opacity-0'"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <!-- No image placeholder -->
            <div v-if="!getImageUrl(highlight, 0)" class="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
              {{ highlight.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {{ highlight.description }}
            </p>
          </div>
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

const hoveredIndex = ref<number | null>(null)

// Get image URL by index (0 = primary, 1 = hover image)
function getImageUrl(highlight: TourHighlight | TourHighlightDB, imageIndex: number = 0): string | undefined {
  // Support images array (multiple images per highlight)
  if ('images' in highlight && Array.isArray((highlight as any).images)) {
    const images = (highlight as any).images
    if (images[imageIndex]) {
      return typeof images[imageIndex] === 'string' ? images[imageIndex] : images[imageIndex].url
    }
  }
  // Fallback to single image (only for index 0)
  if (imageIndex === 0) {
    if ('image' in highlight && highlight.image?.url) return highlight.image.url
    if ('imageUrl' in highlight && highlight.imageUrl) return highlight.imageUrl
  }
  return undefined
}
</script>
