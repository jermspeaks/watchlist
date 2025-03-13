import { BaseRepository } from "./base-repository";
import { books, mediaItems } from "../schema";
import { db } from "../index";
import { eq, like, desc, asc, sql, and } from "drizzle-orm";
import {
  Book,
  DbBook,
  DbBookStatus,
  DbBookSource,
  BookFormat,
  mapDbBookToUiBook,
  mapUiBookToDbBook,
  BookFormData,
} from "@/types/book";

// Create a custom repository that extends BaseRepository but overrides the types
export class BooksRepository extends BaseRepository<Book> {
  constructor() {
    super(books);
  }

  // Create a new book
  async create(data: Omit<Book, "id">): Promise<Book> {
    // Convert UI Book to DbBook
    const dbData = mapUiBookToDbBook(data as BookFormData);

    return db.transaction(async (tx) => {
      // First create the media item
      const mediaData = {
        title: dbData.title,
        description: dbData.description,
        aiDescription: dbData.aiDescription,
        rating: dbData.rating,
        ranking: dbData.ranking,
        tags: dbData.tags || [],
        author: dbData.author,
        status: dbData.status || "WISHLIST",
        source: dbData.source,
        sourceUrl: dbData.source_url,
        imageUrl: dbData.image_url,
        mediaType: "book",
      };

      const [mediaResult] = await tx
        .insert(mediaItems)
        .values(mediaData)
        .returning();

      // Then create the book with the same ID
      const bookData = {
        id: mediaResult.id,
        isbn: dbData.isbn,
        isbn13: dbData.isbn13,
        pageCount: dbData.page_count,
        publisher: dbData.publisher,
        publishedDate: dbData.published_date,
        format: dbData.format,
        source: dbData.source,
        language: dbData.language,
        currentPage: dbData.current_page,
        series: dbData.series,
        seriesPosition: dbData.series_position,
        edition: dbData.edition,
        translator: dbData.translator,
      };

      await tx.insert(books).values(bookData);

      // Return the combined data as a UI Book
      const createdDbBook: DbBook = {
        ...mediaResult,
        ...bookData,
        bookSource: bookData.source,
      } as unknown as DbBook;

      return mapDbBookToUiBook(createdDbBook);
    });
  }

  // Override update to handle both media item and book in a transaction
  async update(
    id: string,
    data: Partial<Omit<Book, "id">>
  ): Promise<Book | undefined> {
    // Convert UI Book partial to DbBook partial
    const dbData: Partial<Omit<DbBook, "id">> = {};

    // Map fields from UI format to DB format
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.aiDescription !== undefined)
      dbData.aiDescription = data.aiDescription;
    if (data.rating !== undefined) dbData.rating = data.rating;
    if (data.ranking !== undefined) dbData.ranking = data.ranking;
    if (data.tags !== undefined) dbData.tags = data.tags;
    if (data.author !== undefined) dbData.author = data.author;
    if (data.status !== undefined) {
      const statusMap: Record<string, DbBookStatus> = {
        wishlist: "WISHLIST",
        reading: "IN_PROGRESS",
        completed: "COMPLETED",
      };
      dbData.status = statusMap[data.status];
    }
    if (data.source !== undefined) {
      const sourceMap: Record<string, DbBookSource> = {
        amazon: "AMAZON",
        kindle: "KINDLE",
        kobo: "KOBO",
        physical: "PHYSICAL",
        other: "OTHER",
      };
      dbData.source = sourceMap[data.source];
    }
    if (data.sourceUrl !== undefined) dbData.source_url = data.sourceUrl;
    if (data.coverUrl !== undefined) dbData.image_url = data.coverUrl;
    if (data.isbn !== undefined) dbData.isbn = data.isbn;
    if (data.isbn13 !== undefined) dbData.isbn13 = data.isbn13;
    if (data.pageCount !== undefined) dbData.page_count = data.pageCount;
    if (data.publisher !== undefined) dbData.publisher = data.publisher;
    if (data.publishedDate !== undefined)
      dbData.published_date = data.publishedDate;
    if (data.format !== undefined) {
      const formatMap: Record<string, BookFormat> = {
        physical: "PHYSICAL",
        ebook: "EBOOK",
        audiobook: "AUDIOBOOK",
      };
      dbData.format = formatMap[data.format];
    }
    if (data.language !== undefined) dbData.language = data.language;
    if (data.currentPage !== undefined) dbData.current_page = data.currentPage;
    if (data.series !== undefined) dbData.series = data.series;
    if (data.seriesPosition !== undefined)
      dbData.series_position = data.seriesPosition;
    if (data.edition !== undefined) dbData.edition = data.edition;
    if (data.translator !== undefined) dbData.translator = data.translator;

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
      if (dbData.title !== undefined) mediaData.title = dbData.title;
      if (dbData.description !== undefined)
        mediaData.description = dbData.description;
      if (dbData.aiDescription !== undefined)
        mediaData.aiDescription = dbData.aiDescription;
      if (dbData.rating !== undefined) mediaData.rating = dbData.rating;
      if (dbData.ranking !== undefined) mediaData.ranking = dbData.ranking;
      if (dbData.tags !== undefined) mediaData.tags = dbData.tags;
      if (dbData.author !== undefined) mediaData.author = dbData.author;
      if (dbData.status !== undefined) mediaData.status = dbData.status;
      if (dbData.source !== undefined) mediaData.source = dbData.source;
      if (dbData.source_url !== undefined)
        mediaData.sourceUrl = dbData.source_url;
      if (dbData.image_url !== undefined) mediaData.imageUrl = dbData.image_url;

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
      if (dbData.isbn !== undefined) bookData.isbn = dbData.isbn;
      if (dbData.isbn13 !== undefined) bookData.isbn13 = dbData.isbn13;
      if (dbData.page_count !== undefined)
        bookData.pageCount = dbData.page_count;
      if (dbData.publisher !== undefined) bookData.publisher = dbData.publisher;
      if (dbData.published_date !== undefined)
        bookData.publishedDate = dbData.published_date;
      if (dbData.format !== undefined) bookData.format = dbData.format;
      if (dbData.bookSource !== undefined) bookData.source = dbData.bookSource;
      if (dbData.language !== undefined) bookData.language = dbData.language;
      if (dbData.current_page !== undefined)
        bookData.currentPage = dbData.current_page;
      if (dbData.series !== undefined) bookData.series = dbData.series;
      if (dbData.series_position !== undefined)
        bookData.seriesPosition = dbData.series_position;
      if (dbData.edition !== undefined) bookData.edition = dbData.edition;
      if (dbData.translator !== undefined)
        bookData.translator = dbData.translator;

