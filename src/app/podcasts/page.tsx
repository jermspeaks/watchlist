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
import { PodcastList } from "@/components/podcasts/podcast-list"
import { PlusIcon } from "@radix-ui/react-icons"

export default function PodcastsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Podcasts</h1>
            <p className="text-muted-foreground">
              Track your podcast subscriptions and episodes
            </p>
          </div>
          <Link href="/podcasts/add">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Podcast
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search podcasts..."
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
              <SelectItem value="wishlist">To Listen</SelectItem>
              <SelectItem value="in_progress">Listening</SelectItem>
              <SelectItem value="completed">Listened</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="pocketcasts">PocketCasts</SelectItem>
              <SelectItem value="rss">RSS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="subscribed">Subscribed</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Podcast List */}
        <PodcastList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          subscriptionFilter={subscriptionFilter}
        />
      </div>
    </div>
  )
} 