import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import Friendship from "@/models/Friendship"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    // Update current user's online status and lastSeen
    await User.findByIdAndUpdate(session.user.id, {
      isOnline: true,
      lastSeen: new Date()
    })
    
    const friendships = await Friendship.find({
      $or: [
        { requester: session.user.id, status: 'accepted' },
        { recipient: session.user.id, status: 'accepted' }
      ]
    }).populate('requester recipient')

    const friendIds = friendships.map(friendship => {
      return friendship.requester._id.toString() === session.user.id
        ? friendship.recipient._id
        : friendship.requester._id
    })

    // Mark users as offline if they haven't been seen in 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    await User.updateMany(
      { lastSeen: { $lt: fiveMinutesAgo } },
      { isOnline: false }
    )

    const onlineFriends = await User.find({
      _id: { $in: friendIds },
      isOnline: true
    })

    return NextResponse.json(onlineFriends)
  } catch (error) {
    console.error("Error fetching online friends:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isOnline } = body

    await connectToDatabase()
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        isOnline: isOnline !== undefined ? isOnline : true,
        lastSeen: new Date()
      },
      { new: true }
    )

    return NextResponse.json({ 
      success: true, 
      isOnline: updatedUser.isOnline,
      lastSeen: updatedUser.lastSeen 
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}