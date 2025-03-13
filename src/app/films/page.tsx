"use client"

import { useState } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { PlusIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { MediaList } from "@/components/media/media-list"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Checkbox } from "@/components/ui/checkbox"
import type { Film, TVShow } from "@/types/media"

type MediaType = "all" | "film" | "tv"
type DateRange = { from: Date; to: Date } | undefined

export default function FilmsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState<MediaType>("all")
  const [ratingRange, setRatingRange] = useState([0, 5])
  const [dateRange, setDateRange] = useState<DateRange>(undefined)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  // Sample genres - would typically come from API/database
  const AVAILABLE_GENRES = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Films & TV Shows</h1>
            <p className="text-muted-foreground">
              Track your watchlist and manage your viewing history
            </p>
          </div>
          <Link href="/films/add">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Media
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search titles, directors, cast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as MediaType)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Media Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="film">Films</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="wishlist">Watchlist</SelectItem>
              <SelectItem value="in_progress">Watching</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="letterboxd">Letterboxd</SelectItem>
              <SelectItem value="stremio">Stremio</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with additional filters
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Rating Range</h4>
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    value={ratingRange}
                    onValueChange={setRatingRange}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{ratingRange[0]} stars</span>
                    <span>{ratingRange[1]} stars</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Release Date Range</h4>
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Genres</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_GENRES.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedGenres([...selectedGenres, genre])
                            } else {
                              setSelectedGenres(selectedGenres.filter((g) => g !== genre))
                            }
                          }}
                        />
                        <label
                          htmlFor={genre}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Media List */}
        <MediaList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          typeFilter={typeFilter}
          ratingRange={ratingRange}
          dateRange={dateRange}
          selectedGenres={selectedGenres}
        />
      </div>
    </div>
  )
} 