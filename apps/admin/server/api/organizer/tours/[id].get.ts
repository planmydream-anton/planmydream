import { eq, and } from 'drizzle-orm'
import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const [tour] = await db.select().from(tours)
    .where(and(eq(tours.id, id), eq(tours.createdBy, auth.userId)))
    .limit(1)

  if (!tour) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  return tour
})
