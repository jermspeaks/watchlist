import { pgTable, text, integer, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { mediaItems } from './base';

// Book-specific enums
export const bookFormatEnum = pgEnum('book_format', ['PHYSICAL', 'EBOOK', 'AUDIOBOOK']);
export const bookSourceEnum = pgEnum('book_source', ['AMAZON', 'KINDLE', 'KOBO', 'PHYSICAL', 'OTHER']);

// Books extension table
export const books = pgTable('books', {
  id: uuid('id').primaryKey().references(() => mediaItems.id, { onDelete: 'cascade' }),
  isbn: text('isbn'),
  isbn13: text('isbn13'),
  pageCount: integer('page_count'),
  publisher: text('publisher'),
  publishedDate: text('published_date'),
  format: bookFormatEnum('format'),
  source: bookSourceEnum('source'),
  language: text('language'),
  currentPage: integer('current_page'),
  series: text('series'),
  seriesPosition: integer('series_position'),
  edition: text('edition'),
  translator: text('translator'),
});

// Book authors (many-to-many)
export const bookAuthors = pgTable('book_authors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  biography: text('biography'),
});

// Book to authors relationship
export const bookToAuthors = pgTable('book_to_authors', {
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => bookAuthors.id, { onDelete: 'cascade' }),
});

// Book genres
export const bookGenres = pgTable('book_genres', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

// Book to genres relationship
export const bookToGenres = pgTable('book_to_genres', {
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  genreId: uuid('genre_id').notNull().references(() => bookGenres.id, { onDelete: 'cascade' }),
}); 