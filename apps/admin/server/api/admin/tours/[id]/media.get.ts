import { eq, asc } from 'drizzle-orm'
import { tourMedia, media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const tourId = getRouterParam(event, 'id')

  if (!tourId) {
    throw createError({ statusCode: 400, message: 'Tour ID required' })
  }

  const items = await db
    .select({
      id: media.id,
      mediaId: media.id,
      tourMediaId: tourMedia.id,
      url: media.url,
      filename: media.filename,
      type: media.type,
      mimeType: media.mimeType,
      width: media.width,
      height: media.height,
      altText: media.altText,
      caption: media.caption,
      position: tourMedia.position,
      isCover: tourMedia.isCover,
    })
    .from(tourMedia)
    .innerJoin(media, eq(tourMedia.mediaId, media.id))
    .where(eq(tourMedia.tourId, tourId))
    .orderBy(asc(tourMedia.position))

  return items
})
