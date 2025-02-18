"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BeneficiaryData, useEntryStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"
import { compressImage } from "@/lib/image-utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/components/ui/form"
import { ImageUpload } from "@/components/ui/image-upload"

const formSchema = z.object({
  beneficiaryName: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .regex(/^[\u0600-\u06FF\s]+$/, "يجب إدخال الاسم باللغة العربية فقط"),
  nationalId: z.string().length(14, "الرقم القومي يجب أن يكون 14 رقم").regex(/^\d+$/, "يجب إدخال أرقام فقط"),
  gender: z.string().min(1, "هذا الحقل مطلوب"),
  idCardImage: z
    .custom<File>()
    .refine((file) => !file || file instanceof File, "يجب اختيار صورة")
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "حجم الصورة يجب أن لا يتجاوز 5 ميجابايت"
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
        ["image/jpeg", "image/png"].includes(file.type)),
      "يجب أن تكون الصورة بصيغة JPG أو PNG"
    )
    .optional(),
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
  const { entryId, researcher, coordinator, setBeneficiary } = useEntryStore()
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

  useEffect(() => {
    // Redirect if no entry data
    if (!entryId || !researcher || !coordinator) {
      router.push("/")
    }
  }, [entryId, researcher, coordinator, router])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      
      let compressedImage: File | undefined
      if (data.idCardImage instanceof File) {
        compressedImage = await compressImage(data.idCardImage)
      }

      const beneficiaryData: BeneficiaryData = {
        name: data.beneficiaryName,
        nationalId: data.nationalId,
        gender: data.gender as 'male' | 'female',
        phone1: data.phone1,
        phone2: data.phone2,
        whatsapp: data.whatsapp,
        familySize: parseInt(data.familySize),
        idCardImage: compressedImage
      }
      
      setBeneficiary(beneficiaryData)
      router.push(`/family-data?familySize=${data.familySize}`)
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
            <Label htmlFor="idCardImage">صورة البطاقة الشخصية</Label>
            <Controller
              name="idCardImage"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageUpload
                  onChange={onChange}
                  value={value}
                  error={errors.idCardImage?.message}
                  maxSize={5}
                  accept={["image/jpeg", "image/png"]}
                />
              )}
            />
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

