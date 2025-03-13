# Personal Media Watchlist Project Plan

## Database Schema (Draft)

### Media Item (Base)

```typescript
interface IMediaBase {
  id: string;
  title: string;
  description: string;
  aiDescription?: string;
  rating?: number;
  ranking?: number;
  tags: string[];
  author?: string;
  dateAdded: Date;
  dateUpdated: Date;
  status: "WISHLIST" | "IN_PROGRESS" | "COMPLETED";
  source: string;
  sourceUrl?: string;
}
```

### Category-Specific Extensions

- Books (Amazon, Kindle, Kobo, Physical)
- Films (Letterboxd, Stremio, Personal Archive)
- TV Shows (TMDB, Personal Archive)
- Video Games (Steam, Personal Archive)
- Board Games (BGG, Physical Collection)
- Podcasts (PocketCasts)
- YouTube (Subscriptions, Watch Later)
- Places (Restaurants, Destinations)

## Feature Roadmap

> Note: Phase 1 has been completed. See CHANGELOG.md for details.

### Phase 1: Database Setup with Neon & Drizzle

#### Database Configuration

- [x] Set up Neon PostgreSQL database
- [x] Install and configure Drizzle ORM
- [x] Create database connection utilities
- [x] Set up environment variables for database credentials

#### Schema Design & Implementation

- [x] Define base media item schema in Drizzle
- [x] Implement category-specific schema extensions
- [x] Create relationships between tables
- [x] Set up indexes for efficient queries

#### Migrations & Seeding

- [x] Set up Drizzle migration system
- [x] Create initial migration for base tables
- [x] Implement seed data scripts for development
- [x] Create utility for resetting development database

#### Data Access Layer

- [x] Create repository pattern for data access
- [x] Implement CRUD operations for each media type
- [x] Add filtering and sorting capabilities
- [x] Implement pagination for list queries

#### Integration with UI

- [ ] Connect UI forms to database operations
- [ ] Implement loading states during data fetching
- [ ] Add error handling for database operations
- [ ] Implement optimistic updates for better UX

#### Data Persistence Features

- [ ] Implement filter preference saving
- [ ] Add recently viewed items tracking
- [ ] Create user-specific data storage

### Phase 2: Authentication System

#### Authentication Provider

- [ ] Choose and set up authentication provider
- [ ] Implement login/register functionality
- [ ] Set up protected routes
- [ ] Add session management

#### User Management

- [ ] Create user profiles
- [ ] Implement user settings
- [ ] Add account management features
- [ ] Set up authorization rules

#### UI Integration

- [ ] Create login/register forms
- [ ] Add user profile UI
- [ ] Implement authenticated navigation
- [ ] Add user-specific views

### Phase 3: Enhanced Features

#### Enhanced Category Features

- [ ] Places
  - [ ] Map integration
- [ ] Books
  - [ ] ISBN lookup integration
  - [ ] Image upload
- [ ] Detailed view pages
  - [ ] Book statistics
  - [ ] Media detailed pages

#### Advanced CRUD Operations

- [ ] Update operations
  - [ ] Bulk edit support
- [ ] Delete operations
  - [ ] Bulk delete support
  - [ ] Soft delete implementation

#### AI Integration

- [ ] Automated descriptions
- [ ] Tag generation
- [ ] Content recommendations

#### RSS Feed Integration

- [ ] Custom RSS reader
- [ ] Podcast aggregator
- [ ] YouTube feed manager

#### Rating System

- [ ] Multiple rating criteria
- [ ] Ranking system
- [ ] Personal notes

### Phase 4: Import Systems

- [ ] Books
  - [ ] Amazon Wishlist Import
  - [ ] Kindle Library Import
  - [ ] Kobo Library Import
  - [ ] Physical Book Scanner
- [ ] Films & TV
  - [ ] Letterboxd Import
  - [ ] Stremio Library Import
  - [ ] TMDB Integration
- [ ] Games
  - [ ] Steam Wishlist Import
  - [ ] Personal Archive Import
- [ ] YouTube
  - [ ] Watch Later Import
  - [ ] Subscription List Import

### Phase 5: Advanced Features

- [ ] Author Pages
- [ ] Analytics Dashboard
- [ ] Export Capabilities
- [ ] Mobile App
- [ ] Browser Extension

## API Integrations

### Required APIs

1. YouTube Data API
2. TMDB API
3. Google Books API
4. Steam API
5. BoardGameGeek API
6. Amazon Product Advertising API
7. Letterboxd API (if available)
8. PocketCasts API

### Data Storage Considerations

- Media metadata
- User preferences
- Watch/Read history
- Ratings and reviews
- Generated content (AI descriptions, tags)
- Cached API responses

## Development Guidelines

1. **Testing**

   - Unit tests for utilities
   - Integration tests for API endpoints
   - Component tests for UI
   - E2E tests for critical flows

2. **Performance**

   - Image optimization
   - Lazy loading
   - API response caching
   - Progressive loading

3. **Security**

   - API key management
   - User data protection
   - Rate limiting
   - Input validation

4. **Accessibility**
   - WCAG 2.1 compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast
   - [x] Fixed date picker day header spacing

## Future Enhancements

- Dark Mode
- Authentication
- Reset filters (advanced control)
- Media detailed pages
- Within each media page, be able to group items together into named lists
- Build import system for chosen category
- Add podcasts by rss feed
- Add youtube videos by url link
- Add articles by rss feed
- Create a board game picker given a set of time we have and the type of gamers that we have
  - Also, this might be great with AI as well
- YouTube fetch the latest feeds and re-make a subscriptions page that makes sense for you
  - You can have different groups of subscriptions rather than a default feed
- There should be a "liked videos" for Youtube that I can then organize
- TV show calendar view where we can see the thumbnails of what is upcoming

## Bugs

- Table headers are not left justified
