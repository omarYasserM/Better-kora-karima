"use client"

import { useForm, Controller } from "react-hook-form"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  researcher: z.string().min(1, "يجب اختيار الباحث"),
  coordinator: z.string().min(1, "يجب اختيار المنسق"),
  visitDate: z.date({
    required_error: "يجب اختيار تاريخ الزيارة",
  }),
})

type FormData = z.infer<typeof formSchema>

const researchers = [
  { value: "1", label: "احمد محمد" },
  { value: "2", label: "محمد علي" },
  { value: "3", label: "فاطمة احمد" },
]

const coordinators = [
  { value: "1", label: "سارة محمد" },
  { value: "2", label: "عمر خالد" },
  { value: "3", label: "ليلى احمد" },
]

export default function LoginForm() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    router.push("/beneficiary")
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
                  <SelectTrigger id="researcher" className="w-full">
                    <SelectValue placeholder="اختر الباحث" />
                  </SelectTrigger>
                  <SelectContent>
                    {researchers.map((researcher) => (
                      <SelectItem key={researcher.value} value={researcher.value}>
                        {researcher.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.researcher && <p className="text-sm text-red-500">{errors.researcher.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinator">اسم المنسق الميداني</Label>
            <Controller
              name="coordinator"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="coordinator" className="w-full">
                    <SelectValue placeholder="اختر المنسق" />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinators.map((coordinator) => (
                      <SelectItem key={coordinator.value} value={coordinator.value}>
                        {coordinator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.coordinator && <p className="text-sm text-red-500">{errors.coordinator.message}</p>}
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
                        !field.value && "text-muted-foreground",
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
                      onSelect={(date) => {
                        field.onChange(date)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.visitDate && <p className="text-sm text-red-500">{errors.visitDate.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            اضافه حاله
          </Button>
        </form>
      </div>
    </div>
  )
}

