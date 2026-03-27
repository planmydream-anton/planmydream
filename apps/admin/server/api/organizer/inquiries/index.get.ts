import { sql, eq, ilike, and, desc, or } from 'drizzle-orm'
import { inquiries, tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const pageSize = Math.min(Number(query.pageSize) || 20, 50)
  const offset = (page - 1) * pageSize
  const status = query.status as string | undefined
  const search = query.search as string | undefined
  const sortBy = (query.sortBy as string) || 'newest'

  const conditions = [eq(inquiries.organizerId, auth.userId)]

  if (status) {
    conditions.push(eq(inquiries.status, status))
  }
  if (search) {
    conditions.push(
      or(
        ilike(inquiries.name, `%${search}%`),
        ilike(inquiries.phone, `%${search}%`),
        ilike(inquiries.email, `%${search}%`),
      )!,
    )
  }

  const where = and(...conditions)

  const [{ count }] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(inquiries).where(where)

  const orderBy = sortBy === 'oldest' ? [inquiries.createdAt] : [desc(inquiries.createdAt)]

  const items = await db.select({
    id: inquiries.id,
    name: inquiries.name,
    email: inquiries.email,
    phone: inquiries.phone,
    message: inquiries.message,
    status: inquiries.status,
    tourId: inquiries.tourId,
    tourTitle: tours.title,
    createdAt: inquiries.createdAt,
  })
    .from(inquiries)
    .leftJoin(tours, eq(inquiries.tourId, tours.id))
    .where(where)
    .orderBy(...orderBy)
    .limit(pageSize)
    .offset(offset)

  return {
    data: items,
    meta: {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  }
})
