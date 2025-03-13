import { SpeakerLoudIcon } from "@radix-ui/react-icons"

interface PodcastPlaceholderProps {
  title?: string
  className?: string
}

export function PodcastPlaceholder({ title, className = "" }: PodcastPlaceholderProps) {
  // Generate a background color based on the title (if provided)
  const bgColor = title
    ? `hsl(${title.charCodeAt(0) % 360}, 70%, 80%)`
    : "hsl(220, 70%, 80%)"

  // Get the first letter of the title (if provided)
  const firstLetter = title ? title.charAt(0).toUpperCase() : ""

  return (
    <div
      className={`flex items-center justify-center rounded-md bg-opacity-80 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {firstLetter ? (
        <span className="text-4xl font-bold text-white">{firstLetter}</span>
      ) : (
        <SpeakerLoudIcon className="h-12 w-12 text-white" />
      )}
    </div>
  )
} 