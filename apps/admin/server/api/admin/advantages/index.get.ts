import { asc } from 'drizzle-orm'
import { advantages } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const items = await db.select().from(advantages).orderBy(asc(advantages.position))
  return { data: items }
})
