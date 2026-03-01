import { sql, eq, and, desc } from 'drizzle-orm'
import { inquiries, tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const query = getQuery(event)
  const status = query.status as string | undefined
  const page = Number(query.page) || 1
  const pageSize = Math.min(Number(query.pageSize) || 20, 50)
  const offset = (page - 1) * pageSize

  const conditions = []
  if (status) conditions.push(eq(inquiries.status, status))
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(inquiries).where(where)

  const items = await db.select({
    id: inquiries.id, name: inquiries.name, email: inquiries.email, phone: inquiries.phone,
    message: inquiries.message, source: inquiries.source, status: inquiries.status,
    createdAt: inquiries.createdAt, tourTitle: tours.title, tourId: inquiries.tourId,
  }).from(inquiries).leftJoin(tours, eq(inquiries.tourId, tours.id))
    .where(where).orderBy(desc(inquiries.createdAt)).limit(pageSize).offset(offset)

  return { data: items, meta: { total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) } }
})
