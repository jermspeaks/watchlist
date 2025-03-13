"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  StarFilledIcon,
  LayoutIcon,
  ListBulletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ImageIcon,
} from "@radix-ui/react-icons"
import type { Film, TVShow } from "@/types/media"

type SortField = "title" | "rating" | "dateAdded" | "releaseDate"
type SortDirection = "asc" | "desc"
type DateRange = { from: Date; to: Date } | undefined

interface MediaListProps {
  searchQuery: string
  statusFilter: string
  sourceFilter: string
  typeFilter: "all" | "film" | "tv"
  ratingRange: number[]
  dateRange: DateRange
  selectedGenres: string[]
}

// Temporary sample data - will be replaced with actual data from database
const SAMPLE_MEDIA: (Film | TVShow)[] = [
  {
    id: "1",
    type: "film",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    rating: 5,
    runtime: 148,
    releaseDate: "2010-07-16",
    status: "completed",
    source: "personal",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    genre: ["Action", "Sci-Fi", "Thriller"],
    dateAdded: "2024-03-13",
    tags: ["mind-bending", "dreams"],
  },
  {
    id: "2",
    type: "tv",
    title: "Breaking Bad",
    description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future as he battles terminal lung cancer.",
    creator: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul"],
    rating: 5,
    seasons: 5,
    episodes: 62,
    startDate: "2008-01-20",
    endDate: "2013-09-29",
    status: "completed",
    source: "personal",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    genre: ["Crime", "Drama", "Thriller"],
    dateAdded: "2024-03-12",
    tags: ["masterpiece", "antihero"],
    currentSeason: 5,
    currentEpisode: 62,
  },
]

export function MediaList({
  searchQuery,
  statusFilter,
  sourceFilter,
  typeFilter,
  ratingRange,
  dateRange,
  selectedGenres,
}: MediaListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [sortField, setSortField] = useState<SortField>("dateAdded")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredMedia = SAMPLE_MEDIA
    .filter((item) => {
      // Type filter
      if (typeFilter !== "all" && item.type !== typeFilter) return false

      // Text search
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(item.type === "film"
          ? item.director.toLowerCase().includes(searchQuery.toLowerCase())
          : item.creator.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !item.cast.some((actor) =>
          actor.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) return false

      // Source filter
      if (sourceFilter !== "all" && item.source !== sourceFilter) return false

      // Rating range
      if (item.rating && (item.rating < ratingRange[0] || item.rating > ratingRange[1])) {
        return false
      }

      // Date range
      if (dateRange?.from && dateRange?.to) {
        const releaseDate = new Date(
          item.type === "film" ? item.releaseDate : item.startDate
        )
        if (
          releaseDate < dateRange.from ||
          releaseDate > dateRange.to
        ) {
          return false
        }
      }

      // Genre filter
      if (
        selectedGenres.length > 0 &&
        !selectedGenres.some((genre) => item.genre.includes(genre))
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title)
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0))
        case "releaseDate":
          const aDate = new Date(a.type === "film" ? a.releaseDate : a.startDate)
          const bDate = new Date(b.type === "film" ? b.releaseDate : b.startDate)
          return direction * (aDate.getTime() - bDate.getTime())
        case "dateAdded":
          return direction * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE)
  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (filteredMedia.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No media found matching your filters.</p>
      </div>
    )
  }

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      className="flex items-center space-x-1"
      onClick={() => toggleSort(field)}
    >
      <span>{label}</span>
      {sortField === field && (
        <span className="ml-1">{sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
      )}
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="releaseDate">Release Date</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            {sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {filteredMedia.length} items
          </span>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <ListBulletIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedMedia.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="aspect-[2/3] relative bg-muted rounded-md overflow-hidden">
                  {item.posterUrl ? (
                    <img
                      src={item.posterUrl}
                      alt={`Poster of ${item.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.type === "film" ? item.director : item.creator}
                  </p>
                  <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                  <Badge variant="outline">{item.source}</Badge>
                  {item.type === "tv" && (
                    <Badge variant="outline">S{item.seasons}</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortButton field="title" label="Title" />
                </TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
                <TableHead>
                  <SortButton field="releaseDate" label="Release Date" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMedia.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    {item.type === "film" ? item.director : item.creator}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{item.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.source}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{item.rating}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.type === "film"
                      ? new Date(item.releaseDate).toLocaleDateString()
                      : new Date(item.startDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 