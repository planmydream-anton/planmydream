import { eq } from 'drizzle-orm'
import { organizerGuides } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()

  const guides = await db.select()
    .from(organizerGuides)
    .where(eq(organizerGuides.organizerId, auth.userId))
    .orderBy(organizerGuides.createdAt)

  return { guides }
})
