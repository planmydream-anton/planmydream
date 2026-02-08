import { db } from '~/server/utils/db'
import { teamMembers } from '@planmydream/database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const result = await db
    .select({
      id: teamMembers.id,
      name: teamMembers.name,
      role: teamMembers.role,
      bio: teamMembers.bio,
      photoUrl: teamMembers.photoUrl,
    })
    .from(teamMembers)
    .orderBy(asc(teamMembers.position))

  return result
})
