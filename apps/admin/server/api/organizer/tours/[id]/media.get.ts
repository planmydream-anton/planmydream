import { eq, and, asc } from 'drizzle-orm'
import { tours, tourMedia, media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const tourId = getRouterParam(event, 'id')

  if (!tourId) {
    throw createError({ statusCode: 400, message: 'Tour ID required' })
  }

  // Verify ownership
  const [tour] = await db.select({ id: tours.id })
    .from(tours)
    .where(and(eq(tours.id, tourId), eq(tours.createdBy, auth.userId)))
    .limit(1)

  if (!tour) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  const items = await db.select({
    id: media.id,
    mediaId: media.id,
    tourMediaId: tourMedia.id,
    url: media.url,
    filename: media.filename,
    type: media.type,
    mimeType: media.mimeType,
    position: tourMedia.position,
    isCover: tourMedia.isCover,
  })
    .from(tourMedia)
    .innerJoin(media, eq(tourMedia.mediaId, media.id))
    .where(eq(tourMedia.tourId, tourId))
    .orderBy(asc(tourMedia.position))

  return items
})
