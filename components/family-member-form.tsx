"use client"

import { useState, useEffect } from "react"
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
import { FormField } from "@/components/ui/form-field"
import { Loader2 } from "lucide-react"
import { useOptions } from "@/providers/options-provider"
import { FormOptions } from "@/types/options"
import { formConfig } from "@/lib/formConfig"


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
  gender: z.string().min(1, validationMessages.required),
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
  if (data.hasPrivateBusiness === 'نعم' && !data.businessType) {
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



// Section configuration
const sections = {
  basic: {
    title: "البيانات الأساسية",
    order: 1
  },
  education: {
    title: "الحالة التعليمية",
    order: 2
  },
  employment: {
    title: "الحالة الوظيفية",
    order: 3
  },
  health: {
    title: "الحالة الصحية",
    order: 4
  }
} as const;

// Update the FormFieldConfig type to include conditional dependsOn
type FormFieldConfig = (typeof formConfig)[number] & {
  dependsOn?: {
    field: keyof FormData;
    value: string;
  };
  optionsKey?: keyof FormOptions;
  showOther?: boolean;
  setOtherVisibility?: (value: boolean) => void;
  placeholder?: string;
};

export function FamilyMemberForm({ memberIndex, onSubmit, isFirst }: FamilyMemberFormProps) {
  const { options } = useOptions()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {} // Ensure fresh start
  })

  // Reset form when memberIndex changes
  useEffect(() => {
    form.reset()
  }, [memberIndex, form])

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form

  // Update watchedFields with proper typing
  const watchedFields = formConfig
    .filter((field): field is FormFieldConfig & { dependsOn: NonNullable<FormFieldConfig['dependsOn']> } => 
      'dependsOn' in field && !!field.dependsOn
    )
    .reduce((acc, field) => ({
      ...acc,
      [field.dependsOn.field]: watch(field.dependsOn.field)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }), {} as Record<string, any>);

  const renderField = (fieldConfig: FormFieldConfig) => {
    // Check if field should be shown based on dependencies
    if (fieldConfig.dependsOn && watchedFields[fieldConfig.dependsOn.field] !== fieldConfig.dependsOn.value) {
      return null;
    }

    const commonProps = {
      id: `${fieldConfig.id}-${memberIndex}`,
      label: fieldConfig.label,
      error: errors[fieldConfig.id]?.message,
      required: fieldConfig.validation.required
    };

    switch (fieldConfig.type) {
      case 'text':
        return (
          <FormField {...commonProps}>
            <Input
              id={commonProps.id}
              {...register(fieldConfig.id)}
              className="text-right"
              maxLength={'maxLength' in fieldConfig.validation ? fieldConfig.validation.maxLength : undefined}
              placeholder={fieldConfig.placeholder}
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField {...commonProps}>
            <Controller
              name={fieldConfig.id}
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    if (fieldConfig.showOther) {
                      const setterFunction = fieldConfig.setOtherVisibility
                      if (setterFunction) {
                        setterFunction(value === "أخرى")
                      }
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger id={commonProps.id}>
                    <SelectValue placeholder={`اختر ${fieldConfig.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(fieldConfig.optionsKey ? options![fieldConfig.optionsKey] : fieldConfig.options)?.map((opt: { id: string; name: string }) => (
                      <SelectItem key={opt.id} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        );

      case 'checkbox-group':
        return (
          <FormField {...commonProps}>
            <div className="grid grid-cols-2 gap-4">
              {options![fieldConfig.optionsKey].map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <Controller
                    name={fieldConfig.id}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Checkbox
                        id={`${fieldConfig.id}-${opt.id}-${memberIndex}`}
                        checked={field.value?.includes(opt.name)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), opt.name]
                            : (field.value || []).filter((value: string) => value !== opt.name)
                          field.onChange(updatedValue)
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={`${fieldConfig.id}-${opt.id}-${memberIndex}`} className="mr-2">
                    {opt.name}
                  </Label>
                </div>
              ))}
            </div>
          </FormField>
        );

      default:
        return null;
    }
  };

  const renderSection = (sectionId: keyof typeof sections) => {
    const sectionFields = formConfig.filter(field => field.section === sectionId);
    
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium">{sections[sectionId].title}</h4>
        {sectionFields.map(field => (
          <div key={field.id} className="space-y-2">
            {renderField(field)}
          </div>
        ))}
      </div>
    );
  };

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
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  if (!options) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {isFirst ? "بيانات رب الأسرة" : `بيانات الفرد ${memberIndex + 1}`}
        </h2>

        {(Object.keys(sections) as (keyof typeof sections)[])
          .sort((a, b) => sections[a].order - sections[b].order)
          .map(sectionId => (
            <div key={sectionId} className="mt-6">
              {renderSection(sectionId)}
            </div>
          ))}
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
  );
}

