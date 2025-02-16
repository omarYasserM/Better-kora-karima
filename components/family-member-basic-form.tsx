"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Form schema
const formSchema = z.object({
  name: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .regex(/^[\u0600-\u06FF\s]+$/, "يجب إدخال الاسم باللغة العربية فقط"),
  kinshipRelation: z.string().min(1, "هذا الحقل مطلوب"),
  age: z.string().min(1, "هذا الحقل مطلوب").regex(/^\d+$/, "يجب إدخال أرقام فقط"),
  gender: z.string().min(1, "هذا الحقل مطلوب"),
  socialStatus: z.string().min(1, "هذا الحقل مطلوب"),
  hasNationalId: z.string().min(1, "هذا الحقل مطلوب"),
  nationalIdImage: z.any().optional(),
  type: z.string().min(1, "هذا الحقل مطلوب"),
  wentToSchool: z.string().min(1, "هذا الحقل مطلوب"),
})

type FormData = z.infer<typeof formSchema>

interface FamilyMemberBasicFormProps {
  memberIndex: number
  onSubmit: (data: FormData) => void
}

const kinshipRelations = [
  { value: "spouse", label: "زوج/زوجة" },
  { value: "son", label: "ابن/ابنة" },
  { value: "parent", label: "والد/والدة" },
  { value: "sibling", label: "أخ/أخت" },
]

const socialStatuses = [
  { value: "single", label: "أعزب/عزباء" },
  { value: "married", label: "متزوج/ة" },
  { value: "divorced", label: "مطلق/ة" },
  { value: "widowed", label: "أرمل/ة" },
]

export function FamilyMemberBasicForm({ memberIndex, onSubmit }: FamilyMemberBasicFormProps) {
  const [selectedFile, setSelectedFile] = useState<string>("")

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name)
      setValue("nationalIdImage", e.target.files)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="mb-6 text-xl font-semibold">
        {memberIndex === 0 ? "بيانات الفرد بدءا برب الأسرة" : `بيانات الفرد ${memberIndex + 1}`}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label>الاسم</Label>
          <Input {...register("name")} className="text-right" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>صلة القرابة</Label>
          <Controller
            name="kinshipRelation"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="صلة القرابة" />
                </SelectTrigger>
                <SelectContent>
                  {kinshipRelations.map((relation) => (
                    <SelectItem key={relation.value} value={relation.value}>
                      {relation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.kinshipRelation && <p className="text-sm text-red-500">{errors.kinshipRelation.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>العمر بالسنوات</Label>
          <Input {...register("age")} type="number" className="text-right" />
          {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>النوع</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>الحالة الاجتماعية</Label>
          <Controller
            name="socialStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة الاجتماعية" />
                </SelectTrigger>
                <SelectContent>
                  {socialStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.socialStatus && <p className="text-sm text-red-500">{errors.socialStatus.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>هل الاسم عنده رقم قومي؟</Label>
          <Controller
            name="hasNationalId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="رقم قومي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">نعم</SelectItem>
                  <SelectItem value="no">لا</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.hasNationalId && <p className="text-sm text-red-500">{errors.hasNationalId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>صورة الرقم القومي</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              {...register("nationalIdImage")}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            >
              <Upload className="ml-2 h-4 w-4" />
              {selectedFile || "اختر ملف"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>النوع</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>هل سبق له الذهاب للمدرسة؟</Label>
          <Controller
            name="wentToSchool"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="ذهب للمدرسة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">نعم</SelectItem>
                  <SelectItem value="no">لا</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.wentToSchool && <p className="text-sm text-red-500">{errors.wentToSchool.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          حفظ بيانات الفرد
        </Button>
      </form>
    </div>
  )
}

