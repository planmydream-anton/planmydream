import { eq } from 'drizzle-orm';
import { db, inquiries, tours, departures } from '@planmydream/database';
import { inquirySchema } from '@planmydream/shared';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Валидация
  const result = inquirySchema.safeParse(body);
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      data: result.error.flatten().fieldErrors,
    });
  }
  
  const data = result.data;
  
  // Проверяем существование тура, если указан
  let tourTitle: string | undefined;
  let departureInfo: { startDate: string; price: string } | undefined;
  
  if (data.tourId) {
    const tour = await db.query.tours.findFirst({
      where: eq(tours.id, data.tourId),
      columns: { title: true },
    });
    
    if (!tour) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tour not found',
      });
    }
    
    tourTitle = tour.title;
  }
  
  // Проверяем существование даты выезда, если указана
  if (data.departureId) {
    const departure = await db.query.departures.findFirst({
      where: eq(departures.id, data.departureId),
      columns: { startDate: true, price: true },
    });
    
    if (departure) {
      departureInfo = {
        startDate: departure.startDate,
        price: departure.price,
      };
    }
  }
  
  // Создаём заявку
  const [inquiry] = await db.insert(inquiries).values({
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    message: data.message || null,
    tourId: data.tourId || null,
    departureId: data.departureId || null,
    source: 'website',
    utmSource: data.utmSource || null,
    utmMedium: data.utmMedium || null,
    utmCampaign: data.utmCampaign || null,
    pageUrl: data.pageUrl || null,
    status: 'new',
  }).returning({ id: inquiries.id });
  
  // Отправка в amoCRM (асинхронно, не блокируем ответ)
  const config = useRuntimeConfig();
  
  if (config.amocrmClientId && config.amocrmClientSecret) {
    // В production здесь будет интеграция с amoCRM
    // Пока просто логируем
    console.log('📧 New inquiry:', {
      id: inquiry.id,
      name: data.name,
      phone: data.phone,
      tour: tourTitle,
      departure: departureInfo?.startDate,
    });
  }
  
  // Telegram уведомление (если настроен)
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  
  if (telegramBotToken && telegramChatId) {
    const message = [
      '🔔 *Новая заявка*',
      '',
      `👤 *Имя:* ${data.name}`,
      `📱 *Телефон:* ${data.phone}`,
      data.email ? `📧 *Email:* ${data.email}` : '',
      tourTitle ? `✈️ *Тур:* ${tourTitle}` : '',
      departureInfo ? `📅 *Дата:* ${departureInfo.startDate}` : '',
      data.message ? `💬 *Сообщение:* ${data.message}` : '',
    ].filter(Boolean).join('\n');
    
    // Отправляем асинхронно, не ждём ответ
    $fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      },
    }).catch(err => {
      console.error('Telegram notification failed:', err);
    });
  }
  
  return {
    success: true,
    id: inquiry.id,
    message: 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
  };
});
