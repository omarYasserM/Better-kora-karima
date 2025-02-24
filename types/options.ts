export interface Option {
  id: string
  name: string
}

export interface FormOptions {
  researchers: Option[]
  coordinators: Option[]
  gender: Option[]
  relationship: Option[]
  age: Option[]
  maritalStatus: Option[]
  hasId: Option[]
  hasBeenToSchool: Option[]
  educationLevel: Option[]
  regularityInStudy: Option[]
  reasonForNotStudying: Option[]
  canReadAndWrite: Option[]
  literacyCertificate: Option[]
  doesWork: Option[]
  typeOfWork: Option[]
  sector: Option[]
  workNature: Option[]
  hasPrivateProject: Option[]
  hasUnusedSkill: Option[]
  unusedSkillType: Option[]
  willingToTrain: Option[]
  desiredTrainingField: Option[]
  hasChronicIllnessOrDisability: Option[]
  disabilityTypes: Option[]
  chronicIllnessTypes: Option[]
  treatmentLocations: Option[]
  treatmentCostsCovered: Option[]
  hasMarriedDaughterUnder18: Option[]
  hadCircumcision: Option[]
  circumcisionPerformer: Option[]
  requiredMedicalAssistance: Option[]
} 