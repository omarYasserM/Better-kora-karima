"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/ui/form-error"

interface ImageUploadProps {
  onChange: (file?: File) => void
  error?: string
  maxSize?: number // in MB
  accept?: string[]
}

export function ImageUpload({
  onChange,
  error,
  maxSize = 5, // Default 5MB
  accept = ["image/jpeg", "image/png"]
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    maxFiles: 1,
  })

  const handleRemove = () => {
    onChange(undefined)
    setPreview(undefined)
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            flex h-48 cursor-pointer flex-col items-center justify-center 
            rounded-lg border-2 border-dashed p-4 text-center hover:bg-gray-50
            ${isDragActive ? "border-primary" : "border-gray-300"}
          `}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 text-sm text-gray-600">
            {isDragActive ? (
              "اسحب الصورة هنا..."
            ) : (
              <>
                اسحب الصورة هنا أو اضغط للاختيار
                <p className="mt-1 text-xs text-gray-500">
                  {`الحد الأقصى للحجم ${maxSize}MB`}
                </p>
                <p className="text-xs text-gray-500">
                  {`الصيغ المدعومة: ${accept.join(", ")}`}
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {error && <FormError message={error} />}
    </div>
  )
} 