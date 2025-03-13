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
import { PlusIcon } from "@radix-ui/react-icons"
import PlacesList from "@/components/places/places-list"

export default function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Places</h1>
          <p className="text-muted-foreground">
            Track restaurants, attractions, and destinations you want to visit
          </p>
        </div>
        <Link href="/places/add">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Place
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 mb-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="wishlist">Want to Visit</SelectItem>
              <SelectItem value="in_progress">Planned</SelectItem>
              <SelectItem value="completed">Visited</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="cafe">Cafés</SelectItem>
              <SelectItem value="bar">Bars</SelectItem>
              <SelectItem value="attraction">Attractions</SelectItem>
              <SelectItem value="museum">Museums</SelectItem>
              <SelectItem value="park">Parks</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Select
          value={locationFilter}
          onValueChange={setLocationFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="domestic">Domestic</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PlacesList
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        locationFilter={locationFilter}
      />
    </div>
  )
} 