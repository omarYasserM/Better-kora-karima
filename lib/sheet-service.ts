import { doc } from "@/lib/google-sheets"
import { Researcher, Coordinator } from "@/lib/store"

export async function fetchResearchers(): Promise<Researcher[]> {
  try {
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle["researchers"]
    if (!sheet) throw new Error("Researchers sheet not found")
    
    await sheet.loadHeaderRow()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await sheet.getRows() as any[]
    
    return rows.map(row => ({
      id: row.rowNumber.toString(),
      name: row.get("name")
    })) as Researcher[]
  } catch (error) {
    console.error("Error fetching researchers:", error)
    return []
  }
}


export async function fetchCoordinators(): Promise<Coordinator[]> {
  try {
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle["coordinators"]
    if (!sheet) throw new Error("Coordinators sheet not found")
    
    await sheet.loadHeaderRow()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await sheet.getRows() as any[]
    
    return rows.map(row => ({
      id: row.rowNumber.toString(),
      name: row.get("name")
    })) as Coordinator[]
  } catch (error) {
    console.error("Error fetching coordinators:", error)
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addBeneficiaryToSheet(data: any) {
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle["Beneficiaries"]
  await sheet.addRow(data)
}

// Similar server-only functions for other sheet operations 