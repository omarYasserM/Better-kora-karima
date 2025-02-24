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
import { FamilyMember } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { useFormPersistence } from "@/hooks/use-form-persistence"
import { FormField } from "@/components/ui/form-field"
import { Loader2 } from "lucide-react"
import { useOptions } from "@/providers/options-provider"


const validationMessages = {
  required: "هذا الحقل مطلوب",
  arabicOnly: "يجب إدخال الاسم باللغة العربية فقط",
  invalidOption: "يرجى اختيار قيمة صحيحة",
} as const

// Form schema
const formSchema = z.object({
  // Required base fields
  name: z
    .string()
    .min(1, validationMessages.required)
    .regex(/^[\u0600-\u06FF\s]+$/, validationMessages.arabicOnly),
  kinshipRelation: z.string().min(1, validationMessages.required),
  gender: z.enum(["male", "female"] as const),
  ageGroup: z.string().min(1, validationMessages.required),
  maritalStatus: z.string().min(1, validationMessages.required),
  hasNationalId: z.string().min(1, validationMessages.required),
  hasAttendedSchool: z.string().min(1, validationMessages.required),
  wentToSchool: z.string().min(1, validationMessages.required),
  canReadAndWrite: z.string().min(1, validationMessages.required),
  isWorking: z.string().min(1, validationMessages.required),
  hasHealthIssue: z.string().min(1, validationMessages.required),

  // All conditional fields made simply optional

  reasonForNotAttending: z.string().optional(),
  lastEducationalStage: z.string().optional(),
  isCurrentlyEnrolled: z.string().optional(),
  reasonForNotEnrolled: z.string().optional(),
  hasLiteracyCertificate: z.string().optional(),
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
  healthIssueType: z.array(z.string()).optional(),
  chronicDiseases: z.array(z.string()).optional(),
  otherChronicDisease: z.string().optional(),
  disabilityType: z.string().optional(),
  disabilityCause: z.string().optional(),
  treatmentLocation: z.string().optional(),
  otherTreatmentLocation: z.string().optional(),
  medicalExpensesCoverage: z.string().optional(),
  otherMedicalExpensesCoverage: z.string().optional(),
  requiredMedicalAssistance: z.array(z.string()).optional(),
  hasMarriedDaughterUnder18: z.string().optional(),
  hasFGM: z.string().optional(),
  whereFGM: z.string().optional(),
  otherWhereFGM: z.string().optional(),
  nationalId: z.string()
    .optional()
}).refine(data => {
  // Validate business type if has private business
  if (data.hasPrivateBusiness === 'yes' && !data.businessType) {
    return false;
  }
  return true;
}, {
  message: "نوع المشروع مطلوب عند اختيار 'نعم' في وجود مشروع خاص",
  path: ["businessType"]
});

type FormData = z.infer<typeof formSchema>

interface FamilyMemberFormProps {
  memberIndex: number
  onSubmit: (data: FamilyMember) => Promise<void>
  isFirst: boolean
}

