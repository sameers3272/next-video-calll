import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Friendship from "@/models/Friendship"

export async function PUT(request, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body // 'accept' or 'decline'

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: "Valid action is required (accept or decline)" }, { status: 400 })
    }

    await connectToDatabase()
    
    const friendship = await Friendship.findOne({
      _id: params.id,
      recipient: session.user.id,
      status: 'pending'
    })

    if (!friendship) {
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 })
    }

    const newStatus = action === 'accept' ? 'accepted' : 'declined'
    friendship.status = newStatus
    await friendship.save()

    const populatedFriendship = await Friendship.findById(friendship._id)
      .populate('requester recipient')

    return NextResponse.json(populatedFriendship)
  } catch (error) {
    console.error("Error updating friend request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}