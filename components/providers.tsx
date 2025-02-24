"use client"

import { Toaster } from "@/components/ui/toaster"
import { OptionsProvider } from "@/providers/options-provider"
import { FormOptions } from "@/types/options"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"

interface ProvidersProps {
  children: React.ReactNode
  options: FormOptions | null
  isLoading: boolean
  error: Error | null
}

export function Providers({ children, options, isLoading, error }: ProvidersProps) {
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  if (!options) {
    return <ErrorState message="لم يتم العثور على البيانات" />
  }

  return (
    <OptionsProvider options={options} isLoading={isLoading} error={error}>
      {children}
      <Toaster />
    </OptionsProvider>
  )
} 