<template>
  <div v-if="tour">
    <!-- Hero Section -->
    <TourHero :tour="tour" />
    
    <!-- Highlights (Что нас ждет) -->
    <TourHighlights 
      v-if="tour.highlights?.length" 
      :highlights="tour.highlights" 
    />
    
    <!-- Program (Подробный маршрут) -->
    <TourProgram 
      v-if="tour.program?.length" 
      :program="tour.program" 
    />
    
    <!-- Includes / Not Includes -->
    <TourIncludes 
      :includes="includedItems" 
      :not-includes="excludedItems"
      :payment-info="tour.paymentTerms"
      :extras="additionalServicesItems"
    />
    
    <!-- CTA "Сомневаетесь?" -->
    <TourCTA />
    
    <!-- Booking Section with Price -->
    <TourBooking 
      :tour="tour"
      :departures="tour.departures"
    />
    
    <!-- Hotels -->
    <TourHotels 
      v-if="tour.accommodationInfo"
      :info="tour.accommodationInfo"
    />
    
    <!-- Reviews -->
    <SectionsReviewsSection :tour-id="tour.id" />
    
    <!-- Gallery -->
    <TourGallery 
      v-if="tour.gallery?.length"
      :images="tour.gallery"
    />
    
    <!-- Team -->
    <SectionsTeamSection />
    
    <!-- Advantages -->
    <SectionsAdvantagesSection />
    
    <!-- Other Tours -->
    <SectionsOtherToursSection :exclude-id="tour.id" />
    
    <!-- FAQ -->
    <SectionsFaqSection />
    
    <!-- How to Book -->
    <SectionsHowToBookSection />
    
    <!-- Final CTA Form -->
    <SectionsContactFormSection />
  </div>
  
  <!-- Loading state -->
  <div v-else-if="pending" class="min-h-screen flex items-center justify-center">
    <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
  
  <!-- Error state -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Тур не найден</h1>
      <p class="text-gray-600 mb-6">К сожалению, такого тура не существует</p>
      <NuxtLink to="/tours" class="text-orange-500 hover:text-orange-600">
        ← Все туры
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour, TourIncludeItem } from '~/types/tour'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Загружаем данные тура
const { data: tour, pending, error } = await useFetch<Tour>(`/api/tours/${slug.value}`)

// Преобразование includes в нужный формат для компонента
const includedItems = computed<TourIncludeItem[]>(() => {
  if (!tour.value?.includes) return []
  return tour.value.includes.map((item, index) => ({
    id: `inc-${index}`,
    text: item.text,
    category: item.category,
  }))
})

const excludedItems = computed<TourIncludeItem[]>(() => {
  if (!tour.value?.excludes) return []
  return tour.value.excludes.map((text, index) => ({
    id: `exc-${index}`,
    text,
    category: 'other',
  }))
})

const additionalServicesItems = computed(() => {
  // Если есть дополнительные услуги как текст, парсим
  if (!tour.value?.additionalServices) return []
  // Пока возвращаем пустой массив, можно расширить позже
  return []
})

// SEO
useSeoMeta({
  title: () => tour.value?.seoTitle || tour.value?.title || 'Тур',
  description: () => tour.value?.seoDescription || tour.value?.subtitle,
  ogTitle: () => tour.value?.seoTitle || tour.value?.title,
  ogDescription: () => tour.value?.seoDescription || tour.value?.subtitle,
  ogImage: () => tour.value?.ogImageUrl,
  ogType: 'website',
})

// Structured Data (Schema.org)
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => tour.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.value.title,
        description: tour.value.subtitle,
        image: tour.value.ogImageUrl,
        touristType: 'Adventure',
        itinerary: {
          '@type': 'ItemList',
          itemListElement: tour.value.program?.map((day, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: day.title,
            description: day.content,
          })),
        },
        offers: tour.value.departures?.map(dep => ({
          '@type': 'Offer',
          price: dep.price,
          priceCurrency: 'USD',
          availability: dep.spotsLeft > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/SoldOut',
          validFrom: dep.startDate,
        })),
      }) : ''),
    },
  ],
})

// 404 если тура нет
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tour not found',
  })
}
</script>
