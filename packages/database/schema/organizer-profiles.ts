import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Типы для JSON полей
export interface LegalAddress {
  index?: string;
  country: string;
  region?: string;
  city?: string;
  street?: string;
}

export interface VatRate {
  rate: number;
  startDate: string;
  endDate?: string;
}

export interface WorkSchedule {
  weekdayStart?: string;
  weekdayEnd?: string;
  weekendStart?: string;
  weekendEnd?: string;
}

export interface SocialLink {
  type: 'instagram' | 'facebook' | 'youtube' | 'telegram' | 'vk' | 'tiktok' | 'other';
  url: string;
}

export interface CancellationPenalty {
  amount: string;
  period: string;
}

export interface CancellationPolicyTemplate {
  type: 'standard' | 'individual';
  penalties: CancellationPenalty[];
  additionalConditions?: string;
}

export const organizerProfiles = pgTable('organizer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),

  // Личные данные
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  patronymic: varchar('patronymic', { length: 255 }),
  aboutMe: text('about_me'),
  photoUrl: varchar('photo_url', { length: 1000 }),

  // Юридическое лицо
  country: varchar('country', { length: 100 }),
  legalForm: varchar('legal_form', { length: 50 }), // ip, ooo, self_employed
  inn: varchar('inn', { length: 20 }),
  ogrnip: varchar('ogrnip', { length: 20 }),
  legalName: varchar('legal_name', { length: 500 }),
  shortLegalName: varchar('short_legal_name', { length: 255 }),
  legalAddress: jsonb('legal_address').$type<LegalAddress>(),
  legalPhone: varchar('legal_phone', { length: 50 }),
  vatRates: jsonb('vat_rates').$type<VatRate[]>(),

  // Контакты
  phone: varchar('phone', { length: 50 }),
  websiteUrl: varchar('website_url', { length: 1000 }),
  socialLinks: jsonb('social_links').$type<SocialLink[]>(),
  emailContact: varchar('email_contact', { length: 255 }),
  emailDocuments: varchar('email_documents', { length: 255 }),
  additionalContacts: text('additional_contacts'),
  reviewUrls: jsonb('review_urls').$type<string[]>(),

  // Политика отмены
  cancellationPolicyTemplate: jsonb('cancellation_policy_template').$type<CancellationPolicyTemplate>(),

  // График работы
  timezone: varchar('timezone', { length: 100 }),
  workSchedule: jsonb('work_schedule').$type<WorkSchedule>(),

  // Уведомления
  notifyInquiries: boolean('notify_inquiries').default(true).notNull(),
  notifyPromotions: boolean('notify_promotions').default(false).notNull(),
  telegramChatId: varchar('telegram_chat_id', { length: 100 }),
  vkId: varchar('vk_id', { length: 100 }),

  // Верификация
  emailVerified: boolean('email_verified').default(false).notNull(),
  identityVerified: boolean('identity_verified').default(false).notNull(),
  dataVerified: boolean('data_verified').default(false).notNull(),
  verificationSubmittedAt: timestamp('verification_submitted_at', { withTimezone: true }),
  verificationCompletedAt: timestamp('verification_completed_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_organizer_profiles_user').on(table.userId),
]);

export const organizerProfilesRelations = relations(organizerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [organizerProfiles.userId],
    references: [users.id],
  }),
  guides: many(organizerGuides),
}));

// Таблица гидов организатора
export const organizerGuides = pgTable('organizer_guides', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizerId: uuid('organizer_id').references(() => users.id).notNull(),

  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  photo: varchar('photo', { length: 1000 }),
  bio: text('bio'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_organizer_guides_organizer').on(table.organizerId),
]);

export const organizerGuidesRelations = relations(organizerGuides, ({ one }) => ({
  organizer: one(organizerProfiles, {
    fields: [organizerGuides.organizerId],
    references: [organizerProfiles.userId],
  }),
}));

export type OrganizerProfile = typeof organizerProfiles.$inferSelect;
export type NewOrganizerProfile = typeof organizerProfiles.$inferInsert;
export type OrganizerGuide = typeof organizerGuides.$inferSelect;
export type NewOrganizerGuide = typeof organizerGuides.$inferInsert;
