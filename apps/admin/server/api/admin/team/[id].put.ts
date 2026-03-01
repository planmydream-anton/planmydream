import { eq } from 'drizzle-orm'
import { teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  const [updated] = await db.update(teamMembers).set({
    name: body.name, role: body.role, bio: body.bio || null,
    photoUrl: body.photoUrl || null, position: body.position ?? 0,
    isActive: body.isActive ? 1 : 0, updatedAt: new Date(),
  }).where(eq(teamMembers.id, id)).returning()

  if (!updated) throw createError({ statusCode: 404, message: 'Не найден' })
  await logAudit({ entityType: 'team_member', entityId: id, action: 'update', userId: user.userId })
  return updated
})
