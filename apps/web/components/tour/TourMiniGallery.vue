<template>
  <div class="relative w-full">
    <!-- Desktop grid layout -->
    <div class="hidden md:grid grid-cols-3 gap-2 rounded-2xl overflow-hidden max-h-[420px]">
      <!-- Large image on the left (2/3 width) -->
      <div
        class="col-span-2 relative cursor-pointer group overflow-hidden"
        @click="emit('open-gallery', 0)"
      >
        <NuxtImg
          v-if="coverImage?.url"
          :src="coverImage.url"
          :alt="coverImage.altText || 'Главное фото тура'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="66vw"
          loading="eager"
          fetchpriority="high"
        />
        <div v-else class="w-full h-full bg-neutral-200 flex items-center justify-center min-h-[420px]">
          <span class="text-neutral-400 text-sm">Нет фото</span>
        </div>
        <!-- Hover overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <!-- 4 small images on the right (1/3 width, 2x2 grid) -->
      <div class="col-span-1 grid grid-cols-2 grid-rows-2 gap-2">
        <div
          v-for="(image, index) in smallImages"
          :key="image.id"
          class="relative cursor-pointer group overflow-hidden"
          @click="emit('open-gallery', index + 1)"
        >
          <NuxtImg
            :src="image.url"
            :alt="image.altText || `Фото тура ${index + 2}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="17vw"
            loading="lazy"
          />
          <!-- "Все фото" overlay on last image -->
          <div
            v-if="index === 3"
            class="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-white font-medium text-sm">Все фото ({{ totalCount }})</span>
          </div>
          <!-- Regular hover overlay -->
          <div
            v-else
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
          />
        </div>

        <!-- Fill remaining slots if fewer than 4 gallery images -->
        <div
          v-for="i in emptySlots"
          :key="`empty-${i}`"
          class="bg-neutral-100"
        />
      </div>
    </div>

    <!-- Mobile: single image with dots indicator -->
    <div class="md:hidden relative rounded-2xl overflow-hidden select-none">
      <div
        class="relative overflow-hidden"
        style="height: 260px;"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div
          class="flex transition-transform duration-300 ease-out h-full"
          :style="{ transform: `translateX(-${mobileIndex * 100}%)` }"
        >
          <div
            v-for="(image, index) in allImages"
            :key="image.id"
            class="min-w-full h-full flex-shrink-0"
            @click="emit('open-gallery', index)"
          >
            <NuxtImg
              :src="image.url"
              :alt="image.altText || `Фото ${index + 1}`"
              class="w-full h-full object-cover"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
            />
          </div>
        </div>

        <!-- "Все фото" button -->
        <button
          class="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm"
          @click.stop="emit('open-gallery', mobileIndex)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Все фото ({{ totalCount }})
        </button>
      </div>

      <!-- Dots navigation -->
      <div
        v-if="allImages.length > 1"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
      >
        <button
          v-for="(_, index) in allImages"
          :key="index"
          class="rounded-full transition-all duration-200"
          :class="index === mobileIndex ? 'bg-white w-4 h-2' : 'bg-white/50 w-2 h-2'"
          @click.stop="mobileIndex = index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tour'

const props = defineProps<{
  coverImage: MediaItem
  gallery: MediaItem[]
}>()

const emit = defineEmits<{
  (e: 'open-gallery', index: number): void
}>()

// All images: cover first, then gallery
const allImages = computed<MediaItem[]>(() => {
  const images: MediaItem[] = []
  if (props.coverImage) images.push(props.coverImage)
  if (props.gallery?.length) images.push(...props.gallery)
  return images
})

// Total photo count
const totalCount = computed(() => allImages.value.length)

// Small images: up to 4 from the gallery (excluding cover)
const smallImages = computed<MediaItem[]>(() => {
  return (props.gallery || []).slice(0, 4)
})

// Empty slots to fill 2x2 grid if fewer than 4 gallery images
const emptySlots = computed(() => {
  const filled = smallImages.value.length
  return filled < 4 ? 4 - filled : 0
})

// Mobile carousel state
const mobileIndex = ref(0)

// Touch handling for swipe
let touchStartX = 0
let touchCurrentX = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchCurrentX = touchStartX
}

function onTouchMove(e: TouchEvent) {
  touchCurrentX = e.touches[0].clientX
}

function onTouchEnd() {
  const diff = touchStartX - touchCurrentX
  const threshold = 50

  if (Math.abs(diff) < threshold) return

  if (diff > 0 && mobileIndex.value < allImages.value.length - 1) {
    mobileIndex.value++
  } else if (diff < 0 && mobileIndex.value > 0) {
    mobileIndex.value--
  }
}
</script>
