import { pgTable, text, integer, uuid, pgEnum, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { mediaItems } from './base';

// Place-specific enums
export const placeCategoryEnum = pgEnum('place_category', [
  'RESTAURANT', 
  'CAFE', 
  'BAR', 
  'ATTRACTION', 
  'MUSEUM', 
  'PARK', 
  'HOTEL', 
  'OTHER'
]);

export const placeLocationTypeEnum = pgEnum('place_location_type', [
  'LOCAL', 
  'DOMESTIC', 
  'INTERNATIONAL'
]);

export const placePriceRangeEnum = pgEnum('place_price_range', [
  'INEXPENSIVE', 
  'MODERATE', 
  'EXPENSIVE', 
  'VERY_EXPENSIVE'
]);

// Places extension table
export const places = pgTable('places', {
  id: uuid('id').primaryKey().references(() => mediaItems.id, { onDelete: 'cascade' }),
  category: placeCategoryEnum('category').notNull(),
  address: text('address'),
  city: text('city').notNull(),
  state: text('state'),
  country: text('country').notNull(),
  postalCode: text('postal_code'),
  coordinates: jsonb('coordinates').$type<{ latitude: number; longitude: number }>(),
  website: text('website'),
  phone: text('phone'),
  priceRange: placePriceRangeEnum('price_range'),
  visitDate: timestamp('visit_date'),
  plannedDate: timestamp('planned_date'),
  locationType: placeLocationTypeEnum('location_type').notNull().default('LOCAL'),
  notes: text('notes'),
});

// Place photos (one-to-many)
export const placePhotos = pgTable('place_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption'),
  isPrimary: integer('is_primary').default(0),
  dateAdded: timestamp('date_added').defaultNow().notNull(),
}); 