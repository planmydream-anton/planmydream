<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center bg-zinc-900">
      <div class="absolute inset-0 z-0">
        <NuxtImg
          src="/images/hero-bg.jpg"
          alt="Путешествие мечты"
          class="w-full h-full object-cover opacity-40"
          sizes="100vw"
          loading="eager"
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
      </div>

      <div class="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Путешествия, <br>
            <span class="text-orange-500">которые меняют жизнь</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl">
            Авторские туры в Китай, Вьетнам, Корею и другие страны. 
            Небольшие группы, проверенные маршруты, незабываемые впечатления.
          </p>
          
          <div class="flex flex-wrap gap-4">
            <NuxtLink 
              to="/tours" 
              class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors"
            >
              Выбрать тур
            </NuxtLink>
            <a 
              href="#about" 
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors"
            >
              Узнать о нас
            </a>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Featured Tours -->
    <section class="py-20 bg-zinc-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Ближайшие туры
          </h2>
          <p class="text-xl text-zinc-600 max-w-2xl mx-auto">
            Выберите свое следующее приключение
          </p>
        </div>

        <div v-if="tours?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TourCard 
            v-for="tour in tours" 
            :key="tour.id" 
            :tour="tour" 
          />
        </div>
        
        <div v-else class="text-center py-12 text-zinc-500">
          Загрузка туров...
        </div>

        <div class="text-center mt-12">
          <NuxtLink 
            to="/tours" 
            class="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            Все туры
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Advantages -->
    <AdvantagesSection />

    <!-- About section -->
    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
              Почему путешествуют с нами
            </h2>
            <div class="space-y-4 text-zinc-600">
              <p>
                Мы организуем авторские туры для тех, кто хочет увидеть мир 
                по-настоящему — не из окна туристического автобуса, а изнутри, 
                погружаясь в культуру и природу каждого места.
              </p>
              <p>
                Наши маршруты — это результат многолетнего опыта путешествий и 
                сотен часов подготовки. Мы сами проходим каждую тропу, проверяем 
                каждый отель и выбираем только лучшие точки для фотографий.
              </p>
              <p>
                Небольшие группы (8-16 человек) позволяют сохранить атмосферу 
                настоящего путешествия, а не массового туризма.
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div class="bg-orange-50 rounded-2xl p-6 text-center">
                <div class="text-4xl font-bold text-orange-500 mb-2">50+</div>
                <div class="text-zinc-600">стран посетили</div>
              </div>
              <div class="bg-zinc-100 rounded-2xl p-6 text-center">
                <div class="text-4xl font-bold text-zinc-900 mb-2">500+</div>
                <div class="text-zinc-600">довольных путешественников</div>
              </div>
            </div>
            <div class="space-y-4 mt-8">
              <div class="bg-zinc-100 rounded-2xl p-6 text-center">
                <div class="text-4xl font-bold text-zinc-900 mb-2">7</div>
                <div class="text-zinc-600">лет организуем туры</div>
              </div>
              <div class="bg-orange-50 rounded-2xl p-6 text-center">
                <div class="text-4xl font-bold text-orange-500 mb-2">98%</div>
                <div class="text-zinc-600">положительных отзывов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <TeamSection />

    <!-- Reviews -->
    <section class="py-20 bg-zinc-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Отзывы путешественников
          </h2>
          <p class="text-xl text-zinc-600 max-w-2xl mx-auto">
            Что говорят те, кто уже отправился с нами
          </p>
        </div>
        
        <ReviewsSlider />
      </div>
    </section>

    <!-- FAQ -->
    <FaqSection />

    <!-- CTA -->
    <section class="py-20 bg-zinc-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Готовы к приключению?
        </h2>
        <p class="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
          Оставьте заявку, и мы поможем выбрать идеальный тур для вас
        </p>
        <button 
          @click="openInquiryModal"
          class="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl text-lg font-medium transition-colors"
        >
          Оставить заявку
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Plan My Dream — Авторские туры в Китай, Вьетнам, Корею',
  description: 'Авторские туры в Китай, Вьетнам, Корею и другие страны. Небольшие группы, проверенные маршруты, русскоязычные гиды. Забронируйте путешествие мечты!',
  ogTitle: 'Plan My Dream — Авторские туры',
  ogDescription: 'Путешествия, которые меняют жизнь. Авторские туры в Азию с небольшими группами.',
})

// Загружаем featured туры
const { data: tours } = await useFetch('/api/tours', {
  query: { 
    status: 'published',
    limit: 6,
    featured: true,
  },
})

// Модалка заявки
const { openModal } = useInquiryModal()

function openInquiryModal() {
  openModal()
}
</script>
