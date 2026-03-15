<template>
  <div v-if="tour">
    <!-- Mini Gallery (top) -->
    <TourMiniGallery
      v-if="tour.coverImage || tour.gallery?.length"
      :cover-image="tour.coverImage"
      :gallery="tour.gallery || []"
      @open-gallery="openGalleryAt"
    />

    <!-- Tour Info: Title + Characteristics -->
    <TourInfo :tour="tour" />

    <!-- Anchor Navigation -->
    <TourAnchors :sections="anchorSections" />

    <!-- Two-column layout: Content + Sticky Booking Sidebar -->
    <div class="container mx-auto px-4">
      <div class="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 xl:gap-12">
        <!-- Left: Main Content -->
        <div class="min-w-0">
          <!-- Description -->
          <TourDescription
            :tagline="tour.tagline"
            :description="tour.description"
          />

          <!-- Highlights -->
          <TourHighlights
            v-if="tour.highlights?.length"
            :highlights="tour.highlights"
          />

          <!-- Program -->
          <TourProgram
            v-if="tour.program?.length"
            :program="tour.program"
          />

          <!-- Organizer -->
          <TourOrganizer
            v-if="tour.organizer"
            :organizer="tour.organizer"
          />

          <!-- Accommodation -->
          <TourAccommodation
            v-if="tour.accommodations?.length || tour.accommodationInfo"
            :accommodations="tour.accommodations || []"
            :info-text="tour.accommodationInfo"
          />

          <!-- Includes / Not Includes -->
          <TourIncludes
            :includes="includedItems"
            :not-includes="excludedItems"
            :payment-info="tour.paymentTerms"
            :extras="additionalServicesItems"
          />

          <!-- Arrival Info -->
          <TourArrival
            v-if="tour.arrivalInfo"
            :content="tour.arrivalInfo"
          />

          <!-- FAQ (tour-specific) -->
          <SectionsFaqSection :tour-id="tour.id" />

          <!-- Reviews -->
          <SectionsReviewsSection :tour-id="tour.id" />

          <!-- Gallery (full, below content) -->
          <TourGallery
            v-if="tour.gallery?.length"
            :images="tour.gallery"
          />
        </div>

        <!-- Right: Sticky Booking Sidebar (desktop only) -->
        <TourBookingSidebar
          :tour="tour"
          :departures="tour.departures"
        />
      </div>
    </div>

    <!-- Full-width sections below the two-column layout -->

    <!-- Similar Tours -->
    <TourSimilar :tour-id="tour.id" />

    <!-- Advantages -->
    <SectionsAdvantagesSection />

    <!-- How to Book -->
    <SectionsHowToBookSection />

    <!-- Contact Form -->
    <SectionsContactFormSection />

    <!-- Full gallery lightbox -->
    <TourGalleryLightbox
      v-if="showLightbox && allImages.length"
      :images="allImages"
      :start-index="lightboxIndex"
      @close="showLightbox = false"
    />
  </div>

  <!-- Loading -->
  <div v-else-if="pending" class="min-h-screen flex items-center justify-center">
    <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>

  <!-- Error -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Тур не найден</h1>
      <p class="text-gray-600 mb-6">К сожалению, такого тура не существует</p>
      <NuxtLink to="/tours" class="text-orange-500 hover:text-orange-600">
        &larr; Все туры
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour, TourIncludeItem } from '~/types/tour'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: tour, pending, error } = await useFetch<Tour>(`/api/tours/${slug.value}`)

// Gallery lightbox state
const showLightbox = ref(false)
const lightboxIndex = ref(0)

const allImages = computed(() => {
  const images = []
  if (tour.value?.coverImage) images.push(tour.value.coverImage)
  if (tour.value?.gallery) images.push(...tour.value.gallery)
  return images
})

function openGalleryAt(index: number) {
  lightboxIndex.value = index
  showLightbox.value = true
}

// Anchor sections
const anchorSections = computed(() => {
  const sections = []
  if (tour.value?.program?.length) sections.push({ id: 'program', label: 'Маршрут' })
  if (tour.value?.accommodations?.length || tour.value?.accommodationInfo) sections.push({ id: 'accommodation', label: 'Размещение' })
  sections.push({ id: 'includes', label: 'Включено' })
  if (tour.value?.arrivalInfo) sections.push({ id: 'arrival', label: 'Как добраться' })
  sections.push({ id: 'faq', label: 'FAQ' })
  sections.push({ id: 'reviews', label: 'Отзывы' })
  return sections
})

// Format includes/excludes for component
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
  return tour.value.excludes.map((item: any, index: number) => ({
    id: `exc-${index}`,
    text: typeof item === 'string' ? item : item.text || '',
    category: typeof item === 'string' ? 'other' : (item.category || 'other'),
  }))
})

const additionalServicesItems = computed(() => {
  if (!tour.value?.additionalServices) return []
  return []
})

// SEO
useSeoMeta({
  title: () => tour.value?.seoTitle || tour.value?.title || 'Тур',
  description: () => tour.value?.seoDescription || tour.value?.subtitle,
  ogTitle: () => tour.value?.seoTitle || tour.value?.title,
  ogDescription: () => tour.value?.seoDescription || tour.value?.subtitle,
  ogImage: () => tour.value?.coverImage?.url || tour.value?.ogImageUrl,
  ogType: 'website',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => tour.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.value.title,
        description: tour.value.subtitle,
        image: tour.value.coverImage?.url || tour.value.ogImageUrl,
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
          priceCurrency: tour.value!.currency || 'USD',
          availability: dep.spotsLeft > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
          validFrom: dep.startDate,
        })),
      }) : ''),
    },
  ],
})

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tour not found',
  })
}
</script>
