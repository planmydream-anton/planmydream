import { eq } from 'drizzle-orm'
import { organizerProfiles } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()

  const [profile] = await db.select().from(organizerProfiles)
    .where(eq(organizerProfiles.userId, auth.userId))
    .limit(1)

  if (!profile) {
    throw createError({ statusCode: 404, message: 'Профиль не найден' })
  }

  return { profile }
})
