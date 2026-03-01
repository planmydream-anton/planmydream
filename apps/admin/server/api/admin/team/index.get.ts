import { asc } from 'drizzle-orm'
import { teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()
  const items = await db.select().from(teamMembers).orderBy(asc(teamMembers.position))
  return { data: items }
})
