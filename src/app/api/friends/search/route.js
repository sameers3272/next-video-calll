import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (email === session.user.email) {
      return NextResponse.json({ error: "Cannot search for yourself" }, { status: 400 })
    }

    await connectToDatabase()
    
    const user = await User.findOne({ email }).select('-googleId')
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error searching for user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}