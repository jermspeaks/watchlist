// UI Book type used throughout the application
import * as z from "zod"

// Define the status and source types as string literals for reuse
export type BookStatus = "wishlist" | "reading" | "completed";
export type DbBookStatus = "WISHLIST" | "IN_PROGRESS" | "COMPLETED";

export type BookSource = "amazon" | "kindle" | "kobo" | "physical" | "other";
export type DbBookSource = "AMAZON" | "KINDLE" | "KOBO" | "PHYSICAL" | "OTHER";

export type BookFormat = "PHYSICAL" | "EBOOK" | "AUDIOBOOK";

// UI Book interface - used in the frontend
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  aiDescription?: string;
  rating?: number;
  ranking?: number;
  tags?: string[];
  status: BookStatus;
  source: BookSource;
  sourceUrl?: string;
  coverUrl?: string; // We use coverUrl consistently in the UI
  imageUrl?: string; // For backward compatibility
  dateAdded: string;
  dateUpdated?: string;
  mediaType?: string;
  // Book-specific fields
  isbn?: string;
  isbn13?: string;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  format?: "physical" | "ebook" | "audiobook";
  language?: string;
  currentPage?: number;
  series?: string;
  seriesPosition?: number;
  edition?: string;
  translator?: string;
}

// Define a type for database book objects (with snake_case where needed)
export interface DbBook {
  id: string;
  title: string;
  description?: string | null;
  aiDescription?: string | null;
  rating?: number | null;
  ranking?: number | null;
  tags?: string[] | null;
  author?: string | null;
  status?: DbBookStatus | null;
  source?: DbBookSource | null;
  source_url?: string | null;
  image_url?: string | null;
  dateAdded?: Date;
  dateUpdated?: Date | null;
  mediaType?: string;
  // Book-specific fields
  isbn?: string | null;
  isbn13?: string | null;
  page_count?: number | null;
  publisher?: string | null;
  published_date?: string | null;
  format?: BookFormat | null;
  language?: string | null;
  current_page?: number | null;
  series?: string | null;
  series_position?: number | null;
  edition?: string | null;
  translator?: string | null;
  // For compatibility with repository
  bookSource?: DbBookSource | null;
}

// Zod schema for form validation
export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  isbn: z.string().optional(),
  isbn13: z.string().optional(),
  pageCount: z.coerce.number().optional(),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  coverUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["wishlist", "reading", "completed"]),
  source: z.enum(["amazon", "kindle", "kobo", "physical", "other"]),
  format: z.enum(["physical", "ebook", "audiobook"]).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  currentPage: z.coerce.number().optional(),
  series: z.string().optional(),
  seriesPosition: z.coerce.number().optional(),
  language: z.string().optional(),
  edition: z.string().optional(),
  translator: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Type for the form data when adding/editing a book
export interface BookFormData {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  isbn13?: string;
  coverUrl?: string;
  status: BookStatus;
  source: BookSource;
  format?: "physical" | "ebook" | "audiobook";
  rating?: number;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  currentPage?: number;
  series?: string;
  seriesPosition?: number;
  language?: string;
  edition?: string;
  translator?: string;
  tags?: string[];
}

