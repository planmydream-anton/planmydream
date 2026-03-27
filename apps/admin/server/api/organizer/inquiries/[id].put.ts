import { eq, and } from 'drizzle-orm'
import { inquiries } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const allowedStatuses = ['awaiting_confirmation', 'awaiting_prepayment', 'prepaid', 'completed', 'cancelled']

  if (body.status && !allowedStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, message: 'Недопустимый статус' })
  }

  const [updated] = await db.update(inquiries)
    .set({ status: body.status })
    .where(and(eq(inquiries.id, id), eq(inquiries.organizerId, auth.userId)))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  return updated
})
