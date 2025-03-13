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
import { YouTubeList } from "@/components/youtube/youtube-list"
import { PlusIcon } from "@radix-ui/react-icons"

export default function YouTubePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">YouTube</h1>
            <p className="text-muted-foreground">
              Track your favorite YouTube videos and channels
            </p>
          </div>
          <Link href="/youtube/add">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search videos..."
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
              <SelectItem value="wishlist">To Watch</SelectItem>
              <SelectItem value="in_progress">Watching</SelectItem>
              <SelectItem value="completed">Watched</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="playlist">Playlist</SelectItem>
              <SelectItem value="channel">Channel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="subscribed">Subscribed</SelectItem>
              <SelectItem value="not_subscribed">Not Subscribed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* YouTube List */}
        <YouTubeList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          channelFilter={channelFilter}
        />
      </div>
    </div>
  )
} 