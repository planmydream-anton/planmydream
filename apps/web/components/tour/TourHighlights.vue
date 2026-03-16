<template>
  <section class="py-8 md:py-10">
    <!-- Header row with arrows -->
    <div class="flex items-end justify-between mb-6">
      <div class="flex-1 min-w-0 pr-4">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
          Что нас ждет в путешествии
        </h2>
      </div>
      <!-- Navigation arrows -->
      <div v-if="highlights.length > 3" class="flex gap-2 flex-shrink-0">
        <button
          @click="scrollLeft"
          class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-30"
          :disabled="scrollPosition <= 0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="scrollRight"
          class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-30"
          :disabled="isAtEnd"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Horizontal scroll carousel -->
    <div
      ref="scrollContainer"
      class="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4 pb-2"
      @scroll="onScroll"
    >
      <div
        v-for="(highlight, index) in highlights"
        :key="highlight.id || index"
        class="flex-shrink-0 w-[280px] md:w-[320px] group"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <!-- Image -->
        <div class="aspect-[4/3] overflow-hidden rounded-2xl relative bg-gray-100">
          <!-- Primary image -->
          <NuxtImg
            v-if="getImageUrl(highlight, 0)"
            :src="getImageUrl(highlight, 0)!"
            :alt="highlight.title"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            :class="hoveredIndex === index && getImageUrl(highlight, 1) ? 'opacity-0' : 'opacity-100'"
            sizes="320px"
            loading="lazy"
          />
          <!-- Second image (shown on hover) -->
          <NuxtImg
            v-if="getImageUrl(highlight, 1)"
            :src="getImageUrl(highlight, 1)!"
            :alt="`${highlight.title} - фото 2`"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            :class="hoveredIndex === index ? 'opacity-100' : 'opacity-0'"
            sizes="320px"
            loading="lazy"
          />
          <!-- No image placeholder -->
          <div v-if="!getImageUrl(highlight, 0)" class="w-full h-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Text below -->
        <div class="mt-3">
          <h3 class="text-base font-bold text-gray-900 mb-1">
            {{ highlight.title }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ highlight.description }}
          </p>
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
const scrollContainer = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const isAtEnd = ref(false)

function onScroll() {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  scrollPosition.value = el.scrollLeft
  isAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10
}

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -340, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 340, behavior: 'smooth' })
}

// Get image URL by index (0 = primary, 1 = hover image)
function getImageUrl(highlight: TourHighlight | TourHighlightDB, imageIndex: number = 0): string | undefined {
  if ('images' in highlight && Array.isArray((highlight as any).images)) {
    const images = (highlight as any).images
    if (images[imageIndex]) {
      return typeof images[imageIndex] === 'string' ? images[imageIndex] : images[imageIndex].url
    }
  }
  if (imageIndex === 0) {
    if ('image' in highlight && highlight.image?.url) return highlight.image.url
    if ('imageUrl' in highlight && highlight.imageUrl) return highlight.imageUrl
  }
  return undefined
}
</script>
