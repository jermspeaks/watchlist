// Common types shared across all media categories
export interface BaseMediaItem {
  id: string
  title: string
  description: string
  rating?: number
  status: "wishlist" | "in_progress" | "completed"
  dateAdded: string
  dateUpdated?: string
  tags: string[]
}

// Books
export interface Book extends BaseMediaItem {
  type: "book"
  author: string
  isbn?: string
  coverUrl?: string
  source: "amazon" | "kindle" | "kobo" | "physical"
  pageCount?: number
  publishDate?: string
  publisher?: string
}

// Films & TV
export interface Film extends BaseMediaItem {
  type: "film"
  director: string
  cast: string[]
  runtime?: number
  releaseDate: string
  source: "letterboxd" | "stremio" | "personal"
  posterUrl?: string
  tmdbId?: string
  genre: string[]
}

export interface TVShow extends BaseMediaItem {
  type: "tv"
  creator: string
  cast: string[]
  seasons: number
  episodes?: number
  startDate: string
  endDate?: string
  source: "letterboxd" | "stremio" | "personal"
  posterUrl?: string
  tmdbId?: string
  genre: string[]
  currentSeason?: number
  currentEpisode?: number
}

// Video Games
export interface VideoGame extends BaseMediaItem {
  type: "game"
  developer: string
  publisher: string
  platform: string[]
  releaseDate: string
  source: "steam" | "personal"
  coverUrl?: string
  steamId?: string
  genre: string[]
  playtime?: number
}

// Board Games
export interface BoardGame extends BaseMediaItem {
  type: "board_game"
  designer: string
  publisher: string
  playerCount: {
    min: number
    max: number
  }
  playTime: {
    min: number
    max: number
  }
  source: "bgg" | "personal"
  imageUrl?: string
  bggId?: string
  complexity?: number
}

// Podcasts
export interface Podcast extends BaseMediaItem {
  type: "podcast"
  host: string
  publisher?: string
  source: "pocketcasts" | "rss"
  artworkUrl?: string
  feedUrl?: string
  episodeCount?: number
  currentEpisode?: number
}

// YouTube
export interface YouTubeItem extends BaseMediaItem {
  type: "youtube"
  channel: string
  channelId: string
  duration?: number
  publishDate: string
  thumbnailUrl?: string
  videoId: string
  playlist?: string
  playlistId?: string
}

// Places
export interface Place extends BaseMediaItem {
  type: "place"
  category: "restaurant" | "attraction" | "accommodation"
  address: string
  city: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
  website?: string
  imageUrl?: string
  priceRange?: string
  cuisine?: string[]
} 