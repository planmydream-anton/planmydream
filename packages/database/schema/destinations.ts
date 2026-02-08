import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const destinations = pgTable('destinations', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }),
  description: text('description'),
  coverImageUrl: varchar('cover_image_url', { length: 1000 }),
  
  // SEO
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Destination = typeof destinations.$inferSelect;
export type NewDestination = typeof destinations.$inferInsert;
