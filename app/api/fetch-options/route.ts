import { NextResponse } from "next/server"
import { doc } from "@/lib/google-sheets"

export async function GET() {
  try {
    await doc.loadInfo()
    
    const researchersSheet = doc.sheetsByTitle["researchers"]
    const coordinatorsSheet = doc.sheetsByTitle["coordinators"]
    
    const researchers = (await researchersSheet.getRows()).map(row => ({
      id: row.rowNumber.toString(),
      name: row.get("name")
    }))
    
    const coordinators = (await coordinatorsSheet.getRows()).map(row => ({
      id: row.rowNumber.toString(),
      name: row.get("name")
    }))

    return NextResponse.json({ researchers, coordinators })
    
  } catch (error) {
    console.error("Error fetching options:", error)
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    )
  }
} 