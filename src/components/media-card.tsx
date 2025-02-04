import Image from "next/image";
import { Smile } from "lucide-react";
import type { MediaItem } from "@/types/catalogue";

interface MediaCardProps {
  item: MediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          width="240"
          height="360"
          className="max-w-full h-auto aspect-[3/4.3] object-cover rounded-lg"
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 33vw"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.creator}</p>
        <Smile
          className="h-6 w-6 text-yellow-400"
          aria-label={`Rating: ${item.rating}`}
        />
      </div>
    </div>
  );
}
