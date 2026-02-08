import { eq, desc, and, gte, lte, like, sql } from 'drizzle-orm';
import { db, tours, departures, destinations, tourMedia, media } from '@planmydream/database';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  // Параметры фильтрации
  const status = query.status as string || 'published';
  const destinationId = query.destinationId as string;
  const featured = query.featured === 'true';
  const limit = Math.min(parseInt(query.limit as string) || 20, 50);
  const offset = parseInt(query.offset as string) || 0;
  const search = query.search as string;

  // Базовые условия
  const conditions = [eq(tours.status, status)];
  
  if (destinationId) {
    conditions.push(eq(tours.destinationId, destinationId));
  }
  
  if (featured) {
    conditions.push(eq(tours.isFeatured, 1));
  }
  
  if (search) {
    conditions.push(
      sql`(${tours.title} ILIKE ${`%${search}%`} OR ${tours.subtitle} ILIKE ${`%${search}%`})`
    );
  }

  // Получаем туры
  const toursList = await db
    .select({
      id: tours.id,
      slug: tours.slug,
      title: tours.title,
      subtitle: tours.subtitle,
      priceFrom: tours.priceFrom,
      currency: tours.currency,
      durationDays: tours.durationDays,
      route: tours.route,
      difficulty: tours.difficulty,
      discountPercent: tours.discountPercent,
      destinationId: tours.destinationId,
      status: tours.status,
      position: tours.position,
      createdAt: tours.createdAt,
    })
    .from(tours)
    .where(and(...conditions))
    .orderBy(desc(tours.position), desc(tours.createdAt))
    .limit(limit)
    .offset(offset);

  // Получаем связанные данные для каждого тура
  const result = await Promise.all(
    toursList.map(async (tour) => {
      // Направление
      const destination = tour.destinationId 
        ? await db.query.destinations.findFirst({
            where: eq(destinations.id, tour.destinationId),
            columns: { id: true, slug: true, name: true },
          })
        : null;

      // Обложка
      const coverMedia = await db
        .select({
          id: media.id,
          url: media.url,
          altText: media.altText,
        })
        .from(tourMedia)
        .leftJoin(media, eq(tourMedia.mediaId, media.id))
        .where(and(
          eq(tourMedia.tourId, tour.id),
          eq(tourMedia.isCover, true)
        ))
        .limit(1);

      // Ближайшие даты выезда
      const tourDepartures = await db
        .select({
          id: departures.id,
          startDate: departures.startDate,
          endDate: departures.endDate,
          price: departures.price,
          spotsTotal: departures.spotsTotal,
          spotsBooked: departures.spotsBooked,
          status: departures.status,
        })
        .from(departures)
        .where(and(
          eq(departures.tourId, tour.id),
          eq(departures.status, 'active'),
          gte(departures.startDate, new Date().toISOString().split('T')[0])
        ))
        .orderBy(departures.startDate)
        .limit(3);

      return {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        subtitle: tour.subtitle,
        priceFrom: tour.priceFrom ? parseFloat(tour.priceFrom) : null,
        currency: tour.currency,
        durationDays: tour.durationDays,
        route: tour.route,
        difficulty: tour.difficulty,
        discountPercent: tour.discountPercent,
        destinationId: tour.destinationId,
        destination,
        coverImage: coverMedia[0] ? {
          id: coverMedia[0].id,
          url: coverMedia[0].url,
          altText: coverMedia[0].altText,
        } : null,
        departures: tourDepartures.map(d => ({
          id: d.id,
          startDate: d.startDate,
          endDate: d.endDate,
          price: parseFloat(d.price),
          spotsTotal: d.spotsTotal || 0,
          spotsBooked: d.spotsBooked || 0,
          spotsLeft: (d.spotsTotal || 0) - (d.spotsBooked || 0),
          status: d.status,
        })),
      };
    })
  );

  // Общее количество для пагинации
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tours)
    .where(and(...conditions));

  return {
    data: result,
    meta: {
      total: Number(count),
      limit,
      offset,
      hasMore: offset + limit < Number(count),
    },
  };
});
