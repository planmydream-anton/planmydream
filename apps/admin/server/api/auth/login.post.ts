import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { users } from '@planmydream/database/schema'
import { loginSchema } from '@planmydream/shared/validators'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0]?.message || 'Неверные данные',
    })
  }

  const { email, password } = result.data
  const db = useDB()

  // Find user
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user.length) {
    throw createError({
      statusCode: 401,
      message: 'Неверный email или пароль',
    })
  }

  const foundUser = user[0]

  // Check if active
  if (!foundUser.isActive) {
    throw createError({
      statusCode: 403,
      message: 'Аккаунт деактивирован',
    })
  }

  // Verify password
  const passwordValid = await bcrypt.compare(password, foundUser.passwordHash)
  if (!passwordValid) {
    throw createError({
      statusCode: 401,
      message: 'Неверный email или пароль',
    })
  }

  // Create JWT
  const token = await createToken({
    userId: foundUser.id,
    email: foundUser.email,
    role: foundUser.role,
  })

  // Set cookie
  setAuthCookie(event, token)

  // Update last login
  await db.update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, foundUser.id))

  return {
    user: {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
    },
  }
})
