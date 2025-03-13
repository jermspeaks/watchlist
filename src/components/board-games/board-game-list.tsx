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
  DashboardIcon,
} from "@radix-ui/react-icons"
import { BoardGame } from "@/types/media"

interface BoardGameListProps {
  searchQuery: string
  statusFilter: string
  sourceFilter: string
  playerCountFilter: string
  complexityFilter: string
}

type SortField = "title" | "designer" | "rating" | "complexity" | "dateAdded" | "playTime"
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE = 12

// Temporary sample data - will be replaced with actual data from database
const SAMPLE_BOARD_GAMES: BoardGame[] = [
  {
    id: "1",
    title: "Gloomhaven",
    description: "Vanquish monsters with strategic cardplay in a 95-scenario campaign.",
    designer: "Isaac Childres",
    publisher: "Cephalofair Games",
    playerCount: {
      min: 1,
      max: 4
    },
    playTime: {
      min: 60,
      max: 120
    },
    source: "bgg",
    bggId: "174430",
    imageUrl: "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__original/img/7d-lj5Gd1e8PFnD97LYFah2c45M=/0x0/filters:format(jpeg)/pic2437871.jpg",
    complexity: 3.8,
    rating: 5,
    status: "in_progress",
    dateAdded: "2023-01-15",
    tags: ["campaign", "fantasy", "cooperative"],
    type: "board_game"
  },
  {
    id: "2",
    title: "Wingspan",
    description: "Attract a beautiful and diverse collection of birds to your wildlife preserve.",
    designer: "Elizabeth Hargrave",
    publisher: "Stonemaier Games",
    playerCount: {
      min: 1,
      max: 5
    },
    playTime: {
      min: 40,
      max: 70
    },
    source: "personal",
    imageUrl: "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__imagepage/img/uIjeoKgHMcRtzRSR4MoUYl3nXxs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg",
    complexity: 2.4,
    rating: 4,
    status: "completed",
    dateAdded: "2022-11-20",
    tags: ["animals", "card-drafting", "engine-building"],
    type: "board_game"
  },
  {
    id: "3",
    title: "Pandemic Legacy: Season 1",
    description: "Mutating diseases are spreading around the world - can your team save humanity?",
    designer: "Rob Daviau, Matt Leacock",
    publisher: "Z-Man Games",
    playerCount: {
      min: 2,
      max: 4
    },
    playTime: {
      min: 60,
      max: 60
    },
    source: "bgg",
    bggId: "161936",
    imageUrl: "https://cf.geekdo-images.com/-Qer2BBPG7qGGDu6KcVDIw__imagepage/img/qZybAu8uJ9_sZlU2A65DIF6Y2Zw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2452831.png",
    complexity: 2.8,
    rating: 5,
    status: "completed",
    dateAdded: "2022-08-15",
    tags: ["cooperative", "legacy", "medical"],
    type: "board_game"
  },
  {
    id: "4",
    title: "Azul",
    description: "Artfully embellish the walls of your palace by drafting the most beautiful tiles.",
    designer: "Michael Kiesling",
    publisher: "Next Move Games",
    playerCount: {
      min: 2,
      max: 4
    },
    playTime: {
      min: 30,
      max: 45
    },
    source: "personal",
    imageUrl: "https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__imagepage/img/q4uWd2nXGeEkKDR8Cc3NhXG9PEU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6973671.png",
    complexity: 1.8,
    rating: 4,
    status: "completed",
    dateAdded: "2022-05-10",
    tags: ["abstract", "tile-placement", "pattern-building"],
    type: "board_game"
  },
  {
    id: "5",
    title: "Spirit Island",
    description: "Island Spirits join forces using elemental powers to defend their home from invaders.",
    designer: "R. Eric Reuss",
    publisher: "Greater Than Games",
    playerCount: {
      min: 1,
      max: 4
    },
    playTime: {
      min: 90,
      max: 120
    },
    source: "bgg",
    bggId: "162886",
    imageUrl: "https://cf.geekdo-images.com/kjCm4ZvPjIZxS-mYgSPy1g__imagepage/img/py7KzNjXVOuVesFZB7LwqCbvALY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7013651.jpg",
    complexity: 3.9,
    rating: 5,
    status: "wishlist",
    dateAdded: "2023-02-05",
    tags: ["cooperative", "area-control", "variable-player-powers"],
    type: "board_game"
  }
]

export function BoardGameList({ 
  searchQuery, 
  statusFilter, 
  sourceFilter, 
  playerCountFilter, 
  complexityFilter 
}: BoardGameListProps) {
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

  // Helper function to filter by player count
  const matchesPlayerCount = (game: BoardGame, filter: string): boolean => {
    if (filter === "all") return true
    if (filter === "1" && game.playerCount.min <= 1) return true
    if (filter === "2" && game.playerCount.min <= 2 && game.playerCount.max >= 2) return true
    if (filter === "3-4" && game.playerCount.max >= 3 && game.playerCount.min <= 4) return true
    if (filter === "5+" && game.playerCount.max >= 5) return true
    return false
  }

  // Helper function to filter by complexity
  const matchesComplexity = (game: BoardGame, filter: string): boolean => {
    if (filter === "all") return true
    if (filter === "light" && game.complexity && game.complexity <= 2) return true
    if (filter === "medium" && game.complexity && game.complexity > 2 && game.complexity <= 3.5) return true
    if (filter === "heavy" && game.complexity && game.complexity > 3.5) return true
    return false
  }

  const sortedAndFilteredGames = SAMPLE_BOARD_GAMES
    .filter((game) => {
      if (
        searchQuery &&
        !game.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !game.designer.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
      if (!matchesPlayerCount(game, playerCountFilter)) {
        return false
      }
      if (!matchesComplexity(game, complexityFilter)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title)
        case "designer":
          return direction * a.designer.localeCompare(b.designer)
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0))
        case "complexity":
          return direction * ((a.complexity || 0) - (b.complexity || 0))
        case "dateAdded":
          return direction * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        case "playTime":
          return direction * ((a.playTime.max || 0) - (b.playTime.max || 0))
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
        <p className="text-muted-foreground">No board games found matching your filters.</p>
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
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="complexity">Complexity</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="playTime">Play Time</SelectItem>
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
                <div className="aspect-[1/1] relative bg-muted rounded-md overflow-hidden">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={`Box art of ${game.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <DashboardIcon className="h-12 w-12 text-muted-foreground" />
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
                  <p className="text-sm text-muted-foreground">{game.designer}</p>
                  <p className="text-sm mt-2 line-clamp-2">{game.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={game.status === "completed" ? "default" : "secondary"}>
                    {game.status === "in_progress" ? "Playing" : game.status}
                  </Badge>
                  <Badge variant="outline">{game.source}</Badge>
                  <Badge variant="outline" className="bg-muted/50">
                    {game.playerCount.min}-{game.playerCount.max} players
                  </Badge>
                  {game.complexity && (
                    <Badge variant="outline" className="ml-auto">
                      Complexity: {game.complexity.toFixed(1)}
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
                  <SortButton field="designer" label="Designer" />
                </TableHead>
                <TableHead>
                  <SortButton field="playTime" label="Play Time" />
                </TableHead>
                <TableHead>Players</TableHead>
                <TableHead>
                  <SortButton field="complexity" label="Complexity" />
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
                  <TableCell>{game.designer}</TableCell>
                  <TableCell>{game.playTime.min}-{game.playTime.max} min</TableCell>
                  <TableCell>{game.playerCount.min}-{game.playerCount.max}</TableCell>
                  <TableCell>{game.complexity ? game.complexity.toFixed(1) : "-"}</TableCell>
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