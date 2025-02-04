"use client"

import { useState, useMemo } from "react"
import { MediaCard } from "@/components/media-card"
import { CatalogueFilters } from "@/components/catalogue-filters"
import type { MediaItem, FilterState } from "@/types/catalogue"

// This would typically come from an API or database
const SAMPLE_ITEMS: MediaItem[] = [
  {
    id: "1",
    title: "Trials of Mana",
    creator: "Square Enix",
    type: "game",
    rating: 5,
    imageUrl: "https://global-img.gamergen.com/trials-of-mana-2019-06-11-19-014_0900926689.jpg",
    date: "2020-04-24",
  },
  {
    id: "2",
    title: "Trials of Mana",
    creator: "Square Enix",
    type: "game",
    rating: 5,
    imageUrl: "https://global-img.gamergen.com/trials-of-mana-2019-06-11-19-014_0900926689.jpg",
    date: "2020-04-24",
  },
]

export default function CataloguePage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    rating: "all",
    sort: "date",
  })

  const filteredItems = useMemo(() => {
    return SAMPLE_ITEMS.filter((item) => {
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.type !== "all" && item.type !== filters.type) {
        return false
      }
      if (filters.rating !== "all" && item.rating < Number.parseInt(filters.rating)) {
        return false
      }
      return true
    }).sort((a, b) => {
      switch (filters.sort) {
        case "title":
          return a.title.localeCompare(b.title)
        case "rating":
          return b.rating - a.rating
        case "date":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })
  }, [filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Catalogue</h1>
          <p className="text-lg text-muted-foreground">
            This page lists games, books, shows... you know, things, I&apos;ve watched, played, read, listened to. Each
            entry includes a description and some metadata. Below are some filters you can use.
          </p>
        </div>

        <CatalogueFilters
          filters={filters}
          totalEntries={SAMPLE_ITEMS.length}
          currentEntries={filteredItems.length}
          onFilterChange={handleFilterChange}
        />

        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

