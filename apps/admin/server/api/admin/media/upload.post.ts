import { put } from '@vercel/blob'
import { media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireAuth(event)

  const form = await readMultipartFormData(event)
  if (!form || !form.length) {
    throw createError({ statusCode: 400, message: 'Файл не найден' })
  }

  const file = form.find(f => f.name === 'file')
  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Файл не найден' })
  }

  const config = useRuntimeConfig()
  if (!config.blobReadWriteToken) {
    throw createError({ statusCode: 500, message: 'BLOB_READ_WRITE_TOKEN не настроен' })
  }

  // Determine file type
  const mimeType = file.type || 'application/octet-stream'
  const isImage = mimeType.startsWith('image/')
  const isVideo = mimeType.startsWith('video/')
  const fileType = isImage ? 'image' : isVideo ? 'video' : 'file'

  // Upload to Vercel Blob
  const blob = await put(`media/${Date.now()}-${file.filename}`, file.data, {
    access: 'public',
    token: config.blobReadWriteToken,
    contentType: mimeType,
  })

  // Save to database
  const db = useDB()
  const [record] = await db.insert(media).values({
    filename: file.filename,
    originalFilename: file.filename,
    url: blob.url,
    type: fileType,
    mimeType,
    sizeBytes: file.data.length,
    createdBy: user.userId,
  }).returning()

  return record
})
