<template>
  <div class="container mx-auto px-4 pt-6 pb-2">
    <!-- Tour title -->
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
      {{ tour.title }}
    </h1>

    <!-- Subtitle / tagline -->
    <p v-if="tour.subtitle" class="text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-4xl">
      {{ tour.subtitle }}
    </p>

    <!-- Info card (like Figma) -->
    <div class="bg-gray-50 rounded-2xl border border-gray-100 p-5 md:p-6 mb-4">
      <!-- Top row: Route + Duration -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 pb-5 border-b border-gray-200">
        <!-- Route -->
        <div v-if="tour.routeCities" class="flex-1">
          <div class="text-sm text-gray-500 mb-1">Маршрут:</div>
          <div class="text-base md:text-lg font-bold text-gray-900">
            {{ tour.routeCities }}
          </div>
        </div>
        <!-- Duration -->
        <div class="flex-shrink-0">
          <div class="text-sm text-gray-500 mb-1">Длительность:</div>
          <div class="text-base md:text-lg font-bold text-gray-900">
            {{ tour.durationDays }} {{ pluralizeDays(tour.durationDays) }}
          </div>
        </div>
      </div>

      <!-- Bottom row: Difficulty, Comfort, Group, Extra -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <!-- Difficulty -->
        <div v-if="tour.difficulty">
          <div class="flex items-center gap-1.5 text-sm text-gray-500 mb-1.5">
            Сложность:
            <span class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center cursor-help" :title="difficultyHints[tour.difficulty]">?</span>
          </div>
          <div class="text-sm font-semibold text-gray-900 mb-1">{{ difficultyLabels[tour.difficulty] }}</div>
          <div class="flex gap-1">
            <span
              v-for="i in 5"
              :key="i"
              class="w-2.5 h-2.5 rounded-full"
              :class="i <= difficultyLevel[tour.difficulty] ? 'bg-emerald-500' : 'bg-gray-300'"
            />
          </div>
          <a href="#program" class="text-emerald-500 text-xs font-medium hover:underline mt-1 inline-block">К маршруту</a>
        </div>

        <!-- Comfort -->
        <div v-if="tour.comfortLevel">
          <div class="flex items-center gap-1.5 text-sm text-gray-500 mb-1.5">
            Комфорт:
            <span class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center cursor-help" :title="comfortHints[tour.comfortLevel]">?</span>
          </div>
          <div class="text-sm font-semibold text-gray-900 mb-1">{{ comfortLabels[tour.comfortLevel] }}</div>
          <div class="flex gap-1">
            <span
              v-for="i in 5"
              :key="i"
              class="w-2.5 h-2.5 rounded-full"
              :class="i <= comfortLevel[tour.comfortLevel] ? 'bg-emerald-500' : 'bg-gray-300'"
            />
          </div>
          <a href="#accommodation" class="text-emerald-500 text-xs font-medium hover:underline mt-1 inline-block">К проживанию</a>
        </div>

        <!-- Group -->
        <div v-if="tour.groupSizeMin || tour.groupSizeMax">
          <div class="text-sm text-gray-500 mb-1.5">Группа:</div>
          <div class="text-sm font-semibold text-gray-900">
            {{ groupSizeLabel }}<template v-if="tour.minAge">,<br>от {{ tour.minAge }} лет</template>
          </div>
        </div>

        <!-- Optional extension (if exists) -->
        <div v-if="tour.extensionInfo" class="border border-emerald-200 bg-emerald-50 rounded-xl p-3">
          <div class="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
            Опциональное продолжение:
            <span class="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">!</span>
          </div>
          <div class="text-sm font-bold text-gray-900">{{ tour.extensionInfo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '~/types/tour'

const props = defineProps<{
  tour: Tour
}>()

// Difficulty
const difficultyLabels: Record<string, string> = {
  easy: 'Легкий',
  medium: 'Средний',
  hard: 'Сложный',
  extreme: 'Экстремальный',
}

const difficultyLevel: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  extreme: 5,
}

const difficultyHints: Record<string, string> = {
  easy: 'Подходит для всех возрастов, минимальные физические нагрузки',
  medium: 'Умеренные пешие прогулки, базовая физическая подготовка',
  hard: 'Длительные пешие маршруты, требуется хорошая физическая форма',
  extreme: 'Экстремальные условия, требуется специальная подготовка',
}

// Comfort
const comfortLabels: Record<string, string> = {
  basic: 'Базовый',
  standard: 'Стандарт',
  comfort: 'Оптимальный',
  luxury: 'Люкс',
}

const comfortLevel: Record<string, number> = {
  basic: 1,
  standard: 2,
  comfort: 3,
  luxury: 5,
}

const comfortHints: Record<string, string> = {
  basic: 'Хостелы и базовые гостиницы',
  standard: 'Хорошие 3* отели',
  comfort: '4* отели, удобный транспорт',
  luxury: '5* отели, VIP сервис',
}

// Group size
const groupSizeLabel = computed(() => {
  const min = props.tour.groupSizeMin
  const max = props.tour.groupSizeMax
  if (min && max) return `${min}–${max} человек`
  if (min) return `от ${min} человек`
  if (max) return `до ${max} человек`
  return ''
})

// Pluralization
function pluralizeDays(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'дней'
  if (mod10 === 1) return 'день'
  if (mod10 >= 2 && mod10 <= 4) return 'дня'
  return 'дней'
}
</script>
