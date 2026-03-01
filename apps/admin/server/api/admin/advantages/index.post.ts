import { advantages } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const [created] = await db.insert(advantages).values({
    title: body.title, description: body.description || null,
    icon: body.icon || null, position: body.position || 0, isActive: body.isActive ? 1 : 0,
  }).returning()

  await logAudit({ entityType: 'advantage', entityId: created.id, action: 'create', userId: user.userId })
  return created
})
