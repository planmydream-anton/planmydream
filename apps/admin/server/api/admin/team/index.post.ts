import { teamMembers } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDB()
  const body = await readBody(event)

  const [created] = await db.insert(teamMembers).values({
    name: body.name,
    role: body.role,
    bio: body.bio || null,
    photoUrl: body.photoUrl || null,
    position: body.position || 0,
    isActive: body.isActive ? 1 : 0,
  }).returning()

  await logAudit({ entityType: 'team_member', entityId: created.id, action: 'create', userId: user.userId })
  return created
})
