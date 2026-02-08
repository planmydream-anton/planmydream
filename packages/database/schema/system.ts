import { pgTable, uuid, varchar, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tours } from './tours';
import { departures } from './departures';
import { users } from './users';

// ============================================
// ЗАЯВКИ
// ============================================
export const inquiries = pgTable('inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Контакт
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  
  // Контекст
  tourId: uuid('tour_id').references(() => tours.id),
  departureId: uuid('departure_id').references(() => departures.id),
  message: text('message'),
  
  // Источник
  source: varchar('source', { length: 100 }), // form, callback, whatsapp
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  pageUrl: varchar('page_url', { length: 1000 }),
  
  // CRM интеграция
  amocrmLeadId: integer('amocrm_lead_id'),
  amocrmSyncedAt: timestamp('amocrm_synced_at', { withTimezone: true }),
  
  // Статус
  status: varchar('status', { length: 50 }).default('new').notNull(), // new, processing, completed, spam
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_inquiries_status').on(table.status),
  index('idx_inquiries_created').on(table.createdAt),
  index('idx_inquiries_tour').on(table.tourId),
]);

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  tour: one(tours, {
    fields: [inquiries.tourId],
    references: [tours.id],
  }),
  departure: one(departures, {
    fields: [inquiries.departureId],
    references: [departures.id],
  }),
}));

// ============================================
// КОМАНДА
// ============================================
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(), // "Основатель", "Автор туров"
  bio: text('bio'),
  photoUrl: varchar('photo_url', { length: 1000 }),
  
  position: integer('position').default(0),
  isActive: integer('is_active').default(1),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// ПРЕИМУЩЕСТВА (глобальные)
// ============================================
export const advantages = pgTable('advantages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }), // Имя иконки или SVG
  
  position: integer('position').default(0),
  isActive: integer('is_active').default(1),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// АУДИТ ЛОГ
// ============================================
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  entityType: varchar('entity_type', { length: 100 }).notNull(), // tour, article, page, etc.
  entityId: uuid('entity_id').notNull(),
  action: varchar('action', { length: 50 }).notNull(), // create, update, delete, publish
  
  changes: jsonb('changes'), // {field: {old: x, new: y}}
  
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_audit_entity').on(table.entityType, table.entityId),
  index('idx_audit_user').on(table.userId),
]);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

// ============================================
// ГЛОБАЛЬНЫЕ НАСТРОЙКИ
// ============================================
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 255 }).unique().notNull(),
  value: jsonb('value'),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Types
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type Advantage = typeof advantages.$inferSelect;
export type NewAdvantage = typeof advantages.$inferInsert;
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
