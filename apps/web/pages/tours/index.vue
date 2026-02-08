<template>
  <div class="min-h-screen bg-zinc-50">
    <!-- Hero -->
    <section class="bg-zinc-900 py-24">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Все туры
        </h1>
        <p class="text-xl text-white/70 max-w-2xl">
          Выберите свое следующее приключение из нашей коллекции авторских маршрутов
        </p>
      </div>
    </section>

    <!-- Filters & Tours -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-8">
          <button
            v-for="destination in destinations"
            :key="destination.id"
            @click="activeDestination = destination.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeDestination === destination.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            ]"
          >
            {{ destination.name }}
          </button>
          <button
            @click="activeDestination = null"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeDestination === null
                ? 'bg-orange-500 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-100'
            ]"
          >
            Все направления
          </button>
        </div>

        <!-- Tours Grid -->
        <div v-if="filteredTours.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TourCard 
            v-for="tour in filteredTours" 
            :key="tour.id" 
            :tour="tour" 
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-medium text-zinc-900 mb-2">
            Туры не найдены
          </h3>
          <p class="text-zinc-600">
            Попробуйте изменить фильтры или посмотрите все туры
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-zinc-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          Не нашли подходящий тур?
        </h2>
        <p class="text-lg text-white/70 mb-8 max-w-xl mx-auto">
          Свяжитесь с нами, и мы поможем подобрать идеальное путешествие
        </p>
        <button 
          @click="openInquiryModal"
          class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Связаться с нами
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '~/types/tour'

// SEO
useSeoMeta({
  title: 'Все туры — Plan My Dream',
  description: 'Каталог авторских туров в Китай, Вьетнам, Корею и другие страны. Выберите свое следующее приключение!',
})

// Загружаем туры
const { data: tours } = await useFetch<Tour[]>('/api/tours', {
  query: { status: 'published' },
})

// Загружаем направления
const { data: destinations } = await useFetch('/api/destinations', {
  query: { status: 'published' },
})

// Фильтр по направлению
const activeDestination = ref<string | null>(null)

const filteredTours = computed(() => {
  if (!tours.value) return []
  if (!activeDestination.value) return tours.value
  return tours.value.filter(t => t.destinationId === activeDestination.value)
})

// Модалка
const { openModal } = useInquiryModal()

function openInquiryModal() {
  openModal()
}
</script>
