<template>
  <div class="pt-20">
    <!-- Hero -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <div class="text-emerald-600 font-medium text-sm uppercase tracking-wider mb-3">О компании</div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Plan My Dream
          </h1>
          <p class="text-xl text-gray-600 leading-relaxed">
            Маркетплейс авторских туров. Мы собрали лучших организаторов путешествий на одной платформе,
            чтобы вы могли выбрать идеальный тур и отправиться в путешествие мечты.
          </p>
        </div>
      </div>
    </section>

    <!-- Photo grid -->
    <section v-if="photos?.length" class="pb-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="(photo, i) in photos.slice(0, 4)"
            :key="photo.id"
            class="rounded-2xl overflow-hidden"
            :class="i === 0 ? 'aspect-[4/3]' : 'aspect-square'"
          >
            <NuxtImg
              :src="photo.url"
              :alt="photo.altText || 'Plan My Dream'"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- How we work — Marketplace model -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Как мы работаем</h2>
          <p class="text-lg text-gray-600">
            Plan My Dream — это маркетплейс авторских туров. Мы не просто турагентство,
            а платформа, которая соединяет путешественников напрямую с проверенными организаторами туров.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Находим лучших</h3>
            <p class="text-gray-600 leading-relaxed">
              Мы тщательно отбираем организаторов туров. Проверяем документы, опыт, отзывы клиентов
              и лично знакомимся с каждым автором перед размещением на платформе.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Гарантируем качество</h3>
            <p class="text-gray-600 leading-relaxed">
              Каждый тур проходит модерацию. Мы следим за тем, чтобы описание соответствовало
              реальности, а условия были прозрачными и честными для путешественников.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Работаем напрямую</h3>
            <p class="text-gray-600 leading-relaxed">
              Никаких посредников. Вы общаетесь и договариваетесь напрямую с организатором тура,
              а мы помогаем на каждом этапе — от выбора до возвращения домой.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Safety section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Безопасность
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">С нами безопасно</h2>
          <p class="text-lg text-gray-600">
            Мы берём на себя ответственность за качество каждого тура на нашей платформе
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div v-for="item in safetyItems" :key="item.title" class="text-center">
            <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <component :is="item.icon" class="w-8 h-8 text-emerald-500" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-16 md:py-20 bg-emerald-50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Наша миссия</h2>
          <p class="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
            Вдохновить людей на настоящие и насыщенные путешествия, сделав авторские туры
            доступными и безопасными для каждого.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div>
              <div class="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">50+</div>
              <div class="text-sm text-gray-600">стран</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">500+</div>
              <div class="text-sm text-gray-600">путешественников</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">7</div>
              <div class="text-sm text-gray-600">лет опыта</div>
            </div>
            <div>
              <div class="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">98%</div>
              <div class="text-sm text-gray-600">довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <SectionsTeamSection />

    <!-- Contacts & Requisites -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Контакты и реквизиты</h2>

        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Contact info -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Свяжитесь с нами</h3>
            <div class="space-y-4">
              <a href="tel:+79315530887" class="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium">+7 (931) 553-08-87</div>
                  <div class="text-sm text-gray-500">Основной</div>
                </div>
              </a>
              <a href="tel:+74951486416" class="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium">+7 (495) 148-64-16</div>
                  <div class="text-sm text-gray-500">Москва</div>
                </div>
              </a>
              <a href="mailto:info@planmydream.ru" class="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium">info@planmydream.ru</div>
                  <div class="text-sm text-gray-500">Электронная почта</div>
                </div>
              </a>
              <div class="flex items-center gap-3 text-gray-700">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium">414045, Россия, г. Астрахань</div>
                  <div class="text-sm text-gray-500">ул. Боевая, д. 25</div>
                </div>
              </div>

              <!-- Social links -->
              <div class="pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-500 mb-3">Мессенджеры и соцсети</div>
                <div class="flex gap-3">
                  <a href="https://wa.me/79857325804" target="_blank" class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors" aria-label="WhatsApp">
                    <svg class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a href="https://t.me/planmydream" target="_blank" class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors" aria-label="Telegram">
                    <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </a>
                  <a href="https://vk.com/planmydream" target="_blank" class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors" aria-label="ВКонтакте">
                    <svg class="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.71-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.558c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.491-.085.745-.576.745z"/>
                    </svg>
                  </a>
                  <a href="https://dzen.ru/planmydream" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors" aria-label="Дзен">
                    <svg class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-9.863-2.863c-.066-.066-.066-.066-.198-.066H12.21c-.066 0-.066 0-.198.066L8.137 12l3.875 2.863c.132.066.132.066.198.066h1.729c.132 0 .132 0 .198-.066L17.863 12l-3.726-2.863z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Legal info -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Юридическая информация</h3>
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-500 mb-1">Наименование</div>
                <div class="text-gray-900 font-medium">ИП Очеретяный Антон Николаевич</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">ИНН</div>
                <div class="text-gray-900 font-medium">164507864870</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">ОГРНИП</div>
                <div class="text-gray-900 font-medium">325300000036202</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">Юридический адрес</div>
                <div class="text-gray-900 font-medium">414045, Россия, г. Астрахань, ул. Боевая, д. 25</div>
              </div>
              <div class="pt-4 border-t border-gray-200">
                <div class="space-y-2">
                  <NuxtLink to="/privacy" class="block text-emerald-600 hover:text-emerald-700 text-sm transition-colors">
                    Политика обработки персональных данных
                  </NuxtLink>
                  <NuxtLink to="/conf-policy" class="block text-emerald-600 hover:text-emerald-700 text-sm transition-colors">
                    Политика конфиденциальности
                  </NuxtLink>
                  <NuxtLink to="/terms" class="block text-emerald-600 hover:text-emerald-700 text-sm transition-colors">
                    Публичная оферта
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <SectionsContactFormSection />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

useSeoMeta({
  title: 'О компании — Plan My Dream',
  description: 'Plan My Dream — маркетплейс авторских туров. Работаем напрямую с проверенными организаторами. ИП Очеретяный А.Н., ИНН 164507864870.',
  ogTitle: 'О компании Plan My Dream',
  ogDescription: 'Маркетплейс авторских туров. Проверенные организаторы, безопасные путешествия.',
})

// Photos for the gallery
const { data: photos } = await useFetch('/api/gallery', {
  query: { limit: 4 },
  key: 'about-page-photos',
})

// Safety items
const safetyItems = [
  {
    title: 'Проверяем организаторов',
    description: 'Верификация документов, проверка опыта и репутации каждого автора тура.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  },
  {
    title: 'Реальные отзывы',
    description: 'Собираем отзывы после каждого путешествия. Качество туров — наша главная задача.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' })
    ])
  },
  {
    title: 'Поддержка 24/7',
    description: 'Наша команда на связи до, во время и после путешествия. Всегда поможем.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' })
    ])
  },
  {
    title: 'Прозрачные условия',
    description: 'Договор, чёткая стоимость, понятные условия отмены. Без скрытых платежей.',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
    ])
  },
]
</script>
