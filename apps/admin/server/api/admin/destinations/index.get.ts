import { desc } from 'drizzle-orm'
import { destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const items = await db.select().from(destinations).orderBy(desc(destinations.createdAt))
  return { data: items }
})
