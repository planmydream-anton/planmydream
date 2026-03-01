import { eq } from 'drizzle-orm'
import { inquiries, tours, departures } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const items = await db.select({
    id: inquiries.id, name: inquiries.name, email: inquiries.email, phone: inquiries.phone,
    message: inquiries.message, source: inquiries.source, status: inquiries.status,
    utmSource: inquiries.utmSource, utmMedium: inquiries.utmMedium, utmCampaign: inquiries.utmCampaign,
    pageUrl: inquiries.pageUrl, createdAt: inquiries.createdAt,
    tourTitle: tours.title, tourId: inquiries.tourId,
  }).from(inquiries).leftJoin(tours, eq(inquiries.tourId, tours.id))
    .where(eq(inquiries.id, id)).limit(1)

  if (!items.length) throw createError({ statusCode: 404, message: 'Не найден' })
  return items[0]
})
