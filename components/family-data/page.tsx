"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FamilyMemberForm } from "@/components/family-member-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function FamilyDataPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [familySize, setFamilySize] = useState(0)
  const [submittedMembers, setSubmittedMembers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      return newMembers
    })
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call

      toast({
        title: "تم حفظ البيانات",
        description: "تم حفظ بيانات الأسرة بالكامل",
        duration: 3000,
      })

      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        router.push("/")
      }, 1000)
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

  const allMembersSubmitted = submittedMembers.length === familySize && submittedMembers.every(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">بيانات الأسرة المعيشية</h1>
          <p className="mt-2 text-gray-600">يرجى إدخال بيانات جميع أفراد الأسرة ({familySize} فرد)</p>
        </div>

        <div className="space-y-6">
          {Array.from({ length: familySize }).map((_, index) => (
            <FamilyMemberForm key={index} memberIndex={index} onSubmit={(data) => handleMemberSubmit(index, data)} />
          ))}
        </div>

        {allMembersSubmitted && (
          <div className="rounded-lg bg-card p-6">
            <Button onClick={handleFinalSubmit} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ جميع البيانات"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

