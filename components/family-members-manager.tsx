"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEntryStore, FamilyMember } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FamilyMemberForm } from "@/components/family-member-form"
import { Card } from "@/components/ui/card"


export function FamilyMembersManager() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)
  
  const { 
    entryId, 
    familyMembers, 
    coordinator,
    researcher,
    addFamilyMember, 
    beneficiary 
  } = useEntryStore()

  const familySize = parseInt(searchParams.get("familySize") || "0")

  // Redirect if no beneficiary data
  if (!beneficiary || !entryId) {
    router.push("/beneficiary")
    return null
  }

  const handleMemberSubmit = async (memberData: FamilyMember) => {
    try {
      addFamilyMember(memberData)
      
      if (currentMemberIndex + 1 < familySize) {
        setCurrentMemberIndex(prev => prev + 1)
      } else {
        setIsSubmitting(true)
        
        // First submit beneficiary data
        const formData = new FormData()
        formData.append('entryId', entryId)
        formData.append('researcher', researcher?.name || "")
        formData.append('coordinator', coordinator?.name || "")
        formData.append('beneficiaryName', beneficiary.name)
        formData.append('nationalId', beneficiary.nationalId)
        formData.append('gender', beneficiary.gender)
        formData.append('familySize', String(beneficiary.familySize))
        formData.append('phone1', beneficiary.phone1)
        if (beneficiary.phone2) formData.append('phone2', beneficiary.phone2)
        if (beneficiary.whatsapp) formData.append('whatsapp', beneficiary.whatsapp)
        if (beneficiary.idCardImage) formData.append('idCardImage', beneficiary.idCardImage)

        const beneficiaryResponse = await fetch("/api/submit-beneficiary", {
          method: "POST",
          body: formData
        })
        
        if (!beneficiaryResponse.ok) {
          throw new Error("Failed to submit beneficiary data")
        }

        // Then submit family members
        const familyResponse = await fetch("/api/submit-family-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entryId,
            familyMembers: [...familyMembers, memberData]
          }),
        })

        if (!familyResponse.ok) {
          const errorText = await familyResponse.text();
          console.error('Family submission error:', errorText);
          throw new Error(errorText);
        }

        toast({
          title: "تم الحفظ بنجاح",
          description: "تم حفظ بيانات جميع أفراد الأسرة",
        })

        // Reset the store before navigating to success
        useEntryStore.getState().reset()
        router.push("/success")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-28 md:p-6 md:pt-28" dir="rtl">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">بيانات الأسرة المعيشية</h1>
          <p className="mt-2 text-gray-600">
            {`فرد ${currentMemberIndex + 1} من ${familySize}`}
          </p>
        </div>

        <Card className="p-6">
          <FamilyMemberForm
            key={currentMemberIndex}
            memberIndex={currentMemberIndex}
            onSubmit={handleMemberSubmit}
            isFirst={currentMemberIndex === 0}
          />
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentMemberIndex > 0) {
                setCurrentMemberIndex(prev => prev - 1)
              } else {
                router.push("/beneficiary")
              }
            }}
          >
            السابق
          </Button>
          
          <div className="flex gap-2">
            {Array.from({ length: familySize }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index <= currentMemberIndex ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 