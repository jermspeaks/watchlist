import { pgTable, serial, text, timestamp, integer, pgEnum, jsonb, uuid } from 'drizzle-orm/pg-core';

// Define status enum
export const mediaStatusEnum = pgEnum('media_status', ['WISHLIST', 'IN_PROGRESS', 'COMPLETED']);

// Base media table
export const mediaItems = pgTable('media_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  aiDescription: text('ai_description'),
  rating: integer('rating'),
  ranking: integer('ranking'),
  tags: jsonb('tags').$type<string[]>().default([]),
  author: text('author'),
  dateAdded: timestamp('date_added').defaultNow().notNull(),
  dateUpdated: timestamp('date_updated').defaultNow().notNull(),
  status: mediaStatusEnum('status').notNull().default('WISHLIST'),
  source: text('source'),
  sourceUrl: text('source_url'),
  // Common fields that might be used across multiple media types
  imageUrl: text('image_url'),
  mediaType: text('media_type').notNull(), // 'book', 'film', 'tv_show', 'video_game', etc.
});

// Tags table for better tag management
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  dateAdded: timestamp('date_added').defaultNow().notNull(),
});

// Media to tags many-to-many relationship
export const mediaToTags = pgTable('media_to_tags', {
  mediaId: uuid('media_id').notNull().references(() => mediaItems.id, { onDelete: 'cascade' }),
  tagId: serial('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

// User preferences for filters, etc.
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // Will link to auth system later
  preferences: jsonb('preferences').default({}),
  dateUpdated: timestamp('date_updated').defaultNow().notNull(),
});

// Recently viewed items
export const recentlyViewed = pgTable('recently_viewed', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  mediaId: uuid('media_id').notNull().references(() => mediaItems.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
}); 