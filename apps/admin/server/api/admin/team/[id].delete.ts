import { eq } from 'drizzle-orm'
import { teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'admin')
  const db = useDB()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID обязателен' })

  await db.delete(teamMembers).where(eq(teamMembers.id, id))
  await logAudit({ entityType: 'team_member', entityId: id, action: 'delete', userId: user.userId })
  return { success: true }
})
