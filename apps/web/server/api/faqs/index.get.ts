import { db } from '~/server/utils/db'
import { faqs } from '@planmydream/database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const result = await db
    .select({
      id: faqs.id,
      question: faqs.question,
      answer: faqs.answer,
      category: faqs.category,
    })
    .from(faqs)
    .orderBy(asc(faqs.position))

  return result
})
