import { eq, ne, and, asc, gte } from 'drizzle-orm'
import { db } from '~/server/utils/db'
import { tours, departures, destinations, tourMedia, media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tourId = query.tourId as string

  if (!tourId) {
    throw createError({ statusCode: 400, statusMessage: 'tourId is required' })
  }

  // Получаем текущий тур для фильтрации
  const [currentTour] = await db
    .select({ destinationId: tours.destinationId, id: tours.id })
    .from(tours)
    .where(eq(tours.id, tourId))
    .limit(1)

  if (!currentTour) {
    return []
  }

  // Ищем похожие туры: тот же destination, published, не текущий
  const conditions = [
    eq(tours.status, 'published'),
    ne(tours.id, tourId),
  ]

  if (currentTour.destinationId) {
    conditions.push(eq(tours.destinationId, currentTour.destinationId))
  }

  const similarTours = await db
    .select()
    .from(tours)
    .leftJoin(destinations, eq(tours.destinationId, destinations.id))
    .where(and(...conditions))
    .limit(3)

  // Получаем обложки и ближайшие departure для каждого тура
  const result = await Promise.all(
    similarTours.map(async (t) => {
      const tourData = t.tours

      // Обложка
      const [cover] = await db
        .select({ url: media.url, altText: media.altText })
        .from(tourMedia)
        .innerJoin(media, eq(tourMedia.mediaId, media.id))
        .where(and(eq(tourMedia.tourId, tourData.id), eq(tourMedia.isCover, true)))
        .limit(1)

      // Ближайший departure
      const [nextDeparture] = await db
        .select()
        .from(departures)
        .where(and(
          eq(departures.tourId, tourData.id),
          eq(departures.status, 'active'),
          gte(departures.startDate, new Date().toISOString().split('T')[0]),
        ))
        .orderBy(asc(departures.startDate))
        .limit(1)

      return {
        id: tourData.id,
        slug: tourData.slug,
        title: tourData.title,
        subtitle: tourData.subtitle,
        priceFrom: tourData.priceFrom,
        currency: tourData.currency,
        durationDays: tourData.durationDays,
        difficulty: tourData.difficulty,
        discountPercent: tourData.discountPercent,
        coverImageUrl: cover?.url,
        destination: t.destinations ? {
          name: t.destinations.name,
          country: t.destinations.country,
        } : undefined,
        nextDeparture: nextDeparture ? {
          startDate: nextDeparture.startDate,
          price: nextDeparture.price,
          spotsLeft: (nextDeparture.spotsTotal || 0) - (nextDeparture.spotsBooked || 0),
        } : undefined,
      }
    })
  )

  return result
})
