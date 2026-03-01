import { eq } from 'drizzle-orm'
import { departures } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const updateData: Record<string, any> = { updatedAt: new Date() }
  if (body.startDate) updateData.startDate = body.startDate
  if (body.endDate) updateData.endDate = body.endDate
  if (body.price) updateData.price = body.price.toString()
  if (body.spotsTotal !== undefined) updateData.spotsTotal = body.spotsTotal
  if (body.spotsBooked !== undefined) updateData.spotsBooked = body.spotsBooked
  if (body.status) updateData.status = body.status
  if (body.notes !== undefined) updateData.notes = body.notes

  const [updated] = await db.update(departures).set(updateData).where(eq(departures.id, id)).returning()
  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'departure', entityId: id, action: 'update', userId: user.userId })
  return updated
})
