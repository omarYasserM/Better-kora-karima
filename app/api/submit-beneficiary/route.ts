import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { doc } from "@/lib/google-sheets"
import { RowData } from "@/types/sheets"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const entries = Object.fromEntries(formData.entries())
    
    // Handle image upload
    const image = entries.idCardImage as File
    let imageUrl = ''
    
    // if (image && image.size > 0) {
    //   const bytes = await image.arrayBuffer()
    //   const buffer = Buffer.from(bytes)
    //   const uploadDir = join(process.cwd(), "public/uploads")
    //   const path = join(uploadDir, image.name)
    //   await writeFile(path, buffer)
    //   imageUrl = `/uploads/${image.name}`
    // }

    // Submit to Google Sheets
    await doc.loadInfo()
    let sheet = doc.sheetsByTitle["Beneficiaries"]
    
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: "Beneficiaries",
        headerValues: [
          "Timestamp", "EntryID", "Researcher", "Coordinator", 
          "BeneficiaryName", "NationalID", "Gender", "IDCardImage",
          "FamilySize", "Phone1", "Phone2", "Whatsapp"
        ]
      })
    }

    const rowData = {
      Timestamp: new Date().toISOString(),
      EntryID: String(entries.entryId || ''),
      Researcher: String(entries.researcher || ''),
      Coordinator: String(entries.coordinator || ''),
      BeneficiaryName: String(entries.beneficiaryName || ''),
      NationalID: String(entries.nationalId || ''),
      Gender: String(entries.gender || ''),
      IDCardImage: imageUrl,
      FamilySize: String(entries.familySize || ''),
      Phone1: String(entries.phone1 || ''),
      Phone2: String(entries.phone2 || ''),
      Whatsapp: String(entries.whatsapp || '')
    }

    await sheet.addRow(rowData)

    return NextResponse.json({ 
      success: true,
      data: rowData
    })
    
  } catch (error) {
    console.error("Error submitting beneficiary:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      { error: "Failed to submit data", details: errorMessage },
      { status: 500 }
    )
  }
} 