import { sql, eq } from 'drizzle-orm'
import { tours, departures, inquiries, teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()

  const [tourStats] = await db.select({
    total: sql<number>`count(*)::int`,
    published: sql<number>`count(*) filter (where ${tours.status} = 'published')::int`,
    draft: sql<number>`count(*) filter (where ${tours.status} = 'draft')::int`,
  }).from(tours)

  const [inquiryStats] = await db.select({
    total: sql<number>`count(*)::int`,
    new: sql<number>`count(*) filter (where ${inquiries.status} = 'new')::int`,
  }).from(inquiries)

  const [departureStats] = await db.select({
    upcoming: sql<number>`count(*) filter (where ${departures.startDate} > now() and ${departures.status} = 'active')::int`,
  }).from(departures)

  const [teamStats] = await db.select({
    total: sql<number>`count(*)::int`,
  }).from(teamMembers)

  return {
    tours: tourStats,
    inquiries: inquiryStats,
    departures: departureStats,
    team: teamStats,
  }
})
