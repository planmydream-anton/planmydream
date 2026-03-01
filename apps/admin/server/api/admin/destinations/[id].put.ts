import { eq } from 'drizzle-orm'
import { destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const [updated] = await db.update(destinations).set({
    slug: body.slug, name: body.name, country: body.country,
    description: body.description, coverImageUrl: body.coverImageUrl,
    status: body.status, seoTitle: body.seoTitle, seoDescription: body.seoDescription,
    updatedAt: new Date(),
  }).where(eq(destinations.id, id)).returning()

  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'destination', entityId: id, action: 'update', userId: user.userId })
  return updated
})
