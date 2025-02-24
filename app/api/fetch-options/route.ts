import { NextResponse } from "next/server"
import { doc } from "@/lib/google-sheets"
import { FormOptions } from "@/types/options"

export async function GET() {
  try {
    await doc.loadInfo()
    
    const optionsSheet = doc.sheetsByTitle["Options"]
    const rows = await optionsSheet.getRows()
    
    // Get all options from the sheet
    const options: FormOptions = {
      researchers: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Researchers")
      })).filter(item => item.name),
      
      coordinators: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Coordinators")
      })).filter(item => item.name),
      
      gender: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Gender")
      })).filter(item => item.name),
      
      relationship: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Relationship")
      })).filter(item => item.name),
      
      age: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Age")
      })).filter(item => item.name),
      
      maritalStatus: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Marital_status")
      })).filter(item => item.name),
      
      hasId: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Is_there_an_ID")
      })).filter(item => item.name),
      
      hasBeenToSchool: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Has_he_ever_been_to_school")
      })).filter(item => item.name),
      
      educationLevel: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("last_level_of_education")
      })).filter(item => item.name),
      
      regularityInStudy: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Regularity_in_study")
      })).filter(item => item.name),
      
      reasonForNotStudying: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("why_didn't_i_go_to_school")
      })).filter(item => item.name),
      
      canReadAndWrite: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Can_he_read_and_write")
      })).filter(item => item.name),
      
      literacyCertificate: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Literacy_certificate")
      })).filter(item => item.name),
      
      doesWork: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Does_he_work")
      })).filter(item => item.name),
      
      typeOfWork: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Type_of_work")
      })).filter(item => item.name),
      
      sector: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Sector")
      })).filter(item => item.name),
      
      workNature: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Nature_of_work")
      })).filter(item => item.name),
      
      hasPrivateProject: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Does_he_have_a_private_project")
      })).filter(item => item.name),
      
      hasUnusedSkill: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Does_he_have_a_skill_or_craft_that_he_does_not_practice")
      })).filter(item => item.name),
      
      unusedSkillType: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("What skill or craft does he have?")
      })).filter(item => item.name),
      
      willingToTrain: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("willing_to_train")
      })).filter(item => item.name),
      
      desiredTrainingField: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("field_does_he want_to_train_in")
      })).filter(item => item.name),
      
      hasChronicIllnessOrDisability: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("have_a_chronic _illness_or_disability")
      })).filter(item => item.name),
      
      disabilityTypes: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Type _of_disability")
      })).filter(item => item.name),
      
      chronicIllnessTypes: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Type_of_chronic_illness")
      })).filter(item => item.name),
      
      treatmentLocations: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Where_to_receive_treatment")
      })).filter(item => item.name),
      
      treatmentCostsCovered: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("costs_of treatment_covered")
      })).filter(item => item.name),
      
      hasMarriedDaughterUnder18: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("hav_ a_married_daughter_under_18")
      })).filter(item => item.name),
      
      hadCircumcision: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("had_a_circumcision")
      })).filter(item => item.name),
      
      circumcisionPerformer: rows.map(row => ({
        id: row.rowNumber.toString(),
        name: row.get("Who_performed_the_circumcision")
      })).filter(item => item.name),
    }

    return NextResponse.json(options)
    
  } catch (error) {
    console.error("Error fetching options:", error)
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    )
  }
} 