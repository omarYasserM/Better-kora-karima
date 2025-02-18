"use client"

import { Label } from "@/components/ui/label"
import { FormError } from "@/components/ui/form-error"

interface FormFieldProps {
  id: string
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
  className?: string
}

export function FormField({
  id,
  label,
  error,
  children,
  required,
  className
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </Label>
      {children}
      <FormError message={error} />
    </div>
  )
} 