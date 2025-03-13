import { BaseRepository } from './base-repository';
import { books, mediaItems } from '../schema';
import { db } from '../index';
import { eq, like, desc, asc, sql } from 'drizzle-orm';

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
  image_url: string | null;
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

  // Override update to handle both media item and book in a transaction
  async update(id: string, data: Partial<Omit<Book, 'id'>>): Promise<Book | undefined> {
    return db.transaction(async (tx) => {
      // Check if the media item exists
      const existingMedia = await tx
        .select()
        .from(mediaItems)
        .where(eq(mediaItems.id, id))
        .limit(1);

      if (existingMedia.length === 0) {
        return undefined;
      }

      // Prepare media item data
      const mediaData: Record<string, unknown> = {
        dateUpdated: new Date(),
      };

      // Copy relevant fields to media item update
      if (data.title !== undefined) mediaData.title = data.title;
      if (data.description !== undefined) mediaData.description = data.description;
      if (data.aiDescription !== undefined) mediaData.aiDescription = data.aiDescription;
      if (data.rating !== undefined) mediaData.rating = data.rating;
      if (data.ranking !== undefined) mediaData.ranking = data.ranking;
      if (data.tags !== undefined) mediaData.tags = data.tags;
      if (data.author !== undefined) mediaData.author = data.author;
      
      // Ensure status is one of the valid enum values
      if (data.status !== undefined) {
        // Map UI status to database status if needed
        if (data.status === 'IN_PROGRESS') {
          mediaData.status = 'IN_PROGRESS';
        } else if (data.status === 'WISHLIST') {
          mediaData.status = 'WISHLIST';
        } else if (data.status === 'COMPLETED') {
          mediaData.status = 'COMPLETED';
        } else if (data.status === 'to_read' || data.status === 'wishlist') {
          mediaData.status = 'WISHLIST';
        } else if (data.status === 'in_progress' || data.status === 'reading') {
          mediaData.status = 'IN_PROGRESS';
        } else if (data.status === 'finished' || data.status === 'completed') {
          mediaData.status = 'COMPLETED';
        }
      }
      
      // Handle source mapping
      if (data.source !== undefined) {
        // Map UI source to database source if needed
        if (data.source === 'AMAZON' || data.source === 'amazon') {
          mediaData.source = 'AMAZON';
        } else if (data.source === 'KINDLE' || data.source === 'kindle') {
          mediaData.source = 'KINDLE';
        } else if (data.source === 'KOBO' || data.source === 'kobo') {
          mediaData.source = 'KOBO';
        } else if (data.source === 'PHYSICAL' || data.source === 'physical') {
          mediaData.source = 'PHYSICAL';
        } else if (data.source === 'OTHER' || data.source === 'other') {
          mediaData.source = 'OTHER';
        } else if (data.source) {
          mediaData.source = data.source.toUpperCase();
        }
      }
      
      if (data.sourceUrl !== undefined) mediaData.sourceUrl = data.sourceUrl;
      if (data.image_url !== undefined) mediaData.imageUrl = data.image_url;

      // Update the media item
      await tx
        .update(mediaItems)
        .set(mediaData)
        .where(eq(mediaItems.id, id))
        .returning();

      // Check if the book exists
      const existingBook = await tx
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

      // Prepare book data
      const bookData: Record<string, unknown> = {};

      // Copy book-specific fields
      if (data.isbn !== undefined) bookData.isbn = data.isbn;
      if (data.isbn13 !== undefined) bookData.isbn13 = data.isbn13;
      if (data.pageCount !== undefined) bookData.pageCount = data.pageCount;
      if (data.publisher !== undefined) bookData.publisher = data.publisher;
      if (data.publishedDate !== undefined) bookData.publishedDate = data.publishedDate;
      if (data.format !== undefined) bookData.format = data.format;
      if (data.bookSource !== undefined) bookData.source = data.bookSource;
      if (data.language !== undefined) bookData.language = data.language;
      if (data.currentPage !== undefined) bookData.currentPage = data.currentPage;
      if (data.series !== undefined) bookData.series = data.series;
      if (data.seriesPosition !== undefined) bookData.seriesPosition = data.seriesPosition;
      if (data.edition !== undefined) bookData.edition = data.edition;
      if (data.translator !== undefined) bookData.translator = data.translator;

      // If book exists, update it; otherwise, create it
      if (existingBook.length > 0) {
        if (Object.keys(bookData).length > 0) {
          await tx
            .update(books)
            .set(bookData)
            .where(eq(books.id, id));
        }
      } else if (Object.keys(bookData).length > 0) {
        // Create a new book entry with the same ID
        await tx
          .insert(books)
          .values({
            id,
            ...bookData,
          });
      }

      // Return the updated book
      return this.findById(id);
    });
  }

  // Override delete to handle both media item and book in a transaction
  async delete(id: string): Promise<boolean> {
    return db.transaction(async (tx) => {
      // First check if the book exists
      const existingBook = await tx
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

      // Delete the book if it exists
      if (existingBook.length > 0) {
        await tx
          .delete(books)
          .where(eq(books.id, id));
      }

      // Then delete the media item
      const deletedMedia = await tx
        .delete(mediaItems)
        .where(eq(mediaItems.id, id))
        .returning();

      return deletedMedia.length > 0;
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
  private mapToBook(result: Record<string, unknown>): Book {
    // Log the raw database row to see what's being received
    // console.log('Raw DB row:', {
    //   id: result.media_items?.id,
    //   title: result.media_items?.title,
    //   imageUrl: result.media_items?.imageUrl,
    //   hasImageUrl: !!result.media_items?.imageUrl
    // });
    
    const mediaItem = result.media_items as Record<string, unknown>;
    const book = result.books as Record<string, unknown> | null;

    return {
      id: mediaItem.id as string,
      title: mediaItem.title as string,
      description: mediaItem.description as string | null,
      aiDescription: mediaItem.ai_description as string | null,
      rating: mediaItem.rating as number | null,
      ranking: mediaItem.ranking as number | null,
      tags: mediaItem.tags as string[],
      author: mediaItem.author as string | null,
      dateAdded: mediaItem.date_added as Date,
      dateUpdated: mediaItem.date_updated as Date,
      status: mediaItem.status as 'WISHLIST' | 'IN_PROGRESS' | 'COMPLETED',
      source: mediaItem.source as string | null,
      sourceUrl: mediaItem.source_url as string | null,
      imageUrl: mediaItem.imageUrl as string | null,
      image_url: mediaItem.imageUrl as string | null,
      mediaType: mediaItem.media_type as string,
      // Book-specific fields
      isbn: book?.isbn as string | null,
      isbn13: book?.isbn13 as string | null,
      pageCount: book?.page_count as number | null,
      publisher: book?.publisher as string | null,
      publishedDate: book?.published_date as string | null,
      format: book?.format as 'PHYSICAL' | 'EBOOK' | 'AUDIOBOOK' | null,
      bookSource: book?.source as 'AMAZON' | 'KINDLE' | 'KOBO' | 'PHYSICAL' | 'OTHER' | null,
      language: book?.language as string | null,
      currentPage: book?.current_page as number | null,
      series: book?.series as string | null,
      seriesPosition: book?.series_position as number | null,
      edition: book?.edition as string | null,
      translator: book?.translator as string | null,
    };
  }
} 