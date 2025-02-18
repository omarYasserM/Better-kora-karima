export interface RowData {
  Timestamp: string
  EntryID: string
  Researcher: string
  Coordinator: string
  BeneficiaryName: string
  NationalID: string
  Gender: string
  IDCardImage: string
  FamilySize: string
  Phone1: string
  Phone2: string
  Whatsapp: string
  [key: string]: string // Allow additional string fields
}

export interface BeneficiaryRow {
  Timestamp: string
  EntryID: string
  Researcher: string
  Coordinator: string
  BeneficiaryName: string
  NationalID: string
  Gender: string
  IDCardImage: string
  FamilySize: string
  Phone1: string
  Phone2: string
  Whatsapp: string
  [key: string]: string
}

export interface FamilyMemberRow {
  Timestamp: string
  EntryID: string
  FamilyMember: string
  [key: string]: string // Allow additional string fields
} 