"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { FamilyMember } from "@/types"

// Educational stages
const educationalStages = [
  { value: "primary", label: "المرحلة الابتدائية" },
  { value: "preparatory", label: "المرحلة الإعدادية" },
  { value: "secondary", label: "المرحلة الثانوية" },
  { value: "university", label: "المرحلة الجامعية" },
]

// Job types
const jobTypes = [
  { value: "daily", label: "عامل باليومية" },
  { value: "driver", label: "سائق" },
  { value: "employee", label: "موظف" },
  { value: "nurse", label: "ممرض" },
]

// Business types
const businessTypes = [
  { value: "tuktuk", label: "توك توك" },
  { value: "livestock", label: "تربية مواشي" },
  { value: "grocery", label: "بقالة" },
  { value: "sewing", label: "خياطة" },
  { value: "workshop", label: "ورشة" },
  { value: "fishing", label: "صيد" },
  { value: "farming", label: "زراعة" },
  { value: "other", label: "أخرى" },
]

// Skills
const skillTypes = [
  { value: "sewing", label: "خياطة" },
  { value: "carpentry", label: "نجارة" },
  { value: "plumbing", label: "سباكة" },
  { value: "programming", label: "برمجة" },
  { value: "handicrafts", label: "مشغولات يدوية" },
  { value: "other", label: "أخرى" },
]

// Training fields
const trainingFields = [
  { value: "metalwork", label: "حدادة" },
  { value: "plumbing", label: "سباكة" },
  { value: "programming", label: "برمجة" },
  { value: "handicrafts", label: "مشغولات يدوية" },
  { value: "other", label: "أخرى" },
]

// Chronic diseases
const chronicDiseases = [
  { value: "pressure", label: "الضغط" },
  { value: "diabetes", label: "السكر" },
  { value: "hepatitisC", label: "فيروس C" },
  { value: "kidney", label: "فشل كلوي" },
  { value: "heart", label: "أمراض قلب" },
  { value: "cancer", label: "سرطان" },
  { value: "other", label: "أخرى" },
]

// Form schema
const formSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .regex(/^[\u0600-\u06FF\s]+$/, "يجب إدخال الاسم باللغة العربية فقط"),
  kinshipRelation: z.string().min(1, "هذا الحقل مطلوب"),
  gender: z.string().min(1, "هذا الحقل مطلوب"),
  ageGroup: z.string().min(1, "هذا الحقل مطلوب"),
  maritalStatus: z.string().min(1, "هذا الحقل مطلوب"),
  hasNationalId: z.string().min(1, "هذا الحقل مطلوب"),
  nationalId: z.string().optional(),

  // Educational Status
  wentToSchool: z.string().min(1, "هذا الحقل مطلوب"),
  reasonForNotAttending: z.string().optional(),
  lastEducationalStage: z.string().optional(),
  isCurrentlyEnrolled: z.string().optional(),
  reasonForNotEnrolled: z.string().optional(),
  hasLiteracyCertificate: z.string().optional(),
  canReadAndWrite: z.string().min(1, "هذا الحقل مطلوب"),
  // Employment Status
  isWorking: z.string().min(1, "هذا الحقل مطلوب"),
  notWorkingReason: z.string().optional(),
  jobType: z.string().optional(),
  sector: z.string().optional(),
  workNature: z.string().optional(),
  hasPrivateBusiness: z.string().optional(),
  businessType: z.string().optional(),
  otherBusinessType: z.string().optional(),
  hasUnusedSkill: z.string().optional(),
  skillType: z.string().optional(),
  otherSkillType: z.string().optional(),
  wantsTraining: z.string().optional(),
  trainingField: z.string().optional(),
  otherTrainingField: z.string().optional(),

  // Health Status
  hasHealthIssue: z.string().min(1, "هذا الحقل مطلوب"),
  healthIssueType: z.array(z.string()).optional(),
  chronicDiseases: z.array(z.string()).optional(),
  otherChronicDisease: z.string().optional(),
  disabilityType: z.string().optional(),
  disabilityCause: z.string().optional(),
  treatmentLocation: z.string().optional(),
  otherTreatmentLocation: z.string().optional(),
  medicalExpensesCoverage: z.string().optional(),
  otherMedicalExpensesCoverage: z.string().optional(),
  requiredMedicalAssistance: z.string().optional(),
}).transform((data): FamilyMember => ({
  ...data,
  hasAttendedSchool: data.wentToSchool,
  hasHealthIssue: data.hasHealthIssue || "no",
  healthIssueType: data.healthIssueType || [],
  chronicDiseases: data.chronicDiseases || [],
  requiredMedicalAssistance: data.requiredMedicalAssistance || ""
}))

