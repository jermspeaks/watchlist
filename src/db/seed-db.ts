// Load environment variables first
import 'dotenv/config';

import { seedDatabase } from './seed';

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 