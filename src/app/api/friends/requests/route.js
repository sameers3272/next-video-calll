import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Friendship from "@/models/Friendship"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    const friendRequests = await Friendship.find({
      recipient: session.user.id,
      status: 'pending'
    }).populate('requester', 'name email profilePicture')

    return NextResponse.json(friendRequests)
  } catch (error) {
    console.error("Error fetching friend requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}