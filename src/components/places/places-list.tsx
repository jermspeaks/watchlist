import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StarFilledIcon,
  LayoutIcon,
  ListBulletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { MapPin, Globe } from "lucide-react";
import { PlacesPlaceholder } from "./places-placeholder";
import { DeleteDialog } from "@/components/delete-dialog";
import { StatusUpdate } from "@/components/status-update";
import Link from "next/link";

// Define the Place item type
interface Place {
  id: string;
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  photoUrl?: string;
  website?: string;
  phone?: string;
  priceRange?: "inexpensive" | "moderate" | "expensive" | "very_expensive";
  rating?: number;
  visitDate?: string;
  plannedDate?: string;
  status: "wishlist" | "in_progress" | "completed";
  tags: string[];
  notes?: string;
  locationType: "local" | "domestic" | "international";
}

interface PlacesListProps {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  locationFilter: string;
}

type SortField = "title" | "category" | "city" | "rating" | "visitDate";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

// Status options for the dropdown
const STATUS_OPTIONS = [
  { value: "wishlist", label: "Want to Visit" },
  { value: "in_progress", label: "Planned" },
  { value: "completed", label: "Visited" },
];

// Sample data for places
const SAMPLE_PLACES: Place[] = [
  {
    id: "1",
    title: "Eiffel Tower",
    description:
      "Iconic iron tower located on the Champ de Mars in Paris, France.",
    category: "attraction",
    address: "Champ de Mars, 5 Avenue Anatole France",
    city: "Paris",
    country: "France",
    postalCode: "75007",
    coordinates: {
      latitude: 48.8584,
      longitude: 2.2945,
    },
    photoUrl:
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=1000",
    website: "https://www.toureiffel.paris/en",
    priceRange: "moderate",
    rating: 5,
    status: "wishlist",
    tags: ["landmark", "tourism", "architecture"],
    locationType: "international",
  },
  {
    id: "2",
    title: "Central Park",
    description: "Urban park in Manhattan, New York City.",
    category: "park",
    address: "Central Park",
    city: "New York",
    state: "NY",
    country: "USA",
    coordinates: {
      latitude: 40.7812,
      longitude: -73.9665,
    },
    photoUrl:
      "https://images.unsplash.com/photo-1534251369789-5067c8b8602a?q=80&w=1000",
    website: "https://www.centralparknyc.org/",
    rating: 4,
    visitDate: "2022-06-15",
    status: "completed",
    tags: ["park", "nature", "recreation"],
    notes:
      "Beautiful in summer, visited the Bethesda Fountain and Strawberry Fields.",
    locationType: "domestic",
  },
  {
    id: "3",
    title: "Sushi Nakazawa",
    description: "High-end sushi restaurant offering omakase-style dining.",
    category: "restaurant",
    address: "23 Commerce St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10014",
    photoUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000",
    website: "https://www.sushinakazawa.com/",
    phone: "+1 212-924-2212",
    priceRange: "very_expensive",
    rating: 5,
    status: "wishlist",
    tags: ["sushi", "japanese", "fine dining"],
    locationType: "domestic",
  },
  {
    id: "4",
    title: "Golden Gate Bridge",
    description: "Suspension bridge spanning the Golden Gate strait.",
    category: "attraction",
    address: "Golden Gate Bridge",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    coordinates: {
      latitude: 37.8199,
      longitude: -122.4783,
    },
    photoUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1000",
    website: "https://www.goldengate.org/",
    rating: 5,
    visitDate: "2021-08-10",
    status: "completed",
    tags: ["bridge", "landmark", "architecture"],
    notes: "Walked across the bridge, amazing views of the bay.",
    locationType: "domestic",
  },
  {
    id: "5",
    title: "The Coffee Bean & Tea Leaf",
    description:
      "Popular coffee chain with a variety of coffee and tea options.",
    category: "cafe",
    address: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    photoUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000",
    website: "https://www.coffeebean.com/",
    priceRange: "inexpensive",
    rating: 3,
    status: "completed",
    visitDate: "2023-01-05",
    tags: ["coffee", "cafe", "casual"],
    locationType: "local",
  },
  {
    id: "6",
    title: "Louvre Museum",
    description:
      "World's largest art museum and a historic monument in Paris, France.",
    category: "museum",
    address: "Rue de Rivoli",
    city: "Paris",
    country: "France",
    postalCode: "75001",
    coordinates: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
    photoUrl:
      "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?q=80&w=1000",
    website: "https://www.louvre.fr/en",
    priceRange: "moderate",
    rating: 5,
    plannedDate: "2023-07-15",
    status: "in_progress",
    tags: ["art", "museum", "history"],
    locationType: "international",
  },
  {
    id: "7",
    title: "Nobu Malibu",
    description: "Upscale Japanese restaurant with ocean views.",
    category: "restaurant",
    address: "22706 Pacific Coast Hwy",
    city: "Malibu",
    state: "CA",
    country: "USA",
    postalCode: "90265",
    photoUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000",
    website: "https://www.noburestaurants.com/malibu",
    phone: "+1 310-317-9140",
    priceRange: "very_expensive",
    rating: 4,
    status: "wishlist",
    tags: ["japanese", "sushi", "fine dining", "ocean view"],
    locationType: "local",
  },
  {
    id: "8",
    title: "Griffith Observatory",
    description:
      "Observatory with exhibits, a planetarium, and views of Los Angeles.",
    category: "attraction",
    address: "2800 E Observatory Rd",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90027",
    coordinates: {
      latitude: 34.1184,
      longitude: -118.3004,
    },
    photoUrl:
      "https://images.unsplash.com/photo-1518533954129-7774297db60f?q=80&w=1000",
    website: "https://www.griffithobservatory.org/",
    priceRange: "inexpensive",
    rating: 4,
    visitDate: "2022-11-20",
    status: "completed",
    tags: ["observatory", "astronomy", "views"],
    notes: "Great views of the city, especially at sunset.",
    locationType: "local",
  },
];

