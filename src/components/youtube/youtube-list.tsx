import { useState } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  StarFilledIcon,
  LayoutIcon,
  ListBulletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  PersonIcon,
} from "@radix-ui/react-icons"
import { YouTubePlaceholder } from "./youtube-placeholder"

// Define the YouTube item type
interface YouTubeItem {
  id: string;
  title: string;
  description: string;
  channelName: string;
  channelId: string;
  isChannelSubscribed: boolean;
  thumbnailUrl?: string;
  videoUrl: string;
  duration?: string;
  viewCount?: number;
  publishedAt: string;
  addedAt: string;
  status: "wishlist" | "in_progress" | "completed";
  rating?: number;
  tags: string[];
  type: "video" | "playlist" | "channel";
  progress?: number; // For videos in progress (percentage)
  playlistItemCount?: number; // For playlists
}

interface YouTubeListProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  channelFilter: string;
}

type SortField = "title" | "channelName" | "publishedAt" | "addedAt" | "rating";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

// Sample data for YouTube items
const SAMPLE_YOUTUBE_ITEMS: YouTubeItem[] = [
  {
    id: "1",
    title: "Building a Next.js App with Tailwind CSS",
    description: "Learn how to build a modern web application using Next.js and Tailwind CSS.",
    channelName: "Coding Garden",
    channelId: "channel1",
    isChannelSubscribed: true,
    thumbnailUrl: "https://i.ytimg.com/vi/1WmNXEVia8I/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=1WmNXEVia8I",
    duration: "1:24:36",
    viewCount: 45000,
    publishedAt: "2023-01-15",
    addedAt: "2023-01-20",
    status: "completed",
    rating: 5,
    tags: ["nextjs", "tailwind", "tutorial"],
    type: "video"
  },
  {
    id: "2",
    title: "React Hooks Explained",
    description: "A comprehensive guide to React Hooks and how to use them effectively.",
    channelName: "Fireship",
    channelId: "channel2",
    isChannelSubscribed: true,
    thumbnailUrl: "https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
    duration: "10:23",
    viewCount: 250000,
    publishedAt: "2022-11-05",
    addedAt: "2022-11-10",
    status: "completed",
    rating: 4,
    tags: ["react", "hooks", "javascript"],
    type: "video"
  },
  {
    id: "3",
    title: "Full Stack Development Crash Course",
    description: "Learn full stack development from scratch in this comprehensive crash course.",
    channelName: "Traversy Media",
    channelId: "channel3",
    isChannelSubscribed: false,
    thumbnailUrl: "https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    duration: "2:45:12",
    viewCount: 1200000,
    publishedAt: "2022-08-20",
    addedAt: "2022-09-15",
    status: "in_progress",
    progress: 45,
    rating: 5,
    tags: ["fullstack", "webdev", "tutorial"],
    type: "video"
  },
  {
    id: "4",
    title: "TypeScript Tutorial for Beginners",
    description: "Learn the basics of TypeScript and how to use it in your projects.",
    channelName: "The Net Ninja",
    channelId: "channel4",
    isChannelSubscribed: true,
    thumbnailUrl: "https://i.ytimg.com/vi/2pZmKW9-I_k/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=2pZmKW9-I_k",
    duration: "35:42",
    viewCount: 320000,
    publishedAt: "2022-05-10",
    addedAt: "2022-06-01",
    status: "wishlist",
    tags: ["typescript", "javascript", "tutorial"],
    type: "video"
  },
  {
    id: "5",
    title: "React Native Crash Course 2023",
    description: "Build mobile apps with React Native in this updated crash course for 2023.",
    channelName: "Academind",
    channelId: "channel5",
    isChannelSubscribed: false,
    thumbnailUrl: "https://i.ytimg.com/vi/VozPNrt-LfE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=VozPNrt-LfE",
    duration: "1:58:24",
    viewCount: 520000,
    publishedAt: "2023-02-01",
    addedAt: "2023-02-05",
    status: "wishlist",
    tags: ["react-native", "mobile", "tutorial"],
    type: "video"
  },
  {
    id: "6",
    title: "Web Development in 2023 - A Practical Guide",
    description: "An overview of the web development landscape in 2023 and what you should learn.",
    channelName: "Traversy Media",
    channelId: "channel3",
    isChannelSubscribed: false,
    thumbnailUrl: "https://i.ytimg.com/vi/EqzUcMzfV1w/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=EqzUcMzfV1w",
    duration: "28:15",
    viewCount: 980000,
    publishedAt: "2023-01-05",
    addedAt: "2023-01-10",
    status: "completed",
    rating: 4,
    tags: ["webdev", "career", "guide"],
    type: "video"
  },
  {
    id: "7",
    title: "JavaScript Tutorials for Beginners",
    description: "Complete JavaScript tutorial series for beginners.",
    channelName: "The Net Ninja",
    channelId: "channel4",
    isChannelSubscribed: true,
    thumbnailUrl: "https://i.ytimg.com/vi/iWOYAxlnaww/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET",
    publishedAt: "2022-03-15",
    addedAt: "2022-04-01",
    status: "in_progress",
    progress: 60,
    rating: 5,
    tags: ["javascript", "tutorial", "playlist"],
    type: "playlist",
    playlistItemCount: 25
  },
  {
    id: "8",
    title: "Fireship",
    description: "High-intensity ⚡ code tutorials and tech news.",
    channelName: "Fireship",
    channelId: "channel2",
    isChannelSubscribed: true,
    thumbnailUrl: "https://yt3.googleusercontent.com/ytc/APkrFKb--NH6RwAGHYsD3KfxX-SAgWgIHrjR5E4Jb5SDSQ=s176-c-k-c0x00ffffff-no-rj",
    videoUrl: "https://www.youtube.com/c/Fireship",
    publishedAt: "2017-08-12",
    addedAt: "2021-10-15",
    status: "completed",
    rating: 5,
    tags: ["coding", "tutorials", "tech"],
    type: "channel"
  }
];

