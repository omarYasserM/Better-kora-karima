"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import { Researcher, Coordinator } from "@/lib/store"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useEntryStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useProgressStore } from "@/lib/progress-store"

const formSchema = z.object({
  researcher: z.string().min(1, "يجب اختيار الباحث"),
  coordinator: z.string().min(1, "يجب اختيار المنسق"),
  visitDate: z.date({
    required_error: "يجب اختيار تاريخ الزيارة",
  }),
})

type FormData = z.infer<typeof formSchema>

export default function EntryForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [researchers, setResearchers] = useState<Researcher[]>([])
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const setInitialEntry = useEntryStore(state => state.setInitialEntry)
  const setCurrentStep = useProgressStore(state => state.setCurrentStep)
  const addCompletedStep = useProgressStore(state => state.addCompletedStep)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetch('/api/fetch-options')
        if (!response.ok) throw new Error("Failed to fetch options")
        
        const { researchers, coordinators } = await response.json()
        setResearchers(researchers)
        setCoordinators(coordinators)
      } catch (error) {
        console.error("Failed to load options:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [])

  useEffect(() => {
    setCurrentStep('entry')
  }, [setCurrentStep])

  const onSubmit = (data: FormData) => {
    const researcher = researchers.find(r => r.id === data.researcher)
    const coordinator = coordinators.find(c => c.id === data.coordinator)
    
    if (!researcher || !coordinator) return
    
    setInitialEntry(researcher, coordinator, data.visitDate)
    addCompletedStep('entry')
    router.push("/beneficiary")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-28 md:p-6 md:pt-28" dir="rtl">
      <div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">قري كريمة للطفل</h1>
          <p className="mt-2 text-gray-600">ادخال بيانات</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="researcher">اسم الباحث</Label>
            <Controller
              name="researcher"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="researcher">
                    <SelectValue placeholder="اختر الباحث" />
                  </SelectTrigger>
                  <SelectContent>
                    {researchers.map((researcher) => (
                      <SelectItem key={researcher.id} value={researcher.id}>
                        {researcher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.researcher && (
              <p className="text-sm text-red-500">{errors.researcher.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinator">اسم المنسق</Label>
            <Controller
              name="coordinator"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="coordinator">
                    <SelectValue placeholder="اختر المنسق" />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinators.map((coordinator) => (
                      <SelectItem key={coordinator.id} value={coordinator.id}>
                        {coordinator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.coordinator && (
              <p className="text-sm text-red-500">{errors.coordinator.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitDate">تاريخ الزيارة</Label>
            <Controller
              name="visitDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="ml-2 h-4 w-4" />
                      {field.value ? field.value.toLocaleDateString("ar-EG") : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.visitDate && (
              <p className="text-sm text-red-500">{errors.visitDate.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            التالي
          </Button>
        </form>
      </div>
    </div>
  )
} 