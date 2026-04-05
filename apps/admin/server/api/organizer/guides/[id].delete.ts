import { eq, and } from 'drizzle-orm'
import { organizerGuides } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const [deleted] = await db.delete(organizerGuides)
    .where(and(eq(organizerGuides.id, id), eq(organizerGuides.organizerId, auth.userId)))
    .returning()

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Гид не найден' })
  }

  return { success: true }
})
