<template>
  <div class="py-6">
    <!-- Tour title -->
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-6">
      {{ tour.title }}
    </h1>

    <!-- Characteristic badges row -->
    <div class="flex flex-wrap gap-2 md:gap-3">
      <!-- Duration -->
      <div class="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-4 py-2">
        <!-- Calendar icon -->
        <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-sm font-medium text-neutral-700">
          {{ tour.durationDays }} {{ pluralizeDays(tour.durationDays) }}
        </span>
      </div>

      <!-- Difficulty -->
      <div
        v-if="tour.difficulty"
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors"
        :class="difficultyStyles[tour.difficulty]?.bg || 'bg-neutral-100 hover:bg-neutral-200'"
      >
        <!-- Mountain icon -->
        <svg class="w-4 h-4 flex-shrink-0" :class="difficultyStyles[tour.difficulty]?.icon || 'text-neutral-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l7 14 7-14" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 20h18" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10l3-6 3 6" />
        </svg>
        <span class="text-sm font-medium" :class="difficultyStyles[tour.difficulty]?.text || 'text-neutral-700'">
          {{ difficultyLabels[tour.difficulty] }}
        </span>
      </div>

      <!-- Comfort level -->
      <div
        v-if="tour.comfortLevel"
        class="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-4 py-2"
      >
        <!-- Star icon -->
        <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span class="text-sm font-medium text-neutral-700">
          {{ comfortLabels[tour.comfortLevel] }}
        </span>
      </div>

      <!-- Group size -->
      <div
        v-if="tour.groupSizeMin || tour.groupSizeMax"
        class="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-4 py-2"
      >
        <!-- People icon -->
        <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-sm font-medium text-neutral-700">{{ groupSizeLabel }}</span>
      </div>

      <!-- Min age -->
      <div
        v-if="tour.minAge"
        class="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-4 py-2"
      >
        <!-- Person icon -->
        <svg class="w-4 h-4 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-sm font-medium text-neutral-700">от {{ tour.minAge }} лет</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '~/types/tour'

const props = defineProps<{
  tour: Tour
}>()

// Difficulty labels and styles
const difficultyLabels: Record<string, string> = {
  easy: 'Легкий',
  medium: 'Средний',
  hard: 'Сложный',
  extreme: 'Экстремальный',
}

const difficultyStyles: Record<string, { bg: string; icon: string; text: string }> = {
  easy: {
    bg: 'bg-green-50 hover:bg-green-100',
    icon: 'text-green-500',
    text: 'text-green-700',
  },
  medium: {
    bg: 'bg-yellow-50 hover:bg-yellow-100',
    icon: 'text-yellow-500',
    text: 'text-yellow-700',
  },
  hard: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    icon: 'text-orange-500',
    text: 'text-orange-700',
  },
  extreme: {
    bg: 'bg-red-50 hover:bg-red-100',
    icon: 'text-red-500',
    text: 'text-red-700',
  },
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
</script>
