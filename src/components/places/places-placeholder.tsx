import { 
  Building, 
  Coffee, 
  Utensils, 
  Palmtree, 
  Globe, 
  Home 
} from "lucide-react"

interface PlacesPlaceholderProps {
  title?: string
  category?: string
  className?: string
}

export function PlacesPlaceholder({ 
  title, 
  category = "attraction", 
  className = "" 
}: PlacesPlaceholderProps) {
  // Generate a background color based on the title (if provided)
  const bgColor = title
    ? `hsl(${title.charCodeAt(0) % 360}, 70%, 80%)`
    : "hsl(200, 70%, 80%)"

  // Get the first letter of the title (if provided)
  const firstLetter = title ? title.charAt(0).toUpperCase() : ""

  // Get the appropriate icon based on category
  const getIcon = () => {
    switch (category) {
      case "restaurant":
        return <Utensils className="h-12 w-12 text-white" />
      case "cafe":
        return <Coffee className="h-12 w-12 text-white" />
      case "bar":
        return <Coffee className="h-12 w-12 text-white" />
      case "park":
        return <Palmtree className="h-12 w-12 text-white" />
      case "museum":
        return <Building className="h-12 w-12 text-white" />
      case "hotel":
        return <Home className="h-12 w-12 text-white" />
      case "attraction":
      default:
        return <Globe className="h-12 w-12 text-white" />
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