export function FamilyMemberForm({ memberIndex, onSubmit, isFirst }: FamilyMemberFormProps) {
  const { options } = useOptions()
  const [showOtherSkillType, setShowOtherSkillType] = useState(false)
  const [showOtherTrainingField, setShowOtherTrainingField] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showOtherChronicDisease, setShowOtherChronicDisease] = useState(false)
  const [showOtherTreatmentLocation, setShowOtherTreatmentLocation] = useState(false)
  const [showOtherMedicalExpensesCoverage, setShowOtherMedicalExpensesCoverage] = useState(false)



  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  // Enable form persistence
  useFormPersistence(
    form,
    `family-member-${memberIndex}`,
    true
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const watchWentToSchool = watch("wentToSchool")
  const watchIsCurrentlyEnrolled = watch("isCurrentlyEnrolled")
  const watchIsWorking = watch("isWorking")
  const watchHasUnusedSkill = watch("hasUnusedSkill")
  const watchWantsTraining = watch("wantsTraining")
  const watchHasHealthIssue = watch("hasHealthIssue")
  const watchHasNationalId = watch("hasNationalId")

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSaving(true)

      const familyMemberData: FamilyMember = {
        ...data,
        healthIssueType: data.healthIssueType || [],
        chronicDiseases: data.chronicDiseases || [],
        requiredMedicalAssistance: Array.isArray(data.requiredMedicalAssistance)
          ? data.requiredMedicalAssistance.join(",")
          : data.requiredMedicalAssistance
      }

      await onSubmit(familyMemberData)

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
      throw error // Re-throw to let parent component handle
    } finally {
      setIsSaving(false)
    }
  }

  if (!options) {
    return null // or return a loading state
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, (data) => console.log(data))} className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {isFirst ? "بيانات رب الأسرة" : `بيانات الفرد ${memberIndex + 1}`}
        </h2>

        {/* Add this section right after the form title */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">البيانات الأساسية</h4>

          <div className="space-y-2">
            <FormField
              id={`name-${memberIndex}`}
              label="الاسم"
              error={errors.name?.message}
              required
            >
              <Input id={`name-${memberIndex}`} {...register("name")} className="text-right" />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`kinshipRelation-${memberIndex}`}
              label="صلة القرابة"
              error={errors.kinshipRelation?.message}
              required
            >
              <Controller
                name="kinshipRelation"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`kinshipRelation-${memberIndex}`}>
                      <SelectValue placeholder="اختر صلة القرابة" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.relationship.map((rel) => (
                        <SelectItem key={rel.id} value={rel.id}>
                          {rel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`gender-${memberIndex}`}
              label="النوع"
              error={errors.gender?.message}
              required
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`gender-${memberIndex}`}>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.gender.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`ageGroup-${memberIndex}`}
              label="الفئة العمرية"
              error={errors.ageGroup?.message}
              required
            >
              <Controller
                name="ageGroup"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`ageGroup-${memberIndex}`}>
                      <SelectValue placeholder="اختر الفئة العمرية" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.age.map((age) => (
                        <SelectItem key={age.id} value={age.id}>
                          {age.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`maritalStatus-${memberIndex}`}
              label="الحالة الاجتماعية"
              error={errors.maritalStatus?.message}
              required
            >
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`maritalStatus-${memberIndex}`}>
                      <SelectValue placeholder="اختر الحالة الاجتماعية" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.maritalStatus.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`hasNationalId-${memberIndex}`}
              label="هل لديه رقم قومي؟"
              error={errors.hasNationalId?.message}
              required
            >
              <Controller
                name="hasNationalId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`hasNationalId-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.hasId.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {watchHasNationalId === "yes" && (
            <div className="space-y-2">
              <FormField
                id={`nationalId-${memberIndex}`}
                label="الرقم القومي"
                error={errors.nationalId?.message}
                required
              >
                <Input
                  id={`nationalId-${memberIndex}`}
                  {...register("nationalId")}
                  className="text-right"
                  maxLength={14}
                  placeholder="14 رقم"
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Educational Status Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">الحالة التعليمية</h4>

          <div className="space-y-2">
            <FormField
              id={`hasAttendedSchool-${memberIndex}`}
              label="هل التحق بالمدرسة؟"
              error={errors.hasAttendedSchool?.message}
              required
            >
              <Controller
                name="hasAttendedSchool"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`hasAttendedSchool-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.hasBeenToSchool.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`wentToSchool-${memberIndex}`}
              label="هل سبق له الذهاب للمدرسة؟"
              error={errors.wentToSchool?.message}
              required
            >
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
            </FormField>
          </div>

          {watchWentToSchool === "no" && (
            <div className="space-y-2">
              <FormField
                id={`reasonForNotAttending-${memberIndex}`}
                label="لماذا لم يذهب للمدرسة؟"
                error={errors.reasonForNotAttending?.message}
                required
              >
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
              </FormField>
            </div>
          )}

          {watchWentToSchool === "yes" && (
            <div className="space-y-2">
              <FormField
                id={`lastEducationalStage-${memberIndex}`}
                label="ما آخر مرحلة تعليمية التحق بها؟"
                error={errors.lastEducationalStage?.message}
                required
              >
                <Controller
                  name="lastEducationalStage"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id={`lastEducationalStage-${memberIndex}`}>
                        <SelectValue placeholder="اختر المرحلة التعليمية" />
                      </SelectTrigger>
                      <SelectContent>
                        {options!.educationLevel.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>
          )}

          <div className="space-y-2">
            <FormField
              id={`isCurrentlyEnrolled-${memberIndex}`}
              label="هل الاسم منتظم في الدراسة لهذا العام؟"
              error={errors.isCurrentlyEnrolled?.message}
              required
            >
              <Controller
                name="isCurrentlyEnrolled"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`isCurrentlyEnrolled-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.regularityInStudy.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {watchIsCurrentlyEnrolled === "no" && (
            <div className="space-y-2">
              <FormField
                id={`reasonForNotEnrolled-${memberIndex}`}
                label="ما هي أسباب عدم الذهاب للمدرسة لهذا العام؟"
                error={errors.reasonForNotEnrolled?.message}
                required
              >
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
              </FormField>
            </div>
          )}

          {watchWentToSchool === "no" && (
            <div className="space-y-2">
              <FormField
                id={`hasLiteracyCertificate-${memberIndex}`}
                label="هل حاصل على شهادة محو الأمية؟"
                error={errors.hasLiteracyCertificate?.message}
                required
              >
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
              </FormField>
            </div>
          )}

          <div className="space-y-2">
            <FormField
              id={`canReadAndWrite-${memberIndex}`}
              label="هل يجيد القراءة والكتابة؟"
              error={errors.canReadAndWrite?.message}
              required
            >
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
            </FormField>
          </div>
        </div>

        {/* Employment Status Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">الحالة الوظيفية</h4>

          <div className="space-y-2">
            <FormField
              id={`isWorking-${memberIndex}`}
              label="هل يعمل؟"
              error={errors.isWorking?.message}
              required
            >
              <Controller
                name="isWorking"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`isWorking-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.doesWork.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {watchIsWorking === "yes" && (
            <>
              <div className="space-y-2">
                <FormField
                  id={`jobType-${memberIndex}`}
                  label="ما هو العمل؟"
                  error={errors.jobType?.message}
                  required
                >
                  <Controller
                    name="jobType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={`jobType-${memberIndex}`}>
                          <SelectValue placeholder="اختر نوع العمل" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.typeOfWork.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              <div className="space-y-2">
                <FormField
                  id={`sector-${memberIndex}`}
                  label="ما هو القطاع؟"
                  error={errors.sector?.message}
                  required
                >
                  <Controller
                    name="sector"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={`sector-${memberIndex}`}>
                          <SelectValue placeholder="اختر القطاع" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.sector.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              <div className="space-y-2">
                <FormField
                  id={`workNature-${memberIndex}`}
                  label="ما هي طبيعة العمل؟"
                  error={errors.workNature?.message}
                  required
                >
                  <Controller
                    name="workNature"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={`workNature-${memberIndex}`}>
                          <SelectValue placeholder="اختر طبيعة العمل" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.workNature.map((nature) => (
                            <SelectItem key={nature.id} value={nature.id}>
                              {nature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>
            </>
          )}

          {watchIsWorking === "no" && (
            <div className="space-y-2">
              <FormField
                id={`notWorkingReason-${memberIndex}`}
                label="لماذا لا يعمل؟"
                error={errors.notWorkingReason?.message}
                required
              >
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
              </FormField>
            </div>
          )}

          <div className="space-y-2">
            <FormField
              id={`hasPrivateBusiness-${memberIndex}`}
              label="هل لديك مشروع خاص؟"
              error={errors.hasPrivateBusiness?.message}
              required
            >
              <Controller
                name="hasPrivateBusiness"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`hasPrivateBusiness-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.hasPrivateProject.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <FormField
              id={`hasUnusedSkill-${memberIndex}`}
              label="هل لديه مهارة أو حرفة ولا يمارسها؟"
              error={errors.hasUnusedSkill?.message}
              required
            >
              <Controller
                name="hasUnusedSkill"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`hasUnusedSkill-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.hasUnusedSkill.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {watchHasUnusedSkill === "yes" && (
            <>
              <div className="space-y-2">
                <FormField
                  id={`skillType-${memberIndex}`}
                  label="ما هي المهارة أو الحرفة؟"
                  error={errors.skillType?.message}
                  required
                >
                  <Controller
                    name="skillType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setShowOtherSkillType(value === "أخرى")
                        }}
                        value={field.value}
                      >
                        <SelectTrigger id={`skillType-${memberIndex}`}>
                          <SelectValue placeholder="اختر نوع المهارة" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.unusedSkillType.map((skill) => (
                            <SelectItem key={skill.id} value={skill.id}>
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              {showOtherSkillType && (
                <div className="space-y-2">
                  <FormField
                    id={`otherSkillType-${memberIndex}`}
                    label="اذكر نوع المهارة"
                    error={errors.otherSkillType?.message}
                    required
                  >
                    <Input
                      id={`otherSkillType-${memberIndex}`}
                      className="text-right"
                      maxLength={50}
                      {...register("otherSkillType")}
                    />
                  </FormField>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <FormField
              id={`wantsTraining-${memberIndex}`}
              label="هل لديك استعداد للتدريب على مهنة معينة أو مجال معين؟"
              error={errors.wantsTraining?.message}
              required
            >
              <Controller
                name="wantsTraining"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`wantsTraining-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.willingToTrain.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {watchWantsTraining === "yes" && (
            <>
              <div className="space-y-2">
                <FormField
                  id={`trainingField-${memberIndex}`}
                  label="ما هو المجال الذي ترغب في التدريب عليه؟"
                  error={errors.trainingField?.message}
                  required
                >
                  <Controller
                    name="trainingField"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setShowOtherTrainingField(value === "أخرى")
                        }}
                        value={field.value}
                      >
                        <SelectTrigger id={`trainingField-${memberIndex}`}>
                          <SelectValue placeholder="اختر مجال التدريب" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.desiredTrainingField.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              {showOtherTrainingField && (
                <div className="space-y-2">
                  <FormField
                    id={`otherTrainingField-${memberIndex}`}
                    label="اذكر مجال التدريب"
                    error={errors.otherTrainingField?.message}
                    required
                  >
                    <Input
                      id={`otherTrainingField-${memberIndex}`}
                      className="text-right"
                      maxLength={50}
                      {...register("otherTrainingField")}
                    />
                  </FormField>
                </div>
              )}
            </>
          )}
        </div>

        {/* Health Status Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">الحالة الصحية</h4>

          <div className="space-y-2">
            <FormField
              id={`hasHealthIssue-${memberIndex}`}
              label="هل يعاني من مرض مزمن أو إعاقة أو مرض نفسي؟"
              error={errors.hasHealthIssue?.message}
              required
            >
              <Controller
                name="hasHealthIssue"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id={`hasHealthIssue-${memberIndex}`}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {options!.hasChronicIllnessOrDisability.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {watchHasHealthIssue === "yes" && (
            <>
              <div className="space-y-2">
                <FormField
                  id={`chronicDiseases-${memberIndex}`}
                  label="الأمراض المزمنة"
                  error={errors.chronicDiseases?.message}
                  required
                >
                  <div className="grid grid-cols-2 gap-4">
                    {options!.chronicIllnessTypes.map((disease) => (
                      <div key={disease.id} className="flex items-center space-x-2">
                        <Controller
                          name="chronicDiseases"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <Checkbox
                              id={`disease-${disease.id}-${memberIndex}`}
                              checked={field.value?.includes(disease.id)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked === true
                                  ? [...(field.value || []), disease.id]
                                  : (field.value || []).filter((value) => value !== disease.id)
                                field.onChange(updatedValue)
                                if (disease.name === "أخرى") {
                                  setShowOtherChronicDisease(checked === true)
                                }
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`disease-${disease.id}-${memberIndex}`} className="mr-2">
                          {disease.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </div>

              {showOtherChronicDisease && (
                <div className="space-y-2">
                  <FormField
                    id={`otherChronicDisease-${memberIndex}`}
                    label="حدد المرض المزمن"
                    error={errors.otherChronicDisease?.message}
                    required
                  >
                    <Input
                      id={`otherChronicDisease-${memberIndex}`}
                      className="text-right"
                      maxLength={50}
                      {...register("otherChronicDisease")}
                    />
                  </FormField>
                </div>
              )}

              <div className="space-y-2">
                <FormField
                  id={`disabilityType-${memberIndex}`}
                  label="نوع الإعاقة"
                  error={errors.disabilityType?.message}
                  required
                >
                  <Controller
                    name="disabilityType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id={`disabilityType-${memberIndex}`}>
                          <SelectValue placeholder="اختر نوع الإعاقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.disabilityTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              <div className="space-y-2">
                <FormField
                  id={`treatmentLocation-${memberIndex}`}
                  label="مكان تلقي العلاج"
                  error={errors.treatmentLocation?.message}
                  required
                >
                  <Controller
                    name="treatmentLocation"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setShowOtherTreatmentLocation(value === "أخرى")
                        }}
                        value={field.value}
                      >
                        <SelectTrigger id={`treatmentLocation-${memberIndex}`}>
                          <SelectValue placeholder="اختر مكان العلاج" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.treatmentLocations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              {showOtherTreatmentLocation && (
                <div className="space-y-2">
                  <FormField
                    id={`otherTreatmentLocation-${memberIndex}`}
                    label="حدد مكان العلاج"
                    error={errors.otherTreatmentLocation?.message}
                    required
                  >
                    <Input
                      id={`otherTreatmentLocation-${memberIndex}`}
                      className="text-right"
                      maxLength={50}
                      {...register("otherTreatmentLocation")}
                    />
                  </FormField>
                </div>
              )}

              <div className="space-y-2">
                <FormField
                  id={`medicalExpensesCoverage-${memberIndex}`}
                  label="كيف تغطي تكاليف العلاج؟"
                  error={errors.medicalExpensesCoverage?.message}
                  required
                >
                  <Controller
                    name="medicalExpensesCoverage"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setShowOtherMedicalExpensesCoverage(value === "أخرى")
                        }}
                        value={field.value}
                      >
                        <SelectTrigger id={`medicalExpensesCoverage-${memberIndex}`}>
                          <SelectValue placeholder="اختر طريقة تغطية التكاليف" />
                        </SelectTrigger>
                        <SelectContent>
                          {options!.treatmentCostsCovered.map((coverage) => (
                            <SelectItem key={coverage.id} value={coverage.id}>
                              {coverage.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              {showOtherMedicalExpensesCoverage && (
                <div className="space-y-2">
                  <FormField
                    id={`otherMedicalExpensesCoverage-${memberIndex}`}
                    label="حدد طريقة تغطية التكاليف"
                    error={errors.otherMedicalExpensesCoverage?.message}
                    required
                  >
                    <Input
                      id={`otherMedicalExpensesCoverage-${memberIndex}`}
                      className="text-right"
                      maxLength={50}
                      {...register("otherMedicalExpensesCoverage")}
                    />
                  </FormField>
                </div>
              )}

              <div className="space-y-2">
                <FormField
                  id={`requiredMedicalAssistance-${memberIndex}`}
                  label="المساعدة الطبية المطلوبة من المؤسسة"
                  error={errors.requiredMedicalAssistance?.message}
                  required
                >
                  <Controller
                    name="requiredMedicalAssistance"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: "monthly", label: "علاج شهري" },
                          { value: "surgery", label: "إجراء عملية" },
                          { value: "wheelchair", label: "كرسي متحرك" },
                          { value: "tests", label: "أشعة وتحاليل" },
                        ].map((assistance) => (
                          <div key={assistance.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`assistance-${assistance.value}-${memberIndex}`}
                              checked={field.value?.includes(assistance.value)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked === true
                                  ? [...(field.value || []), assistance.value]
                                  : (field.value || []).filter((value) => value !== assistance.value)
                                field.onChange(updatedValue)
                              }}
                            />
                            <Label htmlFor={`assistance-${assistance.value}-${memberIndex}`} className="mr-2">
                              {assistance.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </FormField>
              </div>
            </>
          )}
        </div>
      </Card>

      <Button type="submit" className="w-full" disabled={isSaving || isSubmitting}>
        {isSaving ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          "حفظ البيانات"
        )}
      </Button>
    </form>
  )
}

