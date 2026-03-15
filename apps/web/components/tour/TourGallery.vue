<template>
  <section class="py-8 md:py-10">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Галерея
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        Каждый маршрут дарит незабываемые впечатления на всю жизнь
      </p>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="(image, index) in visibleImages"
          :key="image.id || index"
          class="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
          :class="{ 
            'md:col-span-2 md:row-span-2': index === 0,
            'lg:col-span-2': index === 3 
          }"
          @click="openLightbox(index)"
        >
          <NuxtImg
            :src="image.url"
            :alt="image.altText || `Фото ${index + 1}`"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          
          <!-- Zoom icon on hover -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Show more -->
      <div v-if="images.length > initialCount && !showAll" class="mt-8 text-center">
        <button
          @click="showAll = true"
          class="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Показать ещё {{ images.length - initialCount }} фото
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="lightboxOpen" 
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          @click.self="closeLightbox"
        >
          <!-- Close button -->
          <button 
            @click="closeLightbox"
            class="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Navigation -->
          <button 
            v-if="currentIndex > 0"
            @click="currentIndex--"
            class="absolute left-4 text-white/70 hover:text-white p-2"
          >
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
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
            
            <!-- Caption -->
            <div v-if="images[currentIndex].caption" class="text-center text-white/70 mt-4">
              {{ images[currentIndex].caption }}
            </div>
            
            <!-- Counter -->
            <div class="text-center text-white/50 text-sm mt-2">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tour'

const props = defineProps<{
  images: MediaItem[]
}>()

const initialCount = 12
const showAll = ref(false)
const lightboxOpen = ref(false)
const currentIndex = ref(0)

const visibleImages = computed(() => {
  if (showAll.value) return props.images
  return props.images.slice(0, initialCount)
})

function openLightbox(index: number) {
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return
    
    if (e.key === 'Escape') closeLightbox()
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
