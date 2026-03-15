<template>
  <div class="container mx-auto px-4 pt-6 pb-4">
    <!-- Tour title -->
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight mb-4">
      {{ tour.title }}
    </h1>

    <!-- Characteristic badges row -->
    <div class="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-neutral-600">
      <!-- Duration: days (nights) -->
      <div class="inline-flex items-center gap-1.5">
        <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="font-medium">
          {{ tour.durationDays }} {{ pluralizeDays(tour.durationDays) }}
          <template v-if="nightsCount">({{ nightsCount }} {{ pluralizeNights(nightsCount) }})</template>
        </span>
      </div>

      <span class="text-neutral-300">•</span>

      <!-- Difficulty -->
      <div
        v-if="tour.difficulty"
        class="inline-flex items-center gap-1.5"
      >
        <span
          class="w-2 h-2 rounded-full"
          :class="{
            'bg-green-500': tour.difficulty === 'easy',
            'bg-yellow-500': tour.difficulty === 'medium',
            'bg-orange-500': tour.difficulty === 'hard',
            'bg-red-500': tour.difficulty === 'extreme',
          }"
        />
        <span class="font-medium">{{ difficultyLabels[tour.difficulty] }}</span>
      </div>

      <span v-if="tour.difficulty" class="text-neutral-300">•</span>

      <!-- Comfort level -->
      <div v-if="tour.comfortLevel" class="inline-flex items-center gap-1.5">
        <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span class="font-medium">{{ comfortLabels[tour.comfortLevel] }}</span>
      </div>

      <span v-if="tour.comfortLevel" class="text-neutral-300">•</span>

      <!-- Group size -->
      <div v-if="tour.groupSizeMin || tour.groupSizeMax" class="inline-flex items-center gap-1.5">
        <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="font-medium">{{ groupSizeLabel }}</span>
      </div>

      <span v-if="tour.minAge" class="text-neutral-300">•</span>

      <!-- Min age -->
      <div v-if="tour.minAge" class="inline-flex items-center gap-1.5">
        <span class="font-medium">от {{ tour.minAge }}+</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '~/types/tour'

const props = defineProps<{
  tour: Tour
}>()

// Nights = days - 1
const nightsCount = computed(() => {
  if (!props.tour.durationDays) return 0
  return props.tour.durationDays - 1
})

// Difficulty labels
const difficultyLabels: Record<string, string> = {
  easy: 'Легкий',
  medium: 'Средний',
  hard: 'Сложный',
  extreme: 'Экстремальный',
}

// Comfort level labels
const comfortLabels: Record<string, string> = {
  basic: 'Базовый',
  standard: 'Стандарт',
  comfort: 'Комфорт',
  luxury: 'Люкс',
}

// Group size label
const groupSizeLabel = computed(() => {
  const min = props.tour.groupSizeMin
  const max = props.tour.groupSizeMax
  if (min && max) return `${min}-${max} чел.`
  if (min) return `от ${min} чел.`
  if (max) return `до ${max} чел.`
  return ''
})

// Russian pluralization for days
function pluralizeDays(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'дней'
  if (mod10 === 1) return 'день'
  if (mod10 >= 2 && mod10 <= 4) return 'дня'
  return 'дней'
}

// Russian pluralization for nights
function pluralizeNights(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'ночей'
  if (mod10 === 1) return 'ночь'
  if (mod10 >= 2 && mod10 <= 4) return 'ночи'
  return 'ночей'
}
</script>