      // If book exists, update it; otherwise, create it
      if (existingBook.length > 0) {
        if (Object.keys(bookData).length > 0) {
          await tx.update(books).set(bookData).where(eq(books.id, id));
        }
      } else if (Object.keys(bookData).length > 0) {
        // Create a new book entry with the same ID
        await tx.insert(books).values({
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
        await tx.delete(books).where(eq(books.id, id));
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
    sortBy = "dateAdded",
    sortDirection = "desc",
    page = 1,
    pageSize = 10,
  }: {
    search?: string;
    status?: string;
    source?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Book[]; total: number }> {
    const offset = (page - 1) * pageSize;

    // Build conditions array
    const conditions = [eq(mediaItems.mediaType, "book")];

    if (search) {
      conditions.push(like(mediaItems.title, `%${search}%`));
    }

    if (status && status !== "all") {
      const dbStatus = status.toUpperCase() as DbBookStatus;
      conditions.push(eq(mediaItems.status, dbStatus));
    }

    if (source && source !== "all") {
      const dbSource = source.toUpperCase() as DbBookSource;
      conditions.push(eq(books.source, dbSource));
    }

    // Count total before pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(mediaItems)
      .leftJoin(books, eq(mediaItems.id, books.id))
      .where(and(...conditions));

    const total = countResult[0]?.count || 0;

    // Execute the main query with all conditions, sorting, and pagination
    let sortingField;
    if (sortBy === "title") {
      sortingField = mediaItems.title;
    } else if (sortBy === "dateAdded") {
      sortingField = mediaItems.dateAdded;
    } else if (sortBy === "rating") {
      sortingField = mediaItems.rating;
    } else {
      sortingField = mediaItems.dateAdded;
    }

    const sortFunction = sortDirection === "asc" ? asc : desc;

    const results = await db
      .select()
      .from(mediaItems)
      .leftJoin(books, eq(mediaItems.id, books.id))
      .where(and(...conditions))
      .orderBy(sortFunction(sortingField))
      .limit(pageSize)
      .offset(offset);

    // Map the results
    const data = results.map((result) => this.mapToBook(result));

    return { data, total };
  }

  // Helper to map joined results to a Book object
  private mapToBook(result: Record<string, unknown>): Book {
    // console.info("mapToBook", JSON.stringify(result, undefined, 0));
    const mediaItem = result.media_items as Partial<Book>;
    const book = result.books as Partial<Book>;

    // const bookData = { ...book, ...mediaItem } as Book;
    const dbBook: DbBook = {
      id: mediaItem.id as string,
      title: mediaItem.title as string,
      description: mediaItem.description as string | null,
      aiDescription: mediaItem.aiDescription as string | null,
      rating: mediaItem.rating as number | null,
      ranking: mediaItem.ranking as number | null,
      tags: mediaItem.tags as string[],
      author: mediaItem.author as string | null,
      status: mediaItem.status as DbBookStatus,
      source: mediaItem.source as DbBookSource | null,
      source_url: mediaItem.sourceUrl as string | null,
      image_url: mediaItem.imageUrl as string | null,
      dateAdded: mediaItem.dateAdded as Date,
      dateUpdated: mediaItem.dateUpdated as Date,
      mediaType: mediaItem.mediaType as string,
      // Book-specific fields
      isbn: book?.isbn as string | null,
      isbn13: book?.isbn13 as string | null,
      page_count: book?.pageCount as number | null,
      publisher: book?.publisher as string | null,
      published_date: book?.publishedDate as string | null,
      format: book?.format as BookFormat | null,
      bookSource: book?.source as DbBookSource | null,
      language: book?.language as string | null,
      current_page: book?.currentPage as number | null,
      series: book?.series as string | null,
      series_position: book?.seriesPosition as number | null,
      edition: book?.edition as string | null,
      translator: book?.translator as string | null,
    };

    // // Use the helper function from types/book.ts to map to UI Book
    // return bookData;
    return mapDbBookToUiBook(dbBook);
  }
}
