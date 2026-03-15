import { tours } from '@planmydream/database/schema'
import { tourSchema } from '@planmydream/shared/validators'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const result = tourSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0]?.message || 'Неверные данные',
    })
  }

  const data = result.data

  const [created] = await db.insert(tours).values({
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle || null,
    tagline: data.tagline || null,
    description: data.description || null,
    priceFrom: data.priceFrom?.toString() || null,
    currency: data.currency,
    durationDays: data.durationDays || null,
    route: data.route || null,
    difficulty: data.difficulty || null,
    groupSizeMin: data.groupSizeMin || null,
    groupSizeMax: data.groupSizeMax || null,
    destinationId: data.destinationId || null,
    organizerId: data.organizerId || null,
    weatherInfo: data.weatherInfo || null,
    comfortLevel: data.comfortLevel || null,
    minAge: data.minAge || null,
    arrivalInfo: data.arrivalInfo || null,
    accommodations: data.accommodations || null,
    status: data.status,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    seoKeywords: data.seoKeywords || null,
    createdBy: user.userId,
  }).returning()

  await logAudit({
    entityType: 'tour',
    entityId: created.id,
    action: 'create',
    userId: user.userId,
  })

  return created
})
