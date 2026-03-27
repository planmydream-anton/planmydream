import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { users } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const body = await readBody(event)
  const db = useDB()

  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, message: 'Заполните все поля' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'Пароль должен содержать минимум 8 символов' })
  }

  const [user] = await db.select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, auth.userId))
    .limit(1)

  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 400, message: 'Пользователь не найден' })
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!isValid) {
    throw createError({ statusCode: 400, message: 'Неверный текущий пароль' })
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  await db.update(users)
    .set({ passwordHash: newHash })
    .where(eq(users.id, auth.userId))

  return { success: true }
})
