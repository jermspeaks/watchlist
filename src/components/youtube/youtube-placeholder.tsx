import { PlayIcon, ListBulletIcon, PersonIcon } from "@radix-ui/react-icons"

interface YouTubePlaceholderProps {
  title?: string
  type?: "video" | "playlist" | "channel"
  className?: string
}

export function YouTubePlaceholder({ 
  title, 
  type = "video", 
  className = "" 
}: YouTubePlaceholderProps) {
  // Generate a background color based on the title (if provided)
  const bgColor = title
    ? `hsl(${title.charCodeAt(0) % 360}, 70%, 80%)`
    : "hsl(0, 70%, 80%)" // YouTube red-ish color

  // Get the first letter of the title (if provided)
  const firstLetter = title ? title.charAt(0).toUpperCase() : ""

  // Get the appropriate icon based on type
  const getIcon = () => {
    switch (type) {
      case "video":
        return <PlayIcon className="h-12 w-12 text-white" />
      case "playlist":
        return <ListBulletIcon className="h-12 w-12 text-white" />
      case "channel":
        return <PersonIcon className="h-12 w-12 text-white" />
      default:
        return <PlayIcon className="h-12 w-12 text-white" />
    }
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {firstLetter ? (
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{firstLetter}</span>
          <div className="mt-2">{getIcon()}</div>
        </div>
      ) : (
        getIcon()
      )}
    </div>
  )
} 