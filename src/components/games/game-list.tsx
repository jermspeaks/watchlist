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
  PlayIcon,
} from "@radix-ui/react-icons"
import { VideoGame } from "@/types/media"

interface GameListProps {
  searchQuery: string
  statusFilter: string
  sourceFilter: string
  platformFilter: string
}

type SortField = "title" | "developer" | "rating" | "releaseDate" | "dateAdded" | "playtime"
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE = 12

// Temporary sample data - will be replaced with actual data from database
const SAMPLE_GAMES: VideoGame[] = [
  {
    id: "1",
    title: "The Legend of Zelda: Breath of the Wild",
    description: "An open-world action-adventure game set in a vast, beautiful landscape.",
    developer: "Nintendo",
    publisher: "Nintendo",
    platform: ["nintendo"],
    releaseDate: "2017-03-03",
    source: "personal",
    coverUrl: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
    genre: ["action", "adventure", "open-world"],
    rating: 5,
    status: "completed",
    dateAdded: "2023-01-15",
    tags: ["nintendo", "switch", "open-world"],
    type: "game"
  },
  {
    id: "2",
    title: "Elden Ring",
    description: "An action RPG developed by FromSoftware and published by Bandai Namco Entertainment.",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    platform: ["pc", "playstation", "xbox"],
    releaseDate: "2022-02-25",
    source: "steam",
    steamId: "1245620",
    coverUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    genre: ["action", "rpg", "open-world"],
    playtime: 120,
    rating: 4,
    status: "in_progress",
    dateAdded: "2023-03-10",
    tags: ["souls-like", "open-world", "fantasy"],
    type: "game"
  },
  {
    id: "3",
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure RPG set in the megalopolis of Night City.",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    platform: ["pc", "playstation", "xbox"],
    releaseDate: "2020-12-10",
    source: "steam",
    steamId: "1091500",
    coverUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    genre: ["rpg", "open-world", "cyberpunk"],
    playtime: 85,
    rating: 3,
    status: "completed",
    dateAdded: "2022-12-20",
    tags: ["cyberpunk", "rpg", "first-person"],
    type: "game"
  },
  {
    id: "4",
    title: "Stardew Valley",
    description: "A farming simulation game where you inherit your grandfather's old farm plot.",
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    platform: ["pc", "playstation", "xbox", "nintendo", "mobile"],
    releaseDate: "2016-02-26",
    source: "steam",
    steamId: "413150",
    coverUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
    genre: ["simulation", "rpg", "indie"],
    playtime: 200,
    rating: 5,
    status: "completed",
    dateAdded: "2022-05-15",
    tags: ["farming", "life-sim", "pixel-art"],
    type: "game"
  },
  {
    id: "5",
    title: "Hollow Knight",
    description: "A challenging 2D action-adventure game featuring a bug knight exploring the vast, interconnected world of Hallownest.",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    platform: ["pc", "playstation", "xbox", "nintendo"],
    releaseDate: "2017-02-24",
    source: "steam",
    steamId: "367520",
    coverUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
    genre: ["metroidvania", "action", "indie"],
    playtime: 60,
    rating: 5,
    status: "wishlist",
    dateAdded: "2023-06-10",
    tags: ["metroidvania", "difficult", "atmospheric"],
    type: "game"
  }
]

export function GameList({ searchQuery, statusFilter, sourceFilter, platformFilter }: GameListProps) {
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

  const sortedAndFilteredGames = SAMPLE_GAMES
    .filter((game) => {
      if (
        searchQuery &&
        !game.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !game.developer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !game.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (statusFilter !== "all" && game.status !== statusFilter) {
        return false
      }
      if (sourceFilter !== "all" && game.source !== sourceFilter) {
        return false
      }
      if (platformFilter !== "all" && !game.platform.includes(platformFilter)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title)
        case "developer":
          return direction * a.developer.localeCompare(b.developer)
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0))
        case "releaseDate":
          return direction * (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
        case "dateAdded":
          return direction * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        case "playtime":
          return direction * ((a.playtime || 0) - (b.playtime || 0))
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(sortedAndFilteredGames.length / ITEMS_PER_PAGE)
  const paginatedGames = sortedAndFilteredGames.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (sortedAndFilteredGames.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No games found matching your filters.</p>
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
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="releaseDate">Release Date</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="playtime">Playtime</SelectItem>
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
            {sortedAndFilteredGames.length} items
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
          {paginatedGames.map((game) => (
            <Card key={game.id} className="p-4">
              <div className="space-y-3">
                <div className="aspect-[3/4] relative bg-muted rounded-md overflow-hidden">
                  {game.coverUrl ? (
                    <img
                      src={game.coverUrl}
                      alt={`Cover of ${game.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{game.title}</h3>
                    {game.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm">{game.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{game.developer}</p>
                  <p className="text-sm mt-2 line-clamp-2">{game.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={game.status === "completed" ? "default" : "secondary"}>
                    {game.status === "in_progress" ? "Playing" : game.status}
                  </Badge>
                  <Badge variant="outline">{game.source}</Badge>
                  {game.platform.map((platform) => (
                    <Badge key={platform} variant="outline" className="bg-muted/50">
                      {platform}
                    </Badge>
                  ))}
                  {game.playtime && (
                    <Badge variant="outline" className="ml-auto">
                      {game.playtime}h
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
                  <SortButton field="developer" label="Developer" />
                </TableHead>
                <TableHead>
                  <SortButton field="releaseDate" label="Release Date" />
                </TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>
                  <SortButton field="playtime" label="Playtime" />
                </TableHead>
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGames.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>{game.developer}</TableCell>
                  <TableCell>{new Date(game.releaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {game.platform.map((platform) => (
                        <Badge key={platform} variant="outline" className="bg-muted/50">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{game.playtime ? `${game.playtime}h` : "-"}</TableCell>
                  <TableCell>
                    {game.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{game.rating}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={game.status === "completed" ? "default" : "secondary"}>
                      {game.status === "in_progress" ? "Playing" : game.status}
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