import { eq } from 'drizzle-orm'
import { advantages } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const [updated] = await db.update(advantages).set({
    title: body.title, description: body.description, icon: body.icon,
    position: body.position, isActive: body.isActive ? 1 : 0,
  }).where(eq(advantages.id, id)).returning()

  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'advantage', entityId: id, action: 'update', userId: user.userId })
  return updated
})
