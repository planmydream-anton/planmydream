import { eq } from 'drizzle-orm'
import { inquiries } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const [updated] = await db.update(inquiries).set({ status: body.status }).where(eq(inquiries.id, id)).returning()
  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'inquiry', entityId: id, action: 'update', userId: user.userId })
  return updated
})
