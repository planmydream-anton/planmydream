import { eq } from 'drizzle-orm'
import { destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'admin')
  const db = useDB()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })
  await db.delete(destinations).where(eq(destinations.id, id))
  await logAudit({ entityType: 'destination', entityId: id, action: 'delete', userId: user.userId })
  return { success: true }
})
