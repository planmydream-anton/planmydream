import { sql, eq, ilike, and, desc, asc } from 'drizzle-orm'
import { tours, destinations, teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const pageSize = Math.min(Number(query.pageSize) || 20, 50)
  const offset = (page - 1) * pageSize
  const status = query.status as string | undefined
  const search = query.search as string | undefined

  // Build conditions
  const conditions = []
  if (status) {
    conditions.push(eq(tours.status, status))
  }
  if (search) {
    conditions.push(ilike(tours.title, `%${search}%`))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  // Get total count
  const [{ count }] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(tours).where(where)

  // Get tours
  const items = await db.select({
    id: tours.id,
    slug: tours.slug,
    title: tours.title,
    status: tours.status,
    priceFrom: tours.priceFrom,
    currency: tours.currency,
    durationDays: tours.durationDays,
    isFeatured: tours.isFeatured,
    position: tours.position,
    destinationName: destinations.name,
    organizerName: teamMembers.name,
    createdAt: tours.createdAt,
    updatedAt: tours.updatedAt,
  })
    .from(tours)
    .leftJoin(destinations, eq(tours.destinationId, destinations.id))
    .leftJoin(teamMembers, eq(tours.organizerId, teamMembers.id))
    .where(where)
    .orderBy(desc(tours.isFeatured), asc(tours.position), desc(tours.createdAt))
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
