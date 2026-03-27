import { eq, sql } from 'drizzle-orm'
import { tourMedia } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAdminAccess(event)
  const db = useDB()
  const tourId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!tourId || !body.mediaId) {
    throw createError({ statusCode: 400, message: 'tourId and mediaId required' })
  }

  // Get max position
  const [maxPos] = await db
    .select({ max: sql<number>`COALESCE(MAX(${tourMedia.position}), 0)` })
    .from(tourMedia)
    .where(eq(tourMedia.tourId, tourId))

  const nextPosition = (maxPos?.max || 0) + 1

  const [inserted] = await db
    .insert(tourMedia)
    .values({
      tourId,
      mediaId: body.mediaId,
      position: nextPosition,
      isCover: body.isCover || false,
    })
    .returning()

  return inserted
})
