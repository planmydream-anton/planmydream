<template>
  <div>
    <!-- Hero Section — Full-screen with tour slider -->
    <section class="relative min-h-screen flex items-end bg-gray-900">
      <!-- Background images carousel -->
      <div class="absolute inset-0 z-0">
        <Transition
          v-for="(tour, i) in heroTours"
          :key="tour.id"
          enter-active-class="transition-opacity duration-1000"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-1000"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <NuxtImg
            v-show="activeHeroIndex === i"
            :src="tour.coverImage?.url"
            :alt="tour.title"
            class="absolute inset-0 w-full h-full object-cover"
            sizes="100vw"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : 'low'"
            :placeholder="[30, 20, 10]"
          />
        </Transition>
        <!-- Gradient overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div class="container mx-auto px-4 relative z-10 pb-20 pt-32">
        <div class="max-w-4xl">
          <!-- Tagline -->
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span class="text-white/90 text-sm font-medium">Авторские путешествия по миру</span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Путешествия, <br>
            <span class="text-emerald-400">которые меняют жизнь</span>
          </h1>

          <p class="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
            Авторские туры в Китай, Вьетнам, Корею и другие страны Азии.
            Небольшие группы, проверенные маршруты, незабываемые впечатления.
          </p>

          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="#tours"
              class="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Выбрать тур
            </NuxtLink>
            <button
              @click="openInquiryModal"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full text-lg font-medium transition-all"
            >
              Заказать звонок
            </button>
          </div>
        </div>

        <!-- Hero tour selector dots -->
        <div v-if="heroTours?.length > 1" class="flex gap-2 mt-12">
          <button
            v-for="(tour, i) in heroTours"
            :key="tour.id"
            @click="activeHeroIndex = i"
            class="group flex items-center gap-2 transition-all"
          >
            <div
              class="h-1 rounded-full transition-all duration-500"
              :class="activeHeroIndex === i ? 'w-12 bg-emerald-400' : 'w-6 bg-white/30 group-hover:bg-white/50'"
            />
          </button>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Featured Tours -->
    <section id="tours" class="py-16 md:py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Ближайшие туры
            </h2>
            <p class="text-gray-500 text-lg">
              Выберите свое следующее приключение
            </p>
          </div>
          <NuxtLink
            to="/tours"
            class="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors self-start md:self-auto"
          >
            Все туры
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <div v-if="tours?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TourCard
            v-for="tour in tours"
            :key="tour.id"
            :tour="tour"
          />
        </div>

        <div v-else class="text-center py-12 text-gray-400">
          Загрузка туров...
        </div>
      </div>
    </section>

    <!-- Why Us — Advantages -->
    <SectionsAdvantagesSection />

    <!-- Stats Counter Section -->
    <section class="py-16 md:py-20 bg-gray-900 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div class="container mx-auto px-4 relative z-10">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">
              {{ stat.value }}
            </div>
            <div class="text-white/60 text-sm md:text-base">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Photo Gallery -->
    <section v-if="galleryPhotos?.length" class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Фотоотчеты из путешествий
          </h2>
          <p class="text-gray-500 text-lg">
            Живые моменты из наших туров
          </p>
        </div>

        <!-- Masonry-style gallery grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            v-for="(photo, i) in galleryPhotos"
            :key="photo.id"
            class="relative group overflow-hidden rounded-xl cursor-pointer"
            :class="[
              i === 0 ? 'md:col-span-2 md:row-span-2' : '',
              i === 5 ? 'md:col-span-2' : '',
            ]"
            @click="openLightbox(i)"
          >
            <div :class="i === 0 ? 'aspect-square' : 'aspect-[4/3]'">
              <NuxtImg
                :src="photo.url"
                :alt="photo.altText || photo.caption || 'Фото из путешествия'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        </div>

        <div class="text-center mt-8">
          <NuxtLink
            to="/memories"
            class="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Все фотоотчеты
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          @click.self="lightboxOpen = false"
        >
          <button
            class="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10"
            @click="lightboxOpen = false"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            class="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2"
            @click="lightboxIndex = (lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <NuxtImg
            :src="galleryPhotos[lightboxIndex]?.url"
            :alt="galleryPhotos[lightboxIndex]?.altText || ''"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            sizes="90vw"
            quality="85"
          />
          <button
            class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2"
            @click="lightboxIndex = (lightboxIndex + 1) % galleryPhotos.length"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- How to Book -->
    <SectionsHowToBookSection />

    <!-- About Section -->
    <section id="about" class="py-16 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <div class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              О нас
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Почему путешествуют с нами
            </h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
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

            <!-- Mini features -->
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span class="text-sm text-gray-700 font-medium">Группы 8-16 человек</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <span class="text-sm text-gray-700 font-medium">Русскоязычные гиды</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span class="text-sm text-gray-700 font-medium">Проверенные маршруты</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span class="text-sm text-gray-700 font-medium">Лучшие фото-споты</span>
              </div>
            </div>
          </div>

          <!-- Photo collage -->
          <div v-if="aboutPhotos?.length" class="relative">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-3">
                <div class="rounded-2xl overflow-hidden aspect-[3/4]">
                  <NuxtImg
                    v-if="aboutPhotos[0]"
                    :src="aboutPhotos[0].url"
                    alt="Фото из путешествия"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div class="rounded-2xl overflow-hidden aspect-square">
                  <NuxtImg
                    v-if="aboutPhotos[1]"
                    :src="aboutPhotos[1].url"
                    alt="Фото из путешествия"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="space-y-3 pt-8">
                <div class="rounded-2xl overflow-hidden aspect-square">
                  <NuxtImg
                    v-if="aboutPhotos[2]"
                    :src="aboutPhotos[2].url"
                    alt="Фото из путешествия"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div class="rounded-2xl overflow-hidden aspect-[3/4]">
                  <NuxtImg
                    v-if="aboutPhotos[3]"
                    :src="aboutPhotos[3].url"
                    alt="Фото из путешествия"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <!-- Floating badge -->
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-3 flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-900">98%</div>
                <div class="text-xs text-gray-500">положительных отзывов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <SectionsTeamSection />

    <!-- Yandex Reviews -->
    <SectionsYandexReviews />

    <!-- FAQ -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Часто задаваемые вопросы
          </h2>
          <p class="text-gray-500 text-lg">
            Ответы на популярные вопросы о наших турах
          </p>
        </div>
        <SectionsFaqSection />
      </div>
    </section>

    <!-- Contact CTA Section -->
    <SectionsContactFormSection />
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

