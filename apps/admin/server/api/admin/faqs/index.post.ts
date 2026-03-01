import { faqs } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const [created] = await db.insert(faqs).values({
    question: body.question, answer: body.answer, category: body.category || null,
    position: body.position || 0, tourId: body.tourId || null, status: 'published',
  }).returning()

  await logAudit({ entityType: 'faq', entityId: created.id, action: 'create', userId: user.userId })
  return created
})
