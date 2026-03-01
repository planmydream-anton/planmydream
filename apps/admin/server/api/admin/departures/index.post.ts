import { departures } from '@planmydream/database/schema'
import { departureSchema } from '@planmydream/shared/validators'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const result = departureSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.errors[0]?.message || 'Неверные данные' })
  }

  const [created] = await db.insert(departures).values({
    tourId: result.data.tourId, startDate: result.data.startDate,
    endDate: result.data.endDate, price: result.data.price.toString(),
    spotsTotal: result.data.spotsTotal || null, status: result.data.status,
    notes: result.data.notes || null,
  }).returning()

  await logAudit({ entityType: 'departure', entityId: created.id, action: 'create', userId: user.userId })
  return created
})
