import { eq, and, sql } from 'drizzle-orm'
import { put } from '@vercel/blob'
import { tours, tourMedia, media } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const tourId = getRouterParam(event, 'id')

  if (!tourId) {
    throw createError({ statusCode: 400, message: 'Tour ID required' })
  }

  // Verify ownership
  const [tour] = await db.select({ id: tours.id })
    .from(tours)
    .where(and(eq(tours.id, tourId), eq(tours.createdBy, auth.userId)))
    .limit(1)

  if (!tour) {
    throw createError({ statusCode: 404, message: 'Тур не найден' })
  }

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

  const mimeType = file.type || 'application/octet-stream'
  const isImage = mimeType.startsWith('image/')
  const isVideo = mimeType.startsWith('video/')
  const fileType = isImage ? 'image' : isVideo ? 'video' : 'file'

  // Upload to Vercel Blob
  const blob = await put(`tours/${tourId}/${Date.now()}-${file.filename}`, file.data, {
    access: 'public',
    token: config.blobReadWriteToken,
    contentType: mimeType,
  })

  // Save media record
  const [mediaRecord] = await db.insert(media).values({
    filename: file.filename,
    originalFilename: file.filename,
    url: blob.url,
    type: fileType,
    mimeType,
    sizeBytes: file.data.length,
    createdBy: auth.userId,
  }).returning()

  // Get max position
  const [maxPos] = await db
    .select({ max: sql<number>`COALESCE(MAX(${tourMedia.position}), 0)` })
    .from(tourMedia)
    .where(eq(tourMedia.tourId, tourId))

  const isCover = form.find(f => f.name === 'isCover')?.data?.toString() === 'true'

  // Link to tour
  const [tourMediaRecord] = await db.insert(tourMedia).values({
    tourId,
    mediaId: mediaRecord.id,
    position: (maxPos?.max || 0) + 1,
    isCover,
  }).returning()

  return {
    ...mediaRecord,
    tourMediaId: tourMediaRecord.id,
    position: tourMediaRecord.position,
    isCover: tourMediaRecord.isCover,
  }
})
