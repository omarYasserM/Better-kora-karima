import imageCompression from "browser-image-compression"

export async function compressImage(file: File, maxSizeMB = 1) {
  try {
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    
    const compressedFile = await imageCompression(file, options)
    
    // Create a new file with Arabic filename
    return new File(
      [compressedFile], 
      `صورة_${Date.now()}.${compressedFile.name.split('.').pop()}`,
      { type: compressedFile.type }
    )
  } catch (error) {
    console.error("Error compressing image:", error)
    throw error
  }
} 