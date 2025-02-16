export interface FamilyMember {
  // Basic Information
  name: string
  kinshipRelation: string
  gender: string
  ageGroup: string
  maritalStatus: string
  hasNationalId: string
  nationalId?: string

  // Educational Status
  hasAttendedSchool: string
  notAttendingReason?: string
  educationLevel?: string
  isCurrentlyEnrolled?: string
  wentToSchool: string
  reasonForNotAttending?: string
  lastEducationalStage?: string
  reasonForNotEnrolled?: string
  hasLiteracyCertificate?: string
  canReadAndWrite: string

  // Employment Status
  isWorking: string
  notWorkingReason?: string
  jobType?: string
  sector?: string
  workNature?: string
  hasPrivateBusiness?: string
  businessType?: string
  otherBusinessType?: string
  hasUnusedSkill?: string
  skillType?: string
  otherSkillType?: string
  wantsTraining?: string
  trainingField?: string
  otherTrainingField?: string

  // Health Status
  hasHealthIssue: string
  healthIssueType?: string[]
  chronicDiseases?: string[]
  otherChronicDisease?: string
  disabilityType?: string
  disabilityCause?: string
  treatmentLocation?: string
  otherTreatmentLocation?: string
  medicalExpensesCoverage?: string
  otherMedicalExpensesCoverage?: string
  requiredMedicalAssistance?: string

  // Special Questions
  hasMarriedDaughterUnder18?: string
  hasFGM?: string
  whereFGM?: string
  otherWhereFGM?: string
} 