"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ageGroups = [
  { value: "under8", label: "أقل من 8" },
  { value: "8-10", label: "8-10" },
  { value: "11-14", label: "11-14" },
  { value: "15-18", label: "15-18" },
  { value: "19-29", label: "19-29" },
  { value: "30-39", label: "30-39" },
  { value: "40-49", label: "40-49" },
  { value: "50-60", label: "50-60" },
  { value: "above60", label: "أكبر من 60" },
]

const kinshipRelations = [
  { value: "self", label: "رب/ة الأسرة" },
  { value: "spouse", label: "زوج/زوجة" },
  { value: "son", label: "ابن/ابنة" },
  { value: "parent", label: "والد/والدة" },
  { value: "sibling", label: "أخ/أخت" },
]

const maritalStatuses = [
  { value: "single", label: "أعزب/عزباء" },
  { value: "married", label: "متزوج/ة" },
  { value: "divorced", label: "مطلق/ة" },
  { value: "widowed", label: "أرمل/ة" },
  { value: "abandoned", label: "مهجور/ة" },
]

const educationLevels = [
  { value: "kindergarten", label: "رياض أطفال" },
  { value: "primary", label: "ابتدائي" },
  { value: "preparatory", label: "إعدادي" },
  { value: "secondary", label: "ثانوي" },
  { value: "university", label: "جامعي" },
]

const chronicDiseases = [
  { value: "diabetes", label: "السكري" },
  { value: "heartDisease", label: "أمراض القلب" },
  { value: "highBloodPressure", label: "ارتفاع ضغط الدم" },
  { value: "cancer", label: "السرطان" },
  { value: "kidney", label: "أمراض الكلى" },
  { value: "respiratory", label: "أمراض الجهاز التنفسي" },
]

const formSchema = z
  .object({
    // Basic Information
    name: z
      .string()
      .min(1, "هذا الحقل مطلوب")
      .regex(/^[\u0600-\u06FF\s]+$/, "يجب إدخال الاسم باللغة العربية فقط"),
    kinshipRelation: z.string().optional(),
    gender: z.string().optional(),
    ageGroup: z.string().optional(),
    maritalStatus: z.string().optional(),
    hasNationalId: z.string().optional(),
    nationalId: z.string().optional(),
    nationalIdImage: z.any().optional(),

    // Educational Status
    hasAttendedSchool: z.string().optional(),
    notAttendingReason: z.string().optional(),
    isLiterate: z.string().optional(),
    educationLevel: z.string().optional(),
    currentlyEnrolled: z.string().optional(),
    notEnrolledReason: z.string().optional(),
    canReadAndWrite: z.string().optional(),
    hasLiteracyCertificate: z.string().optional(),

    // Employment Status
    isEmployed: z.string().optional(),
    jobType: z.string().optional(),
    sector: z.string().optional(),
    workNature: z.string().optional(),
    unemploymentReason: z.string().optional(),
    hasPrivateBusiness: z.string().optional(),
    businessType: z.string().optional(),
    otherBusinessType: z.string().optional(),
    hasUnusedSkill: z.string().optional(),
    skillType: z.string().optional(),
    wantsTraining: z.string().optional(),
    trainingField: z.string().optional(),

    // Health Status
    hasHealthIssue: z.string().optional(),
    healthIssueType: z.string().optional(),
    chronicDiseases: z.array(z.string()).optional(),
    otherHealthIssue: z.string().optional(),
    treatmentLocation: z.string().optional(),
    treatmentCostCoverage: z.string().optional(),
    requiredAssistance: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasHealthIssue === "yes" && data.healthIssueType === "chronic") {
        return data.chronicDiseases && data.chronicDiseases.length > 0
      }
      return true
    },
    {
      message: "يرجى اختيار مرض مزمن واحد على الأقل",
      path: ["chronicDiseases"],
    },
  )

type FormData = z.infer<typeof formSchema>

interface HouseholdFormProps {
  memberIndex: number
  onSubmit: (data: FormData) => void
  isSubmitted?: boolean
}

