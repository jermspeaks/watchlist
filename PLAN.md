# Personal Media Watchlist Project Plan

## Database Schema (Draft)

### Media Item (Base)
```typescript
interface IMediaBase {
  id: string
  title: string
  description: string
  aiDescription?: string
  rating?: number
  ranking?: number
  tags: string[]
  author?: string
  dateAdded: Date
  dateUpdated: Date
  status: 'WISHLIST' | 'IN_PROGRESS' | 'COMPLETED'
  source: string
  sourceUrl?: string
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
- [ ] Basic CRUD operations for media items
- [ ] Authentication system
- [ ] Database setup and initial schema
- [ ] Basic UI components
- [ ] Category management

### Phase 2: Import Systems
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

### Phase 3: Enhanced Features
- [ ] AI Integration
  - [ ] Automated descriptions
  - [ ] Tag generation
  - [ ] Content recommendations
- [ ] RSS Feed Integration
  - [ ] Custom RSS reader
  - [ ] Podcast aggregator
  - [ ] YouTube feed manager
- [ ] Rating System
  - [ ] Multiple rating criteria
  - [ ] Ranking system
  - [ ] Personal notes

### Phase 4: Advanced Features
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

## Next Steps

1. Set up database and ORM
2. Create basic UI components
3. Implement authentication
4. Start with one category (e.g., Books or Films)
5. Build import system for chosen category
6. Iterate based on usage and feedback 