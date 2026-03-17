import { db } from '~/server/utils/db'
import { media, tourMedia } from '@planmydream/database/schema'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 12

  // Get random photos from all tour media
  const photos = await db
    .select({
      id: media.id,
      url: media.url,
      altText: media.altText,
      caption: media.caption,
    })
    .from(tourMedia)
    .innerJoin(media, eq(tourMedia.mediaId, media.id))
    .where(eq(media.type, 'image'))
    .orderBy(sql`RANDOM()`)
    .limit(limit)

  return photos
})
