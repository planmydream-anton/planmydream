import { eq, and } from 'drizzle-orm'
import { inquiries, tours, departures } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const [inquiry] = await db.select({
    id: inquiries.id,
    name: inquiries.name,
    email: inquiries.email,
    phone: inquiries.phone,
    message: inquiries.message,
    status: inquiries.status,
    source: inquiries.source,
    tourId: inquiries.tourId,
    tourTitle: tours.title,
    departureId: inquiries.departureId,
    utmSource: inquiries.utmSource,
    utmMedium: inquiries.utmMedium,
    utmCampaign: inquiries.utmCampaign,
    pageUrl: inquiries.pageUrl,
    createdAt: inquiries.createdAt,
  })
    .from(inquiries)
    .leftJoin(tours, eq(inquiries.tourId, tours.id))
    .where(and(eq(inquiries.id, id), eq(inquiries.organizerId, auth.userId)))
    .limit(1)

  if (!inquiry) {
    throw createError({ statusCode: 404, message: 'Заявка не найдена' })
  }

  return inquiry
})
