import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "@radix-ui/react-icons"

export function NavHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5" />
              <span className="font-semibold">Watchlist</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
} 