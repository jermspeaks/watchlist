"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DeleteDialog } from "@/components/delete-dialog"

// Sample data for places (in a real app, this would come from an API or database)
const SAMPLE_PLACES = [
  {
    id: "1",
    title: "Eiffel Tower",
    description: "Iconic iron tower located on the Champ de Mars in Paris, France.",
    category: "attraction",
    address: "Champ de Mars, 5 Avenue Anatole France",
    city: "Paris",
    country: "France",
    postalCode: "75007",
    coordinates: {
      latitude: 48.8584,
      longitude: 2.2945,
    },
    photoUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=1000",
    website: "https://www.toureiffel.paris/en",
    priceRange: "moderate" as const,
    rating: 5,
    status: "wishlist" as const,
    tags: ["landmark", "tourism", "architecture"],
    notes: "",
    locationType: "international" as const,
    visitDate: undefined,
    plannedDate: undefined,
  },
  // Add more sample places as needed
];

const placeFormSchema = z.object({
  title: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().optional(),
  photoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  priceRange: z.enum(["inexpensive", "moderate", "expensive", "very_expensive"]).optional(),
  rating: z.number().min(0).max(5).optional(),
  visitDate: z.date().optional(),
  plannedDate: z.date().optional(),
  status: z.enum(["wishlist", "in_progress", "completed"]),
  notes: z.string().optional(),
  locationType: z.enum(["local", "domestic", "international"]),
  coordinates: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
})

type PlaceFormValues = z.infer<typeof placeFormSchema>

export default function EditPlacePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [place, setPlace] = useState<PlaceFormValues | null>(null)

  // In a real app, this would be an API call
  useEffect(() => {
    const fetchPlace = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Find the place in our sample data
        const foundPlace = SAMPLE_PLACES.find(p => p.id === id)
        
        if (foundPlace) {
          // Convert string dates to Date objects if they exist
          const formattedPlace = {
            ...foundPlace,
            visitDate: foundPlace.visitDate ? new Date(foundPlace.visitDate) : undefined,
            plannedDate: foundPlace.plannedDate ? new Date(foundPlace.plannedDate) : undefined,
          }
          setPlace(formattedPlace as PlaceFormValues)
        } else {
          // Handle not found
          router.push("/places")
        }
      } catch (error) {
        console.error("Error fetching place:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlace()
  }, [id, router])

  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
      status: "wishlist",
      description: "",
      photoUrl: "",
      website: "",
      phone: "",
      notes: "",
      locationType: "local",
    },
  })

  // Update form values when place data is loaded
  useEffect(() => {
    if (place) {
      // Reset the form with the place data
      form.reset(place)
    }
  }, [place, form])

  // Watch for status changes to show/hide relevant fields
  const watchStatus = form.watch("status")

  async function onSubmit(data: PlaceFormValues) {
    setIsPending(true)
    
    // This would normally send data to an API or database
    console.log("Form submitted:", data)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsPending(false)
    router.push("/places")
  }

  async function handleDelete() {
    // This would normally send a delete request to an API or database
    console.log("Deleting place:", id)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    router.push("/places")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/places" className="inline-flex items-center text-sm">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Places
          </Link>
          <div className="flex justify-between items-center mt-4">
            <h1 className="text-3xl font-bold">Edit Place</h1>
            <DeleteDialog
              itemName={place?.title || "this place"}
              itemType="places"
              onDelete={handleDelete}
            />
          </div>
          <p className="text-muted-foreground">
            Update the details for this place
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter place name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="cafe">Café</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="attraction">Attraction</SelectItem>
                        <SelectItem value="museum">Museum</SelectItem>
                        <SelectItem value="park">Park</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="wishlist">Want to Visit</SelectItem>
                        <SelectItem value="in_progress">Planned</SelectItem>
                        <SelectItem value="completed">Visited</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Location Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="local" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Local
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="domestic" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Domestic
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="international" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            International
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state or province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchStatus === "completed" && (
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Visit Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchStatus === "in_progress" && (
                <FormField
                  control={form.control}
                  name="plannedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Planned Visit Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inexpensive">$ (Inexpensive)</SelectItem>
                        <SelectItem value="moderate">$$ (Moderate)</SelectItem>
                        <SelectItem value="expensive">$$$ (Expensive)</SelectItem>
                        <SelectItem value="very_expensive">$$$$ (Very Expensive)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for a photo of the place
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter personal notes"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add any personal notes or tips about this place
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/places")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 