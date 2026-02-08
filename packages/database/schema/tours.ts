import { pgTable, uuid, varchar, text, integer, decimal, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { destinations } from './destinations';
import { users } from './users';

// Типы для JSON полей
export interface TourHighlight {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface TourProgramDay {
  day: number;
  title: string;
  content: string; // Markdown/HTML
}

export interface TourIncludeItem {
  category: 'transport' | 'accommodation' | 'food' | 'sights' | 'services' | 'other';
  text: string;
}

export const tours = pgTable('tours', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  
  // Основное
  title: varchar('title', { length: 500 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  tagline: text('tagline'), // Короткое описание для hero
  description: text('description'), // Краткое описание для карточки
  
  // Характеристики
  priceFrom: decimal('price_from', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),
  durationDays: integer('duration_days'),
  route: varchar('route', { length: 1000 }), // "Шанхай — Чжанцзяцзе — ..."
  difficulty: varchar('difficulty', { length: 50 }), // easy, medium, hard
  groupSizeMin: integer('group_size_min'),
  groupSizeMax: integer('group_size_max'),
  
  // Контент (JSON)
  highlights: jsonb('highlights').$type<TourHighlight[]>(), // "Что нас ждет"
  program: jsonb('program').$type<TourProgramDay[]>(), // Программа по дням
  includes: jsonb('includes').$type<TourIncludeItem[]>(), // Что включено
  excludes: jsonb('excludes').$type<string[]>(), // Что не включено
  
  // Дополнительная информация
  paymentTerms: text('payment_terms'), // Порядок оплаты
  accommodationInfo: text('accommodation_info'), // Описание отелей
  additionalServices: text('additional_services'), // Доп. услуги
  
  // SEO
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  seoKeywords: varchar('seo_keywords', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 1000 }),
  
  // Связи
  destinationId: uuid('destination_id').references(() => destinations.id),
  createdBy: uuid('created_by').references(() => users.id),
  
  // Статус и даты
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published, archived
  position: integer('position').default(0), // Для сортировки
  isFeatured: integer('is_featured').default(0), // Показывать на главной
  discountPercent: integer('discount_percent'), // Скидка в процентах
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
}, (table) => [
  index('idx_tours_status').on(table.status),
  index('idx_tours_destination').on(table.destinationId),
  index('idx_tours_slug').on(table.slug),
]);

export const toursRelations = relations(tours, ({ one }) => ({
  destination: one(destinations, {
    fields: [tours.destinationId],
    references: [destinations.id],
  }),
  createdByUser: one(users, {
    fields: [tours.createdBy],
    references: [users.id],
  }),
}));

export type Tour = typeof tours.$inferSelect;
export type NewTour = typeof tours.$inferInsert;
