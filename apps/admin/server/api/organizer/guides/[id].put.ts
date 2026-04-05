import { eq, and } from 'drizzle-orm'
import { organizerGuides } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() }

  if (body.firstName !== undefined) updates.firstName = body.firstName
  if (body.lastName !== undefined) updates.lastName = body.lastName
  if (body.photo !== undefined) updates.photo = body.photo
  if (body.bio !== undefined) updates.bio = body.bio

  const [guide] = await db.update(organizerGuides)
    .set(updates)
    .where(and(eq(organizerGuides.id, id), eq(organizerGuides.organizerId, auth.userId)))
    .returning()

  if (!guide) {
    throw createError({ statusCode: 404, message: 'Гид не найден' })
  }

  return { guide }
})
