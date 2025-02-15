import Image from "next/image"

export function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 bg-white/80 backdrop-blur-sm">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D9%85%D9%88%D9%94%D8%B3%D8%B3%D9%87%20%D8%AD%D9%8A%D8%A7%D9%87%20%D9%83%D8%B1%D9%8A%D9%85%D9%87%20%D9%A1-K94Yhu0GnI6yaxkymj9c7hQkHOTygE.png"
        alt="مؤسسة حياة كريمة"
        width={120}
        height={80}
        className="h-20 w-auto"
        priority
      />
    </div>
  )
}

