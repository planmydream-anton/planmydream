<template>
  <section id="program" class="py-16 md:py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        Подробный маршрут
      </h2>

      <div class="max-w-4xl mx-auto">
        <!-- Days list -->
        <div class="space-y-4">
          <div
            v-for="(day, index) in visibleDays"
            :key="day.id || index"
            class="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <!-- Day header (always visible) -->
            <button
              @click="toggleDay(index)"
              class="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <!-- Day number -->
              <div class="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold">{{ day.day }}</span>
              </div>

              <!-- Title -->
              <div class="flex-grow">
                <div class="text-sm text-orange-500 font-medium mb-1">
                  День {{ day.day }}
                </div>
                <h3 class="text-lg font-bold text-gray-900">
                  {{ day.title }}
                </h3>
              </div>

              <!-- Toggle icon -->
              <div class="flex-shrink-0">
                <svg 
                  class="w-6 h-6 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': expandedDays.has(index) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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
                <div class="px-5 md:px-6 pb-6 pt-2">
                  <div class="pl-16">
                    <!-- Content with HTML rendering for rich text -->
                    <div 
                      class="prose prose-gray max-w-none text-gray-600 leading-relaxed"
                      v-html="formatContent(day.content)"
                    />
                    
                    <!-- Day images if any -->
                    <div v-if="day.images?.length" class="mt-4 flex gap-2 overflow-x-auto">
                      <NuxtImg
                        v-for="img in day.images"
                        :key="img.id"
                        :src="img.url"
                        :alt="img.altText || day.title"
                        class="h-24 w-auto rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Show more button -->
        <div v-if="program.length > initialVisibleCount && !showAll" class="mt-8 text-center">
          <button
            @click="showAll = true"
            class="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Показать все дни программы
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
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
  // Trigger reactivity
  expandedDays.value = new Set(expandedDays.value)
}

// Форматирование контента (поддержка markdown-like форматирования)
function formatContent(content: string): string {
  if (!content) return ''
  
  // Заменяем **text** на <strong>text</strong>
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Заменяем переносы строк на <br>
  formatted = formatted.replace(/\n\n/g, '</p><p>')
  formatted = formatted.replace(/\n/g, '<br>')
  
  // Оборачиваем в параграф
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
  @apply mb-4 last:mb-0;
}

.prose :deep(ul) {
  @apply list-disc list-inside mb-4 space-y-1;
}

.prose :deep(li) {
  @apply text-gray-600;
}
</style>
