import { organizerGuides } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const body = await readBody(event)

  if (!body.firstName || !body.lastName) {
    throw createError({ statusCode: 400, message: 'Имя и фамилия обязательны' })
  }

  const [guide] = await db.insert(organizerGuides)
    .values({
      organizerId: auth.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      photo: body.photo || null,
      bio: body.bio || null,
    })
    .returning()

  return { guide }
})
