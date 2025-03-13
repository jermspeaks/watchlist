import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  StarFilledIcon,
  LayoutIcon,
  ListBulletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BookmarkIcon,
  ReloadIcon,
  TrashIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons"
import { Dispatch, SetStateAction } from "react"

export interface Book {
  id: string
  title: string
  author: string
  description: string
  rating?: number
  status: "wishlist" | "reading" | "completed"
  source: "amazon" | "kindle" | "kobo" | "physical"
  coverUrl?: string
  dateAdded: string
  isbn?: string
  pageCount?: number
  publisher?: string
  publishedDate?: string
  currentPage?: number
}

export interface BookListProps {
  books: Book[]
  isLoading: boolean
  totalBooks: number
  currentPage: number
  totalPages: number
  sortBy: string
  sortDirection: "asc" | "desc"
  onPageChange: (page: number) => void
  onSortChange: (field: string) => void
  onDeleteBook?: Dispatch<SetStateAction<string | null>>
}

export function BookList({
  books,
  isLoading,
  totalBooks,
  currentPage,
  totalPages,
  sortBy,
  sortDirection,
  onPageChange,
  onSortChange,
  onDeleteBook,
}: BookListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ReloadIcon className="h-6 w-6 animate-spin mr-2" />
        <p>Loading books...</p>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No books found matching your filters.</p>
      </div>
    )
  }

  const SortButton = ({ field, label }: { field: string; label: string }) => (
    <Button
      variant="ghost"
      className="flex items-center space-x-1"
      onClick={() => onSortChange(field)}
    >
      <span>{label}</span>
      {sortBy === field && (
        <span className="ml-1">{sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
      )}
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
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
          {books.map((book) => (
            <Card key={book.id} className="p-4">
              <div className="space-y-3">
                <div className="aspect-[2/3] relative bg-muted rounded-md overflow-hidden">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      width={200}
                      height={300}
                      style={{ objectFit: 'cover' }}
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
                {onDeleteBook && (
                  <div className="flex justify-end space-x-2 pt-2">
                    <Link href={`/books/edit/${book.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil1Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteBook(book.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>
                  <SortButton field="dateAdded" label="Date Added" />
                </TableHead>
                {onDeleteBook && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    {book.rating ? (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {book.rating}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.status === "completed" ? "default" : "secondary"}>
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.source}</Badge>
                  </TableCell>
                  <TableCell>{new Date(book.dateAdded).toLocaleDateString()}</TableCell>
                  {onDeleteBook && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/books/edit/${book.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil1Icon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onDeleteBook(book.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
} 