import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Loading({ className, size = "default" }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 
        className={cn(
          "animate-spin text-muted-foreground",
          size === "sm" && "h-4 w-4",
          size === "default" && "h-6 w-6",
          size === "lg" && "h-8 w-8"
        )} 
      />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}