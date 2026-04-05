import { pgTable, uuid, varchar, text, integer, decimal, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { destinations } from './destinations';
import { users } from './users';
import { teamMembers } from './system';

// Типы для JSON полей
export interface TourHighlight {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface TourKeyImpression {
  title: string;
  description?: string;
  images?: string[];
}

export interface TourProgramDay {
  day: number;
  title: string;
  content: string; // Markdown/HTML
  images?: string[]; // URL массив фото для дня
}

export interface TourAccommodation {
  name: string;
  description: string;
  images: string[];
  videoUrl?: string;
  nights?: number;
}

export interface TourGuide {
  name: string;
  photo?: string;
  bio?: string;
  guideId?: string; // Связь с organizer_guides
}

export interface TourStartingLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface TourCancellationPolicy {
  useTemplate: boolean;
  conditions?: string;
}

export interface TourTicketInfo {
  startCity: string;
  endCity: string;
  transportType: 'plane' | 'train' | 'bus' | 'car' | 'ferry' | 'other';
  earliestArrivalTime?: string;
  latestArrivalTime?: string;
  earliestDepartureTime?: string;
  latestDepartureTime?: string;
}

export interface TourFaqItem {
  question: string;
  answer: string;
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
  includes: jsonb('includes').$type<string[]>(), // Что включено (простой список)
  excludes: jsonb('excludes').$type<string[]>(), // Что не включено
  
  // Дополнительная информация
  paymentTerms: text('payment_terms'), // Порядок оплаты
  accommodationInfo: text('accommodation_info'), // Описание отелей
  additionalServices: text('additional_services'), // Доп. услуги
  weatherInfo: text('weather_info'), // Информация о погоде в туре
  comfortLevel: varchar('comfort_level', { length: 20 }), // basic, standard, comfort, luxury
  minAge: integer('min_age'), // Минимальный возраст
  arrivalInfo: text('arrival_info'), // Как добраться (markdown/HTML)
  accommodations: jsonb('accommodations').$type<TourAccommodation[]>(), // Размещение

  // Поля для организаторов
  language: varchar('language', { length: 10 }),
  maxWeight: integer('max_weight'),
  tourTypes: jsonb('tour_types'), // {mainType, activities[], collections[]}
  geography: jsonb('geography'), // {country, regions[], cities[], landmarks[]}
  startingLocation: jsonb('starting_location').$type<TourStartingLocation>(),
  videoStoriesUrl: varchar('video_stories_url', { length: 1000 }),
  keyImpressions: jsonb('key_impressions').$type<TourKeyImpression[]>(),
  guides: jsonb('guides').$type<TourGuide[]>(),
  insurance: varchar('insurance', { length: 50 }), // included, not_included, mandatory_not_included
  cancellationPolicy: jsonb('cancellation_policy').$type<TourCancellationPolicy>(),
  packingList: text('packing_list'),
  ticketInfo: jsonb('ticket_info').$type<TourTicketInfo[]>(),
  travelRecommendations: text('travel_recommendations'),
  generalTouristComment: text('general_tourist_comment'),
  faq: jsonb('faq').$type<TourFaqItem[]>(),
  countries: jsonb('countries').$type<string[]>(),

  // SEO
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  seoKeywords: varchar('seo_keywords', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 1000 }),
  
  // Связи
  destinationId: uuid('destination_id').references(() => destinations.id),
  createdBy: uuid('created_by').references(() => users.id),
  organizerId: uuid('organizer_id').references(() => teamMembers.id), // Организатор тура
  
  // Статус и даты
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, pending_review, published, rejected, archived
  position: integer('position').default(0), // Для сортировки
  isFeatured: integer('is_featured').default(0), // Показывать на главной
  discountPercent: integer('discount_percent'), // Скидка в процентах

  // Модерация
  rejectionReason: text('rejection_reason'),
  moderatedBy: uuid('moderated_by').references(() => users.id),
  moderatedAt: timestamp('moderated_at', { withTimezone: true }),

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
  organizer: one(teamMembers, {
    fields: [tours.organizerId],
    references: [teamMembers.id],
  }),
}));

export type Tour = typeof tours.$inferSelect;
export type NewTour = typeof tours.$inferInsert;
