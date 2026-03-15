<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center"
      @click.self="$emit('close')"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Prev -->
      <button
        v-if="currentIndex > 0"
        @click="currentIndex--"
        class="absolute left-4 text-white/70 hover:text-white p-2"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Next -->
      <button
        v-if="currentIndex < images.length - 1"
        @click="currentIndex++"
        class="absolute right-4 text-white/70 hover:text-white p-2"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Image -->
      <div class="max-w-6xl max-h-[90vh] px-4">
        <NuxtImg
          :src="images[currentIndex].url"
          :alt="images[currentIndex].altText || ''"
          class="max-w-full max-h-[85vh] object-contain mx-auto"
        />
        <div v-if="images[currentIndex].caption" class="text-center text-white/70 mt-4">
          {{ images[currentIndex].caption }}
        </div>
        <div class="text-center text-white/50 text-sm mt-2">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tour'

const props = defineProps<{
  images: MediaItem[]
  startIndex?: number
}>()

defineEmits<{
  close: []
}>()

const currentIndex = ref(props.startIndex || 0)

onMounted(() => {
  document.body.style.overflow = 'hidden'

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // parent handles close via emit
    }
    if (e.key === 'ArrowLeft' && currentIndex.value > 0) currentIndex.value--
    if (e.key === 'ArrowRight' && currentIndex.value < props.images.length - 1) currentIndex.value++
  }

  document.addEventListener('keydown', handleKeydown)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  })
})
</script>
