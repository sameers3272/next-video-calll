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