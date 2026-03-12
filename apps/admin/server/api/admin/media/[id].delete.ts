import { eq } from 'drizzle-orm'
import { del } from '@vercel/blob'
import { media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')
  const db = useDB()

  // Get media record
  const [record] = await db.select().from(media).where(eq(media.id, id!))
  if (!record) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  // Delete from Vercel Blob
  const config = useRuntimeConfig()
  try {
    await del(record.url, { token: config.blobReadWriteToken })
  } catch (e) {
    console.warn('Failed to delete blob:', e)
  }

  // Delete from database
  await db.delete(media).where(eq(media.id, id!))

  return { success: true }
})
