"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  beneficiaryName: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .regex(/^[\u0600-\u06FF\s]+$/, "يجب إدخال الاسم باللغة العربية فقط"),
  nationalId: z.string().length(14, "الرقم القومي يجب أن يكون 14 رقم").regex(/^\d+$/, "يجب إدخال أرقام فقط"),
  gender: z.string().min(1, "هذا الحقل مطلوب"),
  idCardImage: z
    .any()
    .optional()
    .refine(
      (files) => !files || files instanceof FileList,
      "Invalid file input"
    )
    .refine(
      (files) => !files || files.length === 0 || files[0] instanceof File,
      "Please upload a valid image file"
    ),
  phone1: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .regex(/^(010|011|012|015)\d{8}$/, "رقم الهاتف غير صحيح"),
  phone2: z
    .string()
    .regex(/^(010|011|012|015)\d{8}$/, "رقم الهاتف غير صحيح")
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .regex(/^(010|011|012|015)\d{8}$/, "رقم الواتساب غير صحيح")
    .optional()
    .or(z.literal("")),
  familySize: z.string().min(1, "هذا الحقل مطلوب").regex(/^\d+$/, "يجب إدخال أرقام فقط"),
})

type FormData = z.infer<typeof formSchema>

export default function BeneficiaryForm() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)
    // Navigate to the family data page with the family size
    router.push(`/family-data?familySize=${data.familySize}`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file.name)
      setValue("idCardImage", e.target.files)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-28 md:p-6 md:pt-28" dir="rtl">
      <div className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">البيانات التعريفية</h1>
          <h2 className="mt-2 text-xl">بيانات المستفيد</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="beneficiaryName">اسم المستفيد</Label>
            <Input id="beneficiaryName" {...register("beneficiaryName")} className="text-right" />
            {errors.beneficiaryName && <p className="text-sm text-red-500">{errors.beneficiaryName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId">الرقم القومي</Label>
            <Input id="nationalId" {...register("nationalId")} maxLength={14} className="text-right" />
            {errors.nationalId && <p className="text-sm text-red-500">{errors.nationalId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">النوع</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="gender">
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
            <Label htmlFor="idCardImage">رفع صورة البطاقة الشخصية</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="idCardImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("idCardImage")}
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("idCardImage")?.click()}
                >
                  <Upload className="ml-2 h-4 w-4" />
                  {selectedFile || "اختر ملف"}
                </Button>
              </div>
              {imagePreview && (
                <div className="mt-2 rounded-lg border p-2">
                  <Image 
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={150}
                    className="max-h-40 rounded object-contain"
                  />
                </div>
              )}
            </div>
            {errors.idCardImage && <p className="text-sm text-red-500">{errors.idCardImage.message?.toString()}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="familySize">عدد أفراد الأسرة</Label>
            <Input id="familySize" {...register("familySize")} className="text-right" />
            {errors.familySize && <p className="text-sm text-red-500">{errors.familySize.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone1">رقم الهاتف 1 *</Label>
            <Input id="phone1" {...register("phone1")} className="text-right" maxLength={11} />
            {errors.phone1 && <p className="text-sm text-red-500">{errors.phone1.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone2">رقم الهاتف 2</Label>
            <Input id="phone2" {...register("phone2")} className="text-right" maxLength={11} />
            {errors.phone2 && <p className="text-sm text-red-500">{errors.phone2.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">رقم Whatsapp</Label>
            <Input id="whatsapp" {...register("whatsapp")} className="text-right" maxLength={11} />
            {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            الانتقال إلى صفحة بيانات الأسرة المعيشية
          </Button>
        </form>
      </div>
    </div>
  )
}