// Helper function to map from database book to UI book
export function mapDbBookToUiBook(dbBook: DbBook): Book {
  // Status mapping
  const status = dbBook.status ? 
    (dbBook.status === 'WISHLIST' ? 'wishlist' : 
     dbBook.status === 'IN_PROGRESS' ? 'reading' : 
     dbBook.status === 'COMPLETED' ? 'completed' : 'wishlist') : 
    'wishlist';
  
  // Format date consistently
  const dateAdded = dbBook.dateAdded ? 
    new Date(dbBook.dateAdded).toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0];
  
  const dateUpdated = dbBook.dateUpdated ? 
    new Date(dbBook.dateUpdated).toISOString().split('T')[0] : 
    undefined;
  
  // Handle the case where imageUrl is available but coverUrl isn't
  const imageUrl = dbBook.image_url || null;
  
  // Map source from database format to UI format
  const source = dbBook.source ? 
    (dbBook.source === 'AMAZON' ? 'amazon' : 
     dbBook.source === 'KINDLE' ? 'kindle' : 
     dbBook.source === 'KOBO' ? 'kobo' : 
     dbBook.source === 'PHYSICAL' ? 'physical' : 
     dbBook.source === 'OTHER' ? 'other' : 'physical') : 
    'physical';
  
  // Map format if present
  const format = dbBook.format ? 
    dbBook.format.toLowerCase() as "physical" | "ebook" | "audiobook" : 
    undefined;
  
  return {
    id: dbBook.id || '',
    title: dbBook.title || '',
    author: dbBook.author || '',
    description: dbBook.description || '',
    aiDescription: dbBook.aiDescription || undefined,
    rating: dbBook.rating !== null && dbBook.rating !== undefined ? Number(dbBook.rating) : undefined,
    ranking: dbBook.ranking !== null && dbBook.ranking !== undefined ? Number(dbBook.ranking) : undefined,
    tags: dbBook.tags || undefined,
    status: status as BookStatus,
    source: source as BookSource,
    sourceUrl: dbBook.source_url || undefined,
    coverUrl: imageUrl || undefined,
    imageUrl: imageUrl || undefined,
    dateAdded,
    dateUpdated,
    mediaType: dbBook.mediaType || undefined,
    isbn: dbBook.isbn || undefined,
    isbn13: dbBook.isbn13 || undefined,
    pageCount: dbBook.page_count !== null && dbBook.page_count !== undefined ? Number(dbBook.page_count) : undefined,
    publisher: dbBook.publisher || undefined,
    publishedDate: dbBook.published_date || undefined,
    format,
    language: dbBook.language || undefined,
    currentPage: dbBook.current_page !== null && dbBook.current_page !== undefined ? Number(dbBook.current_page) : undefined,
    series: dbBook.series || undefined,
    seriesPosition: dbBook.series_position !== null && dbBook.series_position !== undefined ? Number(dbBook.series_position) : undefined,
    edition: dbBook.edition || undefined,
    translator: dbBook.translator || undefined,
  };
}

// Helper function to map from UI book to database book
export function mapUiBookToDbBook(bookData: BookFormData, existingBook?: Partial<DbBook>): DbBook {
  const dbBook: DbBook = {
    id: existingBook?.id || crypto.randomUUID(),
    title: bookData.title,
    author: bookData.author || null,
    description: bookData.description || null,
    rating: bookData.rating !== undefined ? bookData.rating : null,
    ...existingBook
  };

  // Status mapping
  if (bookData.status) {
    const statusMap: Record<BookStatus, DbBookStatus> = {
      'wishlist': 'WISHLIST',
      'reading': 'IN_PROGRESS',
      'completed': 'COMPLETED'
    };
    dbBook.status = statusMap[bookData.status];
  }

  // Source mapping
  if (bookData.source) {
    const sourceMap: Record<BookSource, DbBookSource> = {
      'amazon': 'AMAZON',
      'kindle': 'KINDLE',
      'kobo': 'KOBO',
      'physical': 'PHYSICAL',
      'other': 'OTHER'
    };
    dbBook.source = sourceMap[bookData.source];
  }
  
  // Format mapping
  if (bookData.format) {
    const formatMap: Record<string, BookFormat> = {
      'physical': 'PHYSICAL',
      'ebook': 'EBOOK',
      'audiobook': 'AUDIOBOOK'
    };
    dbBook.format = formatMap[bookData.format];
  }
  
  // Cover URL
  if (bookData.coverUrl) {
    dbBook.image_url = bookData.coverUrl;
  }

  // Tags
  if (bookData.tags) {
    dbBook.tags = bookData.tags;
  }

  // Other fields
  if (bookData.isbn !== undefined) dbBook.isbn = bookData.isbn || null;
  if (bookData.isbn13 !== undefined) dbBook.isbn13 = bookData.isbn13 || null;
  if (bookData.pageCount !== undefined) dbBook.page_count = bookData.pageCount || null;
  if (bookData.publisher !== undefined) dbBook.publisher = bookData.publisher || null;
  if (bookData.publishedDate !== undefined) dbBook.published_date = bookData.publishedDate || null;
  if (bookData.currentPage !== undefined) dbBook.current_page = bookData.currentPage || null;
  if (bookData.series !== undefined) dbBook.series = bookData.series || null;
  if (bookData.seriesPosition !== undefined) dbBook.series_position = bookData.seriesPosition || null;
  if (bookData.language !== undefined) dbBook.language = bookData.language || null;
  if (bookData.edition !== undefined) dbBook.edition = bookData.edition || null;
  if (bookData.translator !== undefined) dbBook.translator = bookData.translator || null;
  
  // Update timestamp
  dbBook.dateUpdated = new Date();
  
  return dbBook;
} 