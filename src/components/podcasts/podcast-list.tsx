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
} from "@radix-ui/react-icons"
import { Podcast as BasePodcast } from "@/types/media"
import { PodcastPlaceholder } from "./podcast-placeholder"

// Extend the Podcast type to include isSubscribed property
interface Podcast extends BasePodcast {
  isSubscribed: boolean;
}

interface PodcastListProps {
  searchQuery: string
  statusFilter: string
  sourceFilter: string
  subscriptionFilter: string
}

type SortField = "title" | "host" | "rating" | "episodeCount" | "dateAdded"
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE = 12

// Temporary sample data - will be replaced with actual data from database
const SAMPLE_PODCASTS: Podcast[] = [
  {
    id: "1",
    title: "The Daily",
    description: "This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world.",
    host: "Michael Barbaro and Sabrina Tavernise",
    publisher: "The New York Times",
    source: "pocketcasts",
    artworkUrl: "https://image.simplecastcdn.com/images/03d8b93a-f1e1-4e1a-8a48-af7440ae5c1e/d8c0b5d5-3fad-43d8-8826-90a3b8b3ec51/3000x3000/nyt-the-daily-logo-3000x3000.jpg?aid=rss_feed",
    feedUrl: "https://feeds.simplecast.com/54nAGcIl",
    episodeCount: 1200,
    currentEpisode: 1150,
    rating: 4,
    status: "in_progress",
    dateAdded: "2022-01-15",
    tags: ["news", "daily", "journalism"],
    type: "podcast",
    isSubscribed: true
  },
  {
    id: "2",
    title: "Hardcore History",
    description: "In 'Hardcore History' journalist and broadcaster Dan Carlin takes his 'Martian', unorthodox way of thinking and applies it to the past.",
    host: "Dan Carlin",
    publisher: "Dan Carlin",
    source: "rss",
    artworkUrl: "https://content.production.cdn.art19.com/images/1c/95/72/9c/1c95729c-7085-4d08-9103-d30d3b47d452/69d9dab3a8c8c7c3b245c0ab8d8aedfb5b5d4c5aa1e9b15432e2f0a26c08a3a3b7a0431e2048c7e7b3b11e7539d8d235c5d39695bb13b6e4d4a5c0b7c0a9c05.jpeg",
    feedUrl: "https://feeds.feedburner.com/dancarlin/history",
    episodeCount: 69,
    currentEpisode: 65,
    rating: 5,
    status: "in_progress",
    dateAdded: "2021-11-20",
    tags: ["history", "war", "politics"],
    type: "podcast",
    isSubscribed: true
  },
  {
    id: "3",
    title: "99% Invisible",
    description: "Design is everywhere in our lives, perhaps most importantly in the places where we've just stopped noticing.",
    host: "Roman Mars",
    publisher: "Roman Mars",
    source: "pocketcasts",
    artworkUrl: "https://f.prxu.org/96/images/a5a45fca-c728-4b6a-9c66-b3a4b57c3c3c/99-1400.jpg",
    feedUrl: "https://feeds.simplecast.com/BqbsxVfO",
    episodeCount: 500,
    currentEpisode: 450,
    rating: 5,
    status: "in_progress",
    dateAdded: "2022-03-15",
    tags: ["design", "architecture", "society"],
    type: "podcast",
    isSubscribed: true
  },
  {
    id: "4",
    title: "Radiolab",
    description: "Radiolab is on a curiosity bender. We ask deep questions and use investigative journalism to get the answers.",
    host: "Lulu Miller, Latif Nasser",
    publisher: "WNYC Studios",
    source: "rss",
    artworkUrl: "https://media.wnyc.org/i/1400/1400/l/80/1/Radiolab_WNYCStudios_1400.jpg",
    feedUrl: "https://feeds.feedburner.com/radiolab",
    episodeCount: 300,
    currentEpisode: 0,
    rating: 4,
    status: "wishlist",
    dateAdded: "2022-05-10",
    tags: ["science", "philosophy", "society"],
    type: "podcast",
    isSubscribed: false
  },
  {
    id: "5",
    title: "Reply All",
    description: "A podcast about the internet that is actually an unfailingly original exploration of modern life and how to survive it.",
    host: "Emmanuel Dzotsi, Alex Goldman",
    publisher: "Gimlet Media",
    source: "pocketcasts",
    artworkUrl: "https://megaphone.imgix.net/podcasts/23d52a2a-1c5f-11ea-9a0e-b70170f2a827/image/uploads_2F1588357113366-jjsdfzx6x4m-c0339c10f9b113a5fcc93436e66e5ef4_2FReplyAll-2019-Logo.png",
    feedUrl: "https://feeds.megaphone.fm/replyall",
    episodeCount: 187,
    currentEpisode: 187,
    rating: 5,
    status: "completed",
    dateAdded: "2021-08-05",
    tags: ["internet", "technology", "stories"],
    type: "podcast",
    isSubscribed: false
  }
]

