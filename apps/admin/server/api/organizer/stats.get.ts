import { eq, and, sql } from 'drizzle-orm'
import { tours, inquiries } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()

  const [tourStats] = await db.select({
    totalTours: sql<number>`count(*)::int`,
    publishedTours: sql<number>`count(*) filter (where ${tours.status} = 'published')::int`,
    pendingTours: sql<number>`count(*) filter (where ${tours.status} = 'pending_review')::int`,
  }).from(tours).where(eq(tours.createdBy, auth.userId))

  const [inquiryStats] = await db.select({
    totalInquiries: sql<number>`count(*)::int`,
  }).from(inquiries).where(eq(inquiries.organizerId, auth.userId))

  return {
    totalTours: tourStats?.totalTours ?? 0,
    publishedTours: tourStats?.publishedTours ?? 0,
    pendingTours: tourStats?.pendingTours ?? 0,
    totalInquiries: inquiryStats?.totalInquiries ?? 0,
  }
})
