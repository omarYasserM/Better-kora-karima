"use client"

import { useEffect } from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"

export function useFormPersistence<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
  enabled: boolean = true
) {
  const clearPersistedData = () => {
    localStorage.removeItem(key)
    form.reset({} as T)
  }

  useEffect(() => {
    if (!enabled) return

    // Load saved form data
    const savedData = localStorage.getItem(key)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        form.reset(parsedData)
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }

    // Subscribe to form changes
    const subscription = form.watch((data) => {
      localStorage.setItem(key, JSON.stringify(data))
    })

    return () => {
      subscription.unsubscribe()
      if (!enabled) {
        localStorage.removeItem(key)
      }
    }
  }, [form, key, enabled])

  return { clearPersistedData }
} 