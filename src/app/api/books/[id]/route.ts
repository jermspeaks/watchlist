import { NextRequest, NextResponse } from 'next/server';
import { BooksRepository } from '@/db/repositories/books-repository';
import type { Book as DbBook } from '@/db/repositories/books-repository';
import { mapDbBookToUiBook, mapUiBookToDbBook } from '@/types/book';

// Create an instance of the books repository
const booksRepository = new BooksRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure we have the ID before proceeding
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    // Get book from the database
    const book = await booksRepository.findById(id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Map database book to UI book using our helper function
    const formattedBook = mapDbBookToUiBook({
      ...book,
      imageUrl: book.imageUrl || null
    } as import('@/types/book').DbBook);
    
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
    // Ensure we have the ID before proceeding
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    const bookData = await request.json();
    
    // Map UI data to database data using our helper function
    const dbBook = mapUiBookToDbBook(bookData);
    
    // Update book in the database
    const updatedBook = await booksRepository.update(id, dbBook as unknown as Partial<DbBook>);
    
    if (!updatedBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
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
    // Ensure we have the ID before proceeding
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    // Delete book from the database
    const success = await booksRepository.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Book not found or could not be deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
} 