import { eq } from 'drizzle-orm'
import { faqs } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const [updated] = await db.update(faqs).set({
    question: body.question, answer: body.answer, category: body.category,
    position: body.position, tourId: body.tourId || null,
  }).where(eq(faqs.id, id)).returning()

  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'faq', entityId: id, action: 'update', userId: user.userId })
  return updated
})
