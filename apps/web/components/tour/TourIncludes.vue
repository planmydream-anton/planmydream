<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        Что включено / не включено
      </h2>

      <div class="max-w-5xl mx-auto">
        <!-- Two columns: Included and Not Included -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Included -->
          <div class="bg-green-50 rounded-2xl p-6 md:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Что включено</h3>
            </div>

            <ul class="space-y-3">
              <li 
                v-for="item in includes" 
                :key="item.id"
                class="flex items-start gap-3"
              >
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700" v-html="formatText(item.text)" />
              </li>
            </ul>
          </div>

          <!-- Not Included -->
          <div class="bg-gray-100 rounded-2xl p-6 md:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Что не включено</h3>
            </div>

            <ul class="space-y-3">
              <li 
                v-for="item in notIncludes" 
                :key="item.id"
                class="flex items-start gap-3"
              >
                <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
                <span class="text-gray-700" v-html="formatText(item.text)" />
              </li>
            </ul>
          </div>
        </div>

        <!-- Payment Info -->
        <div v-if="paymentInfo" class="bg-orange-50 rounded-2xl p-6 md:p-8 mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Порядок оплаты</h3>
          </div>
          <div class="text-gray-700 leading-relaxed" v-html="formatText(paymentInfo)" />
        </div>

        <!-- Extra Services -->
        <div v-if="extras?.length" class="bg-blue-50 rounded-2xl p-6 md:p-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Дополнительные услуги</h3>
          </div>
          <ul class="space-y-3">
            <li v-for="extra in extras" :key="extra.id" class="text-gray-700">
              <strong>{{ extra.title }}</strong>
              <span v-if="extra.price"> — ${{ extra.price }}</span>
              <p v-if="extra.description" class="text-sm text-gray-600 mt-1">
                {{ extra.description }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TourIncludeItem, TourExtra } from '~/types/tour'

defineProps<{
  includes?: TourIncludeItem[]
  notIncludes?: TourIncludeItem[]
  paymentInfo?: string
  extras?: TourExtra[]
}>()

// Форматирование текста (поддержка **bold**)
function formatText(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}
</script>
