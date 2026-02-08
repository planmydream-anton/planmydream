import { eq } from 'drizzle-orm'
import { db } from '~/server/utils/db'
import { tours, departures, destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  // Получаем тур по slug
  const [tour] = await db
    .select()
    .from(tours)
    .leftJoin(destinations, eq(tours.destinationId, destinations.id))
    .where(eq(tours.slug, slug))
    .limit(1)

  if (!tour?.tours) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tour not found',
    })
  }

  const tourData = tour.tours
  const destinationData = tour.destinations

  // Проверяем что тур опубликован (для публичного API)
  if (tourData.status !== 'published') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tour not found',
    })
  }

  // Получаем выезды
  const tourDepartures = await db
    .select()
    .from(departures)
    .where(eq(departures.tourId, tourData.id))
    .orderBy(departures.startDate)

  // Вычисляем оставшиеся места для каждого выезда
  const departuresWithSpots = tourDepartures
    .filter(dep => dep.status === 'active')
    .map(dep => ({
      id: dep.id,
      tourId: dep.tourId,
      startDate: dep.startDate,
      endDate: dep.endDate,
      price: dep.price,
      spotsTotal: dep.spotsTotal || 0,
      spotsBooked: dep.spotsBooked || 0,
      spotsLeft: (dep.spotsTotal || 0) - (dep.spotsBooked || 0),
      status: dep.status,
      notes: dep.notes,
    }))

  return {
    id: tourData.id,
    slug: tourData.slug,
    title: tourData.title,
    subtitle: tourData.subtitle,
    tagline: tourData.tagline,
    description: tourData.description,
    
    priceFrom: tourData.priceFrom,
    currency: tourData.currency || 'USD',
    durationDays: tourData.durationDays,
    difficulty: tourData.difficulty,
    groupSizeMin: tourData.groupSizeMin,
    groupSizeMax: tourData.groupSizeMax,
    route: tourData.route,
    discountPercent: tourData.discountPercent,
    isFeatured: tourData.isFeatured,
    
    // Контент из JSON полей
    highlights: tourData.highlights || [],
    program: tourData.program || [],
    includes: tourData.includes || [],
    excludes: tourData.excludes || [],
    
    // Дополнительная информация
    paymentTerms: tourData.paymentTerms,
    accommodationInfo: tourData.accommodationInfo,
    additionalServices: tourData.additionalServices,
    
    // SEO
    seoTitle: tourData.seoTitle,
    seoDescription: tourData.seoDescription,
    seoKeywords: tourData.seoKeywords,
    ogImageUrl: tourData.ogImageUrl,
    
    departures: departuresWithSpots,
    
    destination: destinationData ? {
      id: destinationData.id,
      slug: destinationData.slug,
      name: destinationData.name,
      country: destinationData.country,
    } : undefined,
    
    status: tourData.status,
    position: tourData.position,
    createdAt: tourData.createdAt,
    updatedAt: tourData.updatedAt,
    publishedAt: tourData.publishedAt,
  }
})
