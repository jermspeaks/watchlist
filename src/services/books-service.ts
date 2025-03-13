import { BooksRepository } from '@/db/repositories/books-repository';
import { revalidatePath } from 'next/cache';
import type { Book } from '@/db/repositories/books-repository';

// Create an instance of the books repository
const booksRepository = new BooksRepository();

export interface BookFormData {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
  status: 'wishlist' | 'reading' | 'completed';
  source: 'amazon' | 'kindle' | 'kobo' | 'physical';
  rating?: number;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  currentPage?: number;
}

// Map UI status to database status
const statusMap = {
  'wishlist': 'WISHLIST',
  'reading': 'IN_PROGRESS',
  'completed': 'COMPLETED',
} as const;

// Map UI source to database source
const sourceMap = {
  'amazon': 'AMAZON',
  'kindle': 'KINDLE',
  'kobo': 'KOBO',
  'physical': 'PHYSICAL',
} as const;

export async function getBooks({
  search = '',
  status = 'all',
  source = 'all',
  sortBy = 'dateAdded',
  sortDirection = 'desc',
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  status?: string;
  source?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}) {
  try {
    // Convert UI status to database status if not 'all'
    const dbStatus = status !== 'all' ? statusMap[status as keyof typeof statusMap] : undefined;
    
    // Convert UI source to database source if not 'all'
    const dbSource = source !== 'all' ? sourceMap[source as keyof typeof sourceMap] : undefined;
    
    // Get books from the repository
    const result = await booksRepository.findBooks({
      search,
      status: dbStatus,
      source: dbSource,
      sortBy,
      sortDirection,
      page,
      pageSize,
    });
    
    // Map database books to UI books
    const books = result.data.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author || '',
      description: book.description || '',
      rating: book.rating,
      status: book.status === 'WISHLIST' ? 'wishlist' : 
              book.status === 'IN_PROGRESS' ? 'reading' : 'completed',
      source: (book.bookSource?.toLowerCase() || 'physical') as 'amazon' | 'kindle' | 'kobo' | 'physical',
      coverUrl: book.imageUrl,
      dateAdded: book.dateAdded.toISOString().split('T')[0],
      isbn: book.isbn,
      pageCount: book.pageCount,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      currentPage: book.currentPage,
    }));
    
    return {
      books,
      total: result.total,
      totalPages: Math.ceil(result.total / pageSize),
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books');
  }
}

export async function getBookById(id: string) {
  try {
    const book = await booksRepository.findById(id);
    
    if (!book) {
      return null;
    }
    
    return {
      id: book.id,
      title: book.title,
      author: book.author || '',
      description: book.description || '',
      rating: book.rating,
      status: book.status === 'WISHLIST' ? 'wishlist' : 
              book.status === 'IN_PROGRESS' ? 'reading' : 'completed',
      source: (book.bookSource?.toLowerCase() || 'physical') as 'amazon' | 'kindle' | 'kobo' | 'physical',
      coverUrl: book.imageUrl,
      dateAdded: book.dateAdded.toISOString().split('T')[0],
      isbn: book.isbn,
      pageCount: book.pageCount,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      currentPage: book.currentPage,
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    throw new Error('Failed to fetch book');
  }
}

export async function addBook(bookData: BookFormData) {
  try {
    // Map UI data to database data
    const dbBook: Partial<Book> = {
      title: bookData.title,
      description: bookData.description || null,
      author: bookData.author,
      status: statusMap[bookData.status],
      source: bookData.source.toUpperCase(),
      imageUrl: bookData.coverUrl || null,
      mediaType: 'book',
      tags: [],
      isbn: bookData.isbn || null,
      pageCount: bookData.pageCount || null,
      publisher: bookData.publisher || null,
      publishedDate: bookData.publishedDate || null,
      format: null,
      bookSource: sourceMap[bookData.source],
      language: null,
      currentPage: bookData.currentPage || null,
      rating: bookData.rating || null,
      // Required fields for Book type
      dateAdded: new Date(),
      dateUpdated: new Date(),
      aiDescription: null,
      ranking: null,
      sourceUrl: null,
    };
    
    // Add book to the database
    const newBook = await booksRepository.create(dbBook as Omit<Book, 'id'>);
    
    // Revalidate the books page to show the new book
    revalidatePath('/books');
    
    return newBook.id;
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error('Failed to add book');
  }
}

export async function updateBook(id: string, bookData: Partial<BookFormData>) {
  try {
    // Map UI data to database data
    const dbBook: Partial<Book> = {};
    
    if (bookData.title) dbBook.title = bookData.title;
    if (bookData.description !== undefined) dbBook.description = bookData.description || null;
    if (bookData.author) dbBook.author = bookData.author;
    if (bookData.status) dbBook.status = statusMap[bookData.status];
    if (bookData.source) dbBook.source = bookData.source.toUpperCase();
    if (bookData.coverUrl !== undefined) dbBook.imageUrl = bookData.coverUrl || null;
    if (bookData.rating !== undefined) dbBook.rating = bookData.rating || null;
    
    // Update book in the database
    await booksRepository.update(id, dbBook);
    
    // Revalidate the books page to show the updated book
    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    
    return true;
  } catch (error) {
    console.error('Error updating book:', error);
    throw new Error('Failed to update book');
  }
}

export async function deleteBook(id: string) {
  try {
    // Delete book from the database
    await booksRepository.delete(id);
    
    // Revalidate the books page to remove the deleted book
    revalidatePath('/books');
    
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw new Error('Failed to delete book');
  }
} 