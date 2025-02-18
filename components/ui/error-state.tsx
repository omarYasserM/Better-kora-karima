import { AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ 
  message = "حدث خطأ أثناء تحميل البيانات", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-4">
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  )
} 