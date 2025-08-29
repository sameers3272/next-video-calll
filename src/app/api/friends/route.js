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

    const friends = friendships.map(friendship => {
      const friend = friendship.requester._id.toString() === session.user.id
        ? friendship.recipient
        : friendship.requester
      
      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        profilePicture: friend.profilePicture,
        isOnline: friend.isOnline,
        lastSeen: friend.lastSeen
      }
    })

    return NextResponse.json(friends)
  } catch (error) {
    console.error("Error fetching friends:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { recipientId, requestMessage } = body

    if (!recipientId) {
      return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 })
    }

    if (recipientId === session.user.id) {
      return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 })
    }

    await connectToDatabase()
    
    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: session.user.id, recipient: recipientId },
        { requester: recipientId, recipient: session.user.id }
      ]
    })

    if (existingFriendship) {
      return NextResponse.json({ error: "Friendship already exists" }, { status: 400 })
    }

    const friendship = new Friendship({
      requester: session.user.id,
      recipient: recipientId,
      requestMessage: requestMessage || '',
      status: 'pending'
    })

    await friendship.save()

    const populatedFriendship = await Friendship.findById(friendship._id)
      .populate('requester recipient')

    return NextResponse.json(populatedFriendship, { status: 201 })
  } catch (error) {
    console.error("Error creating friend request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}