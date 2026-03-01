import { eq } from 'drizzle-orm'
import { users } from '@planmydream/database/schema'

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

  return { user: user[0] }
})
