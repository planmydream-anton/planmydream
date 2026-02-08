import { pgTable, uuid, varchar, text, integer, date, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tours } from './tours';
import { users } from './users';
import { media } from './media';

// ============================================
// ОТЗЫВЫ
// ============================================
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  tourId: uuid('tour_id').references(() => tours.id),
  
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorPhotoUrl: varchar('author_photo_url', { length: 1000 }),
  
  rating: integer('rating'), // 1-5
  text: text('text').notNull(),
  travelDate: date('travel_date'),
  
  // Модерация
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, rejected
  
  position: integer('position').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_reviews_tour').on(table.tourId),
  index('idx_reviews_status').on(table.status),
]);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  tour: one(tours, {
    fields: [reviews.tourId],
    references: [tours.id],
  }),
}));

// ============================================
// СТАТЬИ / БЛОГ
// ============================================
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content'), // Markdown/HTML
  coverImageUrl: varchar('cover_image_url', { length: 1000 }),
  
  // Категоризация
  category: varchar('category', { length: 100 }), // blog, news, guide
  tags: text('tags').array(),
  
  // SEO
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.id),
}, (table) => [
  index('idx_articles_status').on(table.status),
  index('idx_articles_category').on(table.category),
  index('idx_articles_slug').on(table.slug),
]);

export const articlesRelations = relations(articles, ({ one }) => ({
  createdByUser: one(users, {
    fields: [articles.createdBy],
    references: [users.id],
  }),
}));

// ============================================
// СТАТИЧЕСКИЕ СТРАНИЦЫ
// ============================================
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content'),
  template: varchar('template', { length: 100 }).default('default'), // default, landing, faq
  
  // SEO
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// FAQ
// ============================================
export const faqs = pgTable('faqs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }),
  position: integer('position').default(0),
  
  // Можно привязать к туру или направлению
  tourId: uuid('tour_id').references(() => tours.id),
  
  status: varchar('status', { length: 20 }).default('published').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const faqsRelations = relations(faqs, ({ one }) => ({
  tour: one(tours, {
    fields: [faqs.tourId],
    references: [tours.id],
  }),
}));

// Types
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Faq = typeof faqs.$inferSelect;
export type NewFaq = typeof faqs.$inferInsert;
