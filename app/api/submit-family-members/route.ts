import { doc } from "@/lib/google-sheets"
import { NextResponse } from "next/server"
import { FamilyMember } from "@/lib/store"

interface SubmitFamilyRequest {
  entryId: string
  familyMembers: FamilyMember[]
}

export async function POST(req: Request) {
  try {
    const { entryId, familyMembers } = (await req.json()) as SubmitFamilyRequest

    await doc.loadInfo()
    let sheet = doc.sheetsByTitle["family-members"]
    
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: "family-members",
        headerValues: [
          "Entry ID", "Name", "Relation", "Gender", "Age Group",
          "Education Status", "Employment Status", "Health Issues",
          "Chronic Diseases", "Timestamp"
        ]
      })
    }

    const rows = familyMembers.map(member => ({
      'Entry ID': String(entryId),
      'Name': String(member.name),
      'Relation': String(member.kinshipRelation),
      'Gender': String(member.gender),
      'Age Group': String(member.ageGroup),
      'Education Status': member.wentToSchool === "yes" 
        ? String(member.lastEducationalStage || 'غير محدد') 
        : 'لم يذهب للمدرسة',
      'Employment Status': member.isWorking === "yes" 
        ? String(member.jobType || 'غير محدد') 
        : 'غير عامل',
      'Health Issues': String(member.healthIssueType?.join(", ") || "لا يوجد"),
      'Chronic Diseases': String(member.chronicDiseases?.join(", ") || "لا يوجد"),
      'Timestamp': String(new Date().toISOString())
    }))

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