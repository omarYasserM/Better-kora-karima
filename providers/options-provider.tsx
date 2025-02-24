"use client"

import { createContext, useContext, ReactNode } from "react"
import { FormOptions } from "@/types/options"

interface OptionsContextType {
  options: FormOptions | null
  isLoading: boolean
  error: Error | null
}

const OptionsContext = createContext<OptionsContextType | null>(null)

export function useOptions() {
  const context = useContext(OptionsContext)
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider")
  }
  return context
}

interface OptionsProviderProps {
  children: ReactNode
  options: FormOptions | null
  isLoading: boolean
  error?: Error | null
}

export function OptionsProvider({ 
  children, 
  options,
  isLoading,
  error = null
}: OptionsProviderProps) {
  console.log(options)
  return (
    <OptionsContext.Provider value={{ options, isLoading, error }}>
      {children}
    </OptionsContext.Provider>
  )
} 