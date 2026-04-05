import { put } from '@vercel/blob'

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

  // folder can be passed via query or form field
  const query = getQuery(event)
  const folderField = form.find(f => f.name === 'folder')
  const folder = (query.folder as string) || (folderField?.data?.toString()) || 'organizer-media'

  const blob = await put(`${folder}/${auth.userId}-${Date.now()}.${file.filename.split('.').pop()}`, file.data, {
    access: 'public',
    token: config.blobReadWriteToken,
    contentType: mimeType,
  })

  return { url: blob.url }
})
