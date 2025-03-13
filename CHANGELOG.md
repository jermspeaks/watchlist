# Changelog

All notable changes to the Watchlist project will be documented in this file.

## [0.2.0] - 2025-03-13

### Phase 1: Foundation (MVP)

#### Basic UI Components

- Created homepage with category dashboard
- Set up basic category page layout (Books)
- Implemented basic card view for items
- Added table view option with toggle functionality
- Added pagination support
- Implemented sorting functionality
- Added navigation header
- Enhanced search and filter capabilities:
  - Basic text search
  - Status filtering
  - Source filtering
  - Sorting by different fields
  - Advanced filters (rating, date, etc.)

#### CRUD Operations

- Implemented create operations:
  - Add forms with validation for all media types
  - Manual entry support
  - Image URL support
- Implemented read operations:
  - Basic list views
  - Grid/Table view options
- Implemented update operations:
  - Edit item details
  - Status update shortcuts
- Implemented delete operations:
  - Single item delete with confirmation

#### Category Pages

- Books:
  - List view with filtering and sorting
  - Add form with validation
  - Cover art support
  - Placeholder images
- Films & TV:
  - List view with filtering and sorting
  - Add form with validation
  - Poster art support
  - Placeholder images
- Video Games:
  - List view with filtering and sorting
  - Add form with validation
  - Cover art support
  - Platform tags
  - Playtime tracking
  - Completion status (Completed, Abandoned, etc.)
  - Placeholder images
- Board Games:
  - List view with filtering and sorting
  - Add form with validation
  - Box art support
  - Player count info
  - Play time info
  - Complexity rating
  - Placeholder images
- Podcasts:
  - List view with filtering and sorting
  - Add form with validation
  - Cover art support
  - Episode tracking
  - Subscription status
  - Placeholder images
- YouTube:
  - List view with filtering and sorting
  - Add form with validation
  - Thumbnail support
  - Channel grouping
  - Watch status tracking
  - Placeholder images
- Places:
  - List view with filtering and sorting
  - Add form with validation
  - Photo support
  - Visit date tracking
  - Location categories (Restaurant, Attraction, etc.)
  - Placeholder images

#### Reusable Components

- Created DeleteDialog component for item deletion
- Implemented StatusUpdate component for quick status changes
- Built placeholder image components for different media types

## [0.1.0] - 2025-02-03

- Initial project setup
- Basic Next.js application structure
- UI component library integration
