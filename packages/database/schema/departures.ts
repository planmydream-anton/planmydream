import { pgTable, uuid, date, decimal, integer, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tours } from './tours';

export const departures = pgTable('departures', {
  id: uuid('id').primaryKey().defaultRandom(),
  tourId: uuid('tour_id').notNull().references(() => tours.id, { onDelete: 'cascade' }),
  
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  
  spotsTotal: integer('spots_total').default(0),
  spotsBooked: integer('spots_booked').default(0),
  
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, sold_out, cancelled
  notes: text('notes'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_departures_tour').on(table.tourId),
  index('idx_departures_dates').on(table.startDate, table.endDate),
  index('idx_departures_status').on(table.status),
]);

export const departuresRelations = relations(departures, ({ one }) => ({
  tour: one(tours, {
    fields: [departures.tourId],
    references: [tours.id],
  }),
}));

export type Departure = typeof departures.$inferSelect;
export type NewDeparture = typeof departures.$inferInsert;
