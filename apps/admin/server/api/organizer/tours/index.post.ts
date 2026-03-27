import { tours } from '@planmydream/database/schema'

export default defineEventHandler(async (event) => {
  const auth = await requireOrganizer(event)
  const db = useDB()
  const body = await readBody(event)

  const title = body.title?.trim()
  if (!title) {
    throw createError({ statusCode: 400, message: 'Название тура обязательно' })
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[а-яё]/g, (c: string) => {
      const map: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' }
      return map[c] || c
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const [created] = await db.insert(tours).values({
    slug,
    title,
    status: 'draft',
    createdBy: auth.userId,
    currency: 'RUB',
  }).returning()

  return created
})
