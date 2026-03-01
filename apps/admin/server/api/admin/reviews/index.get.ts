import { eq, desc, and } from 'drizzle-orm'
import { reviews, tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const query = getQuery(event)
  const status = query.status as string | undefined

  const conditions = []
  if (status) conditions.push(eq(reviews.status, status))
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const items = await db.select({
    id: reviews.id, authorName: reviews.authorName, authorPhotoUrl: reviews.authorPhotoUrl,
    rating: reviews.rating, text: reviews.text, travelDate: reviews.travelDate,
    status: reviews.status, position: reviews.position, createdAt: reviews.createdAt,
    tourTitle: tours.title, tourId: reviews.tourId,
  }).from(reviews).leftJoin(tours, eq(reviews.tourId, tours.id)).where(where).orderBy(desc(reviews.createdAt))

  return { data: items }
})
