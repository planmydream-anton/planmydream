import { asc } from 'drizzle-orm'
import { faqs } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const items = await db.select().from(faqs).orderBy(asc(faqs.position))
  return { data: items }
})
