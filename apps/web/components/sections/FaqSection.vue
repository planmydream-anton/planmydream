<template>
  <section id="faq" class="py-8 md:py-10">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Часто задаваемые вопросы (FAQ)
      </h2>

      <div v-if="faqs?.length" class="max-w-3xl mx-auto space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
          :key="faq.id"
          class="bg-gray-50 rounded-xl overflow-hidden"
        >
          <!-- Question (clickable header) -->
          <button
            @click="toggle(index)"
            class="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-100 transition-colors"
          >
            <span class="font-semibold text-gray-900">
              {{ faq.question }}
            </span>
            <svg 
              class="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': expanded.has(index) }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Answer (expandable) -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-show="expanded.has(index)" class="overflow-hidden">
              <div class="px-5 pb-5 pt-0">
                <p class="text-gray-600 leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="pending" class="text-center text-gray-500">
        Загрузка...
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
}

const { data: faqs, pending } = await useFetch<FAQ[]>('/api/faqs')

const expanded = ref(new Set<number>())

function toggle(index: number) {
  if (expanded.value.has(index)) {
    expanded.value.delete(index)
  } else {
    expanded.value.add(index)
  }
  // Trigger reactivity
  expanded.value = new Set(expanded.value)
}
</script>
