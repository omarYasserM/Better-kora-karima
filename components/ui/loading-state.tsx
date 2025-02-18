import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  text?: string
}

export function LoadingState({ text = "جاري التحميل..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
} 