export function PlacesList({
  searchQuery,
  statusFilter,
  categoryFilter,
  locationFilter,
}: PlacesListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [places, setPlaces] = useState<Place[]>(SAMPLE_PLACES);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPlaces(
      places.map((place) =>
        place.id === id
          ? {
              ...place,
              status: newStatus as "wishlist" | "in_progress" | "completed",
              // Clear or set dates based on new status
              visitDate:
                newStatus === "completed"
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
              plannedDate:
                newStatus === "in_progress"
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
            }
          : place
      )
    );
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPlaces(places.filter((place) => place.id !== id));
  };

  const sortedAndFilteredPlaces = places
    .filter((place) => {
      // Apply search filter
      if (
        searchQuery &&
        !place.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !place.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !place.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !place.country.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== "all" && place.status !== statusFilter) {
        return false;
      }

      // Apply category filter
      if (categoryFilter !== "all" && place.category !== categoryFilter) {
        return false;
      }

      // Apply location filter
      if (locationFilter !== "all" && place.locationType !== locationFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "title":
          return direction * a.title.localeCompare(b.title);
        case "category":
          return direction * a.category.localeCompare(b.category);
        case "city":
          return direction * a.city.localeCompare(b.city);
        case "rating":
          return direction * ((a.rating || 0) - (b.rating || 0));
        case "visitDate":
          if (!a.visitDate && !b.visitDate) return 0;
          if (!a.visitDate) return direction;
          if (!b.visitDate) return -direction;
          return (
            direction *
            (new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
          );
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(sortedAndFilteredPlaces.length / ITEMS_PER_PAGE);
  const paginatedPlaces = sortedAndFilteredPlaces.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (sortedAndFilteredPlaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No places found matching your filters.
        </p>
      </div>
    );
  }

  // Helper component for sort buttons
  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
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

  // Format price range
  const formatPriceRange = (priceRange?: string) => {
    if (!priceRange) return "-";
    switch (priceRange) {
      case "inexpensive":
        return "$";
      case "moderate":
        return "$$";
      case "expensive":
        return "$$$";
      case "very_expensive":
        return "$$$$";
      default:
        return priceRange;
    }
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Get location icon
  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case "local":
        return <MapPin className="h-4 w-4" />;
      case "domestic":
        return <Globe className="h-4 w-4" />;
      case "international":
        return <Globe className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="visitDate">Visit Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            {sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {sortedAndFilteredPlaces.length} items
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
          {paginatedPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {place.photoUrl ? (
                  <img
                    src={place.photoUrl}
                    alt={`Photo of ${place.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlacesPlaceholder
                    title={place.title}
                    category={place.category}
                    className="w-full h-full"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/80 text-black">
                    {formatCategory(place.category)}
                  </Badge>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{place.title}</h3>
                  {place.rating && (
                    <div className="flex items-center ml-2 shrink-0">
                      <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm">{place.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {place.city}, {place.country}
                  </span>
                </div>
                {(place.visitDate || place.plannedDate) && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>
                      {place.visitDate
                        ? `Visited: ${new Date(
                            place.visitDate
                          ).toLocaleDateString()}`
                        : `Planned: ${new Date(
                            place.plannedDate!
                          ).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <StatusUpdate
                    currentStatus={place.status}
                    onStatusChange={(newStatus) =>
                      handleStatusUpdate(place.id, newStatus)
                    }
                    statusOptions={STATUS_OPTIONS}
                    buttonVariant="secondary"
                    buttonSize="sm"
                  />
                  {place.priceRange && (
                    <Badge variant="outline">
                      {formatPriceRange(place.priceRange)}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getLocationIcon(place.locationType)}
                    {place.locationType.charAt(0).toUpperCase() +
                      place.locationType.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                  <Link href={`/places/edit/${place.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil1Icon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteDialog
                    itemName={place.title}
                    itemType="places"
                    onDelete={() => handleDelete(place.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        Delete
                      </Button>
                    }
                  />
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
                  <SortButton field="title" label="Name" />
                </TableHead>
                <TableHead>
                  <SortButton field="category" label="Category" />
                </TableHead>
                <TableHead>
                  <SortButton field="city" label="Location" />
                </TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <SortButton field="visitDate" label="Visit Date" />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <SortButton field="rating" label="Rating" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlaces.map((place) => (
                <TableRow key={place.id}>
                  <TableCell className="font-medium">{place.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatCategory(place.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getLocationIcon(place.locationType)}
                      <span className="ml-2">
                        {place.city}, {place.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {place.priceRange
                      ? formatPriceRange(place.priceRange)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {place.visitDate
                      ? new Date(place.visitDate).toLocaleDateString()
                      : place.plannedDate
                      ? `Planned: ${new Date(
                          place.plannedDate
                        ).toLocaleDateString()}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <StatusUpdate
                      currentStatus={place.status}
                      onStatusChange={(newStatus) =>
                        handleStatusUpdate(place.id, newStatus)
                      }
                      statusOptions={STATUS_OPTIONS}
                      buttonVariant="secondary"
                      buttonSize="sm"
                    />
                  </TableCell>
                  <TableCell>
                    {place.rating && (
                      <div className="flex items-center">
                        <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1">{place.rating}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/places/edit/${place.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil1Icon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <DeleteDialog
                        itemName={place.title}
                        itemType="places"
                        onDelete={() => handleDelete(place.id)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            Delete
                          </Button>
                        }
                      />
                    </div>
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
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
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

export default PlacesList;
