import { doc } from "@/lib/google-sheets"
import { FamilyMember } from "@/types"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { familyMembers } = body

    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    // Get existing rows count
    const rows = await sheet.getRows()
    
    // If sheet is empty, set headers first
    if (rows.length === 0) {
      await sheet.setHeaderRow([
        'timestamp',
        'name',
        'kinshipRelation',
        'gender',
        'ageGroup',
        'maritalStatus',
        'hasNationalId',
        'nationalId',
        'wentToSchool',
        'reasonForNotAttending',
        'lastEducationalStage',
        'isCurrentlyEnrolled',
        'reasonForNotEnrolled',
        'hasLiteracyCertificate',
        'canReadAndWrite',
        'isWorking',
        'notWorkingReason',
        'jobType',
        'sector',
        'workNature',
        'hasPrivateBusiness',
        'businessType',
        'otherBusinessType',
        'hasUnusedSkill',
        'skillType',
        'otherSkillType',
        'wantsTraining',
        'trainingField',
        'otherTrainingField',
        'hasHealthIssue',
        'healthIssueType',
        'chronicDiseases',
        'otherChronicDisease',
        'disabilityType',
        'disabilityCause',
        'treatmentLocation',
        'otherTreatmentLocation',
        'medicalExpensesCoverage',
        'otherMedicalExpensesCoverage',
        'requiredMedicalAssistance',
        'hasMarriedDaughterUnder18',
        'hasFGM',
        'whereFGM',
        'otherWhereFGM'
      ])
    }

    // Add new rows without clearing existing ones
    const newRows = familyMembers.map((member: FamilyMember) => ({
      timestamp: new Date().toISOString(),
      name: member.name,
      kinshipRelation: member.kinshipRelation,
      gender: member.gender,
      ageGroup: member.ageGroup,
      maritalStatus: member.maritalStatus,
      hasNationalId: member.hasNationalId,
      nationalId: member.nationalId,
      wentToSchool: member.wentToSchool,
      reasonForNotAttending: member.reasonForNotAttending,
      lastEducationalStage: member.lastEducationalStage,
      isCurrentlyEnrolled: member.isCurrentlyEnrolled,
      reasonForNotEnrolled: member.reasonForNotEnrolled,
      hasLiteracyCertificate: member.hasLiteracyCertificate,
      canReadAndWrite: member.canReadAndWrite,
      isWorking: member.isWorking,
      notWorkingReason: member.notWorkingReason,
      jobType: member.jobType,
      sector: member.sector,
      workNature: member.workNature,
      hasPrivateBusiness: member.hasPrivateBusiness,
      businessType: member.businessType,
      otherBusinessType: member.otherBusinessType,
      hasUnusedSkill: member.hasUnusedSkill,
      skillType: member.skillType,
      otherSkillType: member.otherSkillType,
      wantsTraining: member.wantsTraining,
      trainingField: member.trainingField,
      otherTrainingField: member.otherTrainingField,
      hasHealthIssue: member.hasHealthIssue,
      healthIssueType: member.healthIssueType?.join(", "),
      chronicDiseases: member.chronicDiseases?.join(", "),
      otherChronicDisease: member.otherChronicDisease,
      disabilityType: member.disabilityType,
      disabilityCause: member.disabilityCause,
      treatmentLocation: member.treatmentLocation,
      otherTreatmentLocation: member.otherTreatmentLocation,
      medicalExpensesCoverage: member.medicalExpensesCoverage,
      otherMedicalExpensesCoverage: member.otherMedicalExpensesCoverage,
      requiredMedicalAssistance: member.requiredMedicalAssistance,
      hasMarriedDaughterUnder18: member.hasMarriedDaughterUnder18,
      hasFGM: member.hasFGM,
      whereFGM: member.whereFGM,
      otherWhereFGM: member.otherWhereFGM,
    }))

    await sheet.addRows(newRows)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error)
    return NextResponse.json(
      { error: "Failed to submit data" },
      { status: 500 }
    )
  }
} 