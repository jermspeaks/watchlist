export type MediaItem = {
  id: string
  title: string
  creator: string
  type: string
  rating: number
  imageUrl: string
  date: string
}

export type FilterState = {
  search: string
  type: string
  rating: string
  sort: "date" | "title" | "rating"
}

