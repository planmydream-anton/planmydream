import { eq } from 'drizzle-orm';
import { db, destinations } from '@planmydream/database';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const status = query.status as string || 'published';

  const destinationsList = await db.query.destinations.findMany({
    where: eq(destinations.status, status),
    columns: {
      id: true,
      slug: true,
      name: true,
      country: true,
      description: true,
      coverImageUrl: true,
    },
    orderBy: (destinations, { asc }) => [asc(destinations.name)],
  });

  return destinationsList;
});
