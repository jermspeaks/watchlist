"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"

// Define media categories with their routes and descriptions
const MEDIA_CATEGORIES = [
  {
    title: "Books",
    description: "Track books from Amazon, Kindle, Kobo, and physical collection",
    href: "/books",
    icon: "📚",
  },
  {
    title: "Films & TV",
    description: "Movies and TV shows from various sources including Letterboxd and personal archives",
    href: "/films",
    icon: "🎬",
  },
  {
    title: "Video Games",
    description: "Games from Steam and personal collection",
    href: "/games",
    icon: "🎮",
  },
  {
    title: "Board Games",
    description: "Physical board games and BGG wishlist",
    href: "/board-games",
    icon: "🎲",
  },
  {
    title: "Podcasts",
    description: "Podcast subscriptions and episodes to listen",
    href: "/podcasts",
    icon: "🎧",
  },
  {
    title: "YouTube",
    description: "YouTube channels, playlists, and watch later",
    href: "/youtube",
    icon: "▶️",
  },
  {
    title: "Places",
    description: "Restaurants to try and places to visit",
    href: "/places",
    icon: "📍",
  },
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Media Watchlist</h1>
          <p className="text-lg text-muted-foreground">
            Track and manage your media consumption across different categories
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEDIA_CATEGORIES.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="h-full p-6 transition-colors hover:bg-muted/50">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-2xl font-semibold">{category.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

