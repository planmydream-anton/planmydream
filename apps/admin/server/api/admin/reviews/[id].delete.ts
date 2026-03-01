import { eq } from 'drizzle-orm'
import { reviews } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'admin')
  const db = useDB()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  await db.delete(reviews).where(eq(reviews.id, id))
  await logAudit({ entityType: 'review', entityId: id, action: 'delete', userId: user.userId })
  return { success: true }
})
