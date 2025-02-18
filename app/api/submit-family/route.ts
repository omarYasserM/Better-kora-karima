import { NextResponse } from "next/server"
import { doc } from "@/lib/google-sheets"
import type { RowData, FamilyMemberRow } from "@/types/sheets"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle["FamilyMembers"]
    
    if (!sheet) {
      throw new Error("FamilyMembers sheet not found")
    }

    const rowData: FamilyMemberRow = {
      Timestamp: new Date().toISOString(),
      EntryID: data.entryId,
      FamilyMember: JSON.stringify(data.familyMember),
      // Add other family member fields as needed
    }

    await sheet.addRow(rowData)

    return NextResponse.json({ 
      success: true,
      data: rowData
    })
    
  } catch (error) {
    console.error("Error submitting family member:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to submit family data", details: errorMessage },
      { status: 500 }
    )
  }
} 