const HouseholdForm: React.FC<HouseholdFormProps> = ({ memberIndex, onSubmit, isSubmitted = false }) => {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [otherHealthIssueSelected, setOtherHealthIssueSelected] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasHealthIssue: "",
      healthIssueType: "",
      chronicDiseases: [],
      otherHealthIssue: "",
      treatmentLocation: "",
      treatmentCostCoverage: "",
      requiredAssistance: "",
    },
  })

  const watchGender = watch("gender")
  const watchMaritalStatus = watch("maritalStatus")
  const watchHasNationalId = watch("hasNationalId")
  const watchHasAttendedSchool = watch("hasAttendedSchool")
  const watchIsEmployed = watch("isEmployed")
  const watchHasHealthIssue = watch("hasHealthIssue")
  const watchCanReadAndWrite = watch("canReadAndWrite")
  const watchHasPrivateBusiness = watch("hasPrivateBusiness")
  const watchHasUnusedSkill = watch("hasUnusedSkill")
  const watchWantsTraining = watch("wantsTraining")
  const watchHealthIssueType = watch("healthIssueType")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name)
      setValue("nationalIdImage", e.target.files)
    }
  }

  const handleFormSubmit = async (data: FormData) => {
    setIsSaving(true)
    try {
      const formData = {
        ...data,
        hasHealthIssue: data.hasHealthIssue || "no",
        healthIssueType: data.healthIssueType || undefined,
        chronicDiseases: data.chronicDiseases || [],
        otherHealthIssue: data.otherHealthIssue || undefined,
        treatmentLocation: data.treatmentLocation || undefined,
        treatmentCostCoverage: data.treatmentCostCoverage || undefined,
        requiredAssistance: data.requiredAssistance || undefined,
      }

      onSubmit(formData)
      toast({
        title: "تم الحفظ",
        description: `تم حفظ بيانات الفرد ${memberIndex + 1} بنجاح`,
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {memberIndex === 0 ? "بيانات الفرد بدءاً برب الأسرة" : `بيانات الفرد ${memberIndex + 1}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" {...register("name")} className="text-right" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kinshipRelation">صلة القرابة</Label>
            <Controller
              name="kinshipRelation"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="kinshipRelation">
                    <SelectValue placeholder="اختر صلة القرابة" />
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
            <Label htmlFor="ageGroup">الفئة العمرية</Label>
            <Controller
              name="ageGroup"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="ageGroup">
                    <SelectValue placeholder="اختر الفئة العمرية" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((age) => (
                      <SelectItem key={age.value} value={age.value}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.ageGroup && <p className="text-sm text-red-500">{errors.ageGroup.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">الحالة الاجتماعية</Label>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder="اختر الحالة الاجتماعية" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.maritalStatus && <p className="text-sm text-red-500">{errors.maritalStatus.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hasNationalId">هل لديه رقم قومي؟</Label>
            <Controller
              name="hasNationalId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="hasNationalId">
                    <SelectValue placeholder="اختر" />
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

          {watchHasNationalId === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nationalId">الرقم القومي</Label>
                <Input id="nationalId" {...register("nationalId")} className="text-right" maxLength={14} />
                {errors.nationalId && <p className="text-sm text-red-500">{errors.nationalId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalIdImage">صورة البطاقة الشخصية</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="nationalIdImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    {...register("nationalIdImage")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("nationalIdImage")?.click()}
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    {selectedFile || "اختر ملف"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Educational Status */}
      <Card>
        <CardHeader>
          <CardTitle>الحالة التعليمية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hasAttendedSchool">هل سبق له الذهاب للمدرسة؟</Label>
            <Controller
              name="hasAttendedSchool"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="hasAttendedSchool">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchHasAttendedSchool === "no" && (
            <div className="space-y-2">
              <Label htmlFor="notAttendingReason">لماذا لم يذهب للمدرسة؟</Label>
              <Controller
                name="notAttendingReason"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="notAttendingReason">
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">ظروف مادية</SelectItem>
                      <SelectItem value="work">العمل</SelectItem>
                      <SelectItem value="marriage">الزواج</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {watchHasAttendedSchool === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="educationLevel">ما هو آخر مستوى تعليمي؟</Label>
                <Controller
                  name="educationLevel"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="educationLevel">
                        <SelectValue placeholder="اختر المستوى التعليمي" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentlyEnrolled">هل منتظم في الدراسة حالياً؟</Label>
                <Controller
                  name="currentlyEnrolled"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="currentlyEnrolled">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">نعم</SelectItem>
                        <SelectItem value="no">لا</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="canReadAndWrite">هل يجيد القراءة والكتابة؟</Label>
            <Controller
              name="canReadAndWrite"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="canReadAndWrite">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchCanReadAndWrite === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="hasLiteracyCertificate">هل حاصل على شهادة محو الأمية؟</Label>
              <Controller
                name="hasLiteracyCertificate"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="hasLiteracyCertificate">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">نعم</SelectItem>
                      <SelectItem value="no">لا</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employment Status */}
      <Card>
        <CardHeader>
          <CardTitle>الحالة الوظيفية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="isEmployed">هل يعمل؟</Label>
            <Controller
              name="isEmployed"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="isEmployed">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchIsEmployed === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="jobType">نوع العمل</Label>
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="jobType">
                        <SelectValue placeholder="اختر نوع العمل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">موظف</SelectItem>
                        <SelectItem value="worker">عامل</SelectItem>
                        <SelectItem value="craftsman">حرفي</SelectItem>
                        <SelectItem value="merchant">تاجر</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">القطاع</Label>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="اختر القطاع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">حكومي</SelectItem>
                        <SelectItem value="private">خاص</SelectItem>
                        <SelectItem value="daily">عامل يومية</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workNature">طبيعة العمل</Label>
                <Controller
                  name="workNature"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="workNature">
                        <SelectValue placeholder="اختر طبيعة العمل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullTime">دوام كامل</SelectItem>
                        <SelectItem value="partTime">دوام جزئي</SelectItem>
                        <SelectItem value="seasonal">موسمي</SelectItem>
                        <SelectItem value="temporary">مؤقت</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </>
          )}

          {watchIsEmployed === "no" && (
            <div className="space-y-2">
              <Label htmlFor="unemploymentReason">سبب عدم العمل</Label>
              <Controller
                name="unemploymentReason"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="unemploymentReason">
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">طالب</SelectItem>
                      <SelectItem value="housewife">ربة منزل</SelectItem>
                      <SelectItem value="retired">متقاعد</SelectItem>
                      <SelectItem value="unable">غير قادر على العمل</SelectItem>
                      <SelectItem value="searching">يبحث عن عمل</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hasPrivateBusiness">هل لديه مشروع خاص؟</Label>
            <Controller
              name="hasPrivateBusiness"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="hasPrivateBusiness">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchHasPrivateBusiness === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessType">نوع المشروع</Label>
                <Controller
                  name="businessType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="businessType">
                        <SelectValue placeholder="اختر نوع المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shop">محل تجاري</SelectItem>
                        <SelectItem value="workshop">ورشة</SelectItem>
                        <SelectItem value="farm">مزرعة</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {watch("businessType") === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="otherBusinessType">حدد نوع المشروع</Label>
                  <Input id="otherBusinessType" {...register("otherBusinessType")} className="text-right" />
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="hasUnusedSkill">هل لديه مهارة أو حرفة ولا يمارسها؟</Label>
            <Controller
              name="hasUnusedSkill"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="hasUnusedSkill">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchHasUnusedSkill === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="skillType">ما هي المهارة او الحرفة التي يمتلكها؟</Label>
              <Controller
                name="skillType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="skillType">
                      <SelectValue placeholder="اختر المهارة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carpentry">نجارة</SelectItem>
                      <SelectItem value="plumbing">سباكة</SelectItem>
                      <SelectItem value="electrical">كهرباء</SelectItem>
                      <SelectItem value="sewing">خياطة</SelectItem>
                      <SelectItem value="cooking">طبخ</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="wantsTraining">هل لديك استعداد للتدريب علي مهنة أو مجال معين؟</Label>
            <Controller
              name="wantsTraining"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="wantsTraining">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchWantsTraining === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="trainingField">ما هي المهنة او المجال الذي يرغب في التدريب عليه؟</Label>
              <Controller
                name="trainingField"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="trainingField">
                      <SelectValue placeholder="اختر المجال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carpentry">نجارة</SelectItem>
                      <SelectItem value="plumbing">سباكة</SelectItem>
                      <SelectItem value="electrical">كهرباء</SelectItem>
                      <SelectItem value="sewing">خياطة</SelectItem>
                      <SelectItem value="cooking">طبخ</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>الحالة الصحية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hasHealthIssue">هل يعاني من مرض مزمن أو إعاقة؟</Label>
            <Controller
              name="hasHealthIssue"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="hasHealthIssue">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchHasHealthIssue === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="healthIssueType">نوع المرض/الإعاقة</Label>
                <Controller
                  name="healthIssueType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger id="healthIssueType">
                        <SelectValue placeholder="اختر نوع المرض/الإعاقة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chronic">مرض مزمن</SelectItem>
                        <SelectItem value="physical">إعاقة حركية</SelectItem>
                        <SelectItem value="mental">إعاقة ذهنية</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.healthIssueType && <p className="text-sm text-red-500">{errors.healthIssueType.message}</p>}
              </div>

              {watchHealthIssueType === "chronic" && (
                <div className="space-y-2">
                  <Label>الأمراض المزمنة</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {chronicDiseases.map((disease) => (
                      <div key={disease.value} className="flex items-center space-x-2">
                        <Controller
                          name="chronicDiseases"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`disease-${disease.value}`}
                              checked={field.value?.includes(disease.value)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), disease.value]
                                  : (field.value || []).filter((value) => value !== disease.value)
                                field.onChange(updatedValue)
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`disease-${disease.value}`} className="mr-2">
                          {disease.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.chronicDiseases && <p className="text-sm text-red-500">{errors.chronicDiseases.message}</p>}
                </div>
              )}

              {watchHealthIssueType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="otherHealthIssue">حدد نوع المرض/الإعاقة</Label>
                  <Input id="otherHealthIssue" {...register("otherHealthIssue")} className="text-right" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="treatmentLocation">مكان تلقي العلاج</Label>
                <Controller
                  name="treatmentLocation"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="treatmentLocation">
                        <SelectValue placeholder="اختر مكان العلاج" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publicHospital">مستشفى حكومي</SelectItem>
                        <SelectItem value="privateClinic">عيادة خاصة</SelectItem>
                        <SelectItem value="healthUnit">وحدة صحية</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentCostCoverage">كيف تتغطى تكاليف العلاج للأسرة؟</Label>
                <Controller
                  name="treatmentCostCoverage"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="treatmentCostCoverage">
                        <SelectValue placeholder="اختر طريقة تغطية التكاليف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">تغطية ذاتية</SelectItem>
                        <SelectItem value="insurance">تأمين صحي</SelectItem>
                        <SelectItem value="government">علاج على نفقة الدولة</SelectItem>
                        <SelectItem value="charity">جمعيات خيرية</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredAssistance">ما هو احتياجك من المؤسسة للمساعدة؟</Label>
                <Controller
                  name="requiredAssistance"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="requiredAssistance">
                        <SelectValue placeholder="اختر نوع المساعدة المطلوبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">توفير أدوية</SelectItem>
                        <SelectItem value="treatment">تكاليفعلاج</SelectItem>
                        <SelectItem value="surgery">إجراء عملية جراحية</SelectItem>
                        <SelectItem value="devices">أجهزة تعويضية</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Female-specific questions */}
      {watchGender === "female" && (
        <Card>
          <CardHeader>
            <CardTitle>أسئلة خاصة بالإناث</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hasFGM">هل خضعت لعملية ختان؟</Label>
              <Controller
                name="hasFGM"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="hasFGM">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">نعم</SelectItem>
                      <SelectItem value="no">لا</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hasMarriedDaughterUnder18">هل لديك ابنة متزوجة تقل عن 18 عاماً؟</Label>
              <Controller
                name="hasMarriedDaughterUnder18"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="hasMarriedDaughterUnder18">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">نعم</SelectItem>
                      <SelectItem value="no">لا</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" disabled={isSaving || isSubmitted}>
        {isSaving ? "جاري الحفظ..." : isSubmitted ? "تم الحفظ" : "حفظ بيانات الفرد"}
      </Button>
    </form>
  )
}

export default HouseholdForm

