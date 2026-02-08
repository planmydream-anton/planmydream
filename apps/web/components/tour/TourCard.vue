<template>
  <NuxtLink 
    :to="`/tours/${tour.slug}`"
    class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
  >
    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <NuxtImg
        v-if="tour.coverImage?.url"
        :src="tour.coverImage.url"
        :alt="tour.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        :placeholder="[20, 15, 10]"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-zinc-200 flex items-center justify-center">
        <svg class="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Discount badge -->
      <div 
        v-if="tour.discountPercent"
        class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
      >
        -{{ tour.discountPercent }}%
      </div>
      
      <!-- Destination badge -->
      <div 
        v-if="tour.destination?.name"
        class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
      >
        {{ tour.destination.name }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Title -->
      <h3 class="text-lg font-bold text-zinc-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
        {{ tour.title }}
      </h3>
      
      <!-- Subtitle -->
      <p v-if="tour.subtitle" class="text-zinc-600 text-sm mb-4 line-clamp-2">
        {{ tour.subtitle }}
      </p>

      <!-- Info row -->
      <div class="flex items-center gap-4 text-sm text-zinc-500 mb-4">
        <!-- Duration -->
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ tour.durationDays }} {{ pluralize(tour.durationDays, 'день', 'дня', 'дней') }}
        </div>
        
        <!-- Next departure -->
        <div v-if="nextDeparture" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formatDate(nextDeparture.startDate) }}
        </div>
      </div>

      <!-- Price & CTA -->
      <div class="flex items-end justify-between">
        <div>
          <div v-if="tour.discountPercent && originalPrice" class="text-zinc-400 line-through text-sm">
            ${{ originalPrice.toLocaleString() }}
          </div>
          <div class="text-2xl font-bold text-zinc-900">
            ${{ tour.priceFrom?.toLocaleString() }}
          </div>
        </div>
        
        <span class="inline-flex items-center gap-1 text-orange-500 font-medium text-sm">
          Подробнее
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Tour, Departure } from '~/types/tour'

const props = defineProps<{
  tour: Tour
}>()

// Ближайший выезд
const nextDeparture = computed<Departure | undefined>(() => {
  if (!props.tour.departures?.length) return undefined
  
  const now = new Date()
  return props.tour.departures
    .filter(d => d.status === 'active' && new Date(d.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
})

// Оригинальная цена (если есть скидка)
const originalPrice = computed(() => {
  if (!props.tour.discountPercent || !props.tour.priceFrom) return null
  return Math.round(props.tour.priceFrom / (1 - props.tour.discountPercent / 100))
})

// Форматирование даты
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'short' 
  })
}

// Склонение
function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
</script>
