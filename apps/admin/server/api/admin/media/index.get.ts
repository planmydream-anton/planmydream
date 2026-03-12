import { desc, eq, like } from 'drizzle-orm'
import { media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 24
  const type = query.type as string | undefined
  const offset = (page - 1) * limit

  const db = useDB()

  let items
  if (type && type !== 'all') {
    items = await db.select().from(media)
      .where(eq(media.type, type))
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset)
  } else {
    items = await db.select().from(media)
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset)
  }

  return items
})
