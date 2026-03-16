import { and, eq } from 'drizzle-orm'
import { tourMedia } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const tourId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!tourId || !body.mediaId) {
    throw createError({ statusCode: 400, message: 'tourId and mediaId required' })
  }

  await db
    .delete(tourMedia)
    .where(
      and(
        eq(tourMedia.tourId, tourId),
        eq(tourMedia.mediaId, body.mediaId)
      )
    )

  return { success: true }
})
