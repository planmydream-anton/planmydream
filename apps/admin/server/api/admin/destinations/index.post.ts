import { destinations } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const [created] = await db.insert(destinations).values({
    slug: body.slug, name: body.name, country: body.country || null,
    description: body.description || null, coverImageUrl: body.coverImageUrl || null,
    status: body.status || 'draft', seoTitle: body.seoTitle || null,
    seoDescription: body.seoDescription || null,
  }).returning()

  await logAudit({ entityType: 'destination', entityId: created.id, action: 'create', userId: user.userId })
  return created
})
