import { eq, and } from 'drizzle-orm'
import { tours, tourMedia } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const tourId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!tourId || !body.tourMediaId) {
    throw createError({ statusCode: 400, message: 'tourId and tourMediaId required' })
  }

  // Verify ownership
  const [tour] = await db.select({ id: tours.id })
    .from(tours)
    .where(and(eq(tours.id, tourId), eq(tours.createdBy, auth.userId)))
    .limit(1)

  if (!tour) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  await db.delete(tourMedia).where(eq(tourMedia.id, body.tourMediaId))

  return { success: true }
})
