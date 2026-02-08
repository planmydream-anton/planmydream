<template>
  <section class="py-16 md:py-24 bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        Как забронировать место в группе?
      </h2>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="relative"
        >
          <!-- Step card -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
            <!-- Step number -->
            <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-4">
              <span class="text-white font-bold">{{ index + 1 }}</span>
            </div>

            <!-- Icon -->
            <div class="mb-4">
              <component 
                :is="step.icon" 
                class="w-8 h-8 text-orange-400" 
              />
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold text-white mb-2">
              {{ step.title }}
            </h3>

            <!-- Description -->
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ step.description }}
            </p>
          </div>

          <!-- Connector arrow (not on last item) -->
          <div 
            v-if="index < steps.length - 1" 
            class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10"
          >
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'

const steps = [
  {
    title: 'Оставляете заявку',
    description: 'Заполняете форму на странице понравившегося тура и отправляете заявку.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' })
    ])
  },
  {
    title: 'Обсуждаем детали',
    description: 'Связываемся с вами в удобное время и удобным способом, отвечаем на любые вопросы.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
    ])
  },
  {
    title: 'Договор и предоплата',
    description: 'Заключаем договор. Вы вносите 20% — это гарантирует место в группе.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  },
  {
    title: 'Авиабилеты',
    description: 'Помогаем выбрать удобные рейсы и даем отмашку для покупки.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' })
    ])
  },
  {
    title: 'Чат участников',
    description: 'Добавляем вас в чат группы. Там знакомимся, делимся памятками и предвкушаем поездку :)',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
    ])
  },
  {
    title: 'Путешествие мечты! ✨',
    description: 'От и до спланированная поездка с сопровождением русскоговорящего гида 24/7',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' })
    ])
  },
]
</script>
