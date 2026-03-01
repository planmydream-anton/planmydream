import { eq, desc } from 'drizzle-orm'
import { departures, tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const query = getQuery(event)
  const tourId = query.tourId as string | undefined

  let q = db.select({
    id: departures.id, tourId: departures.tourId, startDate: departures.startDate,
    endDate: departures.endDate, price: departures.price, spotsTotal: departures.spotsTotal,
    spotsBooked: departures.spotsBooked, status: departures.status, notes: departures.notes,
    tourTitle: tours.title,
  }).from(departures).leftJoin(tours, eq(departures.tourId, tours.id)).orderBy(desc(departures.startDate))

  if (tourId) {
    q = q.where(eq(departures.tourId, tourId)) as any
  }

  const items = await q
  return { data: items }
})
