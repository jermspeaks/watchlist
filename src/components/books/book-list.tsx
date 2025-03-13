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
  BookmarkIcon,
} from "@radix-ui/react-icons"

interface Book {
  id: string
  title: string
  author: string
  description: string
  rating?: number
  status: "wishlist" | "reading" | "completed"
  source: "amazon" | "kindle" | "kobo" | "physical"
  coverUrl?: string
  dateAdded: string
}

interface BookListProps {
  searchQuery: string
  statusFilter: string
  sourceFilter: string
}

type SortField = "title" | "author" | "rating" | "dateAdded"
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE = 12

// Temporary sample data - will be replaced with actual data from database
const SAMPLE_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    description: "Your journey to mastery, 20th Anniversary Edition. From journeyman to master programmer.",
    rating: 5,
    status: "completed",
    source: "physical",
    dateAdded: "2024-03-13",
    coverUrl: "https://m.media-amazon.com/images/I/510NRcB7AAL._SL500_.jpg"
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship that has helped countless programmers write better code.",
    rating: 4,
    status: "reading",
    source: "kindle",
    dateAdded: "2024-03-12",
    coverUrl: "https://m.media-amazon.com/images/I/41bOkXnNBjL._SL500_.jpg"
  },
]

export function BookList({ searchQuery, statusFilter, sourceFilter }: BookListProps) {
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

  const sortedAndFilteredBooks = SAMPLE_BOOKS
    .filter((book) => {
      if (
        searchQuery &&
        !book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !book.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !book.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      if (statusFilter !== "all" && book.status !== statusFilter) {
        return false
      }
      if (sourceFilter !== "all" && book.source !== sourceFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title)
        case "author":
          return direction * a.author.localeCompare(b.author)
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0))
        case "dateAdded":
          return direction * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(sortedAndFilteredBooks.length / ITEMS_PER_PAGE)
  const paginatedBooks = sortedAndFilteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (sortedAndFilteredBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No books found matching your filters.</p>
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
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
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
            {sortedAndFilteredBooks.length} items
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
          {paginatedBooks.map((book) => (
            <Card key={book.id} className="p-4">
              <div className="space-y-3">
                <div className="aspect-[2/3] relative bg-muted rounded-md overflow-hidden">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookmarkIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{book.title}</h3>
                    {book.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm">{book.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-sm mt-2 line-clamp-2">{book.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={book.status === "completed" ? "default" : "secondary"}>
                    {book.status}
                  </Badge>
                  <Badge variant="outline">{book.source}</Badge>
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
                  <SortButton field="author" label="Author" />
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
                <TableHead>
                  <SortButton field="dateAdded" label="Added" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{book.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.status === "completed" ? "default" : "secondary"}>
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.source}</Badge>
                  </TableCell>
                  <TableCell>
                    {book.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{book.rating}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(book.dateAdded).toLocaleDateString()}</TableCell>
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