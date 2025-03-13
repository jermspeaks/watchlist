# Watchlist

A personal media tracking application built with Next.js, Neon PostgreSQL, and Drizzle ORM. Track your books, places, and more in one centralized application.

## Features

- Track various media types (books, places, etc.)
- Organize with tags and categories
- Filter and sort your collections
- Rate and review your experiences

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Neon PostgreSQL database (or any PostgreSQL database)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Update the `DATABASE_URL` in `.env` with your database connection string

```bash
# Example .env file
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Commands

The project includes several npm scripts for database management:

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to the database
npm run db:push

# Open Drizzle Studio to visually explore the database
npm run db:studio

# Seed the database with sample data
npm run db:seed

# Reset the database (drop all tables and types)
npm run db:reset
```

## Project Structure

- `/src/db/schema/` - Database schema definitions
- `/src/db/migrations/` - Generated migration files
- `/src/db/repositories/` - Data access layer
- `/src/db/seed/` - Seed data scripts

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Next Plans

- [use star system from bolt](https://bolt.new/~/sb1-ybuwykus)
- [React Front-end Generator - v0 by Vercel](https://v0.dev/chat/react-front-end-generator-3Dvy9WmtAJL)
