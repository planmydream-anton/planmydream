import { db } from '~/server/utils/db'
import { advantages } from '@planmydream/database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const result = await db
    .select({
      id: advantages.id,
      title: advantages.title,
      description: advantages.description,
      icon: advantages.icon,
    })
    .from(advantages)
    .orderBy(asc(advantages.position))

  return result
})
