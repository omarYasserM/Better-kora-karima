"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useEntryStore, EntryState } from "@/lib/store"

type StateKey = keyof Omit<EntryState, 
  'setInitialEntry' | 
  'setBeneficiary' | 
  'addFamilyMember' | 
  'updateFamilyMember' | 
  'reset'
>

export function useNavigationGuard(requiredFields: StateKey[]) {
  const router = useRouter()
  const store = useEntryStore()

  useEffect(() => {
    const missingFields = requiredFields.filter(field => !store[field])
    
    if (missingFields.length > 0) {
      router.push("/")
    }
  }, [router, store, requiredFields])

  return !requiredFields.some(field => !store[field])
} 