// Add this at the top to prevent client-side usage
if (typeof window !== 'undefined') {
  throw new Error('Google Sheets library can only be used server-side')
}

import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
]

// Use environment variables directly instead of child_process
const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: SCOPES,
})

export const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt)

export async function initSheet() {
  try {
    await doc.loadInfo()
    
    // Verify required sheets exist
    const requiredSheets = [
      'Beneficiaries', 
      'family-members',
      'coordinators',
      'researchers'
    ]
    
    requiredSheets.forEach(sheetTitle => {
      if (!doc.sheetsByTitle[sheetTitle]) {
        throw new Error(`Missing required sheet: ${sheetTitle}`)
      }
    })
    
    return doc
  } catch (error) {
    console.error('Error initializing Google Sheet:', error)
    throw new Error('Failed to initialize Google Sheet connection')
  }
} 