// Fetch published tours
const { data: tours } = await useFetch('/api/tours', {
  query: {
    status: 'published',
    limit: 6,
  },
})

// Gallery photos for photo section
const { data: galleryPhotos } = await useFetch('/api/gallery', {
  query: { limit: 10 },
})

// Separate set for about section collage
const { data: aboutPhotos } = await useFetch('/api/gallery', {
  query: { limit: 4 },
  key: 'about-photos',
})

// Hero carousel from tours with cover images
const heroTours = computed(() => {
  if (!tours.value) return []
  return tours.value.filter((t: any) => t.coverImage?.url).slice(0, 4)
})

// Auto-rotate hero
const activeHeroIndex = ref(0)
let heroInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  heroInterval = setInterval(() => {
    if (heroTours.value.length > 1) {
      activeHeroIndex.value = (activeHeroIndex.value + 1) % heroTours.value.length
    }
  }, 6000)
})

onUnmounted(() => {
  if (heroInterval) clearInterval(heroInterval)
})

// Stats
const stats = [
  { value: '50+', label: 'стран посетили' },
  { value: '500+', label: 'довольных путешественников' },
  { value: '7', label: 'лет организуем туры' },
  { value: '24/7', label: 'поддержка в поездке' },
]

// Lightbox
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

// Inquiry modal
const { openModal } = useInquiryModal()

function openInquiryModal() {
  openModal()
}
</script>
