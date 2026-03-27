import { sql, eq, ilike, and, desc, inArray } from 'drizzle-orm'
import { tours, destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const pageSize = Math.min(Number(query.pageSize) || 20, 50)
  const offset = (page - 1) * pageSize
  const status = query.status as string | undefined
  const search = query.search as string | undefined
  const tab = query.tab as string | undefined // 'active' | 'archived'

  const conditions = [eq(tours.createdBy, auth.userId)]

  if (tab === 'archived') {
    conditions.push(eq(tours.status, 'archived'))
  } else if (tab === 'active') {
    conditions.push(inArray(tours.status, ['draft', 'pending_review', 'published', 'rejected']))
  }

  if (status) {
    conditions.push(eq(tours.status, status))
  }
  if (search) {
    conditions.push(ilike(tours.title, `%${search}%`))
  }

  const where = and(...conditions)

  const [{ count }] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(tours).where(where)

  const items = await db.select({
    id: tours.id,
    slug: tours.slug,
    title: tours.title,
    status: tours.status,
    priceFrom: tours.priceFrom,
    currency: tours.currency,
    durationDays: tours.durationDays,
    destinationName: destinations.name,
    rejectionReason: tours.rejectionReason,
    createdAt: tours.createdAt,
    updatedAt: tours.updatedAt,
  })
    .from(tours)
    .leftJoin(destinations, eq(tours.destinationId, destinations.id))
    .where(where)
    .orderBy(desc(tours.updatedAt))
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
