"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const youtubeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  videoUrl: z.string().url("Invalid URL").min(1, "URL is required"),
  channelName: z.string().min(1, "Channel name is required"),
  isChannelSubscribed: z.boolean().default(false),
  description: z.string().optional(),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["wishlist", "in_progress", "completed"]),
  type: z.enum(["video", "playlist", "channel"]),
  duration: z.string().optional(),
  viewCount: z.number().optional(),
  progress: z.number().min(0).max(100).optional(),
  playlistItemCount: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
})

type YouTubeFormValues = z.infer<typeof youtubeFormSchema>

const defaultValues: Partial<YouTubeFormValues> = {
  status: "wishlist",
  type: "video",
  description: "",
  thumbnailUrl: "",
  isChannelSubscribed: false,
  progress: 0,
  playlistItemCount: 0,
  rating: 0,
}

export default function AddYouTubePage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("video")

  const form = useForm<YouTubeFormValues>({
    resolver: zodResolver(youtubeFormSchema),
    defaultValues,
  })

  // Watch for type changes to show/hide relevant fields
  const watchType = form.watch("type")
  if (watchType !== selectedType) {
    setSelectedType(watchType)
  }

  async function onSubmit(data: YouTubeFormValues) {
    setIsPending(true)
    
    // This would normally send data to an API or database
    console.log("Form submitted:", data)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsPending(false)
    router.push("/youtube")
  }

  // Helper function to extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Auto-generate thumbnail URL from video URL
  const autoGenerateThumbnail = () => {
    const videoUrl = form.getValues("videoUrl")
    if (!videoUrl) return
    
    const videoId = extractVideoId(videoUrl)
    if (videoId) {
      form.setValue("thumbnailUrl", `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/youtube" className="inline-flex items-center text-sm">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to YouTube
          </Link>
          <h1 className="text-3xl font-bold mt-4">Add YouTube Content</h1>
          <p className="text-muted-foreground">
            Add a new video, playlist, or channel to your collection
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="playlist">Playlist</SelectItem>
                        <SelectItem value="channel">Channel</SelectItem>
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
                        <SelectItem value="wishlist">To Watch</SelectItem>
                        <SelectItem value="in_progress">Watching</SelectItem>
                        <SelectItem value="completed">Watched</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {selectedType === "video" ? "Video URL" : 
                         selectedType === "playlist" ? "Playlist URL" : "Channel URL"}
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="https://www.youtube.com/..." 
                            {...field} 
                          />
                        </FormControl>
                        {selectedType === "video" && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={autoGenerateThumbnail}
                          >
                            Get Thumbnail
                          </Button>
                        )}
                      </div>
                      <FormDescription>
                        Enter the full YouTube URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter channel name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isChannelSubscribed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Subscribed</FormLabel>
                      <FormDescription>
                        Are you subscribed to this channel?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {selectedType === "video" && (
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10:30" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the video duration (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "video" && (
                <FormField
                  control={form.control}
                  name="viewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>View Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the view count (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "playlist" && (
                <FormField
                  control={form.control}
                  name="playlistItemCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Videos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        How many videos are in this playlist?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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

              {(selectedType === "video" || selectedType === "playlist") && 
               form.getValues("status") === "in_progress" && (
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress ({field.value || 0}%)</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value || 0]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          How much of the {selectedType === "video" ? "video" : "playlist"} have you watched?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the thumbnail image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/youtube")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add to Collection"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 