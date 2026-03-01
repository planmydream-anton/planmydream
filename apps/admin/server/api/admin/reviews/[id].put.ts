import { eq } from 'drizzle-orm'
import { reviews } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const [updated] = await db.update(reviews).set({
    status: body.status, text: body.text, rating: body.rating, position: body.position,
  }).where(eq(reviews.id, id)).returning()

  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'review', entityId: id, action: 'update', userId: user.userId })
  return updated
})
