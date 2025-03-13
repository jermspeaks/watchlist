import { NextRequest, NextResponse } from 'next/server';
import { BooksRepository } from '@/db/repositories/books-repository';
import type { Book } from '@/db/repositories/books-repository';

// Create an instance of the books repository
const booksRepository = new BooksRepository();

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const source = searchParams.get('source') || 'all';
    const sortBy = searchParams.get('sortBy') || 'dateAdded';
    const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
    
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
      dateAdded: book.dateAdded ? book.dateAdded.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      isbn: book.isbn,
      pageCount: book.pageCount,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      currentPage: book.currentPage,
    }));
    
    return NextResponse.json({
      books,
      total: result.total,
      totalPages: Math.ceil(result.total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookData = await request.json();
    
    // Map UI data to database data
    const dbBook: Partial<Book> = {
      title: bookData.title,
      description: bookData.description || null,
      author: bookData.author,
      status: statusMap[bookData.status as keyof typeof statusMap],
      source: bookData.source.toUpperCase(),
      imageUrl: bookData.coverUrl || null,
      mediaType: 'book',
      tags: [],
      isbn: bookData.isbn || null,
      pageCount: bookData.pageCount || null,
      publisher: bookData.publisher || null,
      publishedDate: bookData.publishedDate || null,
      format: null,
      bookSource: sourceMap[bookData.source as keyof typeof sourceMap],
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
    
    return NextResponse.json({ id: newBook.id });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
} 