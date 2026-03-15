<template>
  <section id="program" class="py-8 md:py-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
      Подробный маршрут
    </h2>

    <div class="space-y-3">
      <div
        v-for="(day, index) in visibleDays"
        :key="day.id || index"
        class="bg-white rounded-xl border border-gray-100 overflow-hidden"
        :class="expandedDays.has(index) ? 'shadow-sm' : ''"
      >
        <!-- Day header (always visible) -->
        <button
          @click="toggleDay(index)"
          class="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <!-- Day label -->
          <div class="flex-shrink-0 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
            День {{ day.day }}
          </div>

          <!-- Title -->
          <h3 class="flex-grow text-base font-semibold text-gray-900">
            {{ day.title }}
          </h3>

          <!-- Toggle icon -->
          <svg
            class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0"
            :class="{ 'rotate-180': expandedDays.has(index) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Day content (expandable) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[2000px] opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="max-h-[2000px] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-show="expandedDays.has(index)" class="overflow-hidden">
            <div class="px-4 md:px-5 pb-5 pt-1">
              <!-- Content with HTML rendering for rich text -->
              <div
                class="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed"
                v-html="formatContent(day.content)"
              />

              <!-- Day images if any -->
              <div v-if="getDayImages(day).length" class="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                <NuxtImg
                  v-for="(imgUrl, imgIdx) in getDayImages(day)"
                  :key="imgIdx"
                  :src="imgUrl"
                  :alt="`${day.title} - фото ${imgIdx + 1}`"
                  class="aspect-[4/3] w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Show more button -->
    <div v-if="program.length > initialVisibleCount && !showAll" class="mt-6 text-center">
      <button
        @click="showAll = true"
        class="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors text-sm"
      >
        Показать все дни программы
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TourProgramDay } from '~/types/tour'

const props = defineProps<{
  program: TourProgramDay[]
}>()

const initialVisibleCount = 5
const showAll = ref(false)
const expandedDays = ref(new Set<number>([0])) // Первый день раскрыт по умолчанию

const visibleDays = computed(() => {
  if (showAll.value) return props.program
  return props.program.slice(0, initialVisibleCount)
})

function toggleDay(index: number) {
  if (expandedDays.value.has(index)) {
    expandedDays.value.delete(index)
  } else {
    expandedDays.value.add(index)
  }
  expandedDays.value = new Set(expandedDays.value)
}

// Получение изображений дня
function getDayImages(day: TourProgramDay): string[] {
  if (!day.images?.length) return []
  return day.images.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
}

// Форматирование контента (поддержка **bold** и переносов)
function formatContent(content: string): string {
  if (!content) return ''

  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  formatted = formatted.replace(/\n\n/g, '</p><p>')
  formatted = formatted.replace(/\n/g, '<br>')

  if (!formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`
  }

  return formatted
}
</script>

<style scoped>
.prose :deep(strong) {
  @apply text-gray-900 font-semibold;
}

.prose :deep(p) {
  @apply mb-3 last:mb-0;
}

.prose :deep(ul) {
  @apply list-disc list-inside mb-3 space-y-1;
}

.prose :deep(li) {
  @apply text-gray-600;
}
</style>
