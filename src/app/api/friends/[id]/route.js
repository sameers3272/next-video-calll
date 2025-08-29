import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Friendship from "@/models/Friendship"

export async function DELETE(request, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { requester: session.user.id, recipient: params.id },
        { requester: params.id, recipient: session.user.id }
      ],
      status: 'accepted'
    })

    if (!friendship) {
      return NextResponse.json({ error: "Friendship not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Friend removed successfully" })
  } catch (error) {
    console.error("Error removing friend:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}