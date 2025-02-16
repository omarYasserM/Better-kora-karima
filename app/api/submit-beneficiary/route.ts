import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("Received data:", data)
    // Add your data processing logic here
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting beneficiary:", error)
    return NextResponse.json(
      { error: "Failed to submit data" },
      { status: 500 }
    )
  }
} 