import { BaseRepository } from './base-repository';
import { books, mediaItems } from '../schema';
import { db } from '../index';
import { eq, and, like, desc, asc, sql } from 'drizzle-orm';

// Define the Book type based on our schema
export interface Book {
  id: string;
  title: string;
  description: string | null;
  aiDescription: string | null;
  rating: number | null;
  ranking: number | null;
  tags: string[];
  author: string | null;
  dateAdded: Date;
  dateUpdated: Date;
  status: 'WISHLIST' | 'IN_PROGRESS' | 'COMPLETED';
  source: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  mediaType: string;
  // Book-specific fields
  isbn: string | null;
  isbn13: string | null;
  pageCount: number | null;
  publisher: string | null;
  publishedDate: string | null;
  format: 'PHYSICAL' | 'EBOOK' | 'AUDIOBOOK' | null;
  bookSource: 'AMAZON' | 'KINDLE' | 'KOBO' | 'PHYSICAL' | 'OTHER' | null;
  language: string | null;
  currentPage: number | null;
  series: string | null;
  seriesPosition: number | null;
  edition: string | null;
  translator: string | null;
}

export class BooksRepository extends BaseRepository<Book> {
  constructor() {
    super(books);
  }

  // Override create to handle the media item and book in a transaction
  async create(data: Omit<Book, 'id'>): Promise<Book> {
    return db.transaction(async (tx) => {
      // First create the media item
      const mediaData = {
        title: data.title,
        description: data.description,
        aiDescription: data.aiDescription,
        rating: data.rating,
        ranking: data.ranking,
        tags: data.tags,
        author: data.author,
        status: data.status,
        source: data.source,
        sourceUrl: data.sourceUrl,
        imageUrl: data.imageUrl,
        mediaType: 'book',
      };

      const [mediaResult] = await tx
        .insert(mediaItems)
        .values(mediaData)
        .returning();

      // Then create the book with the same ID
      const bookData = {
        id: mediaResult.id,
        isbn: data.isbn,
        isbn13: data.isbn13,
        pageCount: data.pageCount,
        publisher: data.publisher,
        publishedDate: data.publishedDate,
        format: data.format,
        source: data.bookSource,
        language: data.language,
        currentPage: data.currentPage,
        series: data.series,
        seriesPosition: data.seriesPosition,
        edition: data.edition,
        translator: data.translator,
      };

      await tx.insert(books).values(bookData);

      // Return the combined data
      return {
        ...mediaResult,
        ...bookData,
        bookSource: bookData.source,
      } as unknown as Book;
    });
  }

  // Override findById to join the media item and book
  async findById(id: string): Promise<Book | undefined> {
    const results = await db
      .select()
      .from(mediaItems)
      .leftJoin(books, eq(mediaItems.id, books.id))
      .where(eq(mediaItems.id, id))
      .limit(1);

    if (results.length === 0) {
      return undefined;
    }

    const [result] = results;
    return this.mapToBook(result);
  }

  // Find books with filtering and sorting
  async findBooks({
    search,
    status,
    source,
    sortBy = 'dateAdded',
    sortDirection = 'desc',
    page = 1,
    pageSize = 10,
  }: {
    search?: string;
    status?: string;
    source?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Book[]; total: number }> {
    const offset = (page - 1) * pageSize;
    
    // Build the query
    let query = db
      .select()
      .from(mediaItems)
      .leftJoin(books, eq(mediaItems.id, books.id))
      .where(eq(mediaItems.mediaType, 'book'));

    // Apply filters
    if (search) {
      query = query.where(
        like(mediaItems.title, `%${search}%`)
      );
    }

    if (status && status !== 'all') {
      query = query.where(eq(mediaItems.status, status.toUpperCase()));
    }

    if (source && source !== 'all') {
      query = query.where(eq(books.source, source.toUpperCase()));
    }

    // Count total before pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(mediaItems)
      .leftJoin(books, eq(mediaItems.id, books.id))
      .where(eq(mediaItems.mediaType, 'book'));

    const total = countResult[0]?.count || 0;

    // Apply sorting
    if (sortDirection === 'asc') {
      if (sortBy === 'title') {
        query = query.orderBy(asc(mediaItems.title));
      } else if (sortBy === 'dateAdded') {
        query = query.orderBy(asc(mediaItems.dateAdded));
      } else if (sortBy === 'rating') {
        query = query.orderBy(asc(mediaItems.rating));
      }
    } else {
      if (sortBy === 'title') {
        query = query.orderBy(desc(mediaItems.title));
      } else if (sortBy === 'dateAdded') {
        query = query.orderBy(desc(mediaItems.dateAdded));
      } else if (sortBy === 'rating') {
        query = query.orderBy(desc(mediaItems.rating));
      }
    }

    // Apply pagination
    query = query.limit(pageSize).offset(offset);

    // Execute the query
    const results = await query;

    // Map the results
    const data = results.map(this.mapToBook);

    return { data, total };
  }

  // Helper to map joined results to a Book object
  private mapToBook(result: any): Book {
    // Log the raw database row to see what's being received
    console.log('Raw DB row:', {
      id: result.media_items?.id,
      title: result.media_items?.title,
      imageUrl: result.media_items?.imageUrl,
      hasImageUrl: !!result.media_items?.imageUrl
    });
    
    const mediaItem = result.media_items;
    const book = result.books;

    return {
      id: mediaItem.id,
      title: mediaItem.title,
      description: mediaItem.description,
      aiDescription: mediaItem.ai_description,
      rating: mediaItem.rating,
      ranking: mediaItem.ranking,
      tags: mediaItem.tags,
      author: mediaItem.author,
      dateAdded: mediaItem.date_added,
      dateUpdated: mediaItem.date_updated,
      status: mediaItem.status,
      source: mediaItem.source,
      sourceUrl: mediaItem.source_url,
      imageUrl: mediaItem.imageUrl,
      mediaType: mediaItem.media_type,
      // Book-specific fields
      isbn: book?.isbn,
      isbn13: book?.isbn13,
      pageCount: book?.page_count,
      publisher: book?.publisher,
      publishedDate: book?.published_date,
      format: book?.format,
      bookSource: book?.source,
      language: book?.language,
      currentPage: book?.current_page,
      series: book?.series,
      seriesPosition: book?.series_position,
      edition: book?.edition,
      translator: book?.translator,
    };
  }
} 