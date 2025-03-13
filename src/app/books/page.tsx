"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookList, Book } from "@/components/books/book-list"
import { PlusIcon } from "@radix-ui/react-icons"
import { getBooks, deleteBook } from "@/services/books-service"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dateAdded")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [books, setBooks] = useState<Book[]>([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [bookToDelete, setBookToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBooks()
  }, [searchQuery, statusFilter, sourceFilter, sortBy, sortDirection, currentPage])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const result = await getBooks({
        search: searchQuery,
        status: statusFilter,
        source: sourceFilter,
        sortBy,
        sortDirection,
        page: currentPage,
        pageSize: 12,
      })
      
      // Convert the API response to match the Book type
      const formattedBooks = result.books.map(book => {
        const formattedBook: Book = {
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          rating: book.rating ?? undefined,
          status: book.status as "wishlist" | "reading" | "completed",
          source: book.source as "amazon" | "kindle" | "kobo" | "physical",
          coverUrl: book.coverUrl || undefined,
          dateAdded: book.dateAdded,
          isbn: book.isbn || undefined,
          pageCount: book.pageCount ?? undefined,
          publisher: book.publisher || undefined,
          publishedDate: book.publishedDate || undefined,
          currentPage: book.currentPage ?? undefined,
        };
        return formattedBook;
      });
      
      setBooks(formattedBooks)
      setTotalBooks(result.total)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error("Error fetching books:", error)
      toast({
        title: "Error",
        description: "Failed to fetch books. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const handleDeleteBook = async () => {
    if (!bookToDelete) return
    
    setIsDeleting(true)
    
    // Optimistic update - remove the book from the UI immediately
    const bookIndex = books.findIndex(book => book.id === bookToDelete)
    const bookToRestore = books[bookIndex]
    const newBooks = [...books]
    newBooks.splice(bookIndex, 1)
    setBooks(newBooks)
    setTotalBooks(totalBooks - 1)
    
    try {
      await deleteBook(bookToDelete)
      toast({
        title: "Success",
        description: "Book deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting book:", error)
      
      // Restore the book if deletion fails
      const restoredBooks = [...newBooks]
      restoredBooks.splice(bookIndex, 0, bookToRestore)
      setBooks(restoredBooks)
      setTotalBooks(totalBooks)
      
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setBookToDelete(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Books</h1>
            <p className="text-muted-foreground">
              Track your reading list and manage your book collection
            </p>
          </div>
          <Link href="/books/add">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="wishlist">Wishlist</SelectItem>
              <SelectItem value="reading">Currently Reading</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="kindle">Kindle</SelectItem>
              <SelectItem value="kobo">Kobo</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Book List */}
        <BookList
          books={books}
          isLoading={isLoading}
          totalBooks={totalBooks}
          currentPage={currentPage}
          totalPages={totalPages}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onDeleteBook={setBookToDelete}
        />
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the book from your collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteBook} 
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 