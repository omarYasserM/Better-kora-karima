import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex min-h-screen items-center justify-center", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
} 