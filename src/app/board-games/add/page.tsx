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
import { Slider } from "@/components/ui/slider"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const boardGameFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  designer: z.string().min(1, "Designer is required"),
  publisher: z.string().min(1, "Publisher is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["wishlist", "in_progress", "completed"]),
  source: z.enum(["bgg", "personal"]),
  bggId: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  complexity: z.number().min(1).max(5).optional(),
  playerCountMin: z.number().min(1).max(10),
  playerCountMax: z.number().min(1).max(20),
  playTimeMin: z.number().min(1).max(240),
  playTimeMax: z.number().min(1).max(240),
})

type BoardGameFormValues = z.infer<typeof boardGameFormSchema>

const defaultValues: Partial<BoardGameFormValues> = {
  status: "wishlist",
  description: "",
  imageUrl: "",
  playerCountMin: 2,
  playerCountMax: 4,
  playTimeMin: 30,
  playTimeMax: 60,
  complexity: 2.5,
}

export default function AddBoardGamePage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<BoardGameFormValues>({
    resolver: zodResolver(boardGameFormSchema),
    defaultValues,
  })

  async function onSubmit(data: BoardGameFormValues) {
    setIsPending(true)
    
    // This would normally send data to an API or database
    console.log("Form submitted:", data)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsPending(false)
    router.push("/board-games")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/board-games" className="inline-flex items-center text-sm">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Board Games
          </Link>
          <h1 className="text-3xl font-bold mt-4">Add New Board Game</h1>
          <p className="text-muted-foreground">
            Add a new board game to your collection
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter board game title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter designer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter publisher name" {...field} />
                    </FormControl>
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
                        <SelectItem value="wishlist">Wishlist</SelectItem>
                        <SelectItem value="in_progress">Currently Playing</SelectItem>
                        <SelectItem value="completed">Played</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bgg">BoardGameGeek</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bggId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BoardGameGeek ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional BGG ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      ID from BoardGameGeek URL (optional)
                    </FormDescription>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="complexity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complexity (1-5)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={1}
                            max={5}
                            step={0.1}
                            defaultValue={[field.value || 2.5]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Light (1)</span>
                            <span>Medium (3)</span>
                            <span>Heavy (5)</span>
                          </div>
                          <div className="text-center font-medium">
                            {field.value?.toFixed(1) || "2.5"}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="playerCountMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Players</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playerCountMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Players</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playTimeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Play Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={240}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playTimeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Play Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={240}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Box Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the board game box image
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
                          placeholder="Enter board game description"
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
                onClick={() => router.push("/board-games")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Board Game"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 