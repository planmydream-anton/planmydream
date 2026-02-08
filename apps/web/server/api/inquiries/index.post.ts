import { z } from 'zod'
import { inquiries } from '@planmydream/database/schema'

// Схема валидации
const inquirySchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  tourId: z.string().uuid().optional().nullable(),
  departureId: z.string().uuid().optional().nullable(),
  source: z.string().default('website'),
  pageUrl: z.string().url().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Валидация
  const result = inquirySchema.safeParse(body)
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      data: result.error.flatten(),
    })
  }
  
  const data = result.data
  const db = useDB()

  try {
    // Сохраняем заявку в БД
    const [inquiry] = await db.insert(inquiries).values({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      tourId: data.tourId || null,
      departureId: data.departureId || null,
      source: data.source,
      pageUrl: data.pageUrl || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      status: 'new',
    }).returning()

    // Отправляем в amoCRM (асинхронно, без ожидания)
    sendToAmoCRM(inquiry).catch(err => {
      console.error('Failed to send to amoCRM:', err)
    })

    // Отправляем уведомление в Telegram (опционально)
    sendTelegramNotification(inquiry).catch(err => {
      console.error('Failed to send Telegram notification:', err)
    })

    return {
      success: true,
      id: inquiry.id,
    }
  } catch (error) {
    console.error('Failed to create inquiry:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create inquiry',
    })
  }
})

// Отправка в amoCRM
async function sendToAmoCRM(inquiry: any) {
  const config = useRuntimeConfig()
  
  if (!config.amocrmClientId || !config.amocrmClientSecret) {
    console.log('amoCRM not configured, skipping')
    return
  }

  // TODO: Реализовать интеграцию с amoCRM
  // - Получить/обновить access token
  // - Создать лид
  // - Сохранить amocrm_lead_id в inquiry

  console.log('Would send to amoCRM:', inquiry.id)
}

// Отправка уведомления в Telegram
async function sendTelegramNotification(inquiry: any) {
  const config = useRuntimeConfig()
  
  if (!config.telegramBotToken || !config.telegramChatId) {
    console.log('Telegram not configured, skipping')
    return
  }

  const message = `
🔔 Новая заявка!

👤 Имя: ${inquiry.name}
📱 Телефон: ${inquiry.phone}
${inquiry.email ? `📧 Email: ${inquiry.email}` : ''}
${inquiry.message ? `💬 Сообщение: ${inquiry.message}` : ''}
${inquiry.pageUrl ? `🔗 Страница: ${inquiry.pageUrl}` : ''}

#заявка
  `.trim()

  await $fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: 'POST',
    body: {
      chat_id: config.telegramChatId,
      text: message,
      parse_mode: 'HTML',
    },
  })
}
