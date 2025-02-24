import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Researcher {
  id: string
  name: string
}

export interface Coordinator {
  id: string
  name: string
}

export interface BeneficiaryData {
  name: string
  nationalId: string
  gender: string
  phone1: string
  phone2?: string
  whatsapp?: string
  familySize: number
  idCardImage?: File
}

export interface FamilyMember {
  name: string
  kinshipRelation: string
  gender: string
  ageGroup: string
  maritalStatus: string
  hasNationalId: string
  nationalId?: string
  reasonForNotAttending?: string
  lastEducationalStage?: string
  isCurrentlyEnrolled?: string
  reasonForNotEnrolled?: string
  hasLiteracyCertificate?: string
  canReadAndWrite: string
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
  hasMarriedDaughterUnder18?: string
  hasFGM?: string
  whereFGM?: string
  otherWhereFGM?: string
}

export interface EntryState {
  entryId: string
  researcher: Researcher | null
  coordinator: Coordinator | null
  visitDate: Date | null
  beneficiary: BeneficiaryData | null
  familyMembers: FamilyMember[]
  
  // Actions
  setInitialEntry: (researcher: Researcher, coordinator: Coordinator, visitDate: Date) => void
  setBeneficiary: (data: BeneficiaryData) => void
  addFamilyMember: (member: FamilyMember) => void
  updateFamilyMember: (index: number, member: FamilyMember) => void
  reset: () => void
}

export const useEntryStore = create<EntryState>((set) => ({
  entryId: '',
  researcher: null,
  coordinator: null,
  visitDate: null,
  beneficiary: null,
  familyMembers: [],

  setInitialEntry: (researcher, coordinator, visitDate) => 
    set({ 
      entryId: uuidv4(),
      researcher, 
      coordinator, 
      visitDate 
    }),

  setBeneficiary: (data) => 
    set({ beneficiary: data }),

  addFamilyMember: (member) => 
    set((state) => ({ 
      familyMembers: [...state.familyMembers, member] 
    })),

  reset: () => 
    set({ 
      entryId: '',
      researcher: null,
      coordinator: null,
      visitDate: null,
      beneficiary: null,
      familyMembers: []
    }),

  updateFamilyMember: (index, member) => 
    set((state) => {
      const newMembers = [...state.familyMembers]
      newMembers[index] = member
      return { familyMembers: newMembers }
    })
})) 