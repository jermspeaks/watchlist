import { NextRequest, NextResponse } from 'next/server';
import { BooksRepository } from '@/db/repositories/books-repository';
import type { Book as DbBook } from '@/db/repositories/books-repository';
import { mapDbBookToUiBook, mapUiBookToDbBook } from '@/types/book';

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
    
    // Map database books to UI books using our helper function
    const books = result.data.map(book => {
      // Ensure imageUrl is properly mapped to coverUrl
      return mapDbBookToUiBook({
        ...book,
        imageUrl: book.imageUrl || null
      } as import('@/types/book').DbBook);
    });
    
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
    
    // Map UI data to database data using our helper function
    const dbBook = mapUiBookToDbBook(bookData);
    
    // Add required fields for Book type
    dbBook.mediaType = 'book';
    dbBook.tags = [];
    dbBook.dateAdded = new Date();
    dbBook.dateUpdated = new Date();
    dbBook.aiDescription = null;
    dbBook.ranking = null;
    dbBook.sourceUrl = null;
    
    // Add book to the database
    const newBook = await booksRepository.create(dbBook as unknown as Omit<DbBook, 'id'>);
    
    return NextResponse.json({ id: newBook.id });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
} 