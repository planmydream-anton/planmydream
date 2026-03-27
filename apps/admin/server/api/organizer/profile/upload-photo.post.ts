import { put } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { organizerProfiles } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)

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

  const blob = await put(`organizer-photos/${auth.userId}-${Date.now()}.${file.filename.split('.').pop()}`, file.data, {
    access: 'public',
    token: config.blobReadWriteToken,
    contentType: mimeType,
  })

  const db = useDB()
  await db.update(organizerProfiles)
    .set({ photoUrl: blob.url, updatedAt: new Date() })
    .where(eq(organizerProfiles.userId, auth.userId))

  return { url: blob.url }
})
