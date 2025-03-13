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
  imageUrl?: string; // For backward compatibility
  dateAdded: string;
  isbn?: string;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  currentPage?: number;
}

// Define a type for database book objects (with snake_case)
export interface DbBook {
  id: string;
  title: string;
  author?: string | null;
  description?: string | null;
  rating?: number | null;
  status?: string;
  source?: string;
  image_url?: string | null;
  imageUrl?: string | null;
  date_added?: string | Date;
  isbn?: string | null;
  page_count?: number | null;
  publisher?: string | null;
  published_date?: string | null;
  current_page?: number | null;
  dateUpdated?: Date | null;
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
  const status = dbBook.status ? 
    (dbBook.status === 'to_read' ? 'wishlist' : 
     dbBook.status === 'in_progress' ? 'reading' : 
     dbBook.status === 'finished' ? 'completed' : 'wishlist') : 
    'wishlist';
  
  // Format date consistently
  const dateAdded = dbBook.date_added ? 
    new Date(dbBook.date_added).toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0];
  
  // Handle the case where imageUrl is available but coverUrl isn't
  const imageUrl = dbBook.image_url || dbBook.imageUrl || null;
  
  return {
    id: dbBook.id || '',
    title: dbBook.title || '',
    author: dbBook.author || '',
    description: dbBook.description || '',
    rating: dbBook.rating !== undefined ? Number(dbBook.rating) : undefined,
    status: status as "wishlist" | "reading" | "completed",
    source: (dbBook.source || 'physical') as "amazon" | "kindle" | "kobo" | "physical",
    coverUrl: imageUrl,
    imageUrl: imageUrl,
    dateAdded,
    isbn: dbBook.isbn || undefined,
    pageCount: dbBook.page_count !== undefined ? Number(dbBook.page_count) : undefined,
    publisher: dbBook.publisher || undefined,
    publishedDate: dbBook.published_date || undefined,
    currentPage: dbBook.current_page !== undefined ? Number(dbBook.current_page) : undefined,
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
    const statusMap = {
      'wishlist': 'to_read',
      'reading': 'in_progress',
      'completed': 'finished'
    } as const;
    dbBook.status = statusMap[bookData.status];
  }

  // Source mapping
  if (bookData.source) {
    dbBook.source = bookData.source.toUpperCase();
  }
  
  // Cover URL (handle either coverUrl or imageUrl)
  if (bookData.coverUrl) {
    dbBook.image_url = bookData.coverUrl;
  }

  // Other fields
  if (bookData.isbn !== undefined) dbBook.isbn = bookData.isbn || null;
  if (bookData.pageCount !== undefined) dbBook.page_count = bookData.pageCount || null;
  if (bookData.publisher !== undefined) dbBook.publisher = bookData.publisher || null;
  if (bookData.publishedDate !== undefined) dbBook.published_date = bookData.publishedDate || null;
  if (bookData.currentPage !== undefined) dbBook.current_page = bookData.currentPage || null;
  
  // Update timestamp
  dbBook.dateUpdated = new Date();
  
  return dbBook;
} 