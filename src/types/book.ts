// UI Book type used throughout the application
import * as z from "zod"

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  rating?: number;
  status: "wishlist" | "reading" | "completed";
  source: "amazon" | "kindle" | "kobo" | "physical";
  coverUrl?: string; // We use coverUrl consistently in the UI
  dateAdded: string;
  isbn?: string;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  currentPage?: number;
}

// Database book type (simplified for mapping purposes)
export interface DbBook {
  id: string;
  title: string;
  author?: string | null;
  description?: string | null;
  rating?: number | null;
  status: string;
  source?: string | null;
  bookSource?: string | null;
  imageUrl?: string | null;
  dateAdded?: Date | null;
  isbn?: string | null;
  pageCount?: number | null;
  publisher?: string | null;
  publishedDate?: string | null;
  currentPage?: number | null;
  dateUpdated?: Date | null;
  [key: string]: unknown; // Allow for additional properties with unknown type
}

// Zod schema for form validation
export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  isbn: z.string().optional(),
  pageCount: z.coerce.number().optional(),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  coverUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["wishlist", "reading", "completed"]),
  source: z.enum(["amazon", "kindle", "kobo", "physical"]),
  rating: z.coerce.number().min(0).max(5).optional(),
  currentPage: z.coerce.number().optional(),
})

// Type for the form data when adding/editing a book
export interface BookFormData {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  coverUrl?: string; // We use coverUrl consistently in the UI
  status: 'wishlist' | 'reading' | 'completed';
  source: 'amazon' | 'kindle' | 'kobo' | 'physical';
  rating?: number;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  currentPage?: number;
}

// Helper function to map from database book to UI book
export function mapDbBookToUiBook(dbBook: DbBook): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author || '',
    description: dbBook.description || '',
    rating: dbBook.rating ?? undefined,
    status: dbBook.status === 'WISHLIST' ? 'wishlist' : 
            dbBook.status === 'IN_PROGRESS' ? 'reading' : 'completed',
    source: (dbBook.bookSource?.toLowerCase() || 'physical') as "amazon" | "kindle" | "kobo" | "physical",
    coverUrl: dbBook.imageUrl || undefined, // Map imageUrl from DB to coverUrl for UI
    dateAdded: dbBook.dateAdded ? dbBook.dateAdded.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isbn: dbBook.isbn || undefined,
    pageCount: dbBook.pageCount ?? undefined,
    publisher: dbBook.publisher || undefined,
    publishedDate: dbBook.publishedDate || undefined,
    currentPage: dbBook.currentPage ?? undefined,
  };
}

// Helper function to map from UI book form data to database book
export function mapUiBookToDbBook(bookData: BookFormData, existingBook?: Partial<DbBook>): DbBook {
  const dbBook = { ...(existingBook || {}), id: existingBook?.id || '' } as DbBook;
  
  if (bookData.title) dbBook.title = bookData.title;
  if (bookData.description !== undefined) dbBook.description = bookData.description || null;
  if (bookData.author) dbBook.author = bookData.author;
  
  // Map status
  if (bookData.status) {
    const statusMap = {
      'wishlist': 'WISHLIST',
      'reading': 'IN_PROGRESS',
      'completed': 'COMPLETED',
    } as const;
    dbBook.status = statusMap[bookData.status];
  }
  
  // Map source
  if (bookData.source) {
    const sourceMap = {
      'amazon': 'AMAZON',
      'kindle': 'KINDLE',
      'kobo': 'KOBO',
      'physical': 'PHYSICAL',
    } as const;
    dbBook.source = bookData.source.toUpperCase();
    dbBook.bookSource = sourceMap[bookData.source];
  }
  
  // Map coverUrl to imageUrl for DB
  if (bookData.coverUrl !== undefined) dbBook.imageUrl = bookData.coverUrl || null;
  
  // Other fields
  if (bookData.isbn !== undefined) dbBook.isbn = bookData.isbn || null;
  if (bookData.pageCount !== undefined) dbBook.pageCount = bookData.pageCount || null;
  if (bookData.publisher !== undefined) dbBook.publisher = bookData.publisher || null;
  if (bookData.publishedDate !== undefined) dbBook.publishedDate = bookData.publishedDate || null;
  if (bookData.currentPage !== undefined) dbBook.currentPage = bookData.currentPage || null;
  if (bookData.rating !== undefined) dbBook.rating = bookData.rating || null;
  
  // Always update the dateUpdated field
  dbBook.dateUpdated = new Date();
  
  return dbBook;
} 