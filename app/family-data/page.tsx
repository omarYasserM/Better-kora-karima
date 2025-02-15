import { Suspense } from "react"
import FamilyDataContent from "@/components/family-data-content"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-96" />
        </Card>
      </div>
    </div>
  )
}

export default function FamilyDataPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <FamilyDataContent />
    </Suspense>
  )
}