export function PodcastList({ 
  searchQuery, 
  statusFilter, 
  sourceFilter, 
  subscriptionFilter 
}: PodcastListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [sortField, setSortField] = useState<SortField>("dateAdded")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedAndFilteredPodcasts = SAMPLE_PODCASTS
    .filter((podcast) => {
      if (
        searchQuery &&
        !podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !podcast.host.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !podcast.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (statusFilter !== "all" && podcast.status !== statusFilter) {
        return false
      }
      if (sourceFilter !== "all" && podcast.source !== sourceFilter) {
        return false
      }
      if (subscriptionFilter !== "all") {
        if (subscriptionFilter === "subscribed" && !podcast.isSubscribed) {
          return false
        }
        if (subscriptionFilter === "unsubscribed" && podcast.isSubscribed) {
          return false
        }
      }
      return true
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title)
        case "host":
          return direction * a.host.localeCompare(b.host)
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0))
        case "episodeCount":
          return direction * ((a.episodeCount || 0) - (b.episodeCount || 0))
        case "dateAdded":
          return direction * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(sortedAndFilteredPodcasts.length / ITEMS_PER_PAGE)
  const paginatedPodcasts = sortedAndFilteredPodcasts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (sortedAndFilteredPodcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No podcasts found matching your filters.</p>
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

  // Helper function to format episode progress
  const formatEpisodeProgress = (current: number | undefined, total: number | undefined) => {
    if (!current || !total) return "-"
    return `${current}/${total}`
  }

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
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="episodeCount">Episodes</SelectItem>
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
            {sortedAndFilteredPodcasts.length} items
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
          {paginatedPodcasts.map((podcast) => (
            <Card key={podcast.id} className="p-4">
              <div className="space-y-3">
                <div className="aspect-[1/1] relative bg-muted rounded-md overflow-hidden">
                  {podcast.artworkUrl ? (
                    <img
                      src={podcast.artworkUrl}
                      alt={`Artwork for ${podcast.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PodcastPlaceholder 
                      title={podcast.title} 
                      className="w-full h-full" 
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{podcast.title}</h3>
                    {podcast.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm">{podcast.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{podcast.host}</p>
                  <p className="text-sm mt-2 line-clamp-2">{podcast.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={podcast.status === "completed" ? "default" : "secondary"}>
                    {podcast.status === "in_progress" ? "Listening" : 
                     podcast.status === "wishlist" ? "To Listen" : "Listened"}
                  </Badge>
                  <Badge variant="outline">{podcast.source}</Badge>
                  <Badge variant={podcast.isSubscribed ? "default" : "outline"} className="bg-muted/50">
                    {podcast.isSubscribed ? "Subscribed" : "Not Subscribed"}
                  </Badge>
                  {podcast.episodeCount && (
                    <Badge variant="outline" className="ml-auto">
                      {formatEpisodeProgress(podcast.currentEpisode, podcast.episodeCount)} episodes
                    </Badge>
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
                <TableHead>
                  <SortButton field="host" label="Host" />
                </TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>
                  <SortButton field="episodeCount" label="Episodes" />
                </TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPodcasts.map((podcast) => (
                <TableRow key={podcast.id}>
                  <TableCell className="font-medium">{podcast.title}</TableCell>
                  <TableCell>{podcast.host}</TableCell>
                  <TableCell>{podcast.publisher}</TableCell>
                  <TableCell>
                    {formatEpisodeProgress(podcast.currentEpisode, podcast.episodeCount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={podcast.isSubscribed ? "default" : "outline"} className="bg-muted/50">
                      {podcast.isSubscribed ? "Subscribed" : "Not Subscribed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {podcast.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{podcast.rating}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={podcast.status === "completed" ? "default" : "secondary"}>
                      {podcast.status === "in_progress" ? "Listening" : 
                       podcast.status === "wishlist" ? "To Listen" : "Listened"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 