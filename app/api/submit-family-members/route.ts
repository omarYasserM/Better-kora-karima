import { doc } from "@/lib/google-sheets"
import { NextResponse } from "next/server"
import { FamilyMember } from "@/lib/store"
import { formConfig } from "@/lib/formConfig"

interface SubmitFamilyRequest {
  entryId: string
  familyMembers: FamilyMember[]
}

// Helper to create human-readable headers
const formatHeader = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/Id/g, 'ID')
}

export async function POST(req: Request) {
  try {
    const { entryId, familyMembers } = (await req.json()) as SubmitFamilyRequest

    await doc.loadInfo()
    let sheet = doc.sheetsByTitle["family-members"]
    
    // Get all field IDs from form config
    const allFields = Array.from(new Set(formConfig.map(field => field.id)))
    const headers = [
      'Entry ID', 
      ...allFields.map(formatHeader),
      'Timestamp'
    ]

    if (!sheet) {
      // Create new sheet with enough columns
      sheet = await doc.addSheet({ 
        title: "family-members",
        headerValues: headers,
        gridProperties: {
          columnCount: headers.length,
          rowCount: 1000 // Start with 1000 rows
        }
      })
      // Wait for the sheet to be fully initialized
      await sheet.loadHeaderRow()
    } else {
      // Load headers first
      await sheet.loadHeaderRow()
      // Resize if needed
      if (sheet.columnCount < headers.length) {
        await sheet.resize({
          rowCount: Math.max(sheet.rowCount, 1000),
          columnCount: headers.length
        })
      }
      // Then check and update headers if needed
      const existingHeaders = sheet.headerValues || []
      if (JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
        await sheet.setHeaderRow(headers)
        // Reload headers after setting them
        await sheet.loadHeaderRow()
      }
    }

    const rows = familyMembers.map(member => {
      const rowData: Record<string, string> = {
        'Entry ID': entryId
      }

      // Add all form fields dynamically
      allFields.forEach(field => {
        const value = member[field as keyof FamilyMember]
        rowData[formatHeader(field)] = Array.isArray(value) 
          ? value.join(', ') 
          : String(value || '')
      })

      rowData['Timestamp'] = new Date().toISOString()
      return rowData
    })

    await sheet.addRows(rows)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error)
    return NextResponse.json(
      { error: "Failed to submit data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 