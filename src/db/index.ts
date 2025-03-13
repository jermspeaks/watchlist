import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

// This is needed for Neon serverless to work with Next.js
neonConfig.fetchConnectionCache = true;

// Check if we have a database URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a Drizzle ORM instance
export const db = drizzle(pool);

// For direct SQL queries if needed
export const sql = neon(process.env.DATABASE_URL!); 