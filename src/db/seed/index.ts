import { db } from '../index';
import { mediaItems, books, tags, mediaToTags } from '../schema';
import { v4 as uuidv4 } from 'uuid';

// Function to seed the database with initial data
export async function seedDatabase() {
  console.log('Seeding database...');

  // Seed tags
  const tagIds = await seedTags();
  
  // Seed books
  await seedBooks(tagIds);

  console.log('Database seeded successfully!');
}

// Seed tags
async function seedTags() {
  console.log('Seeding tags...');
  
  const sampleTags = [
    { name: 'Fiction', description: 'Fictional works' },
    { name: 'Non-Fiction', description: 'Non-fictional works' },
    { name: 'Fantasy', description: 'Fantasy genre' },
    { name: 'Science Fiction', description: 'Science fiction genre' },
    { name: 'Mystery', description: 'Mystery genre' },
    { name: 'Thriller', description: 'Thriller genre' },
    { name: 'Romance', description: 'Romance genre' },
    { name: 'Biography', description: 'Biographical works' },
    { name: 'History', description: 'Historical works' },
    { name: 'Self-Help', description: 'Self-help books' },
  ];

  // Insert tags and get their IDs
  const results = await db.insert(tags).values(sampleTags).returning({ id: tags.id });
  
  // Create a map of tag name to ID for easier reference
  const tagMap: Record<string, number> = {};
  results.forEach((tag, index) => {
    tagMap[sampleTags[index].name] = tag.id;
  });

  return tagMap;
}

// Seed books
async function seedBooks(tagIds: Record<string, number>) {
  console.log('Seeding books...');
  
  const sampleBooks = [
    {
      id: uuidv4(),
      title: 'The Lord of the Rings',
      description: 'An epic fantasy novel about a hobbit\'s journey to destroy a powerful ring.',
      author: 'J.R.R. Tolkien',
      status: 'COMPLETED',
      source: 'PHYSICAL',
      imageUrl: 'https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg',
      mediaType: 'book',
      tags: ['Fiction', 'Fantasy'],
      isbn: '9780618640157',
      pageCount: 1178,
      publisher: 'Houghton Mifflin',
      publishedDate: '1954-07-29',
      rating: 5,
    },
    {
      id: uuidv4(),
      title: 'Dune',
      description: 'A science fiction novel set in a distant future amidst a feudal interstellar society.',
      author: 'Frank Herbert',
      status: 'COMPLETED',
      source: 'KINDLE',
      imageUrl: 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg',
      mediaType: 'book',
      tags: ['Fiction', 'Science Fiction'],
      isbn: '9780441172719',
      pageCount: 412,
      publisher: 'Ace Books',
      publishedDate: '1965-08-01',
      rating: 4,
    },
    {
      id: uuidv4(),
      title: 'Atomic Habits',
      description: 'A practical guide to building good habits and breaking bad ones.',
      author: 'James Clear',
      status: 'IN_PROGRESS',
      source: 'AMAZON',
      imageUrl: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
      mediaType: 'book',
      tags: ['Non-Fiction', 'Self-Help'],
      isbn: '9780735211292',
      pageCount: 320,
      publisher: 'Avery',
      publishedDate: '2018-10-16',
      rating: 4,
      currentPage: 150,
    },
    {
      id: uuidv4(),
      title: 'The Hitchhiker\'s Guide to the Galaxy',
      description: 'A comedic science fiction series following the misadventures of an unwitting human.',
      author: 'Douglas Adams',
      status: 'WISHLIST',
      source: 'OTHER',
      imageUrl: 'https://m.media-amazon.com/images/I/81XSN3hA5gL._AC_UF1000,1000_QL80_.jpg',
      mediaType: 'book',
      tags: ['Fiction', 'Science Fiction'],
      isbn: '9780345391803',
      pageCount: 224,
      publisher: 'Del Rey',
      publishedDate: '1979-10-12',
    },
    {
      id: uuidv4(),
      title: 'Sapiens: A Brief History of Humankind',
      description: 'A book that explores the history of the human species from the evolution of archaic human species.',
      author: 'Yuval Noah Harari',
      status: 'COMPLETED',
      source: 'PHYSICAL',
      imageUrl: 'https://m.media-amazon.com/images/I/71N3-2sYDRL._AC_UF1000,1000_QL80_.jpg',
      mediaType: 'book',
      tags: ['Non-Fiction', 'History'],
      isbn: '9780062316097',
      pageCount: 464,
      publisher: 'Harper',
      publishedDate: '2015-02-10',
      rating: 5,
    },
  ];

  // Insert books in a transaction
  for (const book of sampleBooks) {
    await db.transaction(async (tx) => {
      // Extract tags
      const bookTags = book.tags || [];
      delete book.tags;

      // Insert media item
      const mediaData = {
        id: book.id,
        title: book.title,
        description: book.description,
        author: book.author,
        status: book.status,
        source: book.source,
        imageUrl: book.imageUrl,
        mediaType: book.mediaType,
        rating: book.rating,
        tags: bookTags,
      };

      await tx.insert(mediaItems).values(mediaData);

      // Insert book
      const bookData = {
        id: book.id,
        isbn: book.isbn,
        pageCount: book.pageCount,
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        source: book.source,
        currentPage: book.currentPage,
      };

      await tx.insert(books).values(bookData);

      // Insert media to tags relationships
      for (const tagName of bookTags) {
        if (tagIds[tagName]) {
          await tx.insert(mediaToTags).values({
            mediaId: book.id,
            tagId: tagIds[tagName],
          });
        }
      }
    });
  }
}

// If this script is run directly, seed the database
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
} 