import { eq } from 'drizzle-orm'
import { destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })
  const [item] = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1)
  if (!item) throw createError({ statusCode: 404, message: 'Не найден' })
  return item
})
