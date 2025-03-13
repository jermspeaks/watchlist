// Import the standardized types
import { Book, BookFormData } from '@/types/book';

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
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (source) params.append('source', source);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDirection) params.append('sortDirection', sortDirection);
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    // Call the API endpoint
    const response = await fetch(`/api/books?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books');
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    // Call the API endpoint
    const response = await fetch(`/api/books/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch book');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    throw new Error('Failed to fetch book');
  }
}

export async function addBook(bookData: BookFormData): Promise<string> {
  try {
    // Call the API endpoint
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    
    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error('Failed to add book');
  }
}

export async function updateBook(id: string, bookData: Partial<BookFormData>): Promise<boolean> {
  try {
    // Call the API endpoint
    const response = await fetch(`/api/books/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating book:', error);
    throw new Error('Failed to update book');
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    // Call the API endpoint
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw new Error('Failed to delete book');
  }
} 