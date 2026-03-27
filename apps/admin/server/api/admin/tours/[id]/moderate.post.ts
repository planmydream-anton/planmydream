import { eq } from 'drizzle-orm'
import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAdminAccess(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const { action, rejectionReason } = body

  if (!action || !['approve', 'reject'].includes(action)) {
    throw createError({ statusCode: 400, message: 'action должен быть approve или reject' })
  }

  const [existing] = await db.select({ status: tours.status })
    .from(tours)
    .where(eq(tours.id, id))
    .limit(1)

  if (!existing) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

  if (existing.status !== 'pending_review') {
    throw createError({ statusCode: 400, message: 'Тур не находится на модерации' })
  }

  const updateData: Record<string, unknown> = {
    moderatedBy: user.userId,
    moderatedAt: new Date(),
    updatedAt: new Date(),
  }

  if (action === 'approve') {
    updateData.status = 'published'
    updateData.publishedAt = new Date()
    updateData.rejectionReason = null
  } else {
    updateData.status = 'rejected'
    updateData.rejectionReason = rejectionReason || 'Причина не указана'
  }

  const [updated] = await db.update(tours)
    .set(updateData)
    .where(eq(tours.id, id))
    .returning()

  await logAudit({
    entityType: 'tour',
    entityId: id,
    action: action === 'approve' ? 'moderate_approve' : 'moderate_reject',
    userId: user.userId,
  })

  return updated
})
