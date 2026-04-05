import { put } from '@vercel/blob'
import { eq, and } from 'drizzle-orm'
import { organizerGuides } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID обязателен' })
  }

  const form = await readMultipartFormData(event)
  if (!form || !form.length) {
    throw createError({ statusCode: 400, message: 'Файл не найден' })
  }

  const file = form.find(f => f.name === 'file')
  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Файл не найден' })
  }

  const mimeType = file.type || 'image/jpeg'
  if (!mimeType.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Допускаются только изображения' })
  }

  const config = useRuntimeConfig()
  if (!config.blobReadWriteToken) {
    throw createError({ statusCode: 500, message: 'BLOB_READ_WRITE_TOKEN не настроен' })
  }

  const blob = await put(`guide-photos/${auth.userId}-${id}-${Date.now()}.${file.filename.split('.').pop()}`, file.data, {
    access: 'public',
    token: config.blobReadWriteToken,
    contentType: mimeType,
  })

  const db = useDB()
  await db.update(organizerGuides)
    .set({ photo: blob.url, updatedAt: new Date() })
    .where(and(eq(organizerGuides.id, id), eq(organizerGuides.organizerId, auth.userId)))

  return { url: blob.url }
})
