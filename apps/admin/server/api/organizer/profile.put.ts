import { eq } from 'drizzle-orm'
import { organizerProfiles } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const body = await readBody(event)
  const db = useDB()

  // Only allow updating specific fields
  const allowedFields = [
    'firstName', 'lastName', 'patronymic', 'aboutMe', 'photoUrl',
    'country', 'legalForm', 'inn', 'ogrnip', 'legalName', 'shortLegalName',
    'legalAddress', 'legalPhone', 'vatRates',
    'phone', 'websiteUrl', 'socialLinks',
    'emailContact', 'emailDocuments', 'additionalContacts',
    'reviewUrls', 'timezone', 'workSchedule',
    'cancellationPolicyTemplate',
    'notifyInquiries', 'notifyPromotions',
    'telegramChatId', 'vkId',
  ] as const

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
  }

  updates.updatedAt = new Date()

  const [profile] = await db.update(organizerProfiles)
    .set(updates)
    .where(eq(organizerProfiles.userId, auth.userId))
    .returning()

  if (!profile) {
    throw createError({ statusCode: 404, message: 'Профиль не найден' })
  }

  return { profile }
})
