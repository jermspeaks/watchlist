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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get book from the database
    const book = await booksRepository.findById(id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Map database book to UI book
    const formattedBook = {
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
    };
    
    return NextResponse.json(formattedBook);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const bookData = await request.json();
    
    // Map UI data to database data
    const dbBook: Partial<Book> = {};
    
    if (bookData.title) dbBook.title = bookData.title;
    if (bookData.description !== undefined) dbBook.description = bookData.description || null;
    if (bookData.author) dbBook.author = bookData.author;
    if (bookData.status) dbBook.status = statusMap[bookData.status as keyof typeof statusMap];
    if (bookData.source) {
      dbBook.source = bookData.source.toUpperCase();
      dbBook.bookSource = sourceMap[bookData.source as keyof typeof sourceMap];
    }
    if (bookData.coverUrl !== undefined) dbBook.imageUrl = bookData.coverUrl || null;
    if (bookData.rating !== undefined) dbBook.rating = bookData.rating || null;
    if (bookData.isbn !== undefined) dbBook.isbn = bookData.isbn || null;
    if (bookData.pageCount !== undefined) dbBook.pageCount = bookData.pageCount || null;
    if (bookData.publisher !== undefined) dbBook.publisher = bookData.publisher || null;
    if (bookData.publishedDate !== undefined) dbBook.publishedDate = bookData.publishedDate || null;
    if (bookData.currentPage !== undefined) dbBook.currentPage = bookData.currentPage || null;
    
    // Always update the dateUpdated field
    dbBook.dateUpdated = new Date();
    
    // Update book in the database
    await booksRepository.update(id, dbBook);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Delete book from the database
    await booksRepository.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
} 