import { eq } from 'drizzle-orm'
import { faqs } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  await db.delete(faqs).where(eq(faqs.id, id))
  await logAudit({ entityType: 'faq', entityId: id, action: 'delete', userId: user.userId })
  return { success: true }
})
