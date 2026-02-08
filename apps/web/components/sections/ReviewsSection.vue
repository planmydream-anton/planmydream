<template>
  <section id="reviews" class="py-16 md:py-24 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
        Что говорят те, кто уже отправился с нами
      </h2>
      <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Отзывы наших путешественников — лучшее подтверждение качества наших туров
      </p>

      <!-- Reviews slider -->
      <div v-if="reviews?.length" class="relative max-w-4xl mx-auto">
        <!-- Main review card -->
        <div class="bg-gray-50 rounded-2xl p-6 md:p-10">
          <div class="flex flex-col md:flex-row gap-6 items-start">
            <!-- Author photo placeholder -->
            <div class="flex-shrink-0">
              <div 
                v-if="currentReview.authorPhotoUrl"
                class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden"
              >
                <NuxtImg 
                  :src="currentReview.authorPhotoUrl" 
                  :alt="currentReview.authorName"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div 
                v-else 
                class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-100 flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-orange-500">
                  {{ currentReview.authorName.charAt(0) }}
                </span>
              </div>
            </div>

            <!-- Review content -->
            <div class="flex-grow">
              <!-- Stars -->
              <div class="flex gap-1 mb-3">
                <svg 
                  v-for="i in 5" 
                  :key="i"
                  class="w-5 h-5"
                  :class="i <= (currentReview.rating || 5) ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <!-- Quote -->
              <blockquote class="text-gray-700 text-lg leading-relaxed mb-4">
                "{{ currentReview.text }}"
              </blockquote>

              <!-- Author name -->
              <div class="font-semibold text-gray-900">
                {{ currentReview.authorName }}
              </div>
              <div v-if="currentReview.travelDate" class="text-sm text-gray-500">
                {{ formatDate(currentReview.travelDate) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div v-if="reviews.length > 1" class="flex justify-center gap-4 mt-6">
          <button
            @click="prev"
            class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            :disabled="currentIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Dots -->
          <div class="flex items-center gap-2">
            <button
              v-for="(_, index) in reviews"
              :key="index"
              @click="currentIndex = index"
              class="w-2 h-2 rounded-full transition-colors"
              :class="index === currentIndex ? 'bg-orange-500' : 'bg-gray-300 hover:bg-gray-400'"
            />
          </div>

          <button
            @click="next"
            class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            :disabled="currentIndex === reviews.length - 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === reviews.length - 1 }"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else-if="pending" class="text-center text-gray-500">
        Загрузка отзывов...
      </div>

      <!-- Empty state -->
      <div v-else class="text-center text-gray-500">
        Пока нет отзывов
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Review {
  id: string
  authorName: string
  authorPhotoUrl?: string
  text: string
  rating?: number
  travelDate?: string
}

const props = defineProps<{
  tourId?: string
}>()

const currentIndex = ref(0)

// Fetch reviews
const { data: reviews, pending } = await useFetch<Review[]>('/api/reviews', {
  query: { tourId: props.tourId },
})

const currentReview = computed(() => {
  return reviews.value?.[currentIndex.value] || {
    id: '',
    authorName: '',
    text: '',
  }
})

function next() {
  if (reviews.value && currentIndex.value < reviews.value.length - 1) {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { 
    month: 'long', 
    year: 'numeric' 
  })
}
</script>
