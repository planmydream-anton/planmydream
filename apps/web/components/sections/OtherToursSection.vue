<template>
  <section id="othertours" class="py-16 md:py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        Другие туры
      </h2>

      <div v-if="tours?.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TourCard 
          v-for="tour in tours" 
          :key="tour.id" 
          :tour="tour" 
        />
      </div>

      <!-- Loading -->
      <div v-else-if="pending" class="text-center text-gray-500">
        Загрузка...
      </div>

      <!-- Empty -->
      <div v-else class="text-center text-gray-500">
        Нет доступных туров
      </div>

      <!-- View all link -->
      <div class="text-center mt-10">
        <NuxtLink 
          to="/tours" 
          class="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
        >
          Смотреть все туры
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Tour } from '~/types/tour'

const props = defineProps<{
  excludeId?: string
}>()

// Fetch other tours
const { data: tours, pending } = await useFetch<Tour[]>('/api/tours', {
  query: { 
    limit: 6,
    exclude: props.excludeId,
    status: 'published'
  },
})
</script>
