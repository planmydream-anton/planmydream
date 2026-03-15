import { eq, asc } from 'drizzle-orm'
import { db } from '~/server/utils/db'
import { tours, departures, destinations, tourMedia, media, teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  // Получаем тур по slug с destination и организатором
  const [tour] = await db
    .select()
    .from(tours)
    .leftJoin(destinations, eq(tours.destinationId, destinations.id))
    .leftJoin(teamMembers, eq(tours.organizerId, teamMembers.id))
    .where(eq(tours.slug, slug))
    .limit(1)

  if (!tour?.tours) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tour not found',
    })
  }

  const tourData = tour.tours
  const destinationData = tour.destinations
  const organizerData = tour.team_members

  // Проверяем что тур опубликован (для публичного API)
  if (tourData.status !== 'published') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tour not found',
    })
  }

  // Получаем выезды
  const tourDepartures = await db
    .select()
    .from(departures)
    .where(eq(departures.tourId, tourData.id))
    .orderBy(departures.startDate)

  // Получаем медиа файлы тура
  const tourMediaItems = await db
    .select({
      id: media.id,
      url: media.url,
      filename: media.filename,
      type: media.type,
      mimeType: media.mimeType,
      width: media.width,
      height: media.height,
      altText: media.altText,
      caption: media.caption,
      position: tourMedia.position,
      isCover: tourMedia.isCover,
    })
    .from(tourMedia)
    .innerJoin(media, eq(tourMedia.mediaId, media.id))
    .where(eq(tourMedia.tourId, tourData.id))
    .orderBy(asc(tourMedia.position))

  // Разделяем на обложку и галерею
  const coverItem = tourMediaItems.find(m => m.isCover)
  const galleryItems = tourMediaItems.filter(m => !m.isCover)

  // Вычисляем оставшиеся места для каждого выезда
  const departuresWithSpots = tourDepartures
    .filter(dep => dep.status === 'active')
    .map(dep => ({
      id: dep.id,
      tourId: dep.tourId,
      startDate: dep.startDate,
      endDate: dep.endDate,
      price: dep.price,
      spotsTotal: dep.spotsTotal || 0,
      spotsBooked: dep.spotsBooked || 0,
      spotsLeft: (dep.spotsTotal || 0) - (dep.spotsBooked || 0),
      status: dep.status,
      notes: dep.notes,
    }))

  return {
    id: tourData.id,
    slug: tourData.slug,
    title: tourData.title,
    subtitle: tourData.subtitle,
    tagline: tourData.tagline,
    description: tourData.description,
    
    priceFrom: tourData.priceFrom,
    currency: tourData.currency || 'USD',
    durationDays: tourData.durationDays,
    difficulty: tourData.difficulty,
    groupSizeMin: tourData.groupSizeMin,
    groupSizeMax: tourData.groupSizeMax,
    route: tourData.route,
    discountPercent: tourData.discountPercent,
    isFeatured: tourData.isFeatured,
    
    // Контент из JSON полей
    highlights: tourData.highlights || [],
    program: tourData.program || [],
    includes: tourData.includes || [],
    excludes: tourData.excludes || [],
    
    // Характеристики
    comfortLevel: tourData.comfortLevel,
    minAge: tourData.minAge,

    // Дополнительная информация
    paymentTerms: tourData.paymentTerms,
    accommodationInfo: tourData.accommodationInfo,
    additionalServices: tourData.additionalServices,
    arrivalInfo: tourData.arrivalInfo,
    accommodations: tourData.accommodations || [],
    
    // SEO
    seoTitle: tourData.seoTitle,
    seoDescription: tourData.seoDescription,
    seoKeywords: tourData.seoKeywords,
    ogImageUrl: tourData.ogImageUrl,
    
    // Медиа
    coverImage: coverItem ? {
      id: coverItem.id,
      url: coverItem.url,
      filename: coverItem.filename,
      type: coverItem.type,
      mimeType: coverItem.mimeType,
      altText: coverItem.altText,
      caption: coverItem.caption,
    } : undefined,

    gallery: galleryItems.map(m => ({
      id: m.id,
      url: m.url,
      filename: m.filename,
      type: m.type,
      mimeType: m.mimeType,
      altText: m.altText,
      caption: m.caption,
    })),

    departures: departuresWithSpots,
    
    destination: destinationData ? {
      id: destinationData.id,
      slug: destinationData.slug,
      name: destinationData.name,
      country: destinationData.country,
    } : undefined,

    organizer: organizerData ? {
      id: organizerData.id,
      name: organizerData.name,
      role: organizerData.role,
      bio: organizerData.bio,
      photoUrl: organizerData.photoUrl,
    } : undefined,
    
    status: tourData.status,
    position: tourData.position,
    createdAt: tourData.createdAt,
    updatedAt: tourData.updatedAt,
    publishedAt: tourData.publishedAt,
  }
})
