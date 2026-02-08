import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tours } from './tours';
import { users } from './users';

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Файл
  filename: varchar('filename', { length: 500 }).notNull(),
  originalFilename: varchar('original_filename', { length: 500 }),
  url: varchar('url', { length: 1000 }).notNull(),
  
  // Метаданные
  type: varchar('type', { length: 50 }).notNull(), // image, video
  mimeType: varchar('mime_type', { length: 100 }),
  sizeBytes: integer('size_bytes'),
  width: integer('width'),
  height: integer('height'),
  
  // Для поиска и организации
  altText: varchar('alt_text', { length: 500 }),
  caption: text('caption'),
  tags: text('tags').array(), // ['камчатка', 'вулкан', 'лето']
  
  // Если видео
  videoProvider: varchar('video_provider', { length: 50 }), // youtube, vimeo
  videoId: varchar('video_id', { length: 100 }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.id),
}, (table) => [
  index('idx_media_type').on(table.type),
]);

export const mediaRelations = relations(media, ({ one }) => ({
  createdByUser: one(users, {
    fields: [media.createdBy],
    references: [users.id],
  }),
}));

// Связь туров и медиа (many-to-many для переиспользования)
export const tourMedia = pgTable('tour_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  tourId: uuid('tour_id').notNull().references(() => tours.id, { onDelete: 'cascade' }),
  mediaId: uuid('media_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
  
  position: integer('position').default(0), // Порядок в галерее
  isCover: boolean('is_cover').default(false), // Главное фото тура
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_tour_media_tour').on(table.tourId),
  index('idx_tour_media_media').on(table.mediaId),
]);

export const tourMediaRelations = relations(tourMedia, ({ one }) => ({
  tour: one(tours, {
    fields: [tourMedia.tourId],
    references: [tours.id],
  }),
  media: one(media, {
    fields: [tourMedia.mediaId],
    references: [media.id],
  }),
}));

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type TourMedia = typeof tourMedia.$inferSelect;
export type NewTourMedia = typeof tourMedia.$inferInsert;
