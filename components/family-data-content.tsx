"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import HouseholdForm from "@/components/household-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function FamilyDataContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [familySize, setFamilySize] = useState(0)
  const [submittedMembers, setSubmittedMembers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allMembersSubmitted, setAllMembersSubmitted] = useState(false)

  useEffect(() => {
    const size = Number.parseInt(searchParams.get("familySize") || "0")
    if (size === 0) {
      router.push("/")
    }
    setFamilySize(size)
  }, [searchParams, router])

  const handleMemberSubmit = (memberIndex: number, data: any) => {
    setSubmittedMembers((prev) => {
      const newMembers = [...prev]
      newMembers[memberIndex] = data
      const allSubmitted = newMembers.filter(Boolean).length === familySize
      setAllMembersSubmitted(allSubmitted)
      return newMembers
    })
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your backend
      console.log("Submitting family data:", submittedMembers)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم حفظ البيانات",
        description: "تم حفظ بيانات الأسرة بالكامل",
        duration: 3000,
      })

      // Navigate to the home page
      router.push("/")
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (familySize === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-28 md:p-6 md:pt-28" dir="rtl">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">بيانات الأسرة المعيشية</h1>
          <p className="mt-2 text-gray-600">يرجى إدخال بيانات جميع أفراد الأسرة ({familySize} فرد)</p>
        </div>

        <div className="space-y-6">
          {Array.from({ length: familySize }).map((_, index) => (
            <HouseholdForm
              key={index}
              memberIndex={index}
              onSubmit={(data) => handleMemberSubmit(index, data)}
              isSubmitted={Boolean(submittedMembers[index])}
            />
          ))}
        </div>

        <Button onClick={handleFinalSubmit} className="w-full mt-4" disabled={isSubmitting || !allMembersSubmitted}>
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ البيانات بالكامل"
          )}
        </Button>
      </div>
    </div>
  )
}