type FormData = z.infer<typeof formSchema>

interface FamilyMemberFormProps {
  memberIndex: number
  onSubmit: (data: FamilyMember) => void
  isSubmitted: boolean
}

export function FamilyMemberForm({ memberIndex, onSubmit, isSubmitted }: FamilyMemberFormProps) {
  const [showOtherBusinessType, setShowOtherBusinessType] = useState(false)
  const [showOtherSkillType, setShowOtherSkillType] = useState(false)
  const [showOtherTrainingField, setShowOtherTrainingField] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showOtherChronicDisease, setShowOtherChronicDisease] = useState(false)
  const [showOtherTreatmentLocation, setShowOtherTreatmentLocation] = useState(false)
  const [showOtherMedicalExpensesCoverage, setShowOtherMedicalExpensesCoverage] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit"
  })

  const watchWentToSchool = watch("wentToSchool")
  const watchIsCurrentlyEnrolled = watch("isCurrentlyEnrolled")
  const watchIsWorking = watch("isWorking")
  const watchHasPrivateBusiness = watch("hasPrivateBusiness")
  const watchHasUnusedSkill = watch("hasUnusedSkill")
  const watchWantsTraining = watch("wantsTraining")
  const watchHasHealthIssue = watch("hasHealthIssue")

  const handleFormSubmit = async (data: FormData) => {
    console.log("Form submitted", data)
    console.log("Form errors", errors)
    
    try {
      setIsSaving(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(data)
      toast({
        title: "تم الحفظ",
        description: `تم حفظ بيانات الفرد ${memberIndex + 1} بنجاح`,
      })
    } catch (error) {
      console.error("Submit error:", error)
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
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="mb-6 text-xl font-semibold">
        {memberIndex === 0 ? "بيانات الفرد الأول (رب الأسرة)" : `بيانات الفرد ${memberIndex + 1}`}
      </h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Educational Status Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">الحالة التعليمية</h4>

          <div className="space-y-2">
            <Label htmlFor={`wentToSchool-${memberIndex}`}>هل سبق له الذهاب للمدرسة؟</Label>
            <Controller
              name="wentToSchool"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`wentToSchool-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
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

          {watchWentToSchool === "no" && (
            <div className="space-y-2">
              <Label htmlFor={`reasonForNotAttending-${memberIndex}`}>لماذا لم يذهب للمدرسة؟</Label>
              <Controller
                name="reasonForNotAttending"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`reasonForNotAttending-${memberIndex}`}>
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tooYoung">دون سن الإلتحاق</SelectItem>
                      <SelectItem value="academic">ضعف دراسي/رسوب</SelectItem>
                      <SelectItem value="financial">العمل للمساعدة المالية</SelectItem>
                      <SelectItem value="marriage">بسبب الزواج</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reasonForNotAttending && <p className="text-sm text-red-500">{errors.reasonForNotAttending.message}</p>}
            </div>
          )}

          {watchWentToSchool === "yes" && (
            <div className="space-y-2">
              <Label htmlFor={`lastEducationalStage-${memberIndex}`}>ما آخر مرحلة تعليمية التحق بها؟</Label>
              <Controller
                name="lastEducationalStage"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`lastEducationalStage-${memberIndex}`}>
                      <SelectValue placeholder="اختر المرحلة التعليمية" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationalStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.lastEducationalStage && <p className="text-sm text-red-500">{errors.lastEducationalStage.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`isCurrentlyEnrolled-${memberIndex}`}>هل الاسم منتظم في الدراسة لهذا العام؟</Label>
            <Controller
              name="isCurrentlyEnrolled"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`isCurrentlyEnrolled-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.isCurrentlyEnrolled && <p className="text-sm text-red-500">{errors.isCurrentlyEnrolled.message}</p>}
          </div>

          {watchIsCurrentlyEnrolled === "no" && (
            <div className="space-y-2">
              <Label htmlFor={`reasonForNotEnrolled-${memberIndex}`}>ما هي أسباب عدم الذهاب للمدرسة لهذا العام؟</Label>
              <Controller
                name="reasonForNotEnrolled"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`reasonForNotEnrolled-${memberIndex}`}>
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">ضعف دراسي</SelectItem>
                      <SelectItem value="financial">ظروف مادية</SelectItem>
                      <SelectItem value="social">ظروف اجتماعية</SelectItem>
                      <SelectItem value="health">ظروف صحية</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reasonForNotEnrolled && <p className="text-sm text-red-500">{errors.reasonForNotEnrolled.message}</p>}
            </div>
          )}

          {watchWentToSchool === "no" && (
            <div className="space-y-2">
              <Label htmlFor={`hasLiteracyCertificate-${memberIndex}`}>هل حاصل على شهادة محو الأمية؟</Label>
              <Controller
                name="hasLiteracyCertificate"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`hasLiteracyCertificate-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.hasLiteracyCertificate && <p className="text-sm text-red-500">{errors.hasLiteracyCertificate.message}</p>}
          </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`canReadAndWrite-${memberIndex}`}>هل يجيد القراءة والكتابة؟</Label>
            <Controller
              name="canReadAndWrite"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`canReadAndWrite-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.canReadAndWrite && <p className="text-sm text-red-500">{errors.canReadAndWrite.message}</p>}
          </div>
        </div>

        {/* Employment Status Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">الحالة الوظيفية</h4>

          <div className="space-y-2">
            <Label htmlFor={`isWorking-${memberIndex}`}>هل يعمل؟</Label>
            <Controller
              name="isWorking"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`isWorking-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.isWorking && <p className="text-sm text-red-500">{errors.isWorking.message}</p>}
          </div>

          {watchIsWorking === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`jobType-${memberIndex}`}>ما هو العمل؟</Label>
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id={`jobType-${memberIndex}`}>
                        <SelectValue placeholder="اختر نوع العمل" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((job) => (
                          <SelectItem key={job.value} value={job.value}>
                            {job.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jobType && <p className="text-sm text-red-500">{errors.jobType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`sector-${memberIndex}`}>ما هو القطاع؟</Label>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id={`sector-${memberIndex}`}>
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
                {errors.sector && <p className="text-sm text-red-500">{errors.sector.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`workNature-${memberIndex}`}>ما هي طبيعة العمل؟</Label>
                <Controller
                  name="workNature"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id={`workNature-${memberIndex}`}>
                        <SelectValue placeholder="اختر طبيعة العمل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullTime">دوام كامل</SelectItem>
                        <SelectItem value="partTime">دوام جزئي</SelectItem>
                        <SelectItem value="contract">عقد</SelectItem>
                        <SelectItem value="freelance">عمل حر</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.workNature && <p className="text-sm text-red-500">{errors.workNature.message}</p>}
              </div>
            </>
          )}

          {watchIsWorking === "no" && (
            <div className="space-y-2">
              <Label htmlFor={`notWorkingReason-${memberIndex}`}>لماذا لا يعمل؟</Label>
              <Controller
                name="notWorkingReason"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`notWorkingReason-${memberIndex}`}>
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tooYoung">مازال صغير/ة</SelectItem>
                      <SelectItem value="sick">مريض/ة</SelectItem>
                      <SelectItem value="housewife">ربة منزل</SelectItem>
                      <SelectItem value="imprisoned">مسجون</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.notWorkingReason && <p className="text-sm text-red-500">{errors.notWorkingReason.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`hasPrivateBusiness-${memberIndex}`}>هل لديك مشروع خاص؟</Label>
            <Controller
              name="hasPrivateBusiness"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`hasPrivateBusiness-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.hasPrivateBusiness && <p className="text-sm text-red-500">{errors.hasPrivateBusiness.message}</p>}
          </div>

          {watchHasPrivateBusiness === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`businessType-${memberIndex}`}>ما هو المشروع؟</Label>
                <Controller
                  name="businessType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setShowOtherBusinessType(value === "other")
                      }}
                      value={field.value}
                    >
                      <SelectTrigger id={`businessType-${memberIndex}`}>
                        <SelectValue placeholder="اختر نوع المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.businessType && <p className="text-sm text-red-500">{errors.businessType.message}</p>}
              </div>

              {showOtherBusinessType && (
                <div className="space-y-2">
                  <Label htmlFor={`otherBusinessType-${memberIndex}`}>اذكر نوع المشروع</Label>
                  <Input
                    id={`otherBusinessType-${memberIndex}`}
                    className="text-right"
                    maxLength={50}
                    {...register("otherBusinessType")}
                  />
                  {errors.otherBusinessType && <p className="text-sm text-red-500">{errors.otherBusinessType.message}</p>}
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor={`hasUnusedSkill-${memberIndex}`}>هل لديه مهارة أو حرفة ولا يمارسها؟</Label>
            <Controller
              name="hasUnusedSkill"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`hasUnusedSkill-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.hasUnusedSkill && <p className="text-sm text-red-500">{errors.hasUnusedSkill.message}</p>}
          </div>

          {watchHasUnusedSkill === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`skillType-${memberIndex}`}>ما هي المهارة أو الحرفة؟</Label>
                <Controller
                  name="skillType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setShowOtherSkillType(value === "other")
                      }}
                      value={field.value}
                    >
                      <SelectTrigger id={`skillType-${memberIndex}`}>
                        <SelectValue placeholder="اختر نوع المهارة" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.skillType && <p className="text-sm text-red-500">{errors.skillType.message}</p>}
              </div>

              {showOtherSkillType && (
                <div className="space-y-2">
                  <Label htmlFor={`otherSkillType-${memberIndex}`}>اذكر نوع المهارة</Label>
                  <Input
                    id={`otherSkillType-${memberIndex}`}
                    className="text-right"
                    maxLength={50}
                    {...register("otherSkillType")}
                  />
                  {errors.otherSkillType && <p className="text-sm text-red-500">{errors.otherSkillType.message}</p>}
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor={`wantsTraining-${memberIndex}`}>هل لديك استعداد للتدريب على مهنة معينة أو مجال معين؟</Label>
            <Controller
              name="wantsTraining"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`wantsTraining-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.wantsTraining && <p className="text-sm text-red-500">{errors.wantsTraining.message}</p>}
          </div>

          {watchWantsTraining === "yes" && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`trainingField-${memberIndex}`}>ما هو المجال الذي ترغب في التدريب عليه؟</Label>
                <Controller
                  name="trainingField"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setShowOtherTrainingField(value === "other")
                      }}
                      value={field.value}
                    >
                      <SelectTrigger id={`trainingField-${memberIndex}`}>
                        <SelectValue placeholder="اختر مجال التدريب" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainingFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.trainingField && <p className="text-sm text-red-500">{errors.trainingField.message}</p>}
              </div>

              {showOtherTrainingField && (
                <div className="space-y-2">
                  <Label htmlFor={`otherTrainingField-${memberIndex}`}>اذكر مجال التدريب</Label>
                  <Input
                    id={`otherTrainingField-${memberIndex}`}
                    className="text-right"
                    maxLength={50}
                    {...register("otherTrainingField")}
                  />
                  {errors.otherTrainingField && <p className="text-sm text-red-500">{errors.otherTrainingField.message}</p>}
                </div>
              )}
            </>
          )}
        </div>

        {/* Health Status Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">الحالة الصحية</h4>

          <div className="space-y-2">
            <Label htmlFor={`hasHealthIssue-${memberIndex}`}>هل يعاني من مرض مزمن أو إعاقة أو مرض نفسي؟</Label>
            <Controller
              name="hasHealthIssue"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id={`hasHealthIssue-${memberIndex}`}>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.hasHealthIssue && <p className="text-sm text-red-500">{errors.hasHealthIssue.message}</p>}
          </div>

          {watchHasHealthIssue === "yes" && (
            <>
              <div className="space-y-2">
                <Label>الأمراض المزمنة</Label>
                <div className="grid grid-cols-2 gap-4">
                  {chronicDiseases.map((disease) => (
                    <div key={disease.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`disease-${disease.value}-${memberIndex}`}
                        {...register("chronicDiseases")}
                        value={disease.value}
                        onChange={(e) => {
                          if (disease.value === "other") {
                            setShowOtherChronicDisease((e.target as HTMLInputElement).checked)
                          }
                        }}
                      />
                      <Label htmlFor={`disease-${disease.value}-${memberIndex}`} className="mr-2">
                        {disease.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.chronicDiseases && <p className="text-sm text-red-500">{errors.chronicDiseases.message}</p>}
              </div>

              {showOtherChronicDisease && (
                <div className="space-y-2">
                  <Label htmlFor={`otherChronicDisease-${memberIndex}`}>حدد المرض المزمن</Label>
                  <Input
                    id={`otherChronicDisease-${memberIndex}`}
                    className="text-right"
                    maxLength={50}
                    {...register("otherChronicDisease")}
                  />
                  {errors.otherChronicDisease && <p className="text-sm text-red-500">{errors.otherChronicDisease.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`disabilityType-${memberIndex}`}>نوع الإعاقة</Label>
                <Controller
                  name="disabilityType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id={`disabilityType-${memberIndex}`}>
                        <SelectValue placeholder="اختر نوع الإعاقة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">حركية</SelectItem>
                        <SelectItem value="hearing">سمعية</SelectItem>
                        <SelectItem value="visual">بصرية</SelectItem>
                        <SelectItem value="mental">ذهنية</SelectItem>
                        <SelectItem value="multiple">متعددة</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.disabilityType && <p className="text-sm text-red-500">{errors.disabilityType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`treatmentLocation-${memberIndex}`}>مكان تلقي العلاج</Label>
                <Controller
                  name="treatmentLocation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setShowOtherTreatmentLocation(value === "other")
                      }}
                      value={field.value}
                    >
                      <SelectTrigger id={`treatmentLocation-${memberIndex}`}>
                        <SelectValue placeholder="اختر مكان العلاج" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="localClinic">الوحدة الصحية بالمنطقة</SelectItem>
                        <SelectItem value="privateClinic">عيادة خاصة</SelectItem>
                        <SelectItem value="publicHospital">مستشفى عام</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.treatmentLocation && <p className="text-sm text-red-500">{errors.treatmentLocation.message}</p>}
              </div>

              {showOtherTreatmentLocation && (
                <div className="space-y-2">
                  <Label htmlFor={`otherTreatmentLocation-${memberIndex}`}>حدد مكان العلاج</Label>
                  <Input
                    id={`otherTreatmentLocation-${memberIndex}`}
                    className="text-right"
                    maxLength={50}
                    {...register("otherTreatmentLocation")}
                  />
                  {errors.otherTreatmentLocation && <p className="text-sm text-red-500">{errors.otherTreatmentLocation.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`medicalExpensesCoverage-${memberIndex}`}>كيف تغطي تكاليف العلاج؟</Label>
                <Controller
                  name="medicalExpensesCoverage"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setShowOtherMedicalExpensesCoverage(value === "other")
                      }}
                      value={field.value}
                    >
                      <SelectTrigger id={`medicalExpensesCoverage-${memberIndex}`}>
                        <SelectValue placeholder="اختر طريقة تغطية التكاليف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">تغطية الأسرة بالكامل</SelectItem>
                        <SelectItem value="government">علاج على نفقة الدولة</SelectItem>
                        <SelectItem value="insurance">تأمين صحي</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.medicalExpensesCoverage && <p className="text-sm text-red-500">{errors.medicalExpensesCoverage.message}</p>}
              </div>

              {showOtherMedicalExpensesCoverage && (
                <div className="space-y-2">
                  <Label htmlFor={`otherMedicalExpensesCoverage-${memberIndex}`}>حدد طريقة تغطية التكاليف</Label>
                  <Input
                    id={`otherMedicalExpensesCoverage-${memberIndex}`}
                    className="text-right"
                    maxLength={50}
                    {...register("otherMedicalExpensesCoverage")}
                  />
                  {errors.otherMedicalExpensesCoverage && <p className="text-sm text-red-500">{errors.otherMedicalExpensesCoverage.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label>المساعدة الطبية المطلوبة من المؤسسة</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`assistance-monthly-${memberIndex}`}
                      {...register("requiredMedicalAssistance")}
                      value="monthly"
                    />
                    <Label htmlFor={`assistance-monthly-${memberIndex}`} className="mr-2">
                      علاج شهري
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`assistance-surgery-${memberIndex}`}
                      {...register("requiredMedicalAssistance")}
                      value="surgery"
                    />
                    <Label htmlFor={`assistance-surgery-${memberIndex}`} className="mr-2">
                      إجراء عملية
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`assistance-wheelchair-${memberIndex}`}
                      {...register("requiredMedicalAssistance")}
                      value="wheelchair"
                    />
                    <Label htmlFor={`assistance-wheelchair-${memberIndex}`} className="mr-2">
                      كرسي متحرك
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`assistance-tests-${memberIndex}`}
                      {...register("requiredMedicalAssistance")}
                      value="tests"
                    />
                    <Label htmlFor={`assistance-tests-${memberIndex}`} className="mr-2">
                      أشعة وتحاليل
                    </Label>
                  </div>
                </div>
                {errors.requiredMedicalAssistance && <p className="text-sm text-red-500">{errors.requiredMedicalAssistance.message}</p>}
              </div>
            </>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSaving || isSubmitted}
        >
          {isSaving ? "جاري الحفظ..." : "حفظ بيانات الفرد"}
        </Button>
      </form>
    </div>
  )
}

