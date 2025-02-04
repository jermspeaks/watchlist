import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterState } from "@/types/catalogue"

interface CatalogueFiltersProps {
  filters: FilterState
  totalEntries: number
  currentEntries: number
  onFilterChange: (key: keyof FilterState, value: string) => void
}

export function CatalogueFilters({ filters, totalEntries, currentEntries, onFilterChange }: CatalogueFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label htmlFor="search" className="mb-2 block text-sm font-medium">
            Search
          </label>
          <Input
            id="search"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div>
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="game">Game</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="show">Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="rating" className="mb-2 block text-sm font-medium">
            Rating
          </label>
          <Select value={filters.rating} onValueChange={(value) => onFilterChange("rating", value)}>
            <SelectTrigger id="rating">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="sort" className="mb-2 block text-sm font-medium">
            Sort
          </label>
          <Select
            value={filters.sort}
            onValueChange={(value: "date" | "title" | "rating") => onFilterChange("sort", value)}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {currentEntries}/{totalEntries} entries
      </div>
    </div>
  )
}

