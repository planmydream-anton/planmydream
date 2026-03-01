import { eq } from 'drizzle-orm'
import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'admin')
  const db = useDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const [existing] = await db.select().from(tours).where(eq(tours.id, id)).limit(1)
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  await db.delete(tours).where(eq(tours.id, id))

  await logAudit({
    entityType: 'tour',
    entityId: id,
    action: 'delete',
    userId: user.userId,
  })

  return { success: true }
})
