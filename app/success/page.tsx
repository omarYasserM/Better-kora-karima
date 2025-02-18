import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-4 pt-28 md:p-6 md:pt-28" dir="rtl">
        <div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-600">تم الحفظ بنجاح</h1>
          <p className="text-gray-600">تم حفظ جميع البيانات بنجاح</p>
          
          <Link href="/">
            <Button className="w-full">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
} 