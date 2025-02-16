import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
]

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: SCOPES,
})

export const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt) 