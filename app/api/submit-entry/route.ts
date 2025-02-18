import { doc } from "@/lib/google-sheets"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { entryId, researcher, coordinator, visitDate, beneficiary } = await req.json()

    await doc.loadInfo()
    const sheet = doc.sheetsByTitle["beneficiary-form"]

    const row = {
      entryId,
      researcherId: researcher.id,
      researcherName: researcher.name,
      coordinatorId: coordinator.id,
      coordinatorName: coordinator.name,
      visitDate: visitDate,
      beneficiaryName: beneficiary.name,
      nationalId: beneficiary.nationalId,
      gender: beneficiary.gender,
      phone1: beneficiary.phone1,
      phone2: beneficiary.phone2,
      whatsapp: beneficiary.whatsapp,
      familySize: beneficiary.familySize,
    }

    await sheet.addRow(row)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error)
    return NextResponse.json(
      { error: "Failed to submit data" },
      { status: 500 }
    )
  }
} 