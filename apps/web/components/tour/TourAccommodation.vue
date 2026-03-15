<template>
  <section v-if="accommodations && accommodations.length" id="accommodation" class="py-12 md:py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Размещение
      </h2>

      <p v-if="infoText" class="text-gray-600 leading-relaxed mb-8 max-w-3xl">
        {{ infoText }}
      </p>

      <div class="space-y-10">
        <div
          v-for="(item, index) in accommodations"
          :key="index"
          class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <!-- Header -->
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ item.name }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <!-- Photo gallery -->
          <div v-if="item.images && item.images.length" class="p-6">
            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              <button
                v-for="(imgUrl, imgIndex) in item.images"
                :key="imgIndex"
                class="flex-shrink-0 w-36 h-24 rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-400 focus:border-orange-500 focus:outline-none transition-colors"
                @click="openLightbox(item.images, imgIndex)"
              >
                <img
                  :src="imgUrl"
                  :alt="`${item.name} - фото ${imgIndex + 1}`"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            </div>
          </div>

          <!-- Video -->
          <div v-if="item.videoUrl" class="px-6 pb-6">
            <video
              :src="item.videoUrl"
              controls
              class="w-full max-w-2xl rounded-xl bg-black"
              preload="metadata"
            >
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox overlay -->
    <div
      v-if="lightbox.open"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      @click.self="closeLightbox"
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        @click="closeLightbox"
      >
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Prev button -->
      <button
        v-if="lightbox.images.length > 1"
        class="absolute left-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        @click="lightboxPrev"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Image -->
      <img
        :src="lightbox.images[lightbox.index]"
        alt="Фото размещения"
        class="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
      />

      <!-- Next button -->
      <button
        v-if="lightbox.images.length > 1"
        class="absolute right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        @click="lightboxNext"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Counter -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {{ lightbox.index + 1 }} / {{ lightbox.images.length }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TourAccommodationItem } from '~/types/tour'

defineProps<{
  accommodations: TourAccommodationItem[]
  infoText?: string
}>()

const lightbox = reactive<{
  open: boolean
  images: string[]
  index: number
}>({
  open: false,
  images: [],
  index: 0,
})

function openLightbox(images: string[], index: number) {
  lightbox.images = images
  lightbox.index = index
  lightbox.open = true
}

function closeLightbox() {
  lightbox.open = false
  lightbox.images = []
  lightbox.index = 0
}

function lightboxPrev() {
  lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length
}

function lightboxNext() {
  lightbox.index = (lightbox.index + 1) % lightbox.images.length
}

onMounted(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (!lightbox.open) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') lightboxPrev()
    if (e.key === 'ArrowRight') lightboxNext()
  }
  window.addEventListener('keydown', handleKey)
  onUnmounted(() => window.removeEventListener('keydown', handleKey))
})
</script>
