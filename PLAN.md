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

### Phase 1: Foundation (MVP)

#### Basic UI Components

- [x] Create homepage with category dashboard
- [x] Set up basic category page layout (Books)
- [x] Implement basic card view for items
- [x] Add table view option
- [x] Implement view toggle (card/table)
- [x] Add pagination support
- [x] Add sorting functionality
- [x] Add navigation header
- [x] Enhance search and filter capabilities
  - [x] Basic text search
  - [x] Status filter
  - [x] Source filter
  - [x] Sort by different fields
  - [x] Advanced filters (rating, date, etc.)

#### CRUD Operations

- [x] Create operations
  - [x] Add book form with validation
  - [x] Manual entry support
  - [x] Image URL support
- [x] Read operations
  - [x] Basic list view
  - [x] Grid/Table view options
- [x] Update operations
  - [x] Edit item details
  - [x] Status update shortcuts
- [x] Delete operations
  - [x] Single item delete

#### Category Pages Setup

- [x] Books
  - [x] List view
  - [x] Add form
  - [x] Cover art support
  - [x] Placeholder images
- [x] Films & TV
  - [x] List view
  - [x] Add form
  - [x] Poster art support
  - [x] Placeholder images
- [x] Video Games
  - [x] List view
  - [x] Add form
  - [x] Cover art support
  - [x] Platform tags
  - [x] Playtime tracking
  - [x] Completion status (Completed, Abandoned, etc.)
  - [x] Placeholder images
- [x] Board Games
  - [x] List view
  - [x] Add form
  - [x] Box art support
  - [x] Player count info
  - [x] Play time info
  - [x] Complexity rating
  - [x] Placeholder images
- [x] Podcasts
  - [x] List view
  - [x] Add form
  - [x] Cover art support
  - [x] Episode tracking
  - [x] Subscription status
  - [x] Placeholder images
- [x] YouTube
  - [x] List view
  - [x] Add form
  - [x] Thumbnail support
  - [x] Channel grouping
  - [x] Watch status tracking
  - [x] Placeholder images
- [x] Places
  - [x] List view
  - [x] Add form
  - [x] Photo support
  - [x] Visit date tracking
  - [x] Location categories (Restaurant, Attraction, etc.)
  - [x] Placeholder images

### Phase 2: Database & Authentication

#### Database Setup

- [ ] Choose and set up database
- [ ] Design and implement schemas
- [ ] Set up migrations
- [ ] Add seed data
- [ ] Implement data validation

#### Authentication System

- [ ] Set up authentication provider
- [ ] Implement login/register
- [ ] Add user profiles
- [ ] Set up authorization rules

#### Basic UI Components (Persistence)

- [ ] Save filter preferences

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
