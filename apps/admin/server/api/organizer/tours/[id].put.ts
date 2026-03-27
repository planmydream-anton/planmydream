import { eq, and } from 'drizzle-orm'
import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  // Verify ownership
  const [existing] = await db.select({ id: tours.id, status: tours.status })
    .from(tours)
    .where(and(eq(tours.id, id), eq(tours.createdBy, auth.userId)))
    .limit(1)

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() }

  const allowedFields = [
    'title', 'subtitle', 'tagline', 'description',
    'priceFrom', 'currency', 'durationDays', 'route', 'difficulty',
    'groupSizeMin', 'groupSizeMax', 'destinationId',
    'highlights', 'program', 'includes', 'excludes',
    'paymentTerms', 'accommodationInfo', 'additionalServices', 'weatherInfo',
    'comfortLevel', 'minAge', 'arrivalInfo', 'accommodations',
    // Organizer-specific fields
    'language', 'maxWeight', 'tourTypes', 'geography', 'startingLocation',
    'videoStoriesUrl', 'keyImpressions', 'guides', 'insurance',
    'cancellationPolicy', 'packingList', 'cities', 'travelRecommendations',
    'generalTouristComment',
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

  // Handle status changes — organizer can only set draft or pending_review
  if (body.status !== undefined) {
    if (body.status === 'draft' || body.status === 'pending_review') {
      updateData.status = body.status
    } else if (body.status === 'archived') {
      updateData.status = 'archived'
    }
    // Organizer cannot set published or rejected
  }

  const [updated] = await db.update(tours)
    .set(updateData)
    .where(and(eq(tours.id, id), eq(tours.createdBy, auth.userId)))
    .returning()

  return updated
})
