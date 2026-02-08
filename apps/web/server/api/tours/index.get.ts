import { db } from '~/server/utils/db'
import { tours, departures, destinations } from '@planmydream/database/schema'
import { eq, and, ne, desc, asc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  const limit = parseInt(query.limit as string) || 10
  const exclude = query.exclude as string | undefined
  const status = query.status as string || 'published'
  const destinationSlug = query.destination as string | undefined

  // Build conditions
  const conditions = [eq(tours.status, status)]
  
  if (exclude) {
    conditions.push(ne(tours.id, exclude))
  }

  // Base query
  let toursQuery = db
    .select({
      id: tours.id,
      slug: tours.slug,
      title: tours.title,
      subtitle: tours.subtitle,
      tagline: tours.tagline,
      priceFrom: tours.priceFrom,
      currency: tours.currency,
      durationDays: tours.durationDays,
      route: tours.route,
      difficulty: tours.difficulty,
      discountPercent: tours.discountPercent,
      isFeatured: tours.isFeatured,
      destination: {
        id: destinations.id,
        slug: destinations.slug,
        name: destinations.name,
      },
    })
    .from(tours)
    .leftJoin(destinations, eq(tours.destinationId, destinations.id))
    .where(and(...conditions))
    .orderBy(desc(tours.isFeatured), asc(tours.position))
    .limit(limit)

  const result = await toursQuery

  // Get departures for each tour
  const toursWithDepartures = await Promise.all(
    result.map(async (tour) => {
      const tourDepartures = await db
        .select({
          id: departures.id,
          startDate: departures.startDate,
          endDate: departures.endDate,
          price: departures.price,
          spotsTotal: departures.spotsTotal,
          spotsBooked: departures.spotsBooked,
          status: departures.status,
        })
        .from(departures)
        .where(
          and(
            eq(departures.tourId, tour.id),
            eq(departures.status, 'active')
          )
        )
        .orderBy(asc(departures.startDate))

      // Calculate spots left
      const departuresWithSpotsLeft = tourDepartures.map(d => ({
        ...d,
        spotsLeft: (d.spotsTotal || 0) - (d.spotsBooked || 0),
      }))

      return {
        ...tour,
        departures: departuresWithSpotsLeft,
        // Next available departure
        nextDeparture: departuresWithSpotsLeft.find(d => 
          new Date(d.startDate) > new Date() && d.spotsLeft > 0
        ),
      }
    })
  )

  return toursWithDepartures
})
