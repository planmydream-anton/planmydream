<template>
  <section class="relative min-h-[90vh] flex items-center">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <NuxtImg
        v-if="tour.coverImage?.url"
        :src="tour.coverImage.url"
        :alt="tour.title"
        class="w-full h-full object-cover"
        sizes="100vw"
        :placeholder="[100, 50, 10]"
        loading="eager"
        fetchpriority="high"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 relative z-10 pt-24 pb-16">
      <div class="max-w-4xl">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-300 px-4 py-2 rounded-full text-sm mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ tour.destination?.name || 'Авторский тур' }}
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          {{ tour.title }}
        </h1>

        <!-- Subtitle -->
        <p v-if="tour.subtitle" class="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl">
          {{ tour.subtitle }}
        </p>

        <!-- Info Cards -->
        <div class="flex flex-wrap gap-4 mb-8">
          <!-- Price -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
            <div class="text-white/60 text-sm">Стоимость</div>
            <div class="text-white text-2xl font-bold">
              ${{ tour.priceFrom?.toLocaleString() }}
            </div>
          </div>

          <!-- Dates -->
          <div v-if="nextDeparture" class="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
            <div class="text-white/60 text-sm">Ближайшие даты</div>
            <div class="text-white text-lg font-medium">
              {{ formatDateRange(nextDeparture.startDate, nextDeparture.endDate) }}
            </div>
          </div>

          <!-- Duration -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
            <div class="text-white/60 text-sm">Длительность</div>
            <div class="text-white text-lg font-medium">
              {{ tour.durationDays }} {{ pluralize(tour.durationDays, 'день', 'дня', 'дней') }}
            </div>
          </div>
        </div>

        <!-- Route -->
        <div v-if="tour.route" class="text-white/70 mb-8">
          <span class="text-white/50">Маршрут:</span> {{ tour.route }}
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4">
          <button
            @click="openBookingModal"
            class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors flex items-center gap-2"
          >
            Забронировать место
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          <a
            href="#program"
            class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors"
          >
            Подробный маршрут
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Tour, Departure } from '~/types/tour'

const props = defineProps<{
  tour: Tour
}>()

const { openModal } = useInquiryModal()

// Ближайший выезд
const nextDeparture = computed<Departure | undefined>(() => {
  if (!props.tour.departures?.length) return undefined
  
  const now = new Date()
  return props.tour.departures
    .filter(d => d.status === 'active' && new Date(d.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
})

function openBookingModal() {
  openModal({
    tourId: props.tour.id,
    tourTitle: props.tour.title,
    departureId: nextDeparture.value?.id,
    departureDate: nextDeparture.value?.startDate,
  })
}

// Форматирование дат
function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const month = startDate.toLocaleDateString('ru-RU', { month: 'long' })
  const year = startDate.getFullYear()
  
  return `${startDay} — ${endDay} ${month} ${year}`
}

// Склонение слов
function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
</script>
