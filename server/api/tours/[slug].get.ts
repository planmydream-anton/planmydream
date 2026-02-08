import { eq } from 'drizzle-orm';
import { db, tours, departures, destinations, tourMedia, media, reviews } from '@planmydream/database';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  // Получаем тур со всеми связями
  const tour = await db.query.tours.findFirst({
    where: eq(tours.slug, slug),
    with: {
      destination: true,
    },
  });

  if (!tour || tour.status !== 'published') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tour not found',
    });
  }

  // Получаем даты выезда
  const tourDepartures = await db.query.departures.findMany({
    where: eq(departures.tourId, tour.id),
    orderBy: (departures, { asc }) => [asc(departures.startDate)],
  });

  // Получаем медиа
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
      videoProvider: media.videoProvider,
      videoId: media.videoId,
      isCover: tourMedia.isCover,
      position: tourMedia.position,
    })
    .from(tourMedia)
    .leftJoin(media, eq(tourMedia.mediaId, media.id))
    .where(eq(tourMedia.tourId, tour.id))
    .orderBy(tourMedia.position);

  // Получаем отзывы
  const tourReviews = await db.query.reviews.findMany({
    where: (reviews, { and, eq: eqOp }) => and(
      eqOp(reviews.tourId, tour.id),
      eqOp(reviews.status, 'approved')
    ),
    orderBy: (reviews, { asc }) => [asc(reviews.position)],
    limit: 10,
  });

  // Находим обложку
  const coverImage = tourMediaItems.find(m => m.isCover) || tourMediaItems[0];
  
  // Формируем галерею (без обложки)
  const gallery = tourMediaItems
    .filter(m => !m.isCover)
    .map(m => ({
      id: m.id,
      url: m.url,
      filename: m.filename,
      type: m.type,
      mimeType: m.mimeType,
      width: m.width,
      height: m.height,
      altText: m.altText,
      caption: m.caption,
      videoProvider: m.videoProvider,
      videoId: m.videoId,
    }));

  // Формируем ответ
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    subtitle: tour.subtitle,
    description: tour.description,
    
    priceFrom: tour.priceFrom ? parseFloat(tour.priceFrom) : null,
    currency: tour.currency,
    durationDays: tour.durationDays,
    difficulty: tour.difficulty,
    groupSizeMin: tour.groupSizeMin,
    groupSizeMax: tour.groupSizeMax,
    route: tour.route,
    
    // Контент
    highlights: tour.highlights || [],
    program: tour.program || [],
    includes: tour.includes?.filter(i => i.category !== 'excludes') || [],
    notIncludes: tour.excludes || [],
    paymentInfo: tour.paymentTerms,
    extras: tour.additionalServices,
    
    // Медиа
    coverImage: coverImage ? {
      id: coverImage.id,
      url: coverImage.url,
      filename: coverImage.filename,
      type: coverImage.type,
      altText: coverImage.altText,
    } : null,
    gallery,
    
    // Даты выезда с вычислением свободных мест
    departures: tourDepartures.map(d => ({
      id: d.id,
      tourId: d.tourId,
      startDate: d.startDate,
      endDate: d.endDate,
      price: parseFloat(d.price),
      spotsTotal: d.spotsTotal || 0,
      spotsBooked: d.spotsBooked || 0,
      spotsLeft: (d.spotsTotal || 0) - (d.spotsBooked || 0),
      status: d.status,
      notes: d.notes,
    })),
    
    // Направление
    destination: tour.destination ? {
      id: tour.destination.id,
      slug: tour.destination.slug,
      name: tour.destination.name,
      country: tour.destination.country,
    } : null,
    
    // Проживание
    accommodationInfo: tour.accommodationInfo,
    
    // SEO
    seo: {
      title: tour.seoTitle || tour.title,
      description: tour.seoDescription || tour.subtitle,
      keywords: tour.seoKeywords,
    },
    
    // Отзывы
    reviews: tourReviews.map(r => ({
      id: r.id,
      authorName: r.authorName,
      authorPhotoUrl: r.authorPhotoUrl,
      rating: r.rating,
      text: r.text,
      travelDate: r.travelDate,
    })),
    
    // Мета
    status: tour.status,
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString(),
    publishedAt: tour.publishedAt?.toISOString(),
  };
});
