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
import { BoardGameList } from "@/components/board-games/board-game-list"
import { PlusIcon } from "@radix-ui/react-icons"

export default function BoardGamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [playerCountFilter, setPlayerCountFilter] = useState("all")
  const [complexityFilter, setComplexityFilter] = useState("all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Board Games</h1>
            <p className="text-muted-foreground">
              Track your board game collection and wishlist
            </p>
          </div>
          <Link href="/board-games/add">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Board Game
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search board games..."
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
              <SelectItem value="in_progress">Currently Playing</SelectItem>
              <SelectItem value="completed">Played</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="bgg">BoardGameGeek</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={playerCountFilter} onValueChange={setPlayerCountFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Player Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Player Counts</SelectItem>
              <SelectItem value="1">Solo Games</SelectItem>
              <SelectItem value="2">2 Players</SelectItem>
              <SelectItem value="3-4">3-4 Players</SelectItem>
              <SelectItem value="5+">5+ Players</SelectItem>
            </SelectContent>
          </Select>
          <Select value={complexityFilter} onValueChange={setComplexityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexity</SelectItem>
              <SelectItem value="light">Light (1-2)</SelectItem>
              <SelectItem value="medium">Medium (2-3.5)</SelectItem>
              <SelectItem value="heavy">Heavy (3.5-5)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Board Game List */}
        <BoardGameList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          playerCountFilter={playerCountFilter}
          complexityFilter={complexityFilter}
        />
      </div>
    </div>
  )
} 