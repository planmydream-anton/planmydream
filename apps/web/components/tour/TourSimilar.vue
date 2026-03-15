<template>
  <section v-if="similarTours && similarTours.length" class="py-12 md:py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Похожие туры
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="tour in similarTours"
          :key="tour.id"
          :to="`/tours/${tour.slug}`"
          class="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Cover image -->
          <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              v-if="tour.coverImageUrl"
              :src="tour.coverImageUrl"
              :alt="tour.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Discount badge -->
            <div
              v-if="tour.discountPercent"
              class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full"
            >
              -{{ tour.discountPercent }}%
            </div>
          </div>

          <!-- Card content -->
          <div class="p-5">
            <h3 class="text-base font-bold text-gray-900 leading-snug mb-1 group-hover:text-orange-500 transition-colors line-clamp-2">
              {{ tour.title }}
            </h3>

            <p v-if="tour.subtitle" class="text-gray-500 text-sm mb-3 line-clamp-2">
              {{ tour.subtitle }}
            </p>

            <!-- Duration + departure row -->
            <div class="flex items-center gap-3 text-xs text-gray-500 mb-4">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ tour.durationDays }}&nbsp;{{ pluralize(tour.durationDays, 'день', 'дня', 'дней') }}
              </span>

              <span v-if="tour.nextDeparture" class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(tour.nextDeparture.startDate) }}
              </span>
            </div>

            <!-- Price + link row -->
            <div class="flex items-end justify-between">
              <div>
                <div v-if="tour.discountPercent && originalPrice(tour)" class="text-gray-400 line-through text-xs mb-0.5">
                  {{ formatPrice(originalPrice(tour)!, tour.currency) }}
                </div>
                <div class="text-xl font-bold text-gray-900">
                  {{ formatPrice(Number(tour.priceFrom), tour.currency) }}
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface SimilarTour {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  priceFrom: number | string
  currency: string
  durationDays: number
  difficulty?: string | null
  discountPercent?: number | null
  coverImageUrl?: string | null
  destination?: {
    name: string
    country?: string | null
  } | null
  nextDeparture?: {
    startDate: string
    price: number
    spotsLeft: number
  } | null
}

const props = defineProps<{
  tourId: string
}>()

const { data: similarTours } = await useFetch<SimilarTour[]>(
  `/api/tours/similar`,
  {
    query: { tourId: props.tourId },
    default: () => [],
  },
)

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

function formatPrice(amount: number, currency: string): string {
  const currencyMap: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  }
  const symbol = currencyMap[currency] ?? currency
  return `${amount.toLocaleString('ru-RU')}\u00A0${symbol}`
}

function originalPrice(tour: SimilarTour): number | null {
  if (!tour.discountPercent || !tour.priceFrom) return null
  return Math.round(Number(tour.priceFrom) / (1 - tour.discountPercent / 100))
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
</script>
