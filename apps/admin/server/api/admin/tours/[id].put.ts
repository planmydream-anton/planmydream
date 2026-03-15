import { eq } from 'drizzle-orm'
import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  // Get current state for audit
  const [existing] = await db.select().from(tours).where(eq(tours.id, id)).limit(1)
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  // Build update object (only provided fields)
  const updateData: Record<string, any> = { updatedAt: new Date() }

  const allowedFields = [
    'slug', 'title', 'subtitle', 'tagline', 'description',
    'priceFrom', 'currency', 'durationDays', 'route', 'difficulty',
    'groupSizeMin', 'groupSizeMax', 'destinationId', 'organizerId',
    'status', 'position', 'isFeatured', 'discountPercent',
    'highlights', 'program', 'includes', 'excludes',
    'paymentTerms', 'accommodationInfo', 'additionalServices', 'weatherInfo',
    'comfortLevel', 'minAge', 'arrivalInfo', 'accommodations',
    'seoTitle', 'seoDescription', 'seoKeywords', 'ogImageUrl',
  ]

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === 'priceFrom') {
        updateData[field] = body[field]?.toString() || null
      } else {
        updateData[field] = body[field]
      }
    }
  }

  // If publishing, set publishedAt
  if (body.status === 'published' && existing.status !== 'published') {
    updateData.publishedAt = new Date()
  }

  const [updated] = await db.update(tours)
    .set(updateData)
    .where(eq(tours.id, id))
    .returning()

  await logAudit({
    entityType: 'tour',
    entityId: id,
    action: 'update',
    userId: user.userId,
  })

  return updated
})