export function YouTubeList({
  searchQuery,
  statusFilter,
  typeFilter,
  channelFilter
}: YouTubeListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortField, setSortField] = useState<SortField>("addedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAndFilteredItems = SAMPLE_YOUTUBE_ITEMS
    .filter((item) => {
      // Apply search filter
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Apply type filter
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      // Apply channel filter
      if (channelFilter !== "all") {
        if (channelFilter === "subscribed" && !item.isChannelSubscribed) {
          return false;
        }
        if (channelFilter === "not_subscribed" && item.isChannelSubscribed) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title);
        case "channelName":
          return direction * a.channelName.localeCompare(b.channelName);
        case "publishedAt":
          return direction * (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        case "addedAt":
          return direction * (new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0));
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(sortedAndFilteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedAndFilteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (sortedAndFilteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No YouTube items found matching your filters.</p>
      </div>
    );
  }

  // Helper component for sort buttons
  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      className="flex items-center space-x-1"
      onClick={() => toggleSort(field)}
    >
      <span>{label}</span>
      {sortField === field && (
        <span className="ml-1">
          {sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </span>
      )}
    </Button>
  );

  // Format duration from seconds or string
  const formatDuration = (duration?: string) => {
    if (!duration) return "-";
    return duration;
  };

  // Format view count with K, M, etc.
  const formatViewCount = (count?: number) => {
    if (!count) return "-";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case "wishlist":
        return "To Watch";
      case "in_progress":
        return "Watching";
      case "completed":
        return "Watched";
      default:
        return status;
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayIcon className="h-4 w-4" />;
      case "playlist":
        return <ListBulletIcon className="h-4 w-4" />;
      case "channel":
        return <PersonIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="channelName">Channel</SelectItem>
              <SelectItem value="publishedAt">Published Date</SelectItem>
              <SelectItem value="addedAt">Date Added</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            {sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {sortedAndFilteredItems.length} items
          </span>
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
          {paginatedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={`Thumbnail for ${item.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <YouTubePlaceholder
                    title={item.title}
                    type={item.type}
                    className="w-full h-full"
                  />
                )}
                {item.duration && item.type === "video" && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                    {formatDuration(item.duration)}
                  </div>
                )}
                {item.type === "playlist" && item.playlistItemCount && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded flex items-center">
                    <ListBulletIcon className="h-3 w-3 mr-1" />
                    {item.playlistItemCount}
                  </div>
                )}
                {item.progress !== undefined && item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  {item.rating && (
                    <div className="flex items-center ml-2 shrink-0">
                      <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm">{item.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.channelName}</p>
                {item.viewCount && item.type === "video" && (
                  <p className="text-xs text-muted-foreground">
                    {formatViewCount(item.viewCount)} views
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                  <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                    {getStatusText(item.status)}
                  </Badge>
                  {item.isChannelSubscribed && (
                    <Badge variant="outline" className="bg-muted/50">
                      Subscribed
                    </Badge>
                  )}
                </div>
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
                  <SortButton field="channelName" label="Channel" />
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.channelName}
                      {item.isChannelSubscribed && (
                        <Badge variant="outline" className="ml-2 bg-muted/50">
                          Sub
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTypeIcon(item.type)}
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.type === "video" ? formatDuration(item.duration) : "-"}
                    {item.type === "playlist" && item.playlistItemCount
                      ? `${item.playlistItemCount} videos`
                      : ""}
                  </TableCell>
                  <TableCell>
                    {item.type === "video" ? formatViewCount(item.viewCount) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                      {getStatusText(item.status)}
                    </Badge>
                    {item.progress !== undefined && item.progress > 0 && item.progress < 100 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {item.progress}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{item.rating}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 