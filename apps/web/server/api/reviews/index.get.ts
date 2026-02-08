import { db } from '~/server/utils/db'
import { reviews } from '@planmydream/database/schema'
import { eq, and, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tourId = query.tourId as string | undefined

  const conditions = [eq(reviews.status, 'approved')]
  
  if (tourId) {
    conditions.push(eq(reviews.tourId, tourId))
  }

  const result = await db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      authorPhotoUrl: reviews.authorPhotoUrl,
      text: reviews.text,
      rating: reviews.rating,
      travelDate: reviews.travelDate,
    })
    .from(reviews)
    .where(and(...conditions))
    .orderBy(desc(reviews.position), desc(reviews.createdAt))
    .limit(10)

  return result
})
