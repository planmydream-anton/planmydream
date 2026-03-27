import { eq, and } from 'drizzle-orm'
import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  // Only allow deleting draft tours
  const [existing] = await db.select({ status: tours.status })
    .from(tours)
    .where(and(eq(tours.id, id), eq(tours.createdBy, auth.userId)))
    .limit(1)

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  if (existing.status !== 'draft') {
    throw createError({ statusCode: 400, message: 'Можно удалить только черновик' })
  }

  await db.delete(tours)
    .where(and(eq(tours.id, id), eq(tours.createdBy, auth.userId)))

  return { success: true }
})
