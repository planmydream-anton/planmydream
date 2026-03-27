import { eq } from 'drizzle-orm'
import { users, organizerProfiles } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const db = useDB()

  const user = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
  }).from(users).where(eq(users.id, auth.userId)).limit(1)

  if (!user.length) {
    throw createError({
      statusCode: 401,
      message: 'Пользователь не найден',
    })
  }

  const userData = user[0] as Record<string, unknown>

  // For organizers, also return profile data
  if (userData.role === 'organizer') {
    const profile = await db.select({
      firstName: organizerProfiles.firstName,
      lastName: organizerProfiles.lastName,
      photoUrl: organizerProfiles.photoUrl,
      emailVerified: organizerProfiles.emailVerified,
      identityVerified: organizerProfiles.identityVerified,
      dataVerified: organizerProfiles.dataVerified,
    }).from(organizerProfiles).where(eq(organizerProfiles.userId, auth.userId)).limit(1)

    if (profile.length) {
      userData.organizerProfile = profile[0]
    }
  }

  return { user: userData }
})
