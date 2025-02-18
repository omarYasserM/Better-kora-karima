"use client"

import { useProgressStore } from "@/lib/progress-store"

const steps = [
  { id: 'entry', label: 'بيانات الدخول' },
  { id: 'beneficiary', label: 'بيانات المستفيد' },
  { id: 'family', label: 'بيانات الأسرة' }
]

export function ProgressIndicator() {
  const { currentStep, completedSteps } = useProgressStore()

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className={`
                flex h-8 w-8 items-center justify-center rounded-full
                ${completedSteps.includes(step.id)
                  ? 'bg-primary text-white'
                  : currentStep === step.id
                  ? 'border-2 border-primary text-primary'
                  : 'border-2 border-gray-300 text-gray-300'
                }
              `}>
                {completedSteps.includes(step.id) ? '✓' : index + 1}
              </div>
              
              <div className="ml-2 text-sm">
                {step.label}
              </div>

              {index < steps.length - 1 && (
                <div className={`
                  h-0.5 flex-1 mx-4
                  ${completedSteps.includes(step.id)
                    ? 'bg-primary'
                    : 'bg-gray-300'
                  }
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 