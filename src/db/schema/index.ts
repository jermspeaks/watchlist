// Export all schema definitions
export * from './base';
export * from './books';
export * from './places';

// Import and re-export all tables for migrations
import * as base from './base';
import * as books from './books';
import * as places from './places';

export const schema = {
  ...base,
  ...books,
  ...places,
}; 