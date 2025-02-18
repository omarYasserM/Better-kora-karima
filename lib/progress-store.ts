import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  completedSteps: string[]
  currentStep: string
  addCompletedStep: (step: string) => void
  setCurrentStep: (step: string) => void
  reset: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedSteps: [],
      currentStep: 'entry',

      addCompletedStep: (step) => 
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])]
        })),

      setCurrentStep: (step) => 
        set({ currentStep: step }),

      reset: () => 
        set({ 
          completedSteps: [],
          currentStep: 'entry'
        })
    }),
    {
      name: 'form-progress'
    }
  )
) 