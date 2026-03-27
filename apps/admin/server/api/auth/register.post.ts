import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { users, organizerProfiles } from '@planmydream/database/schema'
import { registerOrganizerSchema } from '@planmydream/shared/validators'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const result = registerOrganizerSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0]?.message || 'Неверные данные',
    })
  }

  const { firstName, lastName, email, phone, password } = result.data
  const db = useDB()

  // Check if email already exists
  const existing = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existing.length) {
    throw createError({
      statusCode: 409,
      message: 'Пользователь с таким email уже существует',
    })
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user with role 'organizer'
  const [newUser] = await db.insert(users).values({
    email,
    passwordHash,
    name: `${firstName} ${lastName}`,
    role: 'organizer',
    isActive: true,
  }).returning({
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
  })

  // Create empty organizer profile
  await db.insert(organizerProfiles).values({
    userId: newUser.id,
    firstName,
    lastName,
    emailContact: email,
  })

  // Create JWT
  const token = await createToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  })

  // Set cookie
  setAuthCookie(event, token)

  return {
    user: newUser,
  }
})
