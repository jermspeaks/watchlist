// Load environment variables first
import 'dotenv/config';

import { sql } from './index';

/**
 * Resets the database by dropping all tables and re-running migrations and seeds
 */
async function resetDatabase() {
  console.log('Resetting database...');
  
  try {
    // Drop all tables in the public schema
    console.log('Dropping all tables...');
    await sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `;
    
    // Drop all types
    console.log('Dropping all types...');
    await sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT typname FROM pg_type JOIN pg_namespace ON pg_type.typnamespace = pg_namespace.oid WHERE pg_namespace.nspname = 'public' AND pg_type.typtype = 'e') LOOP
          EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `;
    
    console.log('Database schema dropped successfully');
    
    // Run migrations (this would typically be done with drizzle-kit push)
    console.log('Please run migrations with: npm run db:push');
    
    // Seed the database
    console.log('Please seed the database with: npm run db:seed');
    
    console.log('Database reset process completed');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

// If this script is run directly, reset the database
if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error in reset process:', error);
      process.exit(1);
    